import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Stawki Agencji",
    short_name: "Stawki Agencji",
    description:
      "Porównaj stawki agencji opiekuńczych w Niemczech: wypłaty na rękę, umowy, ZUS, transport i wsparcie.",
    lang: "pl",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f3f5f8",
    theme_color: "#2448b8",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      { src: "/screenshots/01-start.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Porównywarka stawek agencji" },
      { src: "/screenshots/02-oferty.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Lista agencji ze stawkami" },
      { src: "/screenshots/03-porownanie.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Porównanie agencji" },
      { src: "/screenshots/04-umowy.jpg", sizes: "1080x1920", type: "image/jpeg", form_factor: "narrow", label: "Poradnik o umowach" },
    ],
  };
}
