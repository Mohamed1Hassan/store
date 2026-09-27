"use client";

import { useState } from "react";
import { Crown, Layers, Phone } from "lucide-react";
import { whatsappLink } from "@/data/site";
import { MATTRESS_LAYERS, MATTRESS_MODEL, MATTRESS_SPECS } from "@/data/mattress";

const MATTRESS_ORDER_LINK = whatsappLink(
  "مرحباً مفروشات السلطان، أود الاستفسار عن مرتبة السلطان رويال بوكيت والكافر المجاني معها"
);

export default function MattressSection() {
  const [activeLayer, setActiveLayer] = useState(0);

  return (
    <section className="py-20 relative bg-[#090d16] border-b border-[#d4af37]/20">
      {/* Soft top glow so the full-bleed hero film flows straight into this section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-40"
        style={{
          background:
            "linear-gradient(to bottom, rgba(7,9,14,0.95) 0%, rgba(7,9,14,0.35) 45%, rgba(9,13,22,0) 100%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffd700] text-xs font-bold mb-4">
            <Crown className="w-3.5 h-3.5" /> هندسة النوم الملكي
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-serif mb-4 leading-tight">
            مراتب <span className="gold-gradient-text">السلطان الطبية</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
            صُممت بعناية فائقة لتمنحك نوماً هنيئاً وراحة لا تضاهى. هيكل مدعم بنوابض منفصلة وتقنيات العزل الحراري المتقدمة.
          </p>
        </div>

        {/* Mattress Anatomical Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Layers */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#ffd700]" />
              طبقات المرتبة من الداخل للخارج:
            </h3>

            {MATTRESS_LAYERS.map((layer, idx) => {
              const isSelected = activeLayer === idx;
              return (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setActiveLayer(idx)}
                  aria-pressed={isSelected}
                  className={`w-full text-right p-4 rounded-2xl cursor-pointer border transition-all duration-300 ${
                    isSelected
                      ? "bg-[#131929] border-[#d4af37] shadow-xl shadow-[#d4af37]/15 scale-[1.02]"
                      : "bg-[#0b0e17] border-white/5 hover:border-white/20 hover:bg-[#0f1422]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-extrabold text-[#ffd700]">
                      {layer.tag}
                    </span>
                    <span className="text-xs text-zinc-300 font-mono">0{idx + 1}</span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {layer.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {layer.desc}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Card */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#121828] to-[#0a0d16] p-6 md:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs text-[#c8aa6e] font-semibold block">{MATTRESS_MODEL.eyebrow}</span>
                <h3 className="text-2xl font-black text-white font-serif">{MATTRESS_MODEL.name}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 block line-through">{MATTRESS_MODEL.oldPrice}</span>
                <span className="text-2xl font-black text-[#ffd700]">{MATTRESS_MODEL.price}</span>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {MATTRESS_SPECS.map((feat, i) => (
                <div key={i} className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">{feat.label}</span>
                  <span className="text-xs font-bold text-zinc-100">{feat.val}</span>
                </div>
              ))}
            </div>

            {/* Mattress Protector (كافر المراتب) */}
            <div className="p-4 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-black flex items-center justify-center font-black">
                  هدية
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">كافر وواقي مرتبة ضد السوائل والمياه مجاناً</h4>
                  <p className="text-xs text-zinc-400">طبقة عازلة بتقنية TPU تنفسية قطنية 100% مع كل مرتبة</p>
                </div>
              </div>
              <a
                href={MATTRESS_ORDER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-4 py-2 rounded-xl bg-[#d4af37] hover:bg-[#ffd700] text-black font-bold text-xs transition flex items-center gap-1.5"
              >
                <span>اطلب الآن مع الكافر المجاني</span>
                <Phone className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
