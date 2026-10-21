// Lista pytań do agencji. Pierwsze (o podstawę ZUS) opiekunki zadają najczęściej.
const QUESTIONS: [string, string][] = [["Od jakiej kwoty liczycie składki ZUS?", "Od najniższej krajowej czy od średniej? To decyduje o Twojej przyszłej emeryturze i chorobowym."], ["Ile dostanę na rękę za miesiąc i od czego to zależy?", "Poproś o kwotę netto na piśmie, z informacją, czy obejmuje premie."], ["Kto płaci za dojazd i co, jeśli wrócę wcześniej?", "Zapytaj, czy przy skróceniu zlecenia nie potrącą Ci kosztów transportu."], ["Czy umowa ma kary umowne?", "Sprawdź, za co i ile możesz zapłacić, jeśli zrezygnujesz."], ["Kto mi pomoże na miejscu?", "Czy jest koordynator po polsku, pod jakim numerem i w jakich godzinach."], ["Ile mam czasu wolnego i jakie są noce?", "Przerwy w ciągu dnia, dzień wolny w tygodniu, nocne wstawanie do podopiecznego."]];

export default function AskAgency() {
  return (
    <section className="ask">
      <div className="eyebrow">Zanim podpiszesz</div>
      <h2>O co zapytać agencję</h2>
      <ol>
        {QUESTIONS.map(([q, a]) => (
          <li key={q}><b>{q}</b><span>{a}</span></li>
        ))}
      </ol>
      <p className="example">
        Przykład na 2026 rok: składka emerytalna to 19,52% podstawy. Od najniższej krajowej (4 806 zł) na Twoje konto emerytalne trafia ok. 938 zł miesięcznie, a od prognozowanego przeciętnego wynagrodzenia (9 420 zł) ok. 1 839 zł. To około 900 zł więcej na emeryturę za każdy przepracowany miesiąc.
      </p>
    </section>
  );
}
