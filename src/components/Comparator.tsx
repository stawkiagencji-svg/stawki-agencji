"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CONTRACTS, DETAILS, GERMAN, hasPay, sourceLinks,
  type ContractKey, type DetailKey, type Offer, type Review,
} from "@/lib/types";
import { flagReview } from "@/app/opinia/actions";

const SCALE: [number, number] = [1000, 3500];
const TICKS = [1000, 1500, 2000, 2500, 3000, 3500];
const ALL_CONTRACTS = Object.keys(CONTRACTS) as ContractKey[];
const DETAIL_KEYS = Object.keys(DETAILS) as DetailKey[];
const STORAGE_KEY = "pao-filters";
const NO_INFO = "Brak informacji";

type SortKey = "max" | "min" | "name" | "verified";
type Filters = {
  contracts: ContractKey[];
  min: number;
  german: number;
  travel: boolean;
  a1: boolean;
  zusAvg: boolean;
  bonus: boolean;
  housing: boolean;
  support: boolean;
  reviewed: boolean;
  showNoPay: boolean;
  sort: SortKey;
};

const DEFAULT_FILTERS: Filters = {
  contracts: ALL_CONTRACTS, min: 1000, german: 3, travel: false, a1: false, zusAvg: false, bonus: false,
  housing: false, support: false, reviewed: false, showNoPay: true, sort: "max",
};

const nf = new Intl.NumberFormat("pl-PL");
const eur = (n: number) => nf.format(Math.round(n)) + " €";
const pct = (v: number) => Math.max(0, Math.min(100, ((v - SCALE[0]) / (SCALE[1] - SCALE[0])) * 100));
const plural = (n: number, one: string, few: string, many: string) =>
  n === 1 ? one : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? few : many;
const opinions = (n: number) => `${n} ${plural(n, "opinia", "opinie", "opinii")}`;
const avg = (rs: Review[]) => rs.reduce((a, r) => a + r.rating, 0) / rs.length;
const stars = (n: number) => "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n));
const host = (u: string) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/.*$/, "");

/** Stawka słowami: zakres, pojedyncza kwota, „od”/„do” albo null, gdy agencja jej nie podaje. */
function payLabel(o: Offer): string | null {
  const { payMin: a, payMax: b } = o;
  if (a !== null && b !== null) return a === b ? eur(a) : `${eur(a)} – ${eur(b)}`;
  if (a !== null) return `od ${eur(a)}`;
  if (b !== null) return `do ${eur(b)}`;
  return null;
}

// Do sortowania: oferty bez stawki zawsze na końcu.
const top = (o: Offer) => o.payMax ?? o.payMin ?? -1;
const bottom = (o: Offer) => o.payMin ?? o.payMax ?? -1;

const SORTERS: Record<SortKey, (a: Offer, b: Offer) => number> = {
  max: (a, b) => top(b) - top(a) || bottom(b) - bottom(a),
  min: (a, b) => bottom(b) - bottom(a) || top(b) - top(a),
  name: (a, b) => a.name.localeCompare(b.name, "pl"),
  verified: (a, b) => b.verified.localeCompare(a.verified),
};

/** Przełączniki „tak/nie” w panelu filtrów, pogrupowane w kategorie. */
type Toggle = "zusAvg" | "a1" | "travel" | "bonus" | "housing" | "support" | "reviewed";
const CATEGORIES: { label: string; toggles: [Toggle, string][] }[] = [
  { label: "ZUS i ubezpieczenie", toggles: [["zusAvg", "ZUS od średniej krajowej (wyższa emerytura)"], ["a1", "Opłacane składki / ubezpieczenie"]] },
  { label: "Warunki", toggles: [["travel", "Agencja organizuje lub opłaca dojazd"], ["bonus", "Premie lub dodatki"], ["housing", "Opisane warunki na miejscu (pokój, przerwy)"], ["support", "Wsparcie na miejscu (koordynator)"]] },
  { label: "Opinie", toggles: [["reviewed", "Tylko agencje z opiniami opiekunek"]] },
];

