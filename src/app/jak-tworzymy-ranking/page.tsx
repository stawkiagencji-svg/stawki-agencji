import type { Metadata } from "next";

export const metadata: Metadata = { title: "Jak tworzymy ranking" };

export default function RankingPage() {
  return (
    <article className="prose">
      <div className="eyebrow">Przejrzystość</div>
      <h1>Jak tworzymy ranking</h1>
      <h2>Skąd pochodzą dane</h2>
      <p>
        Stawki i warunki zbieramy z publicznych ogłoszeń agencji oraz z informacji przekazanych przez agencje. Przy każdej
        ofercie podajemy datę ostatniej weryfikacji i, jeśli to możliwe, link do źródła.
      </p>
      <h2>Kolejność ofert</h2>
      <p>
        Domyślnie oferty są uporządkowane według najwyższej stawki miesięcznej netto. Możesz zmienić kolejność na stawkę
        minimalną, nazwę lub datę weryfikacji.
      </p>
      <h2>O autorce</h2>
      <p>
        Porównywarkę prowadzi była opiekunka, dziś dyrektorka oddziału Antczak Care. Ta agencja jest na liście
        oznaczona etykietą „Tu pracuje autorka serwisu”. Kolejność ofert od tego nie zależy: wszystkie agencje są
        sortowane według tych samych zasad, a dane o każdej z nich pochodzą ze źródeł podanych przy ofercie.
      </p>
      <h2>Oferty promowane</h2>
      <p>
        Agencje mogą wykupić promowanie oferty. Oferty promowane wyświetlamy na początku listy i zawsze oznaczamy etykietą
        „Oferta promowana”. Opłata nie wpływa na podawane stawki ani na treść oferty.
      </p>
      <p>Pytania o promowanie ofert: napisz na adres podany w regulaminie.</p>
    </article>
  );
}
