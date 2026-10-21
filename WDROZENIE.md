# Wdrożenie krok po kroku (bez terminala)

Wszystko robisz w przeglądarce. Potrzebujesz około godziny i adresu e-mail.
Koszt na start: tylko domena (ok. 10–60 zł za pierwszy rok). Vercel i Neon mają darmowe plany.

## Krok 1. Wybierz i kup domenę

Propozycje nazw (sprawdź, czy są wolne, w wyszukiwarce domen u rejestratora):

- `porownajopieke.pl`
- `stawkiopiekunek.pl`
- `ileplaciagencja.pl`
- `opiekunki-porownanie.pl`
- `agencjeopiekunek.pl`

Gdzie kupić: dowolny polski rejestrator, np. OVHcloud, nazwa.pl, home.pl, cyber_Folks.
Porównaj nie tylko cenę pierwszego roku, ale też **cenę odnowienia** – bywa kilka razy wyższa.

## Krok 2. Załóż konto GitHub i wgraj kod

GitHub przechowuje kod. Vercel pobiera go stamtąd i publikuje stronę.

1. Załóż konto na [github.com](https://github.com).
2. Kliknij **+** (prawy górny róg) → **New repository**.
   - Nazwa: `porownywarka-opieki`
   - Zaznacz **Private** (kod widzisz tylko Ty).
   - Kliknij **Create repository**.
3. Na stronie nowego repozytorium kliknij link **uploading an existing file**.
4. Rozpakuj `porownywarka-opieki.zip` na komputerze, otwórz folder `porownywarka-opieki`,
   zaznacz **całą zawartość** (wszystkie pliki i foldery w środku) i przeciągnij do okna przeglądarki.
5. Poczekaj, aż pliki się wgrają, i kliknij **Commit changes**.

> Możesz też połączyć GitHub z Claude ([claude.ai/connect-github](https://claude.ai/connect-github)).
> Wtedy w nowej sesji Claude wgra kod za Ciebie i będzie mógł wprowadzać kolejne zmiany.

## Krok 3. Opublikuj stronę na Vercelu

1. Wejdź na [vercel.com](https://vercel.com) → **Sign Up** → **Continue with GitHub**. Wybierz plan **Hobby** (darmowy).
2. Kliknij **Add New… → Project**, znajdź `porownywarka-opieki` i kliknij **Import**.
3. Rozwiń **Environment Variables** i dodaj (nazwa → wartość):

   | Nazwa | Wartość |
   |---|---|
   | `ADMIN_PASSWORD` | Twoje hasło do panelu, min. 12 znaków. Zapisz je w bezpiecznym miejscu |
   | `SESSION_SECRET` | Dowolny ciąg min. 32 losowych znaków (np. wygeneruj długie hasło w menedżerze haseł) |
   | `NEXT_PUBLIC_SITE_URL` | `https://twoja-domena.pl` |
   | `DATABASE_SSL` | `true` |
   | `SITE_OWNER_NAME` | Twoje imię i nazwisko (do regulaminu) |
   | `SITE_OWNER_ADDRESS` | Adres do korespondencji |
   | `SITE_CONTACT_EMAIL` | E-mail kontaktowy serwisu |

4. Kliknij **Deploy**. Pierwsza próba może skończyć się błędem połączenia z bazą – to normalne, bazę dodasz w kroku 4.

## Krok 4. Dodaj bazę danych Neon

1. W projekcie na Vercelu otwórz zakładkę **Storage** → **Create Database** → **Neon** (Serverless Postgres).
2. Region wybierz **Frankfurt** (najbliżej Polski), plan **Free**. Kliknij **Create** i połącz z projektem.
   Vercel sam doda zmienną `DATABASE_URL`.
3. Otwórz zakładkę **Deployments**, przy ostatnim wdrożeniu kliknij **⋯ → Redeploy**.

Przy pierwszym uruchomieniu aplikacja sama utworzy tabele i wczyta 20 agencji z Twojego arkusza (od razu widocznych)
oraz 3 szkice do sprawdzenia.

## Krok 5. Podłącz domenę

1. W projekcie na Vercelu: **Settings → Domains → Add**, wpisz swoją domenę.
2. Vercel pokaże rekordy DNS (zwykle rekord `A` dla domeny i `CNAME` dla `www`).
3. Zaloguj się u rejestratora domeny, otwórz **strefę DNS** i dodaj te rekordy.
4. Po kilkunastu minutach (czasem do kilku godzin) strona zadziała pod Twoim adresem, od razu z HTTPS.

## Krok 6. Uzupełnij szkice i braki

1. Wejdź na `https://twoja-domena.pl/admin` i zaloguj się hasłem z kroku 3.
2. 20 agencji z Twojego arkusza jest już opublikowanych. Zobaczysz też 3 szkice (InterKadra, Feliza Job,
   Antczak Care), których nie ma jeszcze na stronie.
3. Dla szkiców i dla agencji z „Brak informacji” w ważnych polach (np. stawka): zadzwoń lub napisz,
   albo sprawdź aktualne ogłoszenie, i potwierdź:
   - wynagrodzenie **netto za miesiąc** (od–do),
   - formę umowy,
   - wymagany poziom niemieckiego,
   - długość turnusu,
   - czy zwracają koszty dojazdu,
   - czy opłacają ubezpieczenie i wystawiają A1,
   - premie.
4. Kliknij **Edytuj**, popraw dane, wpisz **datę weryfikacji** (np. `2026-11-05`), usuń z uwag tekst
   „Do potwierdzenia”, zaznacz **Opublikowana** i zapisz. Pola, których agencja nie podaje, zostaw puste.
   Na stronie pokażą się jako „Brak informacji”.
5. Kolejne agencje dodawaj formularzem na górze panelu.
6. Raz na 1–2 miesiące sprawdzaj stawki i zmieniaj datę weryfikacji. Aktualne dane to główna wartość serwisu.

Wzór wiadomości do agencji:

> Dzień dobry, prowadzę porównywarkę ofert dla opiekunek pracujących w Niemczech ([adres strony]).
> Chciałabym bezpłatnie zamieścić Państwa ofertę. Czy mogą Państwo potwierdzić aktualne warunki:
> wynagrodzenie netto miesięcznie (od–do), forma umowy, wymagany niemiecki, długość turnusu,
> zwrot kosztów dojazdu, ubezpieczenie/A1 i premie? Dziękuję, [imię]

## Krok 7. Aplikacja w Google Play

Gdy strona działa pod domeną, przejdź do `GOOGLE-PLAY.md`.

## Zarabianie bez firmy

Opiekunki korzystają z serwisu za darmo. Zarabiasz na **ofertach promowanych** opłacanych przez agencje.

Bez zakładania firmy możesz prowadzić **działalność nierejestrowaną**, dopóki przychód w miesiącu
nie przekracza 75% minimalnego wynagrodzenia (w 2026 r. to około 3 600 zł). Przychód wykazujesz
w rocznym PIT. Aktualny limit i zasady sprawdź na [biznes.gov.pl](https://www.biznes.gov.pl)
(hasło: „działalność nierejestrowana”). Gdy przychody urosną, załóż jednoosobową działalność.
Wtedy możesz też przenieść konto Google Play na firmę.
