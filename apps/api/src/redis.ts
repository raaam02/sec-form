import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
console.log("Initializing Redis with URL:", redisUrl);
let redis: Redis | null = null;
let isRedisConnected = false;

// Mock cache in-memory fallback
const mockCache: Record<string, { value: string; expiresAt: number }> = {};

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 10,
    lazyConnect: true,
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully.");
    isRedisConnected = true;
  });

  redis.on("error", (err) => {
    console.error("Redis connection error:", err.message || err);
    isRedisConnected = false;
  });

  redis.on("close", () => {
    isRedisConnected = false;
  });

  redis.connect().catch(() => {
    console.log("Redis initial connection attempt deferred; running fallback cache until connected.");
    isRedisConnected = false;
  });
} catch (e) {
  console.log("Redis initialization failed, falling back to In-Memory cache.");
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (redis && isRedisConnected) {
      try {
        return await redis.get(key);
      } catch (e) {
        // fail silently and fallback
      }
    }
    const item = mockCache[key];
    if (item) {
      if (item.expiresAt > Date.now()) {
        return item.value;
      }
      delete mockCache[key];
    }
    return null;
  },

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (redis && isRedisConnected) {
      try {
        if (ttlSeconds) {
          await redis.set(key, value, "EX", ttlSeconds);
        } else {
          await redis.set(key, value);
        }
        return;
      } catch (e) {
        // fail silently and fallback
      }
    }
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    mockCache[key] = { value, expiresAt };
  },

  async del(key: string): Promise<void> {
    if (redis && isRedisConnected) {
      try {
        await redis.del(key);
        return;
      } catch (e) {
        // fail silently and fallback
      }
    }
    delete mockCache[key];
  },

  // Helper for rate limiting
  async incrAndExpire(key: string, ttlSeconds: number): Promise<number> {
    if (redis && isRedisConnected) {
      try {
        const count = await redis.incr(key);
        if (count === 1) {
          await redis.expire(key, ttlSeconds);
        }
        return count;
      } catch (e) {
        // fallback to memory
      }
    }

    const item = mockCache[key];
    let count = 1;
    if (item && item.expiresAt > Date.now()) {
      count = parseInt(item.value, 10) + 1;
    }
    const expiresAt = item ? item.expiresAt : Date.now() + ttlSeconds * 1000;
    mockCache[key] = { value: count.toString(), expiresAt };
    return count;
  }
};
export default redis;
