import { BadgeCheck, MapPin, Quote, Ruler, ShieldCheck, Star, Truck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { RATING_SUMMARY, TESTIMONIALS } from "@/data/testimonials";

const TRUST_CHIPS = [
  { icon: ShieldCheck, label: "ضمان استبدال 10 سنوات" },
  { icon: Truck, label: "توصيل وتركيب للمحافظات" },
  { icon: Ruler, label: "تفصيل على المقاس" },
];

export default function Testimonials() {
  return (
    <section id="testimonials-section" className="py-20 bg-[#07090e] relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-0 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Quote}
          badge="آراء عملاء المعرض"
          title="ثقة"
          accent="نعتز بها"
          description="آراء من عملاء جهّزوا غرف نومهم وصالوناتهم من مفروشات ومراتب وستائر السلطان."
        />

        {/* Rating summary */}
        <div className="mb-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#141926] via-[#10141f] to-[#141926] border border-[#d4af37]/30 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black text-[#ffd700] font-serif">
              {RATING_SUMMARY.average}
            </span>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
                ))}
              </div>
              <p className="text-xs text-zinc-400">
                من {RATING_SUMMARY.count} تقييم · {RATING_SUMMARY.label}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {TRUST_CHIPS.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 text-[11px] font-semibold text-zinc-200 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
              >
                <Icon className="w-3.5 h-3.5 text-[#ffd700]" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col p-6 rounded-3xl bg-[#0b0e17] border border-white/5 hover:border-[#d4af37]/40 hover:bg-[#0e121c] transition-all duration-300"
            >
              <Quote className="w-7 h-7 text-[#d4af37]/60 mb-4" />

              <div className="flex items-center gap-1 mb-3" aria-label={`تقييم ${item.rating} من 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < item.rating ? "text-[#ffd700] fill-[#ffd700]" : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-sm text-zinc-300 leading-relaxed mb-5">
                “{item.text}”
              </blockquote>

              <figcaption className="mt-auto pt-4 border-t border-white/10">
                <span className="block text-sm font-bold text-white">{item.name}</span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-500 mt-1">
                  <MapPin className="w-3 h-3" />
                  {item.city}
                </span>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/25 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3 h-3" />
                  {item.purchase}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
