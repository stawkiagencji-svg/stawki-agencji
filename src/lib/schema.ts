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
`;
