// Adres bazy: integracja Neon na Vercelu nazywa zmienną zależnie od wybranego prefiksu
// (DATABASE_URL, POSTGRES_URL albo STORAGE_URL), więc akceptujemy każdą z nich.
export const DATABASE_URL =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.STORAGE_URL || "";
