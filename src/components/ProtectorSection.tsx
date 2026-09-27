import { BadgeCheck, Check, Droplets, Feather, Phone, Ruler, Sparkles } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { whatsappLink } from "@/data/site";
import { PRODUCTS_CATALOG } from "@/data/products";

/** أيقونة لكل ميزة في نفس ترتيب المميزات داخل الكتالوج */
const FEATURE_ICONS = [Droplets, Feather, Ruler, Sparkles];

export default function ProtectorSection() {
  const protector = PRODUCTS_CATALOG.find((p) => p.id === "medical-mattress-protector");

  if (!protector) return null;

  const orderLink = whatsappLink(
    `مرحباً مفروشات السلطان، أود الاستفسار عن ${protector.name} (السعر: ${protector.price})`
  );

  return (
    <section
      id="protector-section"
      className="py-20 relative overflow-hidden bg-[#0b0f18] border-y border-[#d4af37]/20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-[#d4af37]/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Droplets}
          badge="حماية كاملة لمرتبتك"
          title="كافر وواقي"
          accent="المراتب ضد السوائل"
          description={protector.description}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Features */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {protector.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index] ?? Check;
              return (
                <div
                  key={feature}
                  className="p-5 rounded-2xl bg-[#0f1424] border border-white/5 hover:border-[#d4af37]/40 transition-colors duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 leading-relaxed">{feature}</p>
                </div>
              );
            })}
          </div>

          {/* Price panel */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#121828] to-[#0a0d16] p-6 md:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 px-2.5 py-1 rounded-full mb-4">
              <BadgeCheck className="w-3.5 h-3.5" />
              {protector.tag}
            </span>

            <h3 className="text-xl md:text-2xl font-black text-white font-serif mb-4 leading-snug">
              {protector.name}
            </h3>

            <div className="flex flex-wrap items-end gap-3 mb-6">
              <span className="text-3xl font-black text-[#ffd700]">{protector.price}</span>
              {protector.originalPrice && (
                <span className="text-sm text-zinc-300 line-through mb-1">
                  {protector.originalPrice}
                </span>
              )}
              {protector.savingLabel && (
                <span className="text-[11px] font-bold text-emerald-400 mb-1">
                  توفير {protector.savingLabel}
                </span>
              )}
            </div>

            <a
              href={orderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-black text-sm text-center shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>اطلب الكافر الآن</span>
            </a>

            <div className="mt-5 p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30">
              <p className="text-xs font-bold text-white mb-1">هدية مجانية مع كل مرتبة</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                يتضمن الكافر والواقي مجاناً مع أي مرتبة من مراتب السلطان الطبية.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
