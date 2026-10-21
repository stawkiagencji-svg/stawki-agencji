import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getOffer, listAllOffers } from "@/lib/offers";
import { logout } from "./actions";
import DeleteButton from "./DeleteButton";
import LoginForm from "./LoginForm";
import OfferForm from "./OfferForm";

export const metadata: Metadata = { title: "Panel administratora", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const eur = (n: number) => new Intl.NumberFormat("pl-PL").format(n) + " €";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ edit?: string; saved?: string }> }) {
  if (!(await isAdmin())) {
    return (
      <>
        <div className="eyebrow">Panel właściciela</div>
        <LoginForm />
      </>
    );
  }
  const { edit, saved } = await searchParams;
  const [offers, editing] = await Promise.all([listAllOffers(), edit ? getOffer(Number(edit)) : Promise.resolve(null)]);

  return (
    <>
      <div className="adminbar">
        <div>
          <div className="eyebrow">Panel właściciela</div>
          <h1>Oferty agencji</h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link className="btn" href="/">Zobacz stronę</Link>
          <form action={logout}><button type="submit" className="ghost">Wyloguj</button></form>
        </div>
      </div>
      {saved && <p className="msg" role="status">Zapisano zmiany.</p>}

      {offers.some((o) => !o.published) && (
        <p className="note" style={{ marginBottom: 16 }}>
          Szkice to oferty znalezione w ogłoszeniach. Nie są widoczne na stronie. Sprawdź warunki u agencji (telefon,
          e-mail, aktualne ogłoszenie), popraw dane, wpisz datę weryfikacji i zaznacz „Opublikowana”.
        </p>
      )}

      <OfferForm offer={editing} />

      <div className="admintable panel">
        <table>
          <thead>
            <tr><th scope="col">Agencja</th><th scope="col">Widełki</th><th scope="col">Sprawdzono</th><th scope="col">Status</th><th scope="col" /></tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td className="num">{eur(o.payMin)} – {eur(o.payMax)}</td>
                <td className="num">{o.verified || "—"}</td>
                <td>
                  {o.published ? <span className="chip ok">Opublikowana</span> : <span className="chip no">Szkic – do weryfikacji</span>}{" "}
                  {o.promoted && <span className="chip promo">Promowana</span>}{" "}
                  {o.example && <span className="chip ex">Przykład</span>}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link className="btn" href={`/admin?edit=${o.id}`}>Edytuj</Link> <DeleteButton id={o.id} name={o.name} />
                </td>
              </tr>
            ))}
            {!offers.length && <tr><td colSpan={5}>Brak ofert. Dodaj pierwszą agencję powyżej.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
