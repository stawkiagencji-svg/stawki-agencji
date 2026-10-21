export const CONTRACTS = {
  zlecenie: "Umowa zlecenie",
  praca: "Umowa o pracę",
  b2b: "Działalność (Gewerbe/B2B)",
  de: "Umowa niemiecka",
} as const;

export type ContractKey = keyof typeof CONTRACTS;

export const GERMAN = ["Brak", "Podstawowy (A1)", "Komunikatywny (A2)", "Dobry (B1+)"] as const;

/** Pola opisowe oferty: klucz → etykieta. Kolejność = kolejność w szczegółach i w tabeli porównania. */
export const DETAILS = {
  contractNote: "Umowa",
  insurance: "Składki / ubezpieczenie",
  travelNote: "Transport",
  bonus: "Święta / dodatki",
  support: "Wsparcie podczas zlecenia",
  housing: "Warunki na miejscu",
} as const;

export type DetailKey = keyof typeof DETAILS;

export type Offer = {
  id: number;
  name: string;
  description: string;
  website: string;
  city: string;
  /** Formy umowy podane wprost przez agencję (do filtrowania). Pusta lista = brak informacji. */
  contracts: ContractKey[];
  /** Miesięczna stawka netto w €; null = agencja nie podaje. */
  payMin: number | null;
  payMax: number | null;
  /** Opis stawki słowami, np. kwota za 6 tygodni albo „do 2 200 €”. */
  payNote: string;
  /** Wymagany poziom niemieckiego (indeks w GERMAN); null = brak informacji. */
  german: number | null;
  rotation: string;
  verified: string;
  /** Linki do źródeł, oddzielone znakiem „|”. */
  source: string;
  notes: string;
  /** Agencja organizuje, opłaca lub zwraca dojazd. */
  travel: boolean;
  /** Agencja deklaruje opłacanie składek / ubezpieczenia (ZUS, A1 itp.). */
  a1: boolean;
  /** Agencja deklaruje wprost składki ZUS od średniej krajowej (wyższa przyszła emerytura). */
  zusAvg: boolean;
  example: boolean;
  promoted: boolean;
  /** Agencja, w której pracuje właścicielka serwisu – zawsze oznaczana na stronie. */
  affiliated: boolean;
  /** false = szkic widoczny tylko w panelu administratora */
  published: boolean;
} & Record<DetailKey, string>;

export type OfferInput = Omit<Offer, "id">;

export const SUBMITTER_ROLES = {
  agencja: "Pracownik agencji",
  opiekunka: "Opiekunka / opiekun",
  inna: "Inna osoba",
} as const;

export type SubmitterRole = keyof typeof SUBMITTER_ROLES;

/** Oferta z danymi zgłoszenia – tylko dla panelu administratora. */
export type AdminOffer = Offer & { origin: string; submitterRole: string; submitterEmail: string };

export const hasPay = (o: Pick<Offer, "payMin" | "payMax">) => o.payMin !== null || o.payMax !== null;
export const sourceLinks = (s: string) => s.split("|").map((u) => u.trim()).filter((u) => /^https?:\/\//i.test(u));
