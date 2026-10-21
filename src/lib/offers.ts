import { pool } from "./db";
import { CONTRACTS, DETAILS, type ContractKey, type DetailKey, type Offer, type OfferInput } from "./types";

export * from "./types";

/** Pole oferty → kolumna w bazie. Jedno miejsce, z którego budujemy INSERT, UPDATE i odczyt. */
const COLUMNS: [keyof OfferInput, string][] = [
  ["name", "name"], ["description", "description"], ["website", "website"], ["city", "city"],
  ["contracts", "contracts"], ["payMin", "pay_min"], ["payMax", "pay_max"], ["payNote", "pay_note"],
  ["german", "german"], ["rotation", "rotation"], ["verified", "verified"], ["source", "source"],
  ["notes", "notes"], ["travel", "travel"], ["a1", "a1"], ["example", "example"],
  ["promoted", "promoted"], ["published", "published"], ["contractNote", "contract_note"],
  ["insurance", "insurance"], ["travelNote", "travel_note"], ["bonus", "bonus"],
  ["support", "support"], ["housing", "housing"],
];

const isContract = (c: string): c is ContractKey => c in CONTRACTS;

function fromRow(r: Record<string, unknown>): Offer {
  const o = { id: r.id } as Record<string, unknown>;
  for (const [key, col] of COLUMNS) o[key] = r[col];
  o.contracts = (r.contracts as string[]).filter(isContract);
  return o as Offer;
}

// Oferty bez stawki trafiają na koniec listy.
const ORDER = "promoted DESC, pay_max DESC NULLS LAST, pay_min DESC NULLS LAST, name";

/** Oferty widoczne publicznie (bez szkiców). */
export async function listPublishedOffers(): Promise<Offer[]> {
  const { rows } = await pool.query(`SELECT * FROM offers WHERE published ORDER BY ${ORDER}`);
  return rows.map(fromRow);
}

/** Wszystkie oferty, szkice na początku – dla panelu administratora. */
export async function listAllOffers(): Promise<Offer[]> {
  const { rows } = await pool.query("SELECT * FROM offers ORDER BY published, name");
  return rows.map(fromRow);
}

export async function getOffer(id: number): Promise<Offer | null> {
  const { rows } = await pool.query("SELECT * FROM offers WHERE id = $1", [id]);
  return rows[0] ? fromRow(rows[0]) : null;
}

const values = (o: OfferInput) => COLUMNS.map(([key]) => o[key]);

export async function createOffer(o: OfferInput): Promise<void> {
  const cols = COLUMNS.map(([, col]) => col).join(", ");
  const params = COLUMNS.map((_, i) => `$${i + 1}`).join(", ");
  await pool.query(`INSERT INTO offers (${cols}) VALUES (${params})`, values(o));
}

export async function updateOffer(id: number, o: OfferInput): Promise<void> {
  const sets = COLUMNS.map(([, col], i) => `${col}=$${i + 1}`).join(", ");
  await pool.query(`UPDATE offers SET ${sets}, updated_at=now() WHERE id=$${COLUMNS.length + 1}`, [...values(o), id]);
}

export async function deleteOffer(id: number): Promise<void> {
  await pool.query("DELETE FROM offers WHERE id = $1", [id]);
}

const text = (f: FormData, k: string, max = 300) => String(f.get(k) ?? "").trim().slice(0, max);
const url = (f: FormData, k: string) => {
  const v = text(f, k, 500);
  return /^https?:\/\//i.test(v) ? v : "";
};
const optionalNumber = (f: FormData, k: string) => {
  const v = text(f, k, 20);
  return v === "" ? null : Number(v);
};

/** Odczytuje i sprawdza formularz oferty. Zwraca dane albo komunikat błędu dla użytkownika. */
export function parseOfferForm(f: FormData): { ok: true; offer: OfferInput } | { ok: false; error: string } {
  const german = text(f, "german", 2);
  const details = Object.fromEntries(
    (Object.keys(DETAILS) as DetailKey[]).map((k) => [k, text(f, k, 600)]),
  ) as Record<DetailKey, string>;
  const offer: OfferInput = {
    name: text(f, "name", 120),
    description: text(f, "description", 600),
    website: url(f, "website"),
    city: text(f, "city", 80),
    contracts: f.getAll("contracts").map(String).filter(isContract),
    payMin: optionalNumber(f, "payMin"),
    payMax: optionalNumber(f, "payMax"),
    payNote: text(f, "payNote", 300),
    german: german === "" ? null : Math.min(3, Math.max(0, Number(german) || 0)),
    rotation: text(f, "rotation", 80),
    verified: text(f, "verified", 20),
    // Kilka linków oddzielonych „|” lub nową linią; zapisujemy tylko poprawne adresy.
    source: text(f, "source", 2000).split(/[|\n]/).map((u) => u.trim()).filter((u) => /^https?:\/\//i.test(u)).join(" | "),
    notes: text(f, "notes", 1000),
    travel: f.get("travel") === "on",
    a1: f.get("a1") === "on",
    example: f.get("example") === "on",
    promoted: f.get("promoted") === "on",
    published: f.get("published") === "on",
    ...details,
  };
  if (!offer.name) return { ok: false, error: "Wpisz nazwę agencji." };
  for (const v of [offer.payMin, offer.payMax])
    if (v !== null && (!Number.isFinite(v) || v <= 0)) return { ok: false, error: "Stawka musi być kwotą w euro większą od zera." };
  if (offer.payMin !== null && offer.payMax !== null && offer.payMin > offer.payMax)
    return { ok: false, error: "Stawka „od” nie może być wyższa niż „do”." };
  if (offer.payMin !== null) offer.payMin = Math.round(offer.payMin);
  if (offer.payMax !== null) offer.payMax = Math.round(offer.payMax);
  return { ok: true, offer };
}
