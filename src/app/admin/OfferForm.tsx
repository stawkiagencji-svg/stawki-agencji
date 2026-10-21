"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CONTRACTS, DETAILS, GERMAN, type ContractKey, type DetailKey, type Offer } from "@/lib/types";
import { saveOffer, type FormState } from "./actions";

const DETAIL_HINTS: Record<DetailKey, string> = {
  contractNote: "np. Umowa zlecenie; przy części ofert także Gewerbe",
  insurance: "np. ZUS od średniej krajowej, A1, dodatkowe ubezpieczenie",
  travelNote: "np. Bezpłatny bus od drzwi do drzwi",
  bonus: "np. Premia świąteczna 300 €, bonusy lojalnościowe",
  support: "np. Polskojęzyczny koordynator 24/7",
  housing: "np. Własny pokój z internetem, 1 dzień wolny w tygodniu",
};

export default function OfferForm({ offer }: { offer: Offer | null }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveOffer, {});
  const o = offer;
  // Po błędzie pokazujemy to, co wpisano; inaczej dane edytowanej oferty.
  const sv = state.values;
  const val = (k: string, fallback?: string | number | null) => (sv ? String(sv[k] ?? "") : (fallback ?? ""));
  const on = (k: string, fallback?: boolean) => (sv ? sv[k] === "on" : fallback);
  const hasContract = (k: ContractKey) => (sv ? ([] as string[]).concat(sv.contracts ?? []).includes(k) : o?.contracts.includes(k));
  return (
    <section className="panel">
      <h2>{o ? `Edytuj: ${o.name}` : "Dodaj ofertę agencji"}</h2>
      <p className="note">Wypełnij to, co agencja podaje. Puste pola pokażą się na stronie jako „Brak informacji”.</p>
      {/* key odświeża pola po każdej odpowiedzi serwera */}
      <form action={action} className="form" key={`${o?.id ?? "new"}-${state.n ?? 0}`}>
        {o && <input type="hidden" name="id" value={o.id} />}
        <label>Nazwa agencji<input type="text" name="name" required defaultValue={val("name", o?.name)} /></label>
        <label>Strona www<input type="url" name="website" placeholder="https://" defaultValue={val("website", o?.website)} /></label>
        <label>Siedziba (miasto)<input type="text" name="city" defaultValue={val("city", o?.city)} /></label>
        <label className="full">Krótki opis agencji<textarea name="description" defaultValue={val("description", o?.description)} /></label>

        <label>Stawka od (€ / mies.)<input type="number" name="payMin" min={0} step={10} placeholder="puste = nie podaje" defaultValue={val("payMin", o?.payMin)} /></label>
        <label>Stawka do (€ / mies.)<input type="number" name="payMax" min={0} step={10} placeholder="puste = nie podaje" defaultValue={val("payMax", o?.payMax)} /></label>
        <label className="full">Stawka słowami, jak w źródle
          <input type="text" name="payNote" placeholder="np. ok. 2 600–3 100 € za 6 tygodni" defaultValue={val("payNote", o?.payNote)} />
        </label>

        <label>Minimalny niemiecki
          <select name="german" defaultValue={val("german", o?.german)}>
            <option value="">Brak informacji</option>
            {GERMAN.map((g, i) => <option key={g} value={i}>{g}</option>)}
          </select>
        </label>
        <label>Długość turnusu<input type="text" name="rotation" placeholder="np. 6–12 tygodni" defaultValue={val("rotation", o?.rotation)} /></label>
        <label>Data weryfikacji<input type="text" name="verified" placeholder="RRRR-MM-DD" defaultValue={val("verified", o?.verified)} /></label>

        <fieldset className="full">
          <legend>Formy umów podane wprost (do filtrów)</legend>
          <div className="row">
            {(Object.keys(CONTRACTS) as ContractKey[]).map((k) => (
              <label className="chk" key={k}>
                <input type="checkbox" name="contracts" value={k} defaultChecked={hasContract(k)} /> {CONTRACTS[k]}
              </label>
            ))}
          </div>
        </fieldset>

        {(Object.keys(DETAILS) as DetailKey[]).map((k) => (
          <label key={k}>{DETAILS[k]}
            <textarea name={k} placeholder={DETAIL_HINTS[k]} defaultValue={val(k, o?.[k])} />
          </label>
        ))}

        <div className="full row">
          <label className="chk"><input type="checkbox" name="travel" defaultChecked={on("travel", o?.travel)} /> Agencja organizuje lub opłaca dojazd</label>
          <label className="chk"><input type="checkbox" name="a1" defaultChecked={on("a1", o?.a1)} /> Opłaca składki / ubezpieczenie</label>
          <label className="chk"><input type="checkbox" name="example" defaultChecked={on("example", o?.example)} /> Oznacz jako przykład</label>
          <label className="chk"><input type="checkbox" name="promoted" defaultChecked={on("promoted", o?.promoted)} /> Oferta promowana (płatna)</label>
          <label className="chk"><input type="checkbox" name="affiliated" defaultChecked={on("affiliated", o?.affiliated)} /> Tu pracuję (oznaczenie „Tu pracuje autorka serwisu”)</label>
          <label className="chk"><input type="checkbox" name="published" defaultChecked={on("published", o ? o.published : true)} /> Opublikowana (widoczna na stronie)</label>
        </div>
        <label className="full">Źródła (każdy link w nowej linii)
          <textarea name="source" placeholder="https://" defaultValue={val("source", o?.source.split(" | ").join("\n"))} />
        </label>
        <label className="full">Uwagi wewnętrzne / dodatkowe<textarea name="notes" defaultValue={val("notes", o?.notes)} /></label>
        <div className="formactions full">
          <button className="primary" type="submit" disabled={pending}>{pending ? "Zapisuję…" : "Zapisz ofertę"}</button>
          {o && <Link className="btn" href="/admin">Anuluj edycję</Link>}
          {state.error && <span className="msg err" role="alert">{state.error}</span>}
          {state.ok && <span className="msg" role="status">{state.ok}</span>}
        </div>
      </form>
    </section>
  );
}
