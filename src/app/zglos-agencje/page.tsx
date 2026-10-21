import type { Metadata } from "next";
import { sign } from "@/lib/auth";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Zgłoś agencję",
  description: "Znasz agencję delegującą opiekunki do Niemiec? Zgłoś jej warunki: stawkę, umowę, transport i wsparcie.",
};
export const dynamic = "force-dynamic";

export default function SubmitPage() {
  // Podpisany czas wyświetlenia formularza – odsiewa boty, które wysyłają go natychmiast.
  const ts = String(Date.now());
  return (
    <div className="submitpage">
      <div className="eyebrow">Pomóż innym opiekunkom</div>
      <h1>Zgłoś agencję</h1>
      <p className="lede">
        Znasz agencję, której nie ma w porównywarce, albo masz aktualne informacje o warunkach? Wypełnij to, co wiesz.
        Wymagana jest tylko nazwa agencji. Każde zgłoszenie sprawdzamy przed publikacją.
      </p>
      <SubmitForm token={`${ts}.${sign("form:" + ts)}`} />
    </div>
  );
}
