// Schemat bazy. Wykonywany przy każdym starcie serwera, więc każda zmiana musi być idempotentna.
export const SCHEMA = `
CREATE TABLE IF NOT EXISTS offers (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  website     TEXT NOT NULL DEFAULT '',
  city        TEXT NOT NULL DEFAULT '',
  contracts   TEXT[] NOT NULL DEFAULT '{}',
  pay_min     INTEGER CHECK (pay_min >= 0),
  pay_max     INTEGER CHECK (pay_max >= pay_min),
  german      SMALLINT CHECK (german BETWEEN 0 AND 3),
  rotation    TEXT NOT NULL DEFAULT '',
  bonus       TEXT NOT NULL DEFAULT '',
  verified    TEXT NOT NULL DEFAULT '',
  source      TEXT NOT NULL DEFAULT '',
  notes       TEXT NOT NULL DEFAULT '',
  travel      BOOLEAN NOT NULL DEFAULT FALSE,
  a1          BOOLEAN NOT NULL DEFAULT FALSE,
  example     BOOLEAN NOT NULL DEFAULT FALSE,
  promoted    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Uzupełnienia dla baz utworzonych przez starsze wersje.
ALTER TABLE offers ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS pay_note TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS contract_note TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS insurance TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS travel_note TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS support TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS housing TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ALTER COLUMN pay_min DROP NOT NULL;
ALTER TABLE offers ALTER COLUMN pay_max DROP NOT NULL;
ALTER TABLE offers ALTER COLUMN german DROP NOT NULL;
ALTER TABLE offers ALTER COLUMN german DROP DEFAULT;

-- Zgłoszenia z formularza na stronie. Te kolumny nigdy nie trafiają do publicznych widoków ani API.
ALTER TABLE offers ADD COLUMN IF NOT EXISTS origin TEXT NOT NULL DEFAULT 'admin';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS submitter_role TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS submitter_email TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS ip_hash TEXT;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS affiliated BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS zus_avg BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS apply_url TEXT NOT NULL DEFAULT '';
-- Data, kiedy agencja potwierdziła swoje dane (znaczek przy ofercie), i logo wgrane w panelu.
ALTER TABLE offers ADD COLUMN IF NOT EXISTS confirmed TEXT NOT NULL DEFAULT '';
ALTER TABLE offers ADD COLUMN IF NOT EXISTS logo BYTEA;
ALTER TABLE offers ADD COLUMN IF NOT EXISTS logo_type TEXT NOT NULL DEFAULT '';

-- Opinie opiekunek. Nowe czekają na sprawdzenie (published = false); ip_hash służy tylko do limitu i znika po 30 dniach.
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  offer_id    INTEGER NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  nickname    TEXT NOT NULL DEFAULT '',
  worked      TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL,
  published   BOOLEAN NOT NULL DEFAULT FALSE,
  reported    BOOLEAN NOT NULL DEFAULT FALSE,
  ip_hash     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Odpowiedź agencji pod opinią, wpisywana w panelu.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply TEXT NOT NULL DEFAULT '';
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS reply_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS reviews_offer_idx ON reviews (offer_id) WHERE published;
-- Zamówienia płatnych pakietów z podstrony /cennik. Nie trafiają do publicznych widoków ani API.
CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  package       TEXT NOT NULL,
  agency        TEXT NOT NULL,
  company       TEXT NOT NULL,
  nip           TEXT NOT NULL DEFAULT '',
  address       TEXT NOT NULL DEFAULT '',
  contact_name  TEXT NOT NULL,
  phone         TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL,
  apply_url     TEXT NOT NULL DEFAULT '',
  start_date    TEXT NOT NULL DEFAULT '',
  notes         TEXT NOT NULL DEFAULT '',
  billing       TEXT NOT NULL DEFAULT 'monthly',
  status        TEXT NOT NULL DEFAULT 'new',
  ip_hash       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS billing TEXT NOT NULL DEFAULT 'monthly';
`;
