import Comparator from "@/components/Comparator";
import AskAgency from "@/components/AskAgency";
import ContractGuide from "@/components/ContractGuide";
import { listPublishedOffers } from "@/lib/offers";

// Oferty czytane przy każdym żądaniu, żeby zmiany z panelu były widoczne od razu.
export const dynamic = "force-dynamic";

export default async function Home() {
  const offers = await listPublishedOffers();
  return (
    <>
      <Comparator offers={offers} />
      <AskAgency />
      <ContractGuide />
    </>
  );
}
