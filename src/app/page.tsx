import Comparator from "@/components/Comparator";
import ContractGuide from "@/components/ContractGuide";
import { listOffers } from "@/lib/offers";

// Oferty czytane przy każdym żądaniu, żeby zmiany z panelu były widoczne od razu.
export const dynamic = "force-dynamic";

export default async function Home() {
  const offers = await listOffers();
  return (
    <>
      <Comparator offers={offers} />
      <ContractGuide />
    </>
  );
}
