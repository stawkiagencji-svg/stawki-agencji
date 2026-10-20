import type { Metadata } from "next";

export const metadata: Metadata = { title: "Polityka prywatności" };

export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1>Polityka prywatności</h1>
      <p className="todo">
        [UZUPEŁNIJ przed startem: administrator danych, cele i podstawy przetwarzania (RODO), okres przechowywania, prawa
        użytkownika, dostawca hostingu, ewentualne narzędzia analityczne.]
      </p>
      <h2>Pliki cookie i pamięć przeglądarki</h2>
      <p>
        Serwis zapisuje w pamięci Twojej przeglądarki wybrane filtry, żeby przywrócić je przy następnej wizycie. Te dane
        nie są wysyłane na serwer. Panel administratora używa jednego technicznego pliku cookie sesji.
      </p>
    </article>
  );
}
