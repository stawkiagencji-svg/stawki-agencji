# Stawki Agencji

Porównywarka stawek agencji opiekuńczych w Niemczech – stawkiagencji.pl

Serwis dla opiekunek i opiekunów osób starszych: porównuje polskie agencje delegujące do Niemiec
pod kątem formy umowy, wypłaty netto, turnusów, zwrotu za dojazd i wymaganego niemieckiego.

- **Strona główna** (`/`): filtry, lista ofert na wspólnej skali €, porównanie do 3 ofert, poradnik o umowach.
- **Panel właściciela** (`/admin`): logowanie hasłem, dodawanie, edycja i usuwanie ofert, oznaczanie ofert promowanych.
- **Formularz** (`/zglos-agencje`): agencje i opiekunki zgłaszają oferty; trafiają do panelu jako szkice.
- **Publiczne API** (`/api/offers`): lista ofert w JSON, np. dla przyszłej aplikacji mobilnej.
- **Strony prawne**: `/regulamin`, `/polityka-prywatnosci`, `/jak-tworzymy-ranking` (do uzupełnienia, miejsca oznaczone `[UZUPEŁNIJ]`).

Technologia: Next.js 16, React 19, PostgreSQL (biblioteka `pg`), TypeScript.

## Uruchomienie lokalne

Wymagania: Node.js 20+ i Docker (albo własny PostgreSQL).

```bash
cp .env.example .env          # uzupełnij hasło i sekret
docker compose up -d db       # baza PostgreSQL na porcie 5432
npm install
npm run dev                   # http://localhost:3000
```

Panel: http://localhost:3000/admin (hasło z `ADMIN_PASSWORD`).

Przy pierwszym starcie aplikacja sama tworzy tabele (`src/instrumentation.ts`) i przy pustej bazie
wczytuje oferty startowe z `db/offers.json` (21 agencji i 2 szkice). Szkice nie są
widoczne na stronie, dopóki nie zaznaczysz „Opublikowana” w panelu.

## Wdrożenie

### Opcja A: Vercel + Neon (najprościej, darmowy start)

Instrukcja krok po kroku bez terminala: [WDROZENIE.md](WDROZENIE.md).

### Opcja B: własny serwer VPS (Docker)

```bash
cp .env.example .env   # uzupełnij
docker compose up -d --build
```

Aplikacja przy starcie sama tworzy tabele. Przed serwerem postaw reverse proxy z HTTPS (np. Caddy lub Nginx + Let's Encrypt).
Pamiętaj o kopiach zapasowych bazy (`pg_dump`).

## Zmienne środowiskowe

| Zmienna | Opis |
|---|---|
| `DATABASE_URL` | Adres bazy PostgreSQL |
| `DATABASE_SSL` | `true` dla baz w chmurze wymagających SSL |
| `ADMIN_PASSWORD` | Hasło do `/admin`, min. 12 znaków |
| `SESSION_SECRET` | Losowy ciąg min. 32 znaki (`openssl rand -hex 32`) |
| `NEXT_PUBLIC_SITE_URL` | Publiczny adres strony (mapa strony, metadane) |
| `SITE_OWNER_NAME`, `SITE_OWNER_ADDRESS`, `SITE_CONTACT_EMAIL` | Dane właściciela w regulaminie i polityce prywatności |
| `ANDROID_PACKAGE_NAME` | Nazwa pakietu aplikacji z Google Play (np. `pl.twojadomena.opieka`) |
| `ANDROID_SHA256_FINGERPRINTS` | Odciski SHA-256 kluczy podpisu, oddzielone przecinkami |

## Aplikacja w Google Play

Strona działa jako PWA i jest gotowa do opakowania w aplikację Android.
Instrukcja krok po kroku: [GOOGLE-PLAY.md](GOOGLE-PLAY.md). Grafiki i teksty do sklepu: folder `play-store/`.

## Przed startem sprzedaży

- Uzupełnij szkice i braki w danych (krok 6 w `WDROZENIE.md`).
- Ustaw dane właściciela (`SITE_OWNER_*`). Regulamin i politykę prywatności warto dać do przejrzenia prawnikowi.
- Oferty płatnie promowane muszą być wyraźnie oznaczone. Aplikacja robi to automatycznie (etykieta „Oferta promowana”),
  a strona „Jak tworzymy ranking” wyjaśnia zasady kolejności.

## Struktura

```
db/offers.json             oferty startowe (agencje z arkusza + szkice)
src/instrumentation.ts     automatyczne przygotowanie bazy przy starcie
src/lib/                   baza, schemat, logika ofert, logowanie admina, dane właściciela
src/components/            porównywarka i poradnik
src/app/                   strony, panel /admin, API
```
