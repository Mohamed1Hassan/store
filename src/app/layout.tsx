import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cairo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/data/site";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: "swap",
});

const playfair = cairo;

const TITLE = `${SITE_NAME} | Al-Sultan Luxury Living`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "مراتب طبية",
    "مراتب بوكيت سبرينج",
    "ستائر فاخرة",
    "ستائر بلاك أوت",
    "كافر مراتب",
    "واقي مراتب ضد المياه",
    "مفروشات فندقية",
    "وسائد طبية",
    "تفصيل ستائر",
    "مفروشات السلطان",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "/",
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
};
export const viewport: Viewport = {
  themeColor: "#07090e",
};


const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  "@id": `${SITE_URL}/#store`,
  name: SITE_NAME,
  alternateName: "Al-Sultan Luxury Living",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: "+201055280865",
  priceRange: "EGP",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    opens: "10:00",
    closes: "23:00",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#07090e] text-[#f4efe6] antialiased selection:bg-[#d4af37]/30 selection:text-[#ffd700] overflow-x-hidden font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
