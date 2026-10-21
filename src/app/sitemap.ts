import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return ["", "/zglos-agencje", "/jak-tworzymy-ranking", "/regulamin", "/polityka-prywatnosci"].map((p) => ({ url: base + p }));
}
