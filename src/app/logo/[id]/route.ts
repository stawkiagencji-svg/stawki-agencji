import { getOfferLogo } from "@/lib/offers";

// Logo agencji z bazy. Serwujemy je sami, żeby przeglądarka opiekunki nie łączyła się z cudzymi serwerami.
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const logo = await getOfferLogo(Number((await params).id) || 0);
  if (!logo) return new Response("Nie znaleziono", { status: 404 });
  return new Response(new Uint8Array(logo.data), {
    headers: {
      "Content-Type": logo.type,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}
