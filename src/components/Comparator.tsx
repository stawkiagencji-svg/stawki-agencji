"use client";

import { useEffect, useMemo, useState } from "react";
import { CONTRACTS, GERMAN, type ContractKey, type Offer } from "@/lib/types";

const SCALE: [number, number] = [1000, 3500];
const TICKS = [1000, 1500, 2000, 2500, 3000, 3500];
const ALL_CONTRACTS = Object.keys(CONTRACTS) as ContractKey[];
const STORAGE_KEY = "pao-filters";

type SortKey = "max" | "min" | "name" | "verified";
type Filters = {
  contracts: ContractKey[];
  min: number;
  german: number;
  travel: boolean;
  a1: boolean;
  bonus: boolean;
  sort: SortKey;
};

const DEFAULT_FILTERS: Filters = {
  contracts: ALL_CONTRACTS, min: 1000, german: 3, travel: false, a1: false, bonus: false, sort: "max",
};

const nf = new Intl.NumberFormat("pl-PL");
const eur = (n: number) => nf.format(Math.round(n)) + " €";
const pct = (v: number) => Math.max(0, Math.min(100, ((v - SCALE[0]) / (SCALE[1] - SCALE[0])) * 100));
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const SORTERS: Record<SortKey, (a: Offer, b: Offer) => number> = {
  max: (a, b) => b.payMax - a.payMax,
  min: (a, b) => b.payMin - a.payMin,
  name: (a, b) => a.name.localeCompare(b.name, "pl"),
  verified: (a, b) => b.verified.localeCompare(a.verified),
};

