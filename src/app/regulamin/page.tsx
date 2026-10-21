import type { Metadata } from "next";
import { owner } from "@/lib/owner";

export const metadata: Metadata = { title: "Regulamin" };

export default function TermsPage() {
  return (
    <article className="prose">
      <h1>Regulamin serwisu</h1>
      <p className="note">Obowiązuje od 1 listopada 2026 r.</p>

      <h2>§ 1. Usługodawca</h2>
      <p>
        Serwis „Stawki Agencji” dostępny pod adresem {owner.siteUrl} oraz w aplikacji na Androida prowadzi{" "}
        {owner.name}, {owner.address}, e-mail: {owner.email} (dalej: Usługodawca).
      </p>

      <h2>§ 2. Czym jest serwis</h2>
      <ol>
        <li>Serwis prezentuje informacje o ofertach agencji delegujących opiekunów osób starszych do pracy w Niemczech: formie umowy, orientacyjnym wynagrodzeniu, długości turnusu i innych warunkach.</li>
        <li>Informacje pochodzą z publicznych ogłoszeń agencji i od samych agencji. Przy każdej ofercie podajemy datę weryfikacji i, jeśli to możliwe, źródło.</li>
        <li>Dane mają charakter informacyjny. Nie są ofertą pracy ani ofertą w rozumieniu Kodeksu cywilnego. Usługodawca nie jest agencją pośrednictwa pracy i nie zawiera umów w imieniu agencji.</li>
        <li>Korzystanie z serwisu przez opiekunki i opiekunów jest bezpłatne i nie wymaga rejestracji.</li>
      </ol>

      <h2>§ 3. Wymagania techniczne</h2>
      <p>Do korzystania z serwisu wystarczy urządzenie z dostępem do internetu i aktualną przeglądarką internetową albo aplikacja na Androida.</p>

      <h2>§ 4. Zasady korzystania</h2>
      <ol>
        <li>Zabronione jest dostarczanie treści bezprawnych oraz działania utrudniające działanie serwisu.</li>
        <li>Przed podjęciem pracy użytkownik powinien potwierdzić warunki bezpośrednio u agencji i poprosić o pisemną ofertę z kwotą brutto, formą umowy i informacją o składkach.</li>
      </ol>

      <h2>§ 5. Odpowiedzialność</h2>
      <ol>
        <li>Usługodawca dokłada starań, aby informacje były aktualne i rzetelne, jednak warunki ofert mogą zmienić się bez jego wiedzy.</li>
        <li>Usługodawca nie odpowiada za treść umów zawieranych między użytkownikami a agencjami ani za ich wykonanie.</li>
        <li>Ograniczenia z ust. 1–2 nie wyłączają odpowiedzialności wobec konsumentów w zakresie, w jakim wyłączenie jest niedozwolone przez prawo.</li>
      </ol>

      <h2>§ 6. Oferty promowane</h2>
      <p>
        Agencje mogą wykupić promowanie oferty na podstawie odrębnego porozumienia z Usługodawcą. Oferty promowane są
        wyświetlane na początku listy i zawsze oznaczone etykietą „Oferta promowana”. Opłata nie wpływa na prezentowane
        stawki ani warunki. Zasady kolejności opisuje strona „Jak tworzymy ranking”.
      </p>

      <h2>§ 7. Zgłaszanie błędów i reklamacje</h2>
      <ol>
        <li>Błędne lub nieaktualne dane oraz reklamacje dotyczące działania serwisu można zgłaszać na adres {owner.email}.</li>
        <li>Usługodawca odpowiada na zgłoszenie w ciągu 14 dni.</li>
        <li>Agencja, której dotyczy oferta, może zażądać poprawienia danych o swojej ofercie.</li>
      </ol>

      <h2>§ 8. Dane osobowe</h2>
      <p>Zasady przetwarzania danych osobowych opisuje Polityka prywatności.</p>

      <h2>§ 9. Postanowienia końcowe</h2>
      <ol>
        <li>Usługodawca może zmienić regulamin z ważnych przyczyn, np. zmiany przepisów lub zakresu usług. Zmiany publikuje w serwisie co najmniej 7 dni przed ich wejściem w życie.</li>
        <li>W sprawach nieuregulowanych stosuje się prawo polskie. Konsument może skorzystać z pozasądowych sposobów rozwiązywania sporów, np. pomocy miejskiego lub powiatowego rzecznika konsumentów.</li>
      </ol>
    </article>
  );
}
