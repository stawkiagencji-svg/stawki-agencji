import type { Metadata } from "next";
import Link from "next/link";
import { sign } from "@/lib/auth";
import { getOffer } from "@/lib/offers";
import ReviewForm from "./ReviewForm";

export const metadata: Metadata = { title: "Dodaj opinię o agencji", robots: { index: false, follow: true } };
export const dynamic = "force-dynamic";

export default async function ReviewPage({ searchParams }: { searchParams: Promise<{ agencja?: string }> }) {
  const offer = await getOffer(Number((await searchParams).agencja) || 0);
  if (!offer?.published) {
    return (
      <div className="submitpage">
        <h1>Nie znaleziono agencji</h1>
        <p><Link href="/">Wróć do porównywarki</Link> i kliknij „Dodaj opinię” przy wybranej agencji.</p>
      </div>
    );
  }
  // Podpisany czas wyświetlenia formularza – odsiewa boty, które wysyłają go natychmiast.
  const ts = String(Date.now());
  return (
    <div className="submitpage">
      <div className="eyebrow">Pomóż innym opiekunkom</div>
      <h1>Opinia o agencji {offer.name}</h1>
      <p className="lede">
        Napisz, jak wyglądała współpraca: wypłaty na czas, kontakt z koordynatorką, zgodność warunków z umową, dojazd.
        Każdą opinię czytamy przed publikacją. Na stronie pokażemy tylko podpis, który wpiszesz.
      </p>
      {offer.affiliated && (
        <p className="disclosure">
          Autorka serwisu pracuje w tej agencji. Opinie o niej sprawdzamy według tych samych zasad co wszystkie inne.
        </p>
      )}
      <ReviewForm offerId={offer.id} token={`${ts}.${sign("review:" + ts)}`} />
    </div>
  );
}
