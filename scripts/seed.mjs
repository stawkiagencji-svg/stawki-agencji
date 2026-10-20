import pg from "pg";

// Przykładowe oferty, oznaczone flagą example. Usuń je w panelu /admin,
// gdy dodasz prawdziwe, zweryfikowane dane agencji.
const examples = [
  { name: "Agencja A (przykład)", contracts: ["zlecenie"], pay_min: 1400, pay_max: 2100, german: 1, rotation: "6–12 tygodni", bonus: "Premia świąteczna", verified: "2026-10", travel: true, a1: true },
  { name: "Agencja B (przykład)", contracts: ["praca"], pay_min: 1300, pay_max: 1800, german: 2, rotation: "8–10 tygodni", bonus: "", verified: "2026-10", travel: true, a1: true },
  { name: "Agencja C (przykład)", contracts: ["zlecenie", "b2b"], pay_min: 1600, pay_max: 2600, german: 2, rotation: "4–12 tygodni", bonus: "Dodatek za prawo jazdy", verified: "2026-09", travel: false, a1: true },
  { name: "Agencja D (przykład)", contracts: ["de"], pay_min: 1900, pay_max: 2800, german: 3, rotation: "Stała praca lub turnusy", bonus: "", verified: "2026-09", travel: false, a1: false },
  { name: "Agencja E (przykład)", contracts: ["zlecenie"], pay_min: 1200, pay_max: 1600, german: 0, rotation: "4–8 tygodni", bonus: "", verified: "2026-08", travel: true, a1: true },
];

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});
await client.connect();
const { rows } = await client.query("SELECT count(*)::int AS n FROM offers");
if (rows[0].n > 0) {
  console.log(`Baza ma już ${rows[0].n} ofert, pomijam dane przykładowe.`);
} else {
  for (const o of examples) {
    await client.query(
      `INSERT INTO offers (name, contracts, pay_min, pay_max, german, rotation, bonus, verified, travel, a1, example, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,TRUE,'Dane przykładowe. Zastąp prawdziwą ofertą po weryfikacji u agencji.')`,
      [o.name, o.contracts, o.pay_min, o.pay_max, o.german, o.rotation, o.bonus, o.verified, o.travel, o.a1],
    );
  }
  console.log(`Dodano ${examples.length} przykładowych ofert.`);
}
await client.end();