export default function Comparator({ offers }: { offers: Offer[] }) {
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (saved) setF({ ...DEFAULT_FILTERS, ...saved });
    } catch {}
  }, []);

  const update = (patch: Partial<Filters>) => {
    setF((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const visible = useMemo(() => {
    const list = offers.filter((o) =>
      o.contracts.some((c) => f.contracts.includes(c)) &&
      o.payMax >= f.min && o.german <= f.german &&
      (!f.travel || o.travel) && (!f.a1 || o.a1) && (!f.bonus || o.bonus.trim()));
    // Oferty promowane zawsze na górze i zawsze oznaczone (wymóg przejrzystości rankingu).
    return list.sort((a, b) => Number(b.promoted) - Number(a.promoted) || SORTERS[f.sort](a, b));
  }, [offers, f]);

  const stats = useMemo(() => {
    if (!offers.length) return null;
    const maxs = offers.map((o) => o.payMax).sort((a, b) => a - b);
    const mid = maxs.length / 2;
    const median = maxs.length % 2 ? maxs[Math.floor(mid)] : (maxs[mid - 1] + maxs[mid]) / 2;
    return { min: Math.min(...offers.map((o) => o.payMin)), max: maxs[maxs.length - 1], median };
  }, [offers]);

  const toggleCompare = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s));
  const compared = offers.filter((o) => selected.includes(o.id));

  return (
    <>
      <header className="top">
        <div>
          <div className="eyebrow">Opieka 24h · Polska → Niemcy</div>
          <h1>Porównywarka agencji opieki</h1>
          <p className="lede">
            Zobacz, które polskie agencje delegujące opiekunki i opiekunów do Niemiec oferują jaką umowę i ile płacą
            miesięcznie. Filtruj po formie zatrudnienia, wymaganym niemieckim i stawce, a potem porównaj do trzech ofert
            obok siebie.
          </p>
        </div>
        <div className="stats" aria-live="polite">
          <div className="stat"><b>{offers.length}</b><span>agencji w bazie</span></div>
          <div className="stat pay"><b>{stats ? `${eur(stats.min)} – ${eur(stats.max)}` : "–"}</b><span>widełki netto / mies.</span></div>
          <div className="stat"><b>{stats ? eur(stats.median) : "–"}</b><span>mediana górnej stawki</span></div>
        </div>
      </header>

      <div className="layout">
        <aside className="filters" aria-label="Filtry">
          <fieldset>
            <legend>Forma umowy</legend>
            {ALL_CONTRACTS.map((k) => (
              <label className="chk" key={k}>
                <input
                  type="checkbox" id={`f-${k}`} checked={f.contracts.includes(k)}
                  onChange={(e) => update({ contracts: e.target.checked ? [...f.contracts, k] : f.contracts.filter((c) => c !== k) })}
                />
                {CONTRACTS[k]}
              </label>
            ))}
          </fieldset>
          <fieldset>
            <legend>Chcę zarabiać co najmniej</legend>
            <input type="range" id="f-min" min={1000} max={3000} step={50} value={f.min}
              onChange={(e) => update({ min: Number(e.target.value) })} aria-describedby="f-minval" />
            <span className="rangeval" id="f-minval">{eur(f.min)} netto</span>
          </fieldset>
          <fieldset>
            <legend>Mój niemiecki</legend>
            <select id="f-german" value={f.german} onChange={(e) => update({ german: Number(e.target.value) })}>
              {[3, 2, 1, 0].map((g) => <option key={g} value={g}>{GERMAN[g]}</option>)}
            </select>
          </fieldset>
          <fieldset>
            <legend>Wymagam</legend>
            <label className="chk"><input type="checkbox" id="f-travel" checked={f.travel} onChange={(e) => update({ travel: e.target.checked })} /> Zwrot kosztów dojazdu</label>
            <label className="chk"><input type="checkbox" id="f-a1" checked={f.a1} onChange={(e) => update({ a1: e.target.checked })} /> Ubezpieczenie / A1 w cenie</label>
            <label className="chk"><input type="checkbox" id="f-bonus" checked={f.bonus} onChange={(e) => update({ bonus: e.target.checked })} /> Premie (np. świąteczna)</label>
          </fieldset>
          <button className="ghost" type="button" onClick={() => update(DEFAULT_FILTERS)}>Wyczyść filtry</button>
        </aside>

        <main>
          <div className="listhead">
            <span className="count">{visible.length} z {offers.length} ofert</span>
            <label htmlFor="sort">Sortuj
              <select id="sort" value={f.sort} onChange={(e) => update({ sort: e.target.value as SortKey })}>
                <option value="max">Najwyższa stawka</option>
                <option value="min">Najwyższa stawka minimalna</option>
                <option value="name">Nazwa A–Z</option>
                <option value="verified">Ostatnio sprawdzone</option>
              </select>
            </label>
          </div>
          <div className="ticks" aria-hidden="true">
            {TICKS.map((v) => <span key={v} className={v % 1000 ? "minor" : undefined} style={{ left: `${pct(v)}%` }}>{v === 3500 ? "3 500 €+" : nf.format(v)}</span>)}
          </div>
          <div className="offers">
            {!offers.length ? (
              <div className="empty"><h3>Baza ofert jest pusta</h3><p>Oferty agencji pojawią się tu wkrótce.</p></div>
            ) : !visible.length ? (
              <div className="empty"><h3>Żadna oferta nie spełnia filtrów</h3><p>Obniż minimalną stawkę albo zaznacz więcej form umowy.</p></div>
            ) : (
              visible.map((o) => (
                <OfferCard key={o.id} o={o} minLine={f.min} selected={selected.includes(o.id)}
                  compareDisabled={!selected.includes(o.id) && selected.length >= 3}
                  onCompare={() => toggleCompare(o.id)} />
              ))
            )}
          </div>
        </main>
      </div>

      {compared.length >= 2 && <CompareTable offers={compared} onClear={() => setSelected([])} />}
    </>
  );
}

