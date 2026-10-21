export const CONTRACTS = {
  zlecenie: "Umowa zlecenie",
  praca: "Umowa o pracę",
  b2b: "Działalność (B2B)",
  de: "Umowa niemiecka",
} as const;

export type ContractKey = keyof typeof CONTRACTS;

export const GERMAN = ["Brak", "Podstawowy (A1)", "Komunikatywny (A2)", "Dobry (B1+)"] as const;

export type Offer = {
  id: number;
  name: string;
  website: string;
  city: string;
  contracts: ContractKey[];
  payMin: number;
  payMax: number;
  german: number;
  rotation: string;
  bonus: string;
  verified: string;
  source: string;
  notes: string;
  travel: boolean;
  a1: boolean;
  example: boolean;
  promoted: boolean;
  /** false = szkic widoczny tylko w panelu administratora */
  published: boolean;
};

export type OfferInput = Omit<Offer, "id">;
