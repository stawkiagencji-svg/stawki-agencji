import type { Metadata } from "next";

export const metadata: Metadata = { title: "Brak połączenia", robots: { index: false } };

export default function OfflinePage() {
  return (
    <article className="prose">
      <h1>Brak połączenia z internetem</h1>
      <p>Oferty agencji wczytujemy na bieżąco, żeby stawki były aktualne. Sprawdź połączenie i spróbuj ponownie.</p>
      <a className="btn primary" href="/">Spróbuj ponownie</a>
    </article>
  );
}
