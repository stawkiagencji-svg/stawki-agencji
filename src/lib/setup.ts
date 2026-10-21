import initialOffers from "../../db/offers.json";
import { pool } from "./db";
import { createOffer } from "./offers";
import { SCHEMA } from "./schema";
import type { OfferInput } from "./types";

export async function setupDatabase(): Promise<void> {
  await pool.query(SCHEMA);
  const { rows } = await pool.query<{ n: number }>("SELECT count(*)::int AS n FROM offers");
  if (rows[0].n > 0) return;
  for (const o of initialOffers as OfferInput[]) await createOffer(o);
  console.log(`Wczytano ${initialOffers.length} ofert startowych.`);
}
