import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { isIndexable } from "@/lib/site";
import "./globals.css";

// Self-hosted by next/font — no CDN request, no layout shift on load.
// Weight is omitted so the full variable axis loads (Figtree ships 300–900;
// the design's `font-weight:200` clamps to 300, exactly as in the reference).
const figtree = Figtree({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kuechenheld.de"),
  // Review deploys must stay out of search results — an indexable copy of the
  // homepage would compete with the real kuechenheld.de. Set SITE_INDEXABLE=true
  // only on the deployment that actually serves the site.
  robots: isIndexable
    ? undefined
    : { index: false, follow: false, nocache: true },
  title: "Küchenheld — Küche kaufen von zuhause aus",
  description:
    "Küche online kaufen vom Sofa aus oder vor Ort in einem unserer 8 Showrooms deutschlandweit. Kostenloses, unverbindliches Angebot mit Preisindikation.",
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Küchenheld",
    title: "Küchenheld — Küche kaufen von zuhause aus",
    description:
      "Individuell geplante Küchen, transparent und digital. Kostenloses Angebot mit Preisindikation in 24 Stunden.",
  },
};

export const viewport: Viewport = {
  themeColor: "#141312",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={figtree.variable}>
      <body>{children}</body>
    </html>
  );
}
