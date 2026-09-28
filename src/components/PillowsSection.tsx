import { BadgeCheck, Check, Feather, Phone, ShieldCheck, Star } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { whatsappLink } from "@/data/site";
import type { Product } from "@/data/products";
import type { SiteContent } from "@/schemas/site-content";

/** أيقونة لكل ميزة في نفس ترتيب المميزات داخل الكتالوج */
const FEATURE_ICONS = [Feather, Star, ShieldCheck, BadgeCheck];

interface Props {
  product?: Product;
  pillowsContent?: SiteContent["pillows"];
}

export default function PillowsSection({ product, pillowsContent }: Props) {
  const pillows = product;

  if (!pillows) return null;

  const badge = pillowsContent?.badge || "نوم فندقي 7 نجوم";
  const title = pillowsContent?.title || "مفروشات ووسائد";
  const accent = pillowsContent?.accent || "النخبة الفاخرة";
  const ctaText = pillowsContent?.ctaText || "اطلب طقم الوسائد الآن";
  const highlights =
    pillowsContent?.highlights && pillowsContent.highlights.length > 0
      ? pillowsContent.highlights
      : ["قطن مصري 100%", "مضادة للبكتيريا", "تفصيل حسب المقاس"];

  const orderLink = whatsappLink(
    `مرحباً مفروشات السلطان، أود الاستفسار عن ${pillows.name} (السعر: ${pillows.price})`
  );

  return (
    <section id="pillows-section" className="py-20 relative overflow-hidden bg-[#07090e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Feather}
          badge={badge}
          title={title}
          accent={accent}
          description={pillows.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Price panel */}
          <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-br from-[#101522] to-[#0a0d16] p-6 md:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 px-2.5 py-1 rounded-full mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              {pillows.tag}
            </span>

            <h3 className="text-xl md:text-2xl font-black text-white font-serif mb-4 leading-snug">
              {pillows.name}
            </h3>

            <div className="flex flex-wrap items-end gap-3 mb-6">
              <span className="text-3xl font-black text-[#ffd700]">{pillows.price}</span>
              {pillows.originalPrice && (
                <span className="text-sm text-zinc-300 line-through mb-1">
                  {pillows.originalPrice}
                </span>
              )}
              {pillows.savingLabel && (
                <span className="text-[11px] font-bold text-emerald-400 mb-1">
                  توفير {pillows.savingLabel}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-zinc-200 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full"
                >
                  <Check className="w-3 h-3 text-[#ffd700]" />
                  {highlight}
                </span>
              ))}
            </div>

            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-black text-sm text-center shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>{ctaText}</span>
            </a>
          </div>

          {/* Features */}
          <div className="order-1 lg:order-2 lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillows.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? Check;
              return (
                <div
                  key={feature}
                  className="p-5 rounded-2xl bg-[#0b0e17] border border-white/5 hover:border-[#d4af37]/40 hover:bg-[#0e121c] transition-colors duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 leading-relaxed">{feature}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