function OfferCard({ o, minLine, selected, compareDisabled, onCompare }: {
  o: Offer; minLine: number; selected: boolean; compareDisabled: boolean; onCompare: () => void;
}) {
  return (
    <article className={`offer${selected ? " sel" : ""}`}>
      <div className="orow">
        <div className="ohead">
          <div className="oname">
            <h3>{o.name}</h3>
            {o.promoted && <span className="chip promo">Oferta promowana</span>}
            {o.example && <span className="chip ex">Przykład</span>}
            {o.website && <a href={o.website} target="_blank" rel="noopener nofollow">{host(o.website)}</a>}
          </div>
          <div className="chips">{o.contracts.map((c) => <span className="chip" key={c}>{CONTRACTS[c]}</span>)}</div>
        </div>
        <div className="paybig num">{eur(o.payMin)} – {eur(o.payMax)}<small>netto / miesiąc</small></div>
      </div>
      <div className="bar" role="img" aria-label={`Widełki ${eur(o.payMin)} do ${eur(o.payMax)}`}>
        <i style={{ left: `${pct(o.payMin)}%`, width: `${Math.max(1.5, pct(o.payMax) - pct(o.payMin))}%` }} />
        <span className="tick" style={{ left: `${pct(minLine)}%` }} />
      </div>
      <dl className="meta">
        <div><dt>Niemiecki od</dt><dd>{GERMAN[o.german]}</dd></div>
        <div><dt>Turnus</dt><dd>{o.rotation || "—"}</dd></div>
        <div><dt>Dojazd</dt><dd>{o.travel ? <span className="chip ok">Zwracany</span> : <span className="chip no">Na własny koszt</span>}</dd></div>
        <div><dt>Ubezpieczenie / A1</dt><dd>{o.a1 ? <span className="chip ok">Tak</span> : <span className="chip no">Brak info</span>}</dd></div>
        <div><dt>Premie</dt><dd>{o.bonus || "—"}</dd></div>
        <div><dt>Sprawdzono</dt><dd className="num">{o.verified || "—"}{o.source && <> · <a href={o.source} target="_blank" rel="noopener nofollow">źródło</a></>}</dd></div>
      </dl>
      {o.notes && <p className="note">{o.notes}</p>}
      <div className="oactions">
        <button type="button" onClick={onCompare} disabled={compareDisabled}>
          {selected ? "Usuń z porównania" : "Porównaj"}
        </button>
      </div>
    </article>
  );
}

function CompareTable({ offers, onClear }: { offers: Offer[]; onClear: () => void }) {
  const bestMax = Math.max(...offers.map((o) => o.payMax));
  const bestMin = Math.max(...offers.map((o) => o.payMin));
  const lowGerman = Math.min(...offers.map((o) => o.german));
  const rows: [string, (o: Offer) => React.ReactNode, ((o: Offer) => boolean)?][] = [
    ["Stawka od", (o) => <span className="num">{eur(o.payMin)}</span>, (o) => o.payMin === bestMin],
    ["Stawka do", (o) => <span className="num">{eur(o.payMax)}</span>, (o) => o.payMax === bestMax],
    ["Formy umów", (o) => o.contracts.map((c) => CONTRACTS[c]).join(", ")],
    ["Niemiecki od", (o) => GERMAN[o.german], (o) => o.german === lowGerman],
    ["Turnus", (o) => o.rotation || "—"],
    ["Dojazd", (o) => (o.travel ? "Zwracany" : "Na własny koszt"), (o) => o.travel],
    ["Ubezpieczenie / A1", (o) => (o.a1 ? "Tak" : "Brak info"), (o) => o.a1],
    ["Premie", (o) => o.bonus || "—"],
    ["Sprawdzono", (o) => o.verified || "—"],
  ];
  return (
    <section id="compare">
      <div className="listhead">
        <h2>Porównanie</h2>
        <button className="ghost" type="button" onClick={onClear}>Wyczyść porównanie</button>
      </div>
      <div className="cmpwrap">
        <table className={`cols-${offers.length}`}>
          <thead><tr><th />{offers.map((o) => <th scope="col" key={o.id} className="colhead">{o.name}</th>)}</tr></thead>
          <tbody>
            {rows.map(([label, cell, best]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {offers.map((o) => <td key={o.id} className={best?.(o) ? "best" : undefined}>{cell(o)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
