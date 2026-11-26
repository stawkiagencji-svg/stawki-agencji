import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return ["", "/zglos-agencje", "/cennik", "/jak-tworzymy-ranking", "/regulamin", "/polityka-prywatnosci", "/regulamin-agencji"].map((p) => ({ url: base + p }));
}
