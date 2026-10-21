# Publikacja w Google Play

Aplikacja na Androida to Twoja strona otwarta w pełnym ekranie, bez paska przeglądarki
(technologia Trusted Web Activity). Zmiany w ofertach robisz jak dotąd w panelu `/admin`.
Pojawiają się w aplikacji od razu, bez wysyłania nowej wersji do sklepu.

Strona jest już do tego przygotowana:
- manifest aplikacji (`/manifest.webmanifest`) z nazwą, kolorami i ikonami,
- service worker (`/sw.js`) i strona „Brak połączenia” dla trybu offline,
- plik weryfikacji domeny (`/.well-known/assetlinks.json`), ustawiany zmiennymi środowiskowymi,
- grafiki i teksty do sklepu w folderze `play-store/`.

## Co musisz mieć

- Stronę wdrożoną pod własną domeną z HTTPS (instrukcja w `README.md`).
- Konto dewelopera Google Play: jednorazowa opłata 25 USD, [play.google.com/console](https://play.google.com/console).
- Uzupełnioną politykę prywatności pod adresem `https://stawkiagencji.pl/polityka-prywatnosci`
  (wypełnia się sama po ustawieniu zmiennych `SITE_OWNER_*` z `WDROZENIE.md`).

> **Konto osobiste czy firmowe?** Nowe konta **osobiste** muszą przed publikacją przeprowadzić
> test zamknięty: co najmniej 12 testerów przez 14 dni bez przerwy. Konta **organizacji** (firma
> z numerem D-U-N-S) nie mają tego wymogu. Jeśli prowadzisz działalność, załóż konto firmowe.

## Krok 1. Wdróż stronę

Opublikuj stronę pod docelową domeną (instrukcja: `WDROZENIE.md`). Sprawdź, czy działają:
- `https://stawkiagencji.pl/manifest.webmanifest`
- `https://stawkiagencji.pl/sw.js`

Domeny nie da się później zmienić bez wydania nowej aplikacji. Wybierz ją na stałe.

## Krok 2. Zbuduj aplikację w PWABuilder (bez instalowania niczego)

1. Wejdź na [pwabuilder.com](https://www.pwabuilder.com) i wpisz adres swojej strony.
2. Kliknij **Package for stores**, potem **Android** → **Generate Package**.
3. Ustaw w opcjach:
   - **Package ID**: np. `pl.stawkiagencji.app` (na stałe, nie da się zmienić),
   - **App name**: `Stawki Agencji`,
   - **Launcher name**: `Stawki Agencji`,
   - **Signing key**: *Create new* (PWABuilder wygeneruje klucz).
4. Pobierz paczkę ZIP. W środku jest:
   - plik `.aab`, który wysyłasz do Google Play,
   - `signing.keystore` i `signing-key-info.txt` – **klucz i hasła do aplikacji**,
   - `assetlinks.json` z odciskiem klucza.

> **Zachowaj `signing.keystore` i `signing-key-info.txt` w bezpiecznym miejscu (np. menedżer haseł
> i kopia na dysku zewnętrznym).** Są potrzebne przy każdej aktualizacji aplikacji.

## Krok 3. Utwórz aplikację w Play Console

1. **Utwórz aplikację** → język domyślny: polski, typ: aplikacja, bezpłatna.
2. **Testowanie → Test zamknięty** (konto osobiste) albo **Produkcja** (konto firmowe) → **Utwórz wersję**.
3. Zgódź się na **podpisywanie aplikacji przez Google Play** i wgraj plik `.aab`.

## Krok 4. Połącz aplikację z domeną

Bez tego kroku aplikacja pokazuje u góry pasek adresu jak zwykła przeglądarka.

1. W Play Console otwórz **Testowanie i publikowanie → Integralność aplikacji → Podpisywanie aplikacji**.
2. Skopiuj **odcisk certyfikatu SHA-256** z sekcji *Klucz podpisywania aplikacji*.
3. Skopiuj też odcisk SHA-256 z pliku `assetlinks.json` od PWABuilder (to Twój klucz przesyłania).
4. Ustaw na serwerze zmienne środowiskowe i uruchom ponownie aplikację:
   ```
   ANDROID_PACKAGE_NAME=pl.stawkiagencji.app
   ANDROID_SHA256_FINGERPRINTS=AB:CD:...(klucz Google),12:34:...(klucz PWABuilder)
   ```
5. Sprawdź `https://stawkiagencji.pl/.well-known/assetlinks.json`: powinien pokazać nazwę pakietu i oba odciski.

## Krok 5. Uzupełnij wpis w sklepie

**Rozwój → Obecność w sklepie → Główny wpis.** Teksty i grafiki skopiuj z `play-store/WPIS-DO-SKLEPU.md`:
- ikona: `play-store/icon-512.png`,
- grafika promocyjna: `play-store/feature-graphic-1024x500.png`,
- zrzuty z telefonu: `play-store/screenshots/` (min. 2, wgraj wszystkie 4).

## Krok 6. Formularze w zakładce „Zawartość aplikacji”

| Formularz | Odpowiedź |
|---|---|
| Polityka prywatności | `https://stawkiagencji.pl/polityka-prywatnosci` |
| Dostęp do aplikacji | Wszystkie funkcje dostępne bez specjalnego dostępu (panel `/admin` jest tylko dla Ciebie i nie jest częścią aplikacji dla użytkowników) |
| Reklamy | Nie zawiera reklam. Oferty promowane to treść oznaczona etykietą, nie sieć reklamowa. Jeśli dodasz np. AdSense, zmień na „Tak” |
| Klasyfikacja treści | Wypełnij ankietę: brak przemocy, hazardu i treści dla dorosłych. Kategoria: narzędzia / informacje |
| Grupa docelowa | 18+ |
| Bezpieczeństwo danych | Aplikacja zbiera dane: **Dane osobowe → Adres e-mail** (opcjonalny, tylko w formularzu „Zgłoś agencję”). Cel: **komunikacja z użytkownikiem**. Dane nie są udostępniane innym firmom, są szyfrowane podczas przesyłania (HTTPS), użytkownik może poprosić o ich usunięcie (e-mailem). Filtry zapisują się tylko w telefonie. **Jeśli dodasz analitykę (np. Google Analytics), zaktualizuj tę odpowiedź** |
| Aplikacja z wiadomościami / rządowa / finansowa | Nie |

## Krok 7. Test i publikacja

1. **Konto osobiste:** w teście zamkniętym dodaj min. 12 testerów (adresy Gmail znajomych, opiekunek,
   członków grup na Facebooku). Muszą zainstalować aplikację z linku testowego i mieć ją przez 14 dni.
   Potem w Play Console pojawi się przycisk **Poproś o dostęp do produkcji**.
2. **Konto firmowe:** od razu wyślij wersję produkcyjną do sprawdzenia.
3. Weryfikacja przez Google trwa zwykle od kilku dni do tygodnia.

Po wpisaniu prawdziwych ofert zrób nowe zrzuty ekranu: otwórz aplikację na telefonie, zrób zrzuty
strony głównej, listy ofert, porównania i poradnika, i podmień je w Play Console.

## Jak zebrać 12 testerów (konto osobiste)

Testerzy potrzebują konta Google (Gmail) i telefonu z Androidem. Najłatwiej znaleźć ich w grupach
dla opiekunek na Facebooku. To przy okazji Twoi pierwsi użytkownicy.

1. W Play Console: **Testowanie → Test zamknięty → Testerzy** → utwórz listę e-mailową i dodaj adresy.
2. Skopiuj **link dołączenia do testu** i wyślij go testerom.
3. Testerzy muszą kliknąć link, zaakceptować udział i zainstalować aplikację. Nie mogą jej odinstalować przez 14 dni.
4. Zbierz o kilka osób więcej niż 12, bo ktoś może odpaść.

Wzór posta do grupy:

> Hej! Robię bezpłatną aplikację dla opiekunek pracujących w Niemczech: porównuje agencje,
> umowy i stawki netto w jednym miejscu. Szukam osób z telefonem z Androidem, które przez
> 2 tygodnie przetestują aplikację (wystarczy zainstalować i czasem zajrzeć).
> Chętne osoby proszę o adres Gmail w wiadomości prywatnej. Dziękuję! 🙂

Po 14 dniach w Play Console pojawi się **Poproś o dostęp do produkcji**. Odpowiedz na kilka pytań
o teście (ile osób testowało, jakie były uwagi) i poczekaj na decyzję Google.

## Aktualizacje

- **Oferty, teksty i wygląd strony:** zmieniasz na serwerze. Aplikacja pokaże je od razu.
- **Nazwa, ikona, kolor paska:** wymagają nowej wersji. Wygeneruj ją w PWABuilder **tym samym kluczem**
  (`signing.keystore`) i z wyższym numerem wersji, potem wgraj nowy `.aab` w Play Console.

## Częste problemy

- **Pasek adresu u góry aplikacji:** `assetlinks.json` nie zawiera odcisku klucza Google z kroku 4
  albo serwer nie został uruchomiony ponownie po zmianie zmiennych.
- **Odrzucenie za „minimalną funkcjonalność”:** Google odrzuca aplikacje, które są tylko kopią strony
  bez wartości. Pomaga pełna baza prawdziwych ofert, dobre zrzuty ekranu i opis, który pokazuje,
  co użytkownik zyskuje (porównanie, filtry, poradnik).
