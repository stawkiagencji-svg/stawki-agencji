import type { Metadata } from "next";
import { sign } from "@/lib/auth";
import { FOUNDER_MONTHS, FOUNDER_SLOTS, FREE_FEATURES, PACKAGES, TRIAL_DAYS, type PackageKey } from "@/lib/packages";
import { owner } from "@/lib/owner";
import OrderForm from "./OrderForm";

export const metadata: Metadata = {
  title: "Cennik dla agencji",
  description: "Pakiety dla agencji opiekuńczych: logo przy ofercie, przycisk „Aplikuj”, oferta promowana. Na start 30 dni za darmo.",
};
export const dynamic = "force-dynamic";

export default function PricingPage() {
  // Podpisany czas wyświetlenia formularza – odsiewa boty, które wysyłają go natychmiast.
  const ts = String(Date.now());
  return (
    <div className="submitpage pricing">
      <div className="eyebrow">Dla agencji opieki</div>
      <h1>Cennik</h1>
      <p className="lede">Bądź tam, gdzie opiekunki porównują oferty.</p>

      <div className="plans">
        <section className="panel plan">
          <h2>Podstawowy</h2>
          <p className="price">0 zł</p>
          <p className="note">zawsze bezpłatnie</p>
          <ul>{FREE_FEATURES.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
        {(Object.keys(PACKAGES) as PackageKey[]).map((k) => (
          <section className={`panel plan${k === "premium" ? " best" : ""}`} key={k}>
            {k === "premium" && <span className="chip promo">Najwięcej widoczności</span>}
            <h2>{PACKAGES[k].name}</h2>
            <p className="price">{PACKAGES[k].founder} zł <small>/ mies.</small></p>
            <p className="note">cena regularna <s>{PACKAGES[k].regular} zł</s></p>
            <ul>{PACKAGES[k].features.map((f) => <li key={f}>{f}</li>)}</ul>
          </section>
        ))}
      </div>

      <p className="panel founder">
        <b>−30%</b> Cena założycielska przez pierwsze {FOUNDER_MONTHS} miesięcy dla pierwszych {FOUNDER_SLOTS} agencji,
        a na start {TRIAL_DAYS} dni za darmo.
      </p>

      <p className="note">
        Uczciwe zasady: za pieniądze nie zmieniamy stawek ani warunków i nie usuwamy opinii. Oferty promowane są zawsze
        oznaczone. Podane ceny są cenami końcowymi: sprzedawca nie jest podatnikiem VAT, a za pakiet wystawiamy rachunek (nie fakturę VAT). Płatność przelewem po okresie bezpłatnym, co miesiąc z góry; pakiet możesz zakończyć w każdej chwili
        z końcem opłaconego miesiąca. Pytania: {owner.email}.
      </p>

      <h2 style={{ margin: "28px 0 10px" }}>Zamów pakiet</h2>
      <OrderForm token={`${ts}.${sign("order:" + ts)}`} email={owner.email} />
    </div>
  );
}
