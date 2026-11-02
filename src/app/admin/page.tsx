import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin } from "@/lib/auth";
import { getOffer, listAllOffers, SUBMITTER_ROLES } from "@/lib/offers";
import { listAllReviews } from "@/lib/reviews";
import { logout, moderateReview } from "./actions";
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
  const [offers, editing, reviews] = await Promise.all([
    listAllOffers(), edit ? getOffer(Number(edit)) : Promise.resolve(null), listAllReviews(),
  ]);
  const newSubmissions = offers.filter((o) => o.origin === "form" && !o.published).length;
  const reviewsToCheck = reviews.filter((r) => !r.published || r.reported).length;

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
      {newSubmissions > 0 && (
        <p className="panel" style={{ marginBottom: 16 }}>
          <b>Nowe zgłoszenia z formularza: {newSubmissions}.</b> Są na górze tabeli poniżej. Sprawdź je, uzupełnij
          i zaznacz „Opublikowana”, albo usuń, jeśli to spam lub duplikat.
        </p>
      )}

      {reviewsToCheck > 0 && (
        <p className="panel" style={{ marginBottom: 16 }}>
          <b>Opinie do sprawdzenia: {reviewsToCheck}.</b> Są w sekcji „Opinie opiekunek” na dole strony.
        </p>
      )}

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
                <td>
                  {o.name}
                  {o.origin === "form" && !o.published && (
                    <div className="note">
                      Zgłoszenie: {SUBMITTER_ROLES[o.submitterRole as keyof typeof SUBMITTER_ROLES] ?? "—"}
                      {o.submitterEmail && <> · <a href={`mailto:${o.submitterEmail}`}>{o.submitterEmail}</a></>}
                    </div>
                  )}
                </td>
                <td className="num">{o.payMin === null && o.payMax === null ? "—" : `${o.payMin !== null ? eur(o.payMin) : "…"} – ${o.payMax !== null ? eur(o.payMax) : "…"}`}</td>
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

      <h2 style={{ margin: "32px 0 8px" }}>Opinie opiekunek</h2>
      <p className="note" style={{ marginBottom: 12 }}>
        Publikuj każdą opinię zgodną z regulaminem, także krytyczną. Odrzucaj tylko obraźliwe, z danymi osobowymi
        (nazwiska, telefony, adresy), reklamy i spam. Te same zasady dla każdej agencji, również dla Twojej.
      </p>
      <div className="admintable panel">
        <table>
          <thead>
            <tr><th scope="col">Agencja</th><th scope="col">Opinia</th><th scope="col">Status</th><th scope="col" /></tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.offerName}<div className="note num">{r.date}</div></td>
                <td>
                  <span className="stars">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>{" "}
                  <b>{r.nickname || "Opiekunka"}</b>{r.worked && <span className="note"> · pracowała: {r.worked}</span>}
                  <p style={{ margin: "4px 0 0", whiteSpace: "pre-line" }}>{r.body}</p>
                </td>
                <td>
                  {r.reported && <span className="chip promo">Zgłoszona przez czytelnika</span>}{" "}
                  {r.published ? <span className="chip ok">Opublikowana</span> : <span className="chip no">Do sprawdzenia</span>}
                </td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <form action={moderateReview} style={{ display: "inline-flex", gap: 6 }}>
                    <input type="hidden" name="id" value={r.id} />
                    {(!r.published || r.reported) && <button type="submit" name="action" value="publish" className="primary">{r.reported ? "Zostaw" : "Opublikuj"}</button>}
                    {r.published && <button type="submit" name="action" value="hide" className="ghost">Ukryj</button>}
                    <button type="submit" name="action" value="delete" className="ghost danger">Usuń</button>
                  </form>
                </td>
              </tr>
            ))}
            {!reviews.length && <tr><td colSpan={4}>Nie ma jeszcze opinii.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
