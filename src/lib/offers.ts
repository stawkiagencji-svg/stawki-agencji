import { pool } from "./db";

import { CONTRACTS, type ContractKey, type Offer, type OfferInput } from "./types";

export * from "./types";

type Row = {
  id: number; name: string; website: string; city: string; contracts: string[];
  pay_min: number; pay_max: number; german: number; rotation: string; bonus: string;
  verified: string; source: string; notes: string; travel: boolean; a1: boolean;
  example: boolean; promoted: boolean;
};

const fromRow = (r: Row): Offer => ({
  id: r.id, name: r.name, website: r.website, city: r.city,
  contracts: r.contracts.filter(isContract), payMin: r.pay_min, payMax: r.pay_max,
  german: r.german, rotation: r.rotation, bonus: r.bonus, verified: r.verified,
  source: r.source, notes: r.notes, travel: r.travel, a1: r.a1,
  example: r.example, promoted: r.promoted,
});

const isContract = (c: string): c is ContractKey => c in CONTRACTS;

export async function listOffers(): Promise<Offer[]> {
  const { rows } = await pool.query<Row>("SELECT * FROM offers ORDER BY promoted DESC, pay_max DESC, name");
  return rows.map(fromRow);
}

export async function getOffer(id: number): Promise<Offer | null> {
  const { rows } = await pool.query<Row>("SELECT * FROM offers WHERE id = $1", [id]);
  return rows[0] ? fromRow(rows[0]) : null;
}

const values = (o: OfferInput) => [
  o.name, o.website, o.city, o.contracts, o.payMin, o.payMax, o.german, o.rotation,
  o.bonus, o.verified, o.source, o.notes, o.travel, o.a1, o.example, o.promoted,
];

export async function createOffer(o: OfferInput): Promise<void> {
  await pool.query(
    `INSERT INTO offers (name, website, city, contracts, pay_min, pay_max, german, rotation,
       bonus, verified, source, notes, travel, a1, example, promoted)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
    values(o),
  );
}

export async function updateOffer(id: number, o: OfferInput): Promise<void> {
  await pool.query(
    `UPDATE offers SET name=$1, website=$2, city=$3, contracts=$4, pay_min=$5, pay_max=$6,
       german=$7, rotation=$8, bonus=$9, verified=$10, source=$11, notes=$12, travel=$13,
       a1=$14, example=$15, promoted=$16, updated_at=now()
     WHERE id=$17`,
    [...values(o), id],
  );
}

export async function deleteOffer(id: number): Promise<void> {
  await pool.query("DELETE FROM offers WHERE id = $1", [id]);
}

const text = (f: FormData, k: string, max = 300) => String(f.get(k) ?? "").trim().slice(0, max);
const url = (f: FormData, k: string) => {
  const v = text(f, k, 500);
  return /^https?:\/\//i.test(v) ? v : "";
};

/** Odczytuje i sprawdza formularz oferty. Zwraca dane albo komunikat błędu dla użytkownika. */
export function parseOfferForm(f: FormData): { ok: true; offer: OfferInput } | { ok: false; error: string } {
  const offer: OfferInput = {
    name: text(f, "name", 120),
    website: url(f, "website"),
    city: text(f, "city", 80),
    contracts: f.getAll("contracts").map(String).filter(isContract),
    payMin: Number(f.get("payMin")),
    payMax: Number(f.get("payMax")),
    german: Math.min(3, Math.max(0, Number(f.get("german")) || 0)),
    rotation: text(f, "rotation", 80),
    bonus: text(f, "bonus", 160),
    verified: text(f, "verified", 20),
    source: url(f, "source"),
    notes: text(f, "notes", 1000),
    travel: f.get("travel") === "on",
    a1: f.get("a1") === "on",
    example: f.get("example") === "on",
    promoted: f.get("promoted") === "on",
  };
  if (!offer.name) return { ok: false, error: "Wpisz nazwę agencji." };
  if (!Number.isFinite(offer.payMin) || !Number.isFinite(offer.payMax) || offer.payMin <= 0 || offer.payMax <= 0)
    return { ok: false, error: "Podaj widełki wypłaty w euro." };
  if (offer.payMin > offer.payMax) return { ok: false, error: "Stawka „od” nie może być wyższa niż „do”." };
  if (!offer.contracts.length) return { ok: false, error: "Zaznacz co najmniej jedną formę umowy." };
  offer.payMin = Math.round(offer.payMin);
  offer.payMax = Math.round(offer.payMax);
  return { ok: true, offer };
}
