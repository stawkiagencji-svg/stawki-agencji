import type { Metadata } from "next";
import Link from "next/link";
import { owner } from "@/lib/owner";

export const metadata: Metadata = {
  title: "Regulamin dla agencji",
  description: "Zasady bezpłatnego wpisu i abonamentu dla agencji opieki w porównywarce Stawki Agencji.",
};

export default function AgencyTermsPage() {
  return (
    <article className="prose">
      <div className="eyebrow">Dla agencji</div>
      <h1>Regulamin usług dla agencji</h1>
      <p className="note">Obowiązuje od 20 listopada 2026 r.</p>

      <h2>§ 1. Definicje</h2>
      <ol>
        <li><b>Usługodawca</b>: {owner.name}, {owner.address}, e-mail: {owner.email}, prowadząca serwis „Stawki Agencji” w ramach działalności nierejestrowanej.</li>
        <li><b>Serwis</b>: porównywarka agencji opieki dostępna pod adresem {owner.siteUrl} oraz w aplikacji na Androida.</li>
        <li><b>Agencja</b>: przedsiębiorca, w szczególności agencja delegująca lub zatrudniająca opiekunów osób starszych do pracy w Niemczech, który korzysta z usług na podstawie tego regulaminu.</li>
        <li><b>Pakiet Podstawowy</b>: bezpłatny wpis Agencji w Serwisie.</li>
        <li><b>Abonament</b>: płatny pakiet Standard albo Premium, opisany w § 2.</li>
        <li><b>Okres rozliczeniowy</b>: miesiąc kalendarzowy liczony od dnia rozpoczęcia płatnego Abonamentu.</li>
      </ol>

      <h2>§ 2. Zakres usług</h2>
      <ol>
        <li><b>Pakiet Podstawowy (bezpłatny)</b> obejmuje: prezentację Agencji na liście i w porównaniu ofert, możliwość dodawania opinii przez opiekunów oraz aktualizację danych przez Usługodawcę co 1–2 miesiące na podstawie publicznych ogłoszeń Agencji lub informacji od Agencji.</li>
        <li><b>Abonament Standard</b> obejmuje dodatkowo: logo Agencji przy ofercie, przycisk „Aplikuj na stronie agencji” prowadzący do formularza wskazanego przez Agencję, oznaczenie „Dane potwierdzone przez agencję” z datą potwierdzenia oraz wprowadzanie zmian danych zgłoszonych przez Agencję w ciągu 48 godzin w dni robocze.</li>
        <li><b>Abonament Premium</b> obejmuje wszystko z pakietu Standard oraz: wyświetlanie oferty jako „Oferta promowana” na początku listy, jeden post o Agencji na profilu Serwisu na Facebooku w każdym Okresie rozliczeniowym, publikowanie odpowiedzi Agencji pod opiniami oraz wprowadzanie zmian danych w ciągu 24 godzin w dni robocze.</li>
        <li>Jednocześnie wyświetlane są najwyżej trzy Oferty promowane. Jeśli Abonament Premium wykupi więcej Agencji, ich kolejność na górze listy zmienia się rotacyjnie.</li>
        <li>Usługodawca nie gwarantuje określonej liczby wyświetleń, kliknięć ani zgłoszeń kandydatów.</li>
      </ol>

      <h2>§ 3. Zasady neutralności</h2>
      <ol>
        <li>Opłaty nie wpływają na prezentowane stawki i warunki pracy, na treść ani ocenę opinii, ani na kolejność ofert. Wyjątkiem jest oznaczona Oferta promowana, o której mowa w § 2 ust. 3.</li>
        <li>Usługodawca nie usuwa ani nie zmienia opinii zgodnych z <Link href="/regulamin">regulaminem Serwisu</Link> na prośbę Agencji, niezależnie od wykupionego pakietu.</li>
        <li>Oferty promowane i posty na Facebooku są zawsze wyraźnie oznaczone jako materiały promocyjne.</li>
        <li>Jeśli Usługodawca współpracuje z którąś z agencji, jest ona oznaczona w Serwisie etykietą „Tu pracuje autorka serwisu” i korzysta z usług według tego samego regulaminu i cennika.</li>
      </ol>

      <h2>§ 4. Zawarcie umowy</h2>
      <ol>
        <li>Pakiet Podstawowy jest dostępny bez zawierania odrębnej umowy. Agencja może zgłosić lub poprawić swoje dane przez <Link href="/zglos-agencje">formularz</Link> albo e-mailem.</li>
        <li>Aby zamówić Abonament, Agencja wypełnia formularz na stronie <Link href="/cennik">Cennik</Link> albo wysyła na adres {owner.email} zamówienie zawierające: nazwę firmy, NIP, adres, imię i nazwisko oraz e-mail osoby kontaktowej, wybrany pakiet i sposób płatności (miesięcznie albo rocznie), a także oświadczenie o akceptacji tego regulaminu.</li>
        <li>Umowa zostaje zawarta z chwilą potwierdzenia zamówienia przez Usługodawcę e-mailem.</li>
        <li>Agencja oświadcza, że zawiera umowę w związku z prowadzoną działalnością gospodarczą i ma ona dla niej charakter zawodowy.</li>
      </ol>

      <h2>§ 5. Okres próbny i cena założycielska</h2>
      <ol>
        <li>Pierwsze 20 Agencji, które zamówią Abonament, otrzymuje 30 dni korzystania z wybranego pakietu bez opłat.</li>
        <li>Najpóźniej 7 dni przed końcem okresu próbnego Usługodawca przypomina e-mailem o jego zakończeniu. Jeśli Agencja nie zrezygnuje przed końcem okresu próbnego, Abonament staje się płatny od następnego dnia.</li>
        <li>Pierwszym 20 Agencjom przysługuje cena założycielska, niższa o 30% od ceny regularnej. Cena założycielska obowiązuje przez pierwsze 12 Okresów rozliczeniowych płatnego Abonamentu, o ile Abonament trwa bez przerwy. Po tym czasie obowiązuje aktualna cena regularna. Po rezygnacji i ponownym zamówieniu obowiązuje cena aktualna w dniu zamówienia.</li>
      </ol>

      <h2>§ 6. Ceny i płatności</h2>
      <ol>
        <li>Ceny regularne wynoszą: Standard 199 zł, Premium 449 zł za Okres rozliczeniowy. Cena założycielska wynosi odpowiednio 139 zł i 314 zł.</li>
        <li>Usługodawca nie jest czynnym podatnikiem VAT. Podane ceny są cenami końcowymi.</li>
        <li>Abonament jest płatny z góry za każdy Okres rozliczeniowy, przelewem na rachunek bankowy wskazany przez Usługodawcę, w terminie 7 dni od otrzymania rachunku. Usługodawca wystawia rachunek i wysyła go e-mailem.</li>
        <li>Przy płatności za 12 miesięcy z góry Agencja płaci za 10 miesięcy.</li>
        <li>Jeśli płatność opóźnia się o więcej niż 14 dni, Usługodawca może wstrzymać usługi płatne do czasu zapłaty. Pakiet Podstawowy pozostaje aktywny.</li>
      </ol>

      <h2>§ 7. Obowiązki Agencji</h2>
      <ol>
        <li>Agencja przekazuje dane prawdziwe, aktualne i zgodne z jej rzeczywistą ofertą oraz informuje Usługodawcę o ich zmianie.</li>
        <li>Agencja prowadzi działalność zgodnie z prawem, w tym, jeśli jest to wymagane, posiada wpis do Krajowego Rejestru Agencji Zatrudnienia.</li>
        <li>Przekazując logo i materiały, Agencja oświadcza, że ma do nich prawa, i udziela Usługodawcy niewyłącznej, nieodpłatnej licencji na ich wyświetlanie w Serwisie i na profilach Serwisu w mediach społecznościowych na czas trwania umowy.</li>
        <li>Formularz, do którego prowadzi przycisk „Aplikuj”, należy do Agencji. Agencja jest administratorem danych osobowych przekazanych w tym formularzu i odpowiada za ich przetwarzanie.</li>
        <li>Usługodawca może odmówić publikacji danych lub treści nieprawdziwych, wprowadzających w błąd albo niezgodnych z prawem i poprosić Agencję o ich poprawienie.</li>
      </ol>

      <h2>§ 8. Czas trwania i rezygnacja</h2>
      <ol>
        <li>Umowa o Abonament zawierana jest na czas nieokreślony.</li>
        <li>Agencja może zrezygnować z Abonamentu w każdej chwili, e-mailem na adres {owner.email}. Rezygnacja działa na koniec opłaconego Okresu rozliczeniowego. Po tym czasie Agencja pozostaje w Serwisie w Pakiecie Podstawowym, chyba że poprosi o usunięcie wpisu.</li>
        <li>Opłata roczna nie podlega zwrotowi, z wyjątkiem rozwiązania umowy z przyczyn leżących po stronie Usługodawcy. Wtedy Usługodawca zwraca opłatę za niewykorzystane pełne miesiące.</li>
        <li>Usługodawca może rozwiązać umowę ze skutkiem natychmiastowym, jeśli Agencja rażąco narusza regulamin, w szczególności przekazuje dane nieprawdziwe albo zalega z płatnością ponad 30 dni.</li>
      </ol>

      <h2>§ 9. Odpowiedzialność</h2>
      <ol>
        <li>Usługodawca dokłada starań, aby Serwis działał bez przerw. Przerwy techniczne nie są naruszeniem umowy, jeśli łącznie nie przekraczają 3 dni w Okresie rozliczeniowym. Za dłuższe przerwy Usługodawca obniża opłatę proporcjonalnie.</li>
        <li>Usługodawca nie odpowiada za rekrutację prowadzoną przez Agencję ani za umowy zawierane między Agencją a opiekunami.</li>
        <li>Odpowiedzialność Usługodawcy wobec Agencji jest ograniczona do wysokości opłat zapłaconych przez Agencję za ostatnie 3 Okresy rozliczeniowe. Ograniczenie nie dotyczy szkody wyrządzonej umyślnie.</li>
      </ol>

      <h2>§ 10. Reklamacje</h2>
      <p>Reklamacje dotyczące usług Agencja zgłasza na adres {owner.email}. Usługodawca odpowiada w ciągu 14 dni.</p>

      <h2>§ 11. Dane osobowe</h2>
      <p>
        Usługodawca przetwarza dane osób kontaktowych Agencji (imię, nazwisko, e-mail, telefon) w celu zawarcia i wykonania umowy
        oraz rozliczeń (art. 6 ust. 1 lit. b, c i f RODO). Szczegóły opisuje <Link href="/polityka-prywatnosci">polityka prywatności</Link>.
      </p>

      <h2>§ 12. Zmiany regulaminu i cen</h2>
      <ol>
        <li>Usługodawca może zmienić regulamin lub ceny regularne z ważnych przyczyn, informując Agencje e-mailem co najmniej 14 dni przed zmianą.</li>
        <li>Agencja, która nie akceptuje zmiany, może zrezygnować z Abonamentu przed jej wejściem w życie.</li>
        <li>W okresie, o którym mowa w § 5 ust. 3, cena założycielska pozostaje o 30% niższa od aktualnej ceny regularnej.</li>
      </ol>

      <h2>§ 13. Postanowienia końcowe</h2>
      <ol>
        <li>W sprawach nieuregulowanych stosuje się prawo polskie, w szczególności Kodeks cywilny.</li>
        <li>Spory rozstrzyga sąd właściwy dla miejsca zamieszkania Usługodawcy.</li>
        <li>Regulamin Serwisu dla użytkowników znajduje się na stronie <Link href="/regulamin">Regulamin</Link>.</li>
      </ol>
    </article>
  );
}
