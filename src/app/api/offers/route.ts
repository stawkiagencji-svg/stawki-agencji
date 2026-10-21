import { listPublishedOffers } from "@/lib/offers";

export const dynamic = "force-dynamic";

// Publiczne API (tylko odczyt), np. dla przyszłej aplikacji mobilnej.
export async function GET() {
  const offers = await listPublishedOffers();
  return Response.json({ offers }, { headers: { "Cache-Control": "public, max-age=60" } });
}