export default function Comparator({ offers, reviews }: { offers: Offer[]; reviews: Review[] }) {
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

  const allContracts = f.contracts.length === ALL_CONTRACTS.length;
  const reviewsOf = useMemo(() => {
    const m = new Map<number, Review[]>();
    for (const r of reviews) m.set(r.offerId, [...(m.get(r.offerId) ?? []), r]);
    return m;
  }, [reviews]);

  const visible = useMemo(() => {
    const list = offers.filter((o) => {
      // Oferta bez podanej formy umowy przechodzi tylko wtedy, gdy nikt nie zawęża umów.
      const contractOk = o.contracts.length ? o.contracts.some((c) => f.contracts.includes(c)) : allContracts;
      // Oferta bez stawki nie spełnia progu kwotowego, więc znika, gdy użytkownik go podniesie.
      const payOk = hasPay(o) ? top(o) >= f.min : f.showNoPay && f.min <= SCALE[0];
      return contractOk && payOk &&
        (o.german === null || o.german <= f.german) &&
        (!f.travel || o.travel) && (!f.a1 || o.a1 || o.zusAvg) && (!f.zusAvg || o.zusAvg) && (!f.bonus || o.bonus.trim()) &&
        (!f.housing || o.housing.trim()) && (!f.support || o.support.trim()) && (!f.reviewed || reviewsOf.has(o.id));
    });
    // Oferty promowane zawsze na górze i zawsze oznaczone (wymóg przejrzystości rankingu).
    return list.sort((a, b) => Number(b.promoted) - Number(a.promoted) || SORTERS[f.sort](a, b));
  }, [offers, f, allContracts, reviewsOf]);

  const stats = useMemo(() => {
    const paid = offers.filter(hasPay);
    if (!paid.length) return null;
    const tops = paid.map(top).sort((a, b) => a - b);
    const mid = tops.length / 2;
    const median = tops.length % 2 ? tops[Math.floor(mid)] : (tops[mid - 1] + tops[mid]) / 2;
    return { min: Math.min(...paid.map(bottom)), max: tops[tops.length - 1], median, count: paid.length };
  }, [offers]);

  const toggleCompare = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < 3 ? [...s, id] : s));
  const compared = offers.filter((o) => selected.includes(o.id));
  const affiliated = offers.filter((o) => o.affiliated).map((o) => o.name);

  return (
    <>
      <header className="top">
        <div>
          <div className="eyebrow">Opieka 24h · Polska → Niemcy</div>
          <h1>Stawki Agencji</h1>
          <p className="lede">
            Porównaj stawki agencji opiekuńczych w Niemczech: ile płacą na rękę, jaką umowę oferują, czy opłacają
            dojazd i składki oraz jakie wsparcie dają na miejscu. Zestaw do trzech agencji obok siebie.
          </p>
          {affiliated.length > 0 && (
            <p className="disclosure">
              Porównywarkę prowadzi była opiekunka, dziś dyrektorka oddziału {affiliated.join(", ")}. Wszystkie
              agencje porównuję według tych samych zasad i źródeł.
            </p>
          )}
          <div className="cta">
            <a className="btn" href="/zglos-agencje">Zgłoś agencję</a>
            <span>Znasz agencję, której tu brakuje?</span>
          </div>
        </div>
        <div className="stats" aria-live="polite">
          <div className="stat"><b>{offers.length}</b><span>agencji w bazie</span></div>
          <div className="stat pay">
            <b>{stats ? `${eur(stats.min)} – ${eur(stats.max)}` : "–"}</b>
            <span>{stats ? `widełki / mies. (${stats.count} agencji podaje stawkę)` : "widełki / mies."}</span>
          </div>
          <div className="stat"><b>{stats ? eur(stats.median) : "–"}</b><span>mediana górnej stawki</span></div>
        </div>
      </header>

      <div className="layout">
        <aside className="filters" aria-label="Filtry">
          <fieldset>
            <legend>Chcę zarabiać co najmniej</legend>
            <input type="range" id="f-min" min={1000} max={3000} step={50} value={f.min}
              onChange={(e) => update({ min: Number(e.target.value) })} aria-describedby="f-minval" />
            <span className="rangeval" id="f-minval">{eur(f.min)} / mies.</span>
            <label className="chk">
              <input type="checkbox" id="f-nopay" checked={f.showNoPay} disabled={f.min > SCALE[0]}
                onChange={(e) => update({ showNoPay: e.target.checked })} />
              Pokaż agencje bez podanej stawki
            </label>
          </fieldset>
          <fieldset>
            <legend>Mój niemiecki</legend>
            <select id="f-german" value={f.german} onChange={(e) => update({ german: Number(e.target.value) })}>
              {[3, 2, 1, 0].map((g) => <option key={g} value={g}>{GERMAN[g]}</option>)}
            </select>
          </fieldset>
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
            {!allContracts && <p className="hint">Ukryte są też agencje, które nie podają formy umowy.</p>}
          </fieldset>
          {CATEGORIES.map((c) => (
            <fieldset key={c.label}>
              <legend>{c.label}</legend>
              {c.toggles.map(([k, label]) => (
                <label className="chk" key={k}>
                  <input type="checkbox" id={`f-${k}`} checked={f[k]} onChange={(e) => update({ [k]: e.target.checked })} /> {label}
                </label>
              ))}
            </fieldset>
          ))}
          <button className="ghost" type="button" onClick={() => update(DEFAULT_FILTERS)}>Wyczyść filtry</button>
        </aside>

        <main>
          <div className="listhead">
            <span className="count">{visible.length} z {offers.length} agencji</span>
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
              <div className="empty"><h3>Baza ofert jest pusta</h3><p>Oferty agencji pojawią się tu wkrótce. Znasz agencję? <a href="/zglos-agencje">Zgłoś ją</a>.</p></div>
            ) : !visible.length ? (
              <div className="empty"><h3>Żadna agencja nie spełnia filtrów</h3><p>Odznacz część filtrów albo obniż minimalną stawkę.</p><p><button type="button" onClick={() => update(DEFAULT_FILTERS)}>Wyczyść filtry</button></p></div>
            ) : (
              visible.map((o) => (
                <OfferCard key={o.id} o={o} reviews={reviewsOf.get(o.id) ?? []} minLine={f.min} selected={selected.includes(o.id)}
                  compareDisabled={!selected.includes(o.id) && selected.length >= 3}
                  onCompare={() => toggleCompare(o.id)} />
              ))
            )}
          </div>
        </main>
      </div>

      {compared.length >= 2 && <CompareTable offers={compared} reviewsOf={reviewsOf} onClear={() => setSelected([])} />}
    </>
  );
}

