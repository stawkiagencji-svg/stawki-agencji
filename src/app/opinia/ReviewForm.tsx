"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitReview, type ReviewState } from "./actions";

export default function ReviewForm({ offerId, token }: { offerId: number; token: string }) {
  const [state, action, pending] = useActionState<ReviewState, FormData>(submitReview, {});
  const val = (k: string) => state.values?.[k] ?? "";

  if (state.ok) {
    return (
      <div className="panel thanks" role="status">
        <h2>Dziękujemy za opinię!</h2>
        <p>Sprawdzimy ją i opublikujemy, zwykle w ciągu kilku dni.</p>
        <p><Link className="btn primary" href="/">Wróć do porównywarki</Link></p>
      </div>
    );
  }

  return (
    <form action={action} className="panel submitform" key={state.n ?? 0}>
      <input type="hidden" name="t" value={token} />
      <input type="hidden" name="offerId" value={offerId} />
      {/* Pole-pułapka dla botów: ukryte dla ludzi i czytników ekranu. */}
      <div className="hp" aria-hidden="true">
        <label>Strona firmy<input type="text" name="company_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>Twoja ocena *</legend>
        <div className="stars-input">
          {[5, 4, 3, 2, 1].map((n) => (
            <label key={n} title={`${n} z 5`}>
              <input type="radio" name="rating" value={n} required defaultChecked={val("rating") === String(n)} />
              <span aria-hidden="true">★</span><span className="sr">{n} z 5</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form">
        <label className="full">Twoja opinia *
          <textarea name="body" required minLength={30} maxLength={2000} rows={6} defaultValue={val("body")}
            placeholder="Co było dobre, a co nie? Np. wypłata na czas, pomoc koordynatorki, warunki zgodne z ofertą" />
        </label>
        <label>Podpis (opcjonalnie)
          <input type="text" name="nickname" maxLength={40} placeholder="np. Ania z Opola" defaultValue={val("nickname")} />
        </label>
        <label>Kiedy pracowałaś z agencją?
          <input type="text" name="worked" maxLength={40} placeholder="np. 2025–2026" defaultValue={val("worked")} />
        </label>
        <p className="note full">
          Nie wpisuj nazwisk, telefonów ani adresów rodzin czy pracowników agencji. Takich opinii nie opublikujemy.
        </p>
        <label className="chk full">
          <input type="checkbox" name="truthful" required defaultChecked={val("truthful") === "on"} />
          <span>Opinia opisuje moje własne doświadczenie z tą agencją. Nie jestem jej pracownikiem ani pracownikiem
            agencji konkurencyjnej. Akceptuję <Link href="/regulamin">zasady publikacji opinii</Link>. *</span>
        </label>
      </fieldset>

      <div className="formactions">
        <button className="primary" type="submit" disabled={pending}>{pending ? "Wysyłam…" : "Wyślij opinię"}</button>
        {state.error && <span className="msg err" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
