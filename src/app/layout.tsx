import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], weight: ["600", "800"], variable: "--font-display" });
const body = Source_Sans_3({ subsets: ["latin", "latin-ext"], weight: ["400", "600", "700"], variable: "--font-body" });
const mono = IBM_Plex_Mono({ subsets: ["latin", "latin-ext"], weight: ["500"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Stawki Agencji – porównaj stawki agencji opiekuńczych w Niemczech", template: "%s · Stawki Agencji" },
  description:
    "Porównaj polskie agencje delegujące opiekunki osób starszych do Niemiec: formy umów, wypłaty netto, turnusy, zwrot za dojazd i wymagany niemiecki.",
  openGraph: { type: "website", locale: "pl_PL" },
  icons: { icon: "/icons/icon-192.png", apple: "/icons/apple-touch-icon.png" },
};

export const viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#2448b8" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <ServiceWorker />
        <div className="wrap">
          {children}
          <footer className="site">
            <nav aria-label="Informacje">
              <Link href="/zglos-agencje">Zgłoś agencję</Link>
              <Link href="/jak-tworzymy-ranking">Jak tworzymy ranking</Link>
              <Link href="/regulamin">Regulamin</Link>
              <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
            </nav>
            <p>Dane mają charakter informacyjny i nie stanowią oferty pracy. Zawsze potwierdź warunki bezpośrednio u agencji.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
