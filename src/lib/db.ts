import { Pool } from "pg";

const globalForPg = globalThis as unknown as { pgPool?: Pool };

// Jedna pula połączeń na proces; w trybie dev przeżywa przeładowania modułów.
export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    max: 5,
  });

if (process.env.NODE_ENV !== "production") globalForPg.pgPool = pool;
