import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["", "/jak-tworzymy-ranking", "/regulamin", "/polityka-prywatnosci"].map((p) => ({ url: base + p }));
}
