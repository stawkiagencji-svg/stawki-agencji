# Stan projektu – Porównywarka agencji opieki

Ostatnia aktualizacja: 2026-10-21

## Gotowe

- [x] Prototyp w claude.ai (artefakt): https://claude.ai/artifact/9gn9Wob3eSBf4vexFooSrk
- [x] Aplikacja Next.js 16 + PostgreSQL (ten folder)
  - [x] Porównywarka: filtry (umowa, stawka, niemiecki, dojazd, A1, premie), sortowanie, porównanie do 3 ofert
  - [x] Poradnik o formach umów (zlecenie, o pracę, B2B, umowa niemiecka)
  - [x] Panel `/admin` z hasłem: dodawanie, edycja, usuwanie ofert, oferty promowane
  - [x] Publiczne API `/api/offers`
  - [x] Strony: jak tworzymy ranking, regulamin, polityka prywatności (szablony)
  - [x] SEO: robots.txt, mapa strony, metadane
  - [x] Docker i docker-compose do własnego serwera
- [x] Przygotowanie do Google Play
  - [x] PWA: manifest, ikony, service worker, strona offline
  - [x] `/.well-known/assetlinks.json` (ustawiany zmiennymi środowiskowymi)
  - [x] Grafiki do sklepu, 4 zrzuty z telefonu, teksty wpisu (`play-store/`)
  - [x] Instrukcja publikacji (`GOOGLE-PLAY.md`)
- [x] Testy w przeglądarce: filtry, porównanie, logowanie, dodawanie/edycja/usuwanie, tryb offline, telefon, tryb ciemny

## Do zrobienia

### Dane (najważniejsze przed startem)
- [ ] Zebrać prawdziwe oferty agencji: stawki netto od–do, forma umowy, wymagany niemiecki, turnus, dojazd, A1, premie
- [ ] Przy każdej ofercie: data weryfikacji i link do źródła
- [ ] Usunąć 5 przykładowych ofert („Agencja A–E”)

### Firma i prawo
- [ ] Zdecydować: konto Google Play osobiste czy firmowe (firmowe = bez testu 12 osób / 14 dni, wymaga numeru D-U-N-S)
- [ ] Uzupełnić regulamin i politykę prywatności (miejsca `[UZUPEŁNIJ]`), najlepiej z prawnikiem
- [ ] Ustalić cennik ofert promowanych i wpisać go na stronie „Jak tworzymy ranking”

### Wdrożenie
- [ ] Kupić domenę
- [ ] Wybrać hosting: Vercel + Neon/Supabase (prościej) albo własny VPS z Dockerem
- [ ] Ustawić zmienne środowiskowe (`.env.example`) i wdrożyć stronę
- [ ] Wgrać kod do repozytorium GitHub (kopia zapasowa, łatwe wdrożenia)

### Google Play
- [ ] Założyć konto dewelopera (25 USD)
- [ ] Wygenerować aplikację w PWABuilder, bezpiecznie zachować `signing.keystore` i hasła
- [ ] Wgrać `.aab`, ustawić odciski SHA-256 w `.env` (krok 4 w `GOOGLE-PLAY.md`)
- [ ] Wypełnić wpis i formularze, zrobić nowe zrzuty z prawdziwymi ofertami
- [ ] Test zamknięty (jeśli konto osobiste), potem publikacja

### Pomysły na później
- [ ] Opinie opiekunek o agencjach (z moderacją)
- [ ] Kalkulator brutto → netto dla umowy niemieckiej
- [ ] Wersja niemieckojęzyczna strony
- [ ] Formularz „Zgłoś agencję” dla agencji chcących trafić do porównywarki
- [ ] Analityka odwiedzin (wtedy zaktualizować politykę prywatności i formularz „Bezpieczeństwo danych” w Google Play)

## Jak wrócić do pracy

1. Rozpakuj `porownywarka-opieki.zip` albo pobierz kod z GitHuba (gdy już tam będzie).
2. Otwórz nową sesję Claude Code z tym projektem i napisz, które zadanie z listy chcesz zrobić.
3. Uruchomienie lokalne: `README.md`, sekcja „Uruchomienie lokalne”.
