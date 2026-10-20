import { readFile } from "node:fs/promises";
import pg from "pg";

const sql = await readFile(new URL("../db/schema.sql", import.meta.url), "utf8");
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
await client.connect();
await client.query(sql);
await client.end();
console.log("Schemat bazy gotowy.");
