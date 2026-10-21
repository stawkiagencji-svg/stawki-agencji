# Stan projektu – Porównywarka agencji opieki

Ostatnia aktualizacja: 2026-10-21 (część 2)

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
- [x] Szkice 7 prawdziwych agencji z ogłoszeń (`db/drafts.json`), niewidoczne na stronie do czasu weryfikacji
- [x] Automatyczne tworzenie bazy przy starcie – wdrożenie bez terminala
- [x] Pełny regulamin i polityka prywatności dla osoby prywatnej (dane z ustawień `SITE_OWNER_*`)
- [x] Instrukcja wdrożenia bez terminala: `WDROZENIE.md` (GitHub → Vercel → Neon → domena)
- [x] Wzór wiadomości do agencji i posta do zebrania 12 testerów
- [x] Testy w przeglądarce: filtry, porównanie, logowanie, dodawanie/edycja/usuwanie, tryb offline, telefon, tryb ciemny

## Do zrobienia

Decyzje: konto osobiste (bez firmy), hosting Vercel + Neon. Kolejność kroków jak w `WDROZENIE.md`.

### Dane (najważniejsze przed startem)
- [ ] Zweryfikować u agencji 7 szkiców i opublikować (krok 6 w `WDROZENIE.md`)
- [ ] Dodać kolejne agencje (cel: 15–20)

### Prawo i pieniądze
- [ ] Ustawić dane właściciela (`SITE_OWNER_NAME`, `SITE_OWNER_ADDRESS`, `SITE_CONTACT_EMAIL`) na Vercelu
- [ ] Opcjonalnie: przegląd regulaminu i polityki prywatności przez prawnika
- [ ] Ustalić cennik ofert promowanych; pilnować limitu działalności nierejestrowanej

### Wdrożenie
- [ ] Kupić domenę (propozycje w `WDROZENIE.md`, krok 1)
- [ ] Wgrać kod na GitHub (krok 2)
- [ ] Wdrożyć na Vercelu i dodać bazę Neon (kroki 3–4)
- [ ] Podłączyć domenę (krok 5)

### Google Play
- [ ] Założyć konto dewelopera – osobiste (25 USD)
- [ ] Zebrać min. 12 testerów (wzór posta w `GOOGLE-PLAY.md`)
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
