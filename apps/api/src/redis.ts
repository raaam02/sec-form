import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
console.log("Initializing Redis with URL:", redisUrl);
let redis: Redis | null = null;
let isRedisConnected = false;

// High-speed In-Memory cache fallback
const mockCache: Record<string, { value: string; expiresAt: number }> = {};

try {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    connectTimeout: 1000,
    commandTimeout: 300,
    enableOfflineQueue: false, // Do NOT block HTTP requests when offline; immediately use in-memory cache
    lazyConnect: true,
    retryStrategy(times) {
      if (times > 3) return null; // stop aggressive retries
      return Math.min(times * 500, 2000);
    },
  });

  redis.on("connect", () => {
    console.log("Redis connected successfully.");
    isRedisConnected = true;
  });

  redis.on("ready", () => {
    isRedisConnected = true;
  });

  redis.on("error", (err) => {
    isRedisConnected = false;
  });

  redis.on("close", () => {
    isRedisConnected = false;
  });

  redis.connect().catch(() => {
    isRedisConnected = false;
  });
} catch (e) {
  console.log("Redis initialization deferred, using In-Memory cache fallback.");
}

export const cache = {
  async get(key: string): Promise<string | null> {
    if (redis && isRedisConnected) {
      try {
        const res = await Promise.race([
          redis.get(key),
          new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 200)),
        ]);
        if (res !== null) return res;
      } catch {
        // fail silently and fallback immediately
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
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    mockCache[key] = { value, expiresAt };

    if (redis && isRedisConnected) {
      try {
        if (ttlSeconds) {
          await Promise.race([
            redis.set(key, value, "EX", ttlSeconds),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 200)),
          ]);
        } else {
          await Promise.race([
            redis.set(key, value),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 200)),
          ]);
        }
      } catch {
        // In-memory cache is already updated
      }
    }
  },

  async del(key: string): Promise<void> {
    delete mockCache[key];
    if (redis && isRedisConnected) {
      try {
        await Promise.race([
          redis.del(key),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 200)),
        ]);
      } catch {
        // In-memory cache already deleted
      }
    }
  },

  // High-performance rate limiting counter (never blocks)
  async incrAndExpire(key: string, ttlSeconds: number): Promise<number> {
    if (redis && isRedisConnected) {
      try {
        const count = await Promise.race([
          redis.incr(key),
          new Promise<number>((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 150)),
        ]);
        if (count === 1) {
          redis.expire(key, ttlSeconds).catch(() => {});
        }
        return count;
      } catch {
        // Instant fallback to memory
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
  },
};

export default redis;
