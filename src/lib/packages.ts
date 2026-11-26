// Cennik pakietów. Bez zależności od bazy, więc można go importować także w komponentach przeglądarki.
/** Płatne pakiety. Ceny w zł miesięcznie; `founder` to cena założycielska (−30%) dla pierwszych agencji. */
export const PACKAGES = {
  standard: {
    name: "Standard",
    regular: 199,
    founder: 139,
    features: [
      "Logo agencji przy ofercie",
      "Przycisk „Aplikuj” do Twojego formularza",
      "Znaczek „Dane potwierdzone przez agencję”",
      "Zmiany danych wprowadzamy w 48 h",
    ],
  },
  premium: {
    name: "Premium",
    regular: 449,
    founder: 314,
    features: [
      "Wszystko z pakietu Standard",
      "Oferta promowana na górze listy",
      "Post o agencji na naszym Facebooku 1× w miesiącu",
      "Odpowiedzi agencji pod opiniami",
      "Zmiany danych w 24 h",
    ],
  },
} as const;
export type PackageKey = keyof typeof PACKAGES;

export const FREE_FEATURES = ["Agencja na liście i w porównaniu", "Opinie opiekunek", "Dane sprawdzane przez nas co 1–2 miesiące"];
export const FOUNDER_SLOTS = 20;
export const FOUNDER_MONTHS = 12;
export const TRIAL_DAYS = 30;

export const ORDER_STATUSES = { new: "Nowe", active: "Aktywne", ended: "Zakończone" } as const;
export type OrderStatus = keyof typeof ORDER_STATUSES;