function Sources({ o }: { o: Offer }) {
  const links = sourceLinks(o.source);
  if (!links.length) return <>{o.verified || "—"}</>;
  return (
    <>
      {o.verified && <span className="num">{o.verified} · </span>}
      {links.map((u, i) => (
        <span key={u}>{i > 0 && ", "}<a href={u} target="_blank" rel="noopener nofollow">źródło {links.length > 1 ? i + 1 : ""}</a></span>
      ))}
    </>
  );
}

function ReportButton({ id }: { id: number }) {
  const [done, setDone] = useState(false);
  if (done) return <span>Dziękujemy, sprawdzimy tę opinię.</span>;
  return (
    <form action={async (fd) => { await flagReview(fd); setDone(true); }}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="linkbtn">Zgłoś naruszenie</button>
    </form>
  );
}

function Reviews({ o, reviews }: { o: Offer; reviews: Review[] }) {
  return (
    <details className="more">
      <summary>Opinie opiekunek ({reviews.length})</summary>
      <div className="reviews">
        {reviews.map((r) => (
          <div className="review" key={r.id}>
            <div className="by"><span className="stars" aria-label={`Ocena ${r.rating} z 5`}>{stars(r.rating)}</span>
              <b>{r.nickname || "Opiekunka"}</b>{r.worked && <span>pracowała: {r.worked}</span>}<span className="num">{r.date}</span></div>
            <p>{r.body}</p>
            <div className="by"><ReportButton id={r.id} /></div>
          </div>
        ))}
        {!reviews.length && <p className="note">Nikt jeszcze nie ocenił tej agencji.</p>}
        <p className="note">
          Opinie sprawdzamy przed publikacją według <a href="/regulamin">regulaminu</a>, tak samo dla każdej agencji. Autorki
          oświadczają, że opisują własne doświadczenie, ale nie możemy potwierdzić, że pracowały z agencją.
          {o.affiliated && " Autorka serwisu pracuje w tej agencji."}
        </p>
        <p><a className="btn" href={`/opinia?agencja=${o.id}`}>Dodaj opinię</a></p>
      </div>
    </details>
  );
}

