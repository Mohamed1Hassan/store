import type { Metadata } from "next";
import { Cairo, Playfair_Display } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "السلطان للمفروشات والمراتب والستائر | Al-Sultan Luxury Living",
  description: "اكتشف الفخامة والراحة الملكية مع مفروشات ومراتب وستائر السلطان. تجربة ثلاثية الأبعاد تفاعلية لأحدث التصاميم الراقية.",
  icons: {
    icon: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${playfair.variable} dark scroll-smooth`}>
      <body className="min-h-screen bg-[#07090e] text-[#f4efe6] antialiased selection:bg-[#d4af37]/30 selection:text-[#ffd700] overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}

