const GUIDE = [
  {
    title: "Umowa zlecenie",
    lead: "Najczęstsza forma w delegowaniu. Składki płacone w Polsce, za granicą chroni Cię zaświadczenie A1.",
    plus: ["Wyższa kwota „na rękę”", "Elastyczne turnusy"],
    minus: ["Brak płatnego urlopu", "Składki często liczone od niskiej podstawy, więc niższa emerytura"],
  },
  {
    title: "Umowa o pracę",
    lead: "Delegowanie pracownika z polskiej firmy. Pełne prawa pracownicze z Kodeksu pracy.",
    plus: ["Urlop, L4, staż pracy", "Pełne składki emerytalne"],
    minus: ["Zwykle niższa stawka netto", "Mniej swobody przy zmianie turnusu"],
  },
  {
    title: "Działalność gospodarcza (B2B)",
    lead: "Sama lub sam wystawiasz faktury agencji lub rodzinie. Wymaga własnej firmy i rozliczeń.",
    plus: ["Najwyższe stawki brutto", "Sama lub sam wybierasz zlecenia"],
    minus: ["ZUS i podatek po Twojej stronie", "Ryzyko uznania za pozorne samozatrudnienie"],
  },
  {
    title: "Umowa niemiecka",
    lead: "Zatrudnienie bezpośrednio u niemieckiego pracodawcy. Obowiązuje płaca minimalna 13,90 €/h (2026).",
    plus: ["Niemiecka ochrona pracownicza", "Składki w Niemczech"],
    minus: ["Podatek wg klasy podatkowej", "Zwykle wymagany dobry niemiecki"],
  },
];

export default function ContractGuide() {
  return (
    <section className="guide">
      <div className="eyebrow">Zanim podpiszesz</div>
      <h2>Czym różnią się formy umów</h2>
      <div className="grid">
        {GUIDE.map((g) => (
          <div className="gcard" key={g.title}>
            <h3>{g.title}</h3>
            <p className="note">{g.lead}</p>
            <ul>
              {g.plus.map((p) => <li className="plus" key={p}>{p}</li>)}
              {g.minus.map((m) => <li className="minus" key={m}>{m}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="disclaimer">
        Stawki w porównywarce to kwoty orientacyjne netto za miesiąc pracy (turnus przeliczony na 30 dni), zebrane z
        ogłoszeń i od agencji, z datą weryfikacji przy każdej ofercie. Ostateczna kwota zależy od liczby podopiecznych,
        nocnych pobudek, prawa jazdy i znajomości języka. Zawsze poproś agencję o pisemną ofertę z kwotą brutto, formą
        umowy i informacją o składkach.
      </p>
    </section>
  );
}