function OfferCard({ o, reviews, minLine, selected, compareDisabled, onCompare }: {
  o: Offer; reviews: Review[]; minLine: number; selected: boolean; compareDisabled: boolean; onCompare: () => void;
}) {
  const pay = payLabel(o);
  const from = o.payMin ?? o.payMax, to = o.payMax ?? o.payMin;
  return (
    <article className={`offer${selected ? " sel" : ""}`}>
      <div className="orow">
        <div className="ohead">
          <div className="oname">
            <h3>{o.name}</h3>
            {o.promoted && <span className="chip promo">Oferta promowana</span>}
            {o.affiliated && <span className="chip promo">Tu pracuje autorka serwisu</span>}
            {o.example && <span className="chip ex">Przykład</span>}
            {o.website && <a href={o.website} target="_blank" rel="noopener nofollow">{host(o.website)}</a>}
          </div>
          {reviews.length > 0 && (
            <div className="rating"><span className="stars" aria-hidden="true">★</span>
              <b>{avg(reviews).toFixed(1).replace(".", ",")}</b><span>({opinions(reviews.length)})</span></div>
          )}
          {(o.description || o.city) && (
            <p className="note">{o.description}{o.city && !o.description.includes(o.city) ? ` Siedziba: ${o.city}.` : ""}</p>
          )}
          <div className="chips">
            {o.contracts.length
              ? o.contracts.map((c) => <span className="chip" key={c}>{CONTRACTS[c]}</span>)
              : <span className="chip no">Umowa: brak informacji</span>}
            {o.travel && <span className="chip ok">Dojazd zapewniony</span>}
            {o.zusAvg ? <span className="chip ok">ZUS od średniej krajowej</span> : o.a1 && <span className="chip ok">Składki opłacane</span>}
            {o.bonus && <span className="chip ok">Premie / dodatki</span>}
          </div>
        </div>
        <div className={`paybig num${pay ? "" : " nopay"}`}>
          {pay ?? "Brak stawki"}
          <small>{pay ? "na miesiąc" : /\d.*€/.test(o.payNote) ? "miesięcznej – zob. niżej" : "agencja nie podaje"}</small>
        </div>
      </div>
      <div className="bar" role="img" aria-label={pay ? `Stawka ${pay}` : "Agencja nie podaje stawki"}>
        {from !== null && to !== null && (
          <i style={{ left: `${pct(from)}%`, width: `${Math.max(1.5, pct(to) - pct(from))}%` }} />
        )}
        <span className="tick" style={{ left: `${pct(minLine)}%` }} />
      </div>
      {o.payNote && <p className="note paynote">Według źródła: {o.payNote}</p>}
      <details className="more">
        <summary>Warunki, wsparcie i źródła</summary>
        <dl className="meta wide">
          {DETAIL_KEYS.map((k) => (
            <div key={k}><dt>{DETAILS[k]}</dt><dd className={o[k] ? undefined : "muted"}>{o[k] || NO_INFO}</dd></div>
          ))}
          {o.german !== null && <div><dt>Niemiecki od</dt><dd>{GERMAN[o.german]}</dd></div>}
          {o.rotation && <div><dt>Turnus</dt><dd>{o.rotation}</dd></div>}
          <div><dt>Sprawdzono</dt><dd><Sources o={o} /></dd></div>
        </dl>
        {o.notes && <p className="note">{o.notes}</p>}
      </details>
      <Reviews o={o} reviews={reviews} />
      <div className="oactions">
        {o.applyUrl && (
          <a className="btn primary" href={o.applyUrl} target="_blank" rel="noopener nofollow">Aplikuj na stronie agencji ↗</a>
        )}
        <button type="button" onClick={onCompare} disabled={compareDisabled}>
          {selected ? "Usuń z porównania" : "Porównaj"}
        </button>
      </div>
    </article>
  );
}

function CompareTable({ offers, reviewsOf, onClear }: { offers: Offer[]; reviewsOf: Map<number, Review[]>; onClear: () => void }) {
  const paid = offers.filter(hasPay);
  const bestTop = paid.length ? Math.max(...paid.map(top)) : null;
  const text = (v: string) => v || <span className="muted">{NO_INFO}</span>;
  const rows: [string, (o: Offer) => React.ReactNode, ((o: Offer) => boolean)?][] = [
    ["Stawka / mies.", (o) => <span className="num">{payLabel(o) ?? <span className="muted">Nie podaje</span>}</span>, (o) => hasPay(o) && top(o) === bestTop],
    ["Według źródła", (o) => text(o.payNote)],
    ["Umowa", (o) => text(o.contractNote || o.contracts.map((c) => CONTRACTS[c]).join(", "))],
    ...DETAIL_KEYS.filter((k) => k !== "contractNote").map((k): [string, (o: Offer) => React.ReactNode] => [DETAILS[k], (o) => text(o[k])]),
    ["Niemiecki od", (o) => (o.german !== null ? GERMAN[o.german] : text(""))],
    ["Opinie", (o) => {
      const rs = reviewsOf.get(o.id) ?? [];
      return rs.length ? <span><span className="stars">★</span> {avg(rs).toFixed(1).replace(".", ",")} ({opinions(rs.length)})</span> : text("");
    }],
    ["Sprawdzono", (o) => <Sources o={o} />],
  ];
  return (
    <section id="compare">
      <div className="listhead">
        <h2>Porównanie</h2>
        <button className="ghost" type="button" onClick={onClear}>Wyczyść porównanie</button>
      </div>
      <div className="cmpwrap">
        <table className={`cols-${offers.length}`}>
          <thead><tr><th />{offers.map((o) => <th scope="col" key={o.id} className="colhead">{o.name}{o.affiliated && <div className="note">tu pracuje autorka serwisu</div>}</th>)}</tr></thead>
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
