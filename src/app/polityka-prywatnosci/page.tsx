import type { Metadata } from "next";
import { owner } from "@/lib/owner";

export const metadata: Metadata = { title: "Polityka prywatności" };

export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1>Polityka prywatności</h1>
      <p className="note">Obowiązuje od 1 listopada 2026 r.</p>

      <h2>Administrator danych</h2>
      <p>
        Administratorem danych osobowych jest {owner.name}, {owner.address}. Kontakt w sprawach danych osobowych:{" "}
        {owner.email}.
      </p>

      <h2>Jakie dane przetwarzamy</h2>
      <p>
        Serwis nie wymaga rejestracji i nie zbiera danych osobowych użytkowników przeglądających oferty. Nie używamy
        narzędzi analitycznych ani reklamowych. Dane osobowe przetwarzamy tylko w sytuacjach opisanych poniżej.
      </p>
      <ul>
        <li>
          <b>Logi serwera.</b> Dostawca hostingu automatycznie zapisuje techniczne dane o połączeniach (adres IP, czas,
          rodzaj przeglądarki) w celu zapewnienia bezpieczeństwa i działania serwisu. Podstawa: prawnie uzasadniony
          interes administratora (art. 6 ust. 1 lit. f RODO). Logi są przechowywane przez okres ustalony przez dostawcę
          hostingu, zwykle nie dłużej niż 30 dni.
        </li>
        <li>
          <b>Formularz „Zgłoś agencję”.</b> Przetwarzamy informację, kim jesteś (np. opiekunka, pracownik agencji),
          treść zgłoszenia oraz – jeśli go podasz – adres e-mail. Treść zgłoszenia służy do sprawdzenia i opublikowania
          informacji o agencji (prawnie uzasadniony interes, art. 6 ust. 1 lit. f RODO). Adres e-mail wykorzystujemy
          wyłącznie do kontaktu w sprawie zgłoszenia, na podstawie Twojej zgody (art. 6 ust. 1 lit. a RODO), którą
          możesz w każdej chwili wycofać. E-mail usuwamy po zakończeniu weryfikacji, najpóźniej po 12 miesiącach.
          Dane zgłaszającego nigdy nie są publikowane.
        </li>
        <li>
          <b>Ochrona przed spamem.</b> Przy wysyłce formularza zapisujemy zaszyfrowany skrót adresu IP (nie sam
          adres), żeby ograniczyć liczbę zgłoszeń z jednego urządzenia. Skrót usuwamy po 30 dniach. Podstawa: prawnie
          uzasadniony interes (art. 6 ust. 1 lit. f RODO).
        </li>
        <li>
          <b>Korespondencja.</b> Jeśli napiszesz do nas e-mail, przetwarzamy Twój adres i treść wiadomości, żeby
          odpowiedzieć. Podstawa: prawnie uzasadniony interes (art. 6 ust. 1 lit. f RODO). Przechowujemy korespondencję
          do 2 lat od zakończenia sprawy.
        </li>
        <li>
          <b>Dane agencji.</b> Przy ofertach prezentujemy publicznie dostępne informacje o agencjach (nazwa, strona
          www, warunki ofert). Są to dane firm, a nie osób prywatnych.
        </li>
      </ul>

      <h2>Pamięć przeglądarki i pliki cookie</h2>
      <p>
        Serwis zapisuje w pamięci Twojej przeglądarki (localStorage) wybrane filtry, żeby przywrócić je przy następnej
        wizycie. Te dane zostają na Twoim urządzeniu i nie są wysyłane na serwer. Możesz je usunąć, czyszcząc dane
        strony w przeglądarce. Serwis nie używa plików cookie wobec użytkowników. Jeden techniczny plik cookie służy
        wyłącznie do logowania administratora.
      </p>

      <h2>Odbiorcy danych</h2>
      <p>
        Dane techniczne przetwarza dostawca hostingu (Vercel Inc.) oraz dostawca bazy danych (Neon). Mogą one przetwarzać
        dane poza Europejskim Obszarem Gospodarczym, w tym w USA, na podstawie decyzji Komisji Europejskiej w sprawie
        Ramowego porozumienia w zakresie ochrony danych UE–USA lub standardowych klauzul umownych.
      </p>

      <h2>Twoje prawa</h2>
      <p>
        Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz
        wniesienia sprzeciwu. Masz też prawo złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2,
        00-193 Warszawa). Aby skorzystać z praw, napisz na {owner.email}.
      </p>

      <h2>Aplikacja na Androida</h2>
      <p>
        Aplikacja w Google Play wyświetla ten sam serwis i podlega tej samej polityce prywatności. Nie prosi o żadne
        uprawnienia w telefonie i nie zbiera innych danych niż opisane powyżej.
      </p>

      <h2>Zmiany</h2>
      <p>O zmianach polityki prywatności informujemy na tej stronie, podając datę obowiązywania.</p>
    </article>
  );
}
