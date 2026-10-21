import { pool } from "@/lib/db";
import { DATABASE_URL_SOURCE } from "@/lib/env";

export const dynamic = "force-dynamic";

// Diagnostyka wdrożenia: pokazuje, czy ustawienia są kompletne, bez ujawniania wartości.
export async function GET() {
  const report: Record<string, unknown> = {
    bazaDanychZmienna: DATABASE_URL_SOURCE || "BRAK – podłącz bazę Neon w zakładce Storage",
    hasloAdmina: process.env.ADMIN_PASSWORD ? (process.env.ADMIN_PASSWORD.length >= 12 ? "ustawione" : "za krótkie (min. 12 znaków)") : "BRAK – dodaj ADMIN_PASSWORD",
  };
  try {
    const { rows } = await pool.query("SELECT count(*)::int AS n FROM offers");
    report.polaczenieZBaza = "OK";
    report.liczbaOfert = rows[0].n;
  } catch (err) {
    report.polaczenieZBaza = "BŁĄD";
    report.blad = err instanceof Error ? err.message : String(err);
  }
  return Response.json(report, { headers: { "Cache-Control": "no-store" } });
}
