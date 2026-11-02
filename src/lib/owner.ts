import { SITE_URL } from "./site";

// Dane właściciela serwisu do regulaminu i polityki prywatności.
// Zmienne środowiskowe (np. w ustawieniach projektu na Vercelu) mają pierwszeństwo przed wartościami poniżej.
export const owner = {
  name: process.env.SITE_OWNER_NAME || "Karolina Woźniak",
  // Miejsce zamieszkania i adres do korespondencji (poste restante zamiast adresu domowego).
  address: process.env.SITE_OWNER_ADDRESS ||
    "zamieszkała we Wrocławiu, adres do korespondencji: Poste restante, UP Wrocław 59, ul. Eugeniusza Horbaczewskiego 4-6, 54-160 Wrocław",
  email: process.env.SITE_CONTACT_EMAIL || "stawkiagencji@gmail.com",
  siteUrl: SITE_URL,
};
