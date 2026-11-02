import { SITE_URL } from "./site";

// Dane właściciela serwisu do regulaminu i polityki prywatności.
// Zmienne środowiskowe (np. w ustawieniach projektu na Vercelu) mają pierwszeństwo przed wartościami poniżej.
export const owner = {
  name: process.env.SITE_OWNER_NAME || "Karolina Woźniak",
  // Miejsce zamieszkania; adres do korespondencji (poste restante) dopiszemy, gdy będzie wybrana poczta.
  address: process.env.SITE_OWNER_ADDRESS || "Wrocław",
  email: process.env.SITE_CONTACT_EMAIL || "stawkiagencji@gmail.com",
  siteUrl: SITE_URL,
};
