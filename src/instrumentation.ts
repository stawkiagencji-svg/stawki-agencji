// Uruchamiane raz przy starcie serwera: tworzy tabele i przy pustej bazie
// wczytuje szkice ofert do weryfikacji. Dzięki temu wdrożenie nie wymaga terminala.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { DATABASE_URL } = await import("./lib/env");
  if (!DATABASE_URL) return;
  const { setupDatabase } = await import("./lib/setup");
  try {
    await setupDatabase();
  } catch (err) {
    console.error("Nie udało się przygotować bazy danych:", err);
  }
}
