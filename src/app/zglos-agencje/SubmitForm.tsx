"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CONTRACTS, DETAILS, SUBMITTER_ROLES, type ContractKey, type DetailKey, type SubmitterRole } from "@/lib/types";
import { submitAgency, type SubmitState } from "./actions";

const HINTS: Record<DetailKey, string> = {
  contractNote: "np. umowa zlecenie z polską firmą, możliwy Gewerbe",
  insurance: "np. ZUS od najniższej krajowej, A1, EKUZ",
  travelNote: "np. bezpłatny bus od drzwi do drzwi",
  bonus: "np. premia świąteczna 300 €",
  support: "np. koordynatorka po polsku, telefon 24/7",
  housing: "np. własny pokój, internet, 2 godz. przerwy dziennie",
};

export default function SubmitForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<SubmitState, FormData>(submitAgency, {});
  const sv = state.values;
  const val = (k: string) => (sv ? String(sv[k] ?? "") : "");
  const on = (k: string) => sv?.[k] === "on";
  const hasContract = (k: ContractKey) => ([] as string[]).concat(sv?.contracts ?? []).includes(k);

  if (state.ok) {
    return (
      <div className="panel thanks" role="status">
        <h2>Dziękujemy za zgłoszenie!</h2>
        <p>Sprawdzimy informacje i dodamy agencję do porównywarki. Zwykle trwa to kilka dni.</p>
        <p><Link className="btn primary" href="/">Wróć do porównywarki</Link></p>
      </div>
    );
  }

  return (
    <form action={action} className="panel submitform" key={state.n ?? 0}>
      <input type="hidden" name="t" value={token} />
      {/* Pole-pułapka dla botów: ukryte dla ludzi i czytników ekranu. */}
      <div className="hp" aria-hidden="true">
        <label>Strona firmy<input type="text" name="company_url" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <fieldset>
        <legend>Kim jesteś?</legend>
        <div className="row">
          {(Object.keys(SUBMITTER_ROLES) as SubmitterRole[]).map((r) => (
            <label className="chk" key={r}>
              <input type="radio" name="role" value={r} required defaultChecked={val("role") === r} /> {SUBMITTER_ROLES[r]}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Agencja</legend>
        <label>Nazwa agencji *<input type="text" name="name" required maxLength={120} defaultValue={val("name")} /></label>
        <label>Strona www<input type="url" name="website" placeholder="https://" defaultValue={val("website")} /></label>
        <label>Siedziba (miasto)<input type="text" name="city" maxLength={80} defaultValue={val("city")} /></label>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Wynagrodzenie</legend>
        <label>Od (€ na miesiąc)<input type="number" name="payMin" min={0} step={10} defaultValue={val("payMin")} /></label>
        <label>Do (€ na miesiąc)<input type="number" name="payMax" min={0} step={10} defaultValue={val("payMax")} /></label>
        <label className="full">Opis stawki (netto czy brutto, za jaki okres)
          <input type="text" name="payNote" maxLength={300} placeholder="np. 2 100 € netto miesięcznie przy niemieckim A2" defaultValue={val("payNote")} />
        </label>
      </fieldset>

      <fieldset className="form">
        <legend className="full">Warunki</legend>
        <div className="full">
          <span className="sublabel">Formy umowy</span>
          <div className="row">
            {(Object.keys(CONTRACTS) as ContractKey[]).map((k) => (
              <label className="chk" key={k}>
                <input type="checkbox" name="contracts" value={k} defaultChecked={hasContract(k)} /> {CONTRACTS[k]}
              </label>
            ))}
          </div>
        </div>
        <div className="full row">
          <label className="chk"><input type="checkbox" name="travel" defaultChecked={on("travel")} /> Agencja organizuje lub opłaca dojazd</label>
          <label className="chk"><input type="checkbox" name="a1" defaultChecked={on("a1")} /> Opłaca składki / ubezpieczenie</label>
        </div>
        {(Object.keys(DETAILS) as DetailKey[]).map((k) => (
          <label key={k}>{k === "contractNote" ? "Umowa – szczegóły" : DETAILS[k]}
            <textarea name={k} maxLength={600} placeholder={HINTS[k]} defaultValue={val(k)} />
          </label>
        ))}
      </fieldset>

      <fieldset className="form">
        <legend className="full">Źródło i kontakt</legend>
        <label className="full">Link do ogłoszenia lub posta (np. na Facebooku)
          <input type="url" name="source" placeholder="https://" defaultValue={val("source")} />
        </label>
        <label className="full">Coś jeszcze?<textarea name="notes" maxLength={1000} defaultValue={val("notes")} /></label>
        <label className="full">Twój e-mail (opcjonalnie, jeśli możemy dopytać)
          <input type="email" name="email" autoComplete="email" maxLength={200} defaultValue={val("email")} />
        </label>
        <label className="chk full">
          <input type="checkbox" name="consent" defaultChecked={on("consent")} />
          <span>Zgadzam się na kontakt w sprawie zgłoszenia na podany e-mail. Zasady opisuje{" "}
            <Link href="/polityka-prywatnosci">polityka prywatności</Link>.</span>
        </label>
        <label className="chk full">
          <input type="checkbox" name="truthful" required defaultChecked={on("truthful")} />
          <span>Potwierdzam, że podane informacje są zgodne z moją wiedzą. *</span>
        </label>
      </fieldset>

      <div className="formactions">
        <button className="primary" type="submit" disabled={pending}>{pending ? "Wysyłam…" : "Wyślij zgłoszenie"}</button>
        {state.error && <span className="msg err" role="alert">{state.error}</span>}
      </div>
    </form>
  );
}
