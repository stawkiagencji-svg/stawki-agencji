// Adres bazy. Integracja Neon na Vercelu dokleja do nazw zmiennych prefiks wybrany przy podłączaniu
// (np. DATABASE_URL, STORAGE_URL, MOJA_BAZA_DATABASE_URL), więc oprócz typowych nazw szukamy
// dowolnej zmiennej kończącej się na _DATABASE_URL albo _POSTGRES_URL.
function findDatabaseUrl(): string {
  const env = process.env;
  const direct = env.DATABASE_URL || env.POSTGRES_URL || env.STORAGE_URL;
  if (direct) return direct;
  const keys = Object.keys(env).sort();
  for (const suffix of ["_DATABASE_URL", "_POSTGRES_URL"]) {
    const key = keys.find((k) => k.endsWith(suffix) && env[k]);
    if (key) return env[key] as string;
  }
  return "";
}

export const DATABASE_URL = findDatabaseUrl();
