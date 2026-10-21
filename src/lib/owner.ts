// Dane właściciela serwisu do regulaminu i polityki prywatności.
// Ustawiasz je w zmiennych środowiskowych (np. w ustawieniach projektu na Vercelu).
const missing = (what: string) => `[UZUPEŁNIJ: ${what}]`;

export const owner = {
  name: process.env.SITE_OWNER_NAME || missing("imię i nazwisko"),
  address: process.env.SITE_OWNER_ADDRESS || missing("adres do korespondencji"),
  email: process.env.SITE_CONTACT_EMAIL || missing("adres e-mail"),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || missing("adres strony"),
};
