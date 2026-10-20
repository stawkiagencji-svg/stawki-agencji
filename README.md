# Porównywarka agencji opieki

Serwis dla opiekunek i opiekunów osób starszych: porównuje polskie agencje delegujące do Niemiec
pod kątem formy umowy, wypłaty netto, turnusów, zwrotu za dojazd i wymaganego niemieckiego.

- **Strona główna** (`/`): filtry, lista ofert na wspólnej skali €, porównanie do 3 ofert, poradnik o umowach.
- **Panel właściciela** (`/admin`): logowanie hasłem, dodawanie, edycja i usuwanie ofert, oznaczanie ofert promowanych.
- **Publiczne API** (`/api/offers`): lista ofert w JSON, np. dla przyszłej aplikacji mobilnej.
- **Strony prawne**: `/regulamin`, `/polityka-prywatnosci`, `/jak-tworzymy-ranking` (do uzupełnienia, miejsca oznaczone `[UZUPEŁNIJ]`).

Technologia: Next.js 16, React 19, PostgreSQL (biblioteka `pg`), TypeScript.

## Uruchomienie lokalne

Wymagania: Node.js 20+ i Docker (albo własny PostgreSQL).

```bash
cp .env.example .env          # uzupełnij hasło i sekret
docker compose up -d db       # baza PostgreSQL na porcie 5432
npm install
npm run db:migrate            # tworzy tabelę offers
npm run db:seed               # 5 przykładowych ofert (oznaczonych "Przykład")
npm run dev                   # http://localhost:3000
```

Panel: http://localhost:3000/admin (hasło z `ADMIN_PASSWORD`).

## Wdrożenie

### Opcja A: Vercel + Neon/Supabase (najprościej, darmowy start)

1. Wrzuć projekt na GitHub.
2. Załóż bazę PostgreSQL w [Neon](https://neon.tech) lub [Supabase](https://supabase.com) i skopiuj adres połączenia.
3. Uruchom raz lokalnie z tym adresem: `DATABASE_URL=... DATABASE_SSL=true npm run db:migrate` (opcjonalnie `db:seed`).
4. W [Vercel](https://vercel.com) zaimportuj repozytorium i dodaj zmienne: `DATABASE_URL`, `DATABASE_SSL=true`,
   `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`.
5. Podepnij własną domenę w ustawieniach projektu.

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
| `ANDROID_PACKAGE_NAME` | Nazwa pakietu aplikacji z Google Play (np. `pl.twojadomena.opieka`) |
| `ANDROID_SHA256_FINGERPRINTS` | Odciski SHA-256 kluczy podpisu, oddzielone przecinkami |

## Aplikacja w Google Play

Strona działa jako PWA i jest gotowa do opakowania w aplikację Android.
Instrukcja krok po kroku: [GOOGLE-PLAY.md](GOOGLE-PLAY.md). Grafiki i teksty do sklepu: folder `play-store/`.

## Przed startem sprzedaży

- Zastąp przykładowe oferty prawdziwymi, z datą weryfikacji i linkiem do źródła.
- Uzupełnij regulamin, politykę prywatności i dane firmy (najlepiej z prawnikiem).
- Oferty płatnie promowane muszą być wyraźnie oznaczone. Aplikacja robi to automatycznie (etykieta „Oferta promowana”),
  a strona „Jak tworzymy ranking” wyjaśnia zasady kolejności.

## Struktura

```
db/schema.sql              tabela offers
scripts/migrate.mjs        tworzenie tabel
scripts/seed.mjs           dane przykładowe
src/lib/                   baza, logika ofert, logowanie admina
src/components/            porównywarka i poradnik
src/app/                   strony, panel /admin, API
```
