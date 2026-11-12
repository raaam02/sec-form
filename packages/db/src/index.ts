import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/secform";

console.log("DATABASE_URL EXISTS:", !!process.env.DATABASE_URL);
console.log(
  "DATABASE_URL PREFIX:",
  process.env.DATABASE_URL?.substring(0, 10)
);

const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
const isCloudDb =
  connectionString.includes("render.com") ||
  connectionString.includes("supabase.co") ||
  connectionString.includes("neon.tech") ||
  connectionString.includes("pooler") ||
  connectionString.includes("sslmode=require");

const globalForDb = globalThis as unknown as {
  postgresClient: postgres.Sql | undefined;
};

// High-performance client with connection pooler and SSL compatibility
const client =
  globalForDb.postgresClient ??
  postgres(connectionString, {
    max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS, 10) : 10,
    idle_timeout: 30,
    connect_timeout: 10,
    // CRITICAL: Disable prepared statements for connection poolers (PgBouncer, Render, Supabase pooler, Neon)
    // Prepared statements hang or fail when queries route through transaction poolers!
    prepare: false,
    ssl: isCloudDb || isProduction ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

export const db = drizzle(client, { schema });

export * from "./schema";
export * from "drizzle-orm";
