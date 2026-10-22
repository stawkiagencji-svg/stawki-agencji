# Stan projektu – Stawki Agencji (stawkiagencji.pl)

Ostatnia aktualizacja: 2026-10-22

## Gotowe

- [x] Wersja testowa w claude.ai z 20 agencjami (do udostępnienia od razu linkiem): https://claude.ai/artifact/9gn9Wob3eSBf4vexFooSrk
  Dane są wbudowane w stronę – zmiany wprowadza Claude na prośbę. Zgłoszenia: e-mail niki2506@outlook.com.
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
- [x] 21 opublikowanych agencji: 20 z arkusza porównawczego + Antczak Care (stan na 21.10.2026), ze źródłami (`db/offers.json`)
- [x] 2 szkice do uzupełnienia: InterKadra, Feliza Job
- [x] Rozszerzony model ofert: składki/ubezpieczenie, transport, wsparcie, warunki na miejscu, opis stawki, wiele źródeł, „Brak informacji” zamiast zgadywania
- [x] Nowe zrzuty do Google Play z prawdziwymi danymi
- [x] Formularz „Zgłoś agencję” (`/zglos-agencje`): zgłoszenia trafiają do panelu jako szkice, ochrona przed spamem, opcjonalny e-mail za zgodą
- [x] Automatyczne tworzenie bazy przy starcie – wdrożenie bez terminala
- [x] Pełny regulamin i polityka prywatności dla osoby prywatnej (dane z ustawień `SITE_OWNER_*`)
- [x] Instrukcja wdrożenia bez terminala: `WDROZENIE.md` (GitHub → Vercel → Neon → domena)
- [x] Wzór wiadomości do agencji i posta do zebrania 12 testerów
- [x] Testy w przeglądarce: filtry, porównanie, logowanie, dodawanie/edycja/usuwanie, tryb offline, telefon, tryb ciemny

## Do zrobienia

Decyzje: konto osobiste (bez firmy), hosting Vercel + Neon. Kolejność kroków jak w `WDROZENIE.md`.

### Dane (najważniejsze przed startem)
- [ ] Uzupełnić 2 szkice i opublikować (krok 6 w `WDROZENIE.md`)
- [ ] Uzupełnić stawki u 10 agencji, które ich nie podają publicznie (telefon/e-mail)
- [ ] Udostępnić link do formularza w grupach dla opiekunek na Facebooku
- [ ] Regularnie przeglądać nowe zgłoszenia w panelu
- [ ] Co 1–2 miesiące odświeżać stawki i daty weryfikacji

### Prawo i pieniądze
- [ ] Ustawić dane właściciela (`SITE_OWNER_NAME`, `SITE_OWNER_ADDRESS`, `SITE_CONTACT_EMAIL`) na Vercelu (jedyne wymagane ustawienie to `ADMIN_PASSWORD`)
- [ ] Opcjonalnie: przegląd regulaminu i polityki prywatności przez prawnika
- [ ] Ustalić cennik ofert promowanych; pilnować limitu działalności nierejestrowanej

### Wdrożenie
- [x] Domena stawkiagencji.pl kupiona (nazwa.pl, 21.10.2026)
- [x] Kod na GitHubie: github.com/stawkiagencji-svg/stawki-agencji (prywatne), połączone z Claude
- [x] Strona działa: https://stawki-agencji.vercel.app (Vercel Hobby + Neon, konto karolina15); diagnostyka: /api/health
- [x] Domena dodana na Vercelu; na nazwa.pl ustawione zewnętrzne DNS: ns1/ns2.vercel-dns.com (21.10.2026, czekamy na propagację do 24 h)
- [x] **https://stawkiagencji.pl działa** (22.10.2026)
- [ ] 22.10: stawkiagencji.pl działa na komputerze, na telefonie jeszcze nie (vercel.app działa). DNSSEC w nazwa.pl wyłączony – czekamy na odświeżenie DNS (do 48 h). Sprawdzić 23.10 na telefonie, potem wrzucić post na FB
- [x] Panel /admin działa – Karolina edytuje oferty sama (22.10.2026). Uwaga: aktualne dane są w bazie Neon, a `db/offers.json` to tylko dane startowe

### Google Play
- [x] Konto dewelopera Google Play – osobiste, opłacone 25 USD (22.10.2026)
- [ ] Weryfikacja tożsamości w Play Console – dokumenty wysłane 22.10.2026, czekamy na zatwierdzenie przez Google
- [ ] Potem: weryfikacja numeru telefonu (przycisk „Zweryfikuj” pojawi się dopiero po zatwierdzeniu tożsamości)
- [ ] Zebrać min. 12 testerów (wzór posta w `GOOGLE-PLAY.md`)
- [x] Paczka Android z PWABuilder (pl.stawkiagencji.app); klucz i hasła u Karoliny – NIE w repozytorium
- [x] Odcisk klucza przesyłania dodany do /.well-known/assetlinks.json (src/lib/android.ts)
- [ ] Utworzyć aplikację w Play Console i wgrać .aab do testu zamkniętego
- [ ] Dopisać odcisk „klucza podpisywania aplikacji” Google do src/lib/android.ts
- [ ] Wypełnić wpis i formularze (zrzuty z prawdziwymi ofertami są gotowe)
- [ ] Test zamknięty (jeśli konto osobiste), potem publikacja

### Pomysły na później
- [ ] Powiadomienie e-mailem o nowym zgłoszeniu (wymaga usługi do wysyłki maili, np. Resend)
- [ ] Import agencji z arkusza Excel w panelu admina
- [ ] Opinie opiekunek o agencjach (z moderacją)
- [ ] Kalkulator brutto → netto dla umowy niemieckiej
- [ ] Wersja niemieckojęzyczna strony
- [ ] Analityka odwiedzin (wtedy zaktualizować politykę prywatności i formularz „Bezpieczeństwo danych” w Google Play)

## Jak wrócić do pracy

1. Rozpakuj `porownywarka-opieki.zip` albo pobierz kod z GitHuba (gdy już tam będzie).
2. Otwórz nową sesję Claude Code z tym projektem i napisz, które zadanie z listy chcesz zrobić.
3. Uruchomienie lokalne: `README.md`, sekcja „Uruchomienie lokalne”.
