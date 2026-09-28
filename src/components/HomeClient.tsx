"use client";

import { useState } from "react";
import {
  ChevronLeft,
  Crown,
  Layers,
  Phone,
  Scissors,
  ShieldCheck,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import MattressSection from "@/components/MattressSection";
import CurtainSection from "@/components/CurtainSection";
import ProtectorSection from "@/components/ProtectorSection";
import PillowsSection from "@/components/PillowsSection";
import ProductsGrid from "@/components/ProductsGrid";
import Testimonials from "@/components/Testimonials";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import CinematicSuiteBanner from "@/components/CinematicSuiteBanner";
import PromoCountdownBar from "@/components/PromoCountdownBar";
import dynamic from "next/dynamic";
import type { Product } from "@/data/products";

const OrderForm = dynamic(() => import("@/components/OrderForm"), { ssr: false });
const WhatsAppFloatButton = dynamic(() => import("@/components/WhatsAppFloatButton"), { ssr: false });
const CartDrawer = dynamic(() => import("@/components/CartDrawer"), { ssr: false });
const AnalyticsListener = dynamic(() => import("@/components/AnalyticsListener"), { ssr: false });

import { DEFAULT_ORDER_MESSAGE, whatsappLink } from "@/data/site";
import type { CategoryId } from "@/data/products";

const HERO_FEATURES = [
  { icon: ShieldCheck, label: "ضمان استبدال 10 سنوات", iconClass: "text-[#ffd700]" },
  { icon: Scissors, label: "تفصيل فوري لجميع المقاسات", iconClass: "text-[#ffd700]" },
  { icon: Layers, label: "شاسيه منفصل بوكيت سبرينج", iconClass: "text-[#ffd700]" },
  { icon: Star, label: "خامات فندقية 7 نجوم", iconClass: "text-[#ffd700] fill-[#ffd700]" },
];

const WHATSAPP_LINK = whatsappLink(DEFAULT_ORDER_MESSAGE);

export default function HomeClient({ products }: { products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("room");

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectCategory = (cat: CategoryId) => {
    setActiveCategory(cat);

    if (cat === "curtains") {
      scrollToSection("curtains-section");
    } else if (cat === "pillows") {
      scrollToSection("pillows-section");
    } else if (cat === "specs") {
      scrollToSection("protector-section");
    } else if (cat === "room") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      scrollToSection("mattress-section");
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-clip bg-[#07090e] text-[#f4efe6]">
      <AnalyticsListener />
      <div className="sticky top-0 z-50">
        <PromoCountdownBar />
        <Navbar onSelectCategory={handleSelectCategory} activeCategory={activeCategory} />
      </div>

      {/* ══ HERO · full-bleed cinematic film with the copy layered on top ══ */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-36 pt-28 lg:pb-40 lg:pt-32">
        {/* Full-bleed film (edges dissolve into the page) + media bar */}
        <CinematicSuiteBanner />

        {/* Copy */}
        <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto w-full max-w-2xl space-y-6">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0b0f18]/55 px-4 py-1.5 text-xs font-bold text-[#ffd700] backdrop-blur-md">
              <Crown className="h-4 w-4 text-[#ffd700]" />
              <span>الاسم الأول في عالم الفخامة والراحة الملكية</span>
            </div>

            <h1 className="font-serif text-4xl font-black leading-[1.15] tracking-tight drop-shadow-[0_6px_28px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl">
              السلطان <br />
              <span className="gold-gradient-text">للمفروشات والستائر</span> <br />
              <span className="font-sans text-2xl font-bold text-zinc-200 sm:text-3xl">
                وكافر المراتب الطبية
              </span>
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-200 drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)] sm:text-base">
              نصنع لك أرقى غرف النوم الملكية بتوليفة استثنائية من المراتب الطبية بنوابض منفصلة، والستائر الفاخرة المفصلة على مقاسك، والمفروشات الفندقية الحريرية.
            </p>

            <div className="grid w-full max-w-lg grid-cols-1 gap-2.5 pt-1 sm:grid-cols-2">
              {HERO_FEATURES.map(({ icon: Icon, label, iconClass }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition duration-300 hover:border-[#d4af37]/40 hover:bg-white/10"
                >
                  <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
                  <span className="text-xs font-semibold text-zinc-100">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex w-full flex-wrap items-center gap-3 pt-2">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                data-track="hero-cta"
                className="flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] px-7 py-3.5 text-sm font-black text-[#07090e] shadow-xl shadow-black/40 transition-all hover:scale-[1.03] hover:shadow-[#d4af37]/40 active:scale-[0.98]"
              >
                <Phone className="h-4 w-4 fill-current" />
                <span>تواصل واطلب مقاسك الآن</span>
              </a>

              <button
                type="button"
                onClick={() => scrollToSection("mattress-section")}
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-bold text-zinc-100 backdrop-blur-md transition-all hover:border-[#d4af37]/50 hover:bg-white/10 hover:text-[#ffd700]"
              >
                <span>استكشف المواصفات</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-7 z-20 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={() => scrollToSection("mattress-section")}
            aria-label="انتقل إلى مواصفات المراتب"
            className="pointer-events-auto flex flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c8aa6e]/80 transition hover:text-[#ffd700]"
          >
            <span>اكتشف المزيد</span>
            <span aria-hidden className="h-8 w-px animate-pulse-slow bg-gradient-to-b from-transparent via-[#d4af37]/70 to-transparent" />
          </button>
        </div>
      </section>

      {/* DETAILED MATTRESS ANATOMY SECTION */}
      <div id="mattress-section">
        <MattressSection />
      </div>

      {/* CURTAIN FABRIC & BESPOKE TAILORING SECTION */}
      <div id="curtains-section">
        <CurtainSection products={products} />
      </div>

      {/* MATTRESS PROTECTOR SECTION (كافر المراتب) */}
      <ProtectorSection product={products.find((p) => p.id === "medical-mattress-protector")} />

      {/* PILLOWS & BEDDING SECTION */}
      <PillowsSection product={products.find((p) => p.id === "hotel-pillow-suite")} />

      {/* FULL PRODUCTS CATALOG */}
      <ProductsGrid products={products} />

      {/* CUSTOMER TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <FaqSection />

      {/* ORDER FORM */}
      <OrderForm products={products} />


      {/* FOOTER */}
      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />

    </main>
  );
}
