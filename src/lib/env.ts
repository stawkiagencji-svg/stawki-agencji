// Adres bazy. Integracja Neon na Vercelu dokleja do nazw zmiennych prefiks wybrany przy podłączaniu
// (np. DATABASE_URL, STORAGE_URL, MOJA_BAZA_DATABASE_URL), więc oprócz typowych nazw szukamy
// dowolnej zmiennej kończącej się na _DATABASE_URL albo _POSTGRES_URL.
function findDatabaseUrl(): { key: string; url: string } {
  const env = process.env;
  for (const key of ["DATABASE_URL", "POSTGRES_URL", "STORAGE_URL"]) if (env[key]) return { key, url: env[key] as string };
  const keys = Object.keys(env).sort();
  for (const suffix of ["_DATABASE_URL", "_POSTGRES_URL"]) {
    const key = keys.find((k) => k.endsWith(suffix) && env[k]);
    if (key) return { key, url: env[key] as string };
  }
  return { key: "", url: "" };
}

const found = findDatabaseUrl();
export const DATABASE_URL = found.url;
/** Nazwa zmiennej, z której wzięto adres bazy (do diagnostyki, bez wartości). */
export const DATABASE_URL_SOURCE = found.key;
