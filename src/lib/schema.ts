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
-- Od listopada 2026 r. autorka nie pracuje w Antczak Care – zdejmujemy oznaczenie „Tu pracuje autorka serwisu”.
UPDATE offers SET affiliated = FALSE WHERE affiliated AND name = 'Antczak Care';
-- 28.11.2026: aktualne warunki od Active Intercare (e-mail od agencji). Warunek na datę weryfikacji, żeby nie nadpisać późniejszych zmian z panelu.
UPDATE offers SET pay_min = 1900, pay_max = 2600, pay_note = '1 900–2 600 € netto/mies., zależnie od zlecenia (informacja od agencji).',
  contracts = '{de}', contract_note = 'Zatrudnienie w modelu niemieckim.',
  insurance = 'Ubezpieczenie społeczne w Niemczech (model niemiecki).',
  notes = 'Agencja deklaruje sprawdzone miejsca zleceń.', verified = '2026-11-28',
  source = source || ' | informacja od agencji (e-mail, 28.11.2026)', updated_at = now()
  WHERE name = 'Active Intercare' AND verified < '2026-11-28';
UPDATE offers SET pay_note = '1 900–2 600 € netto/mies., zależnie od zlecenia (informacja od agencji).'
  WHERE name = 'Active Intercare' AND pay_note LIKE 'Według informacji od agencji:%';

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
`;
