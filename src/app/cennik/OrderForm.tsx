"use client";

import Link from "next/link";
import { useActionState } from "react";
import { BILLING, PACKAGES, type Billing, type PackageKey } from "@/lib/packages";
import { submitOrder, type OrderState } from "./actions";

export default function OrderForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState<OrderState, FormData>(submitOrder, {});
  const val = (k: string) => state.values?.[k] ?? "";

  if (state.ok) {
    return (
      <div className="panel thanks" role="status">
        <h2>Dziękujemy za zamówienie!</h2>
        <p>
          Odezwiemy się na podany e-mail w ciągu 2 dni roboczych, potwierdzimy zamówienie i poprosimy o logo agencji.
          Pierwsze 30 dni są bezpłatne.
        </p>
        <p><Link className="btn primary" href="/">Wróć do porównywarki</Link></p>
      </div>
    );
  }

  return (
    <form action={action} className="panel submitform" id="zamow" key={state.n ?? 0}>
      <input type="hidden" name="t" value={token} />
      {/* Pole-pułapka dla botów: ukryte dla ludzi i czytników ekranu. */}
      <div className="hp" aria-hidden="true">
        <label>Strona firmy<input type="text" name="company_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>Pakiet *</legend>
        <div className="row">
          {(Object.keys(PACKAGES) as PackageKey[]).map((k) => (
            <label className="chk" key={k}>
              <input type="radio" name="package" value={k} required defaultChecked={(val("package") || "premium") === k} />{" "}
              {PACKAGES[k].name} – {PACKAGES[k].founder} zł / mies.
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Płatność *</legend>
        <div className="row">
          {(Object.keys(BILLING) as Billing[]).map((k) => (
            <label className="chk" key={k}>
              <input type="radio" name="billing" value={k} required defaultChecked={(val("billing") || "monthly") === k} /> {BILLING[k]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Agencja i dane do rachunku</legend>
        <label>Nazwa agencji *<input type="text" name="agency" required maxLength={120} defaultValue={val("agency")} /></label>
        <label>Pełna nazwa firmy *<input type="text" name="company" required maxLength={200} defaultValue={val("company")} /></label>
        <label>NIP<input type="text" name="nip" inputMode="numeric" maxLength={20} defaultValue={val("nip")} /></label>
        <label>Adres siedziby<input type="text" name="address" maxLength={300} defaultValue={val("address")} /></label>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Osoba do kontaktu</legend>
        <label>Imię i nazwisko *<input type="text" name="contactName" required maxLength={120} autoComplete="name" defaultValue={val("contactName")} /></label>
        <label>E-mail *<input type="email" name="email" required maxLength={200} autoComplete="email" defaultValue={val("email")} /></label>
        <label>Telefon<input type="tel" name="phone" maxLength={40} autoComplete="tel" defaultValue={val("phone")} /></label>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Szczegóły</legend>
        <label className="full">Link do formularza aplikacyjnego agencji (dla przycisku „Aplikuj”)
          <input type="url" name="applyUrl" placeholder="https://" maxLength={500} defaultValue={val("applyUrl")} />
        </label>
        <label>Preferowana data rozpoczęcia<input type="date" name="startDate" defaultValue={val("startDate")} /></label>
        <label className="full">Uwagi<textarea name="notes" maxLength={1000} defaultValue={val("notes")} /></label>
        <p className="note full">Logo agencji (PNG lub JPG) prześlij po potwierdzeniu zamówienia na adres {email}.</p>
        <label className="chk full">
          <input type="checkbox" name="terms" required defaultChecked={val("terms") === "on"} />
          <span>Akceptuję <Link href="/regulamin-agencji">Regulamin usług dla agencji</Link> i zapoznałem się z{" "}
            <Link href="/polityka-prywatnosci">polityką prywatności</Link>. Zamawiam w związku z prowadzoną działalnością gospodarczą. *</span>
        </label>
      </fieldset>

      <div className="formactions">
        <button className="primary" type="submit" disabled={pending}>{pending ? "Wysyłam…" : "Zamów pakiet"}</button>
        {state.error && <span className="msg err" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
