import type { Metadata } from "next";

export const metadata: Metadata = { title: "Regulamin" };

export default function TermsPage() {
  return (
    <article className="prose">
      <h1>Regulamin serwisu</h1>
      <p className="todo">
        [UZUPEŁNIJ przed startem: dane usługodawcy (nazwa firmy, NIP, adres, e-mail), zakres usług, zasady korzystania,
        tryb reklamacji, zasady płatnego promowania ofert. Regulamin powinien sprawdzić prawnik.]
      </p>
      <h2>1. Charakter serwisu</h2>
      <p>
        Serwis prezentuje informacje o ofertach agencji delegujących opiekunów osób starszych do Niemiec. Dane mają
        charakter informacyjny i nie stanowią oferty pracy w rozumieniu przepisów prawa. Warunki zatrudnienia należy
        potwierdzić bezpośrednio u agencji.
      </p>
    </article>
  );
}
