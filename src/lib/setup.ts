import drafts from "../../db/drafts.json";
import { pool } from "./db";
import { SCHEMA } from "./schema";
import { createOffer } from "./offers";
import type { ContractKey } from "./types";

type Draft = {
  name: string; website: string; contracts: string[]; payMin: number; payMax: number;
  german: number; rotation?: string; bonus?: string; source: string; notes: string;
};

export async function setupDatabase(): Promise<void> {
  await pool.query(SCHEMA);
  const { rows } = await pool.query<{ n: number }>("SELECT count(*)::int AS n FROM offers");
  if (rows[0].n > 0) return;
  for (const d of drafts as Draft[]) {
    await createOffer({
      name: d.name, website: d.website, city: "", contracts: d.contracts as ContractKey[],
      payMin: d.payMin, payMax: d.payMax, german: d.german, rotation: d.rotation ?? "",
      bonus: d.bonus ?? "", verified: "", source: d.source, notes: d.notes,
      travel: false, a1: false, example: false, promoted: false, published: false,
    });
  }
  console.log(`Wczytano ${drafts.length} szkiców ofert do weryfikacji.`);
}
