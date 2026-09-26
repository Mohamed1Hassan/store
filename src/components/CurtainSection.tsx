"use client";

import React, { useState } from "react";
import { Sparkles, Scissors, Sun, Shield, Check, Phone } from "lucide-react";
import type { ProductMode } from "./Scene3D";

interface CurtainSectionProps {
  onSelectMode: (mode: ProductMode) => void;
  onCurtainColorChange: (color: string) => void;
}

export default function CurtainSection({
  onSelectMode,
  onCurtainColorChange,
}: CurtainSectionProps) {
  const [selectedFabric, setSelectedFabric] = useState("velvet");

  const fabrics = [
    {
      id: "velvet",
      title: "القطيفة المخملية الثقيلة (Velvet Blackout)",
      desc: "عزل تام للضوء بنسبة 100% مع عزل صوتي وحراري فائق وانسدال ملكي جذاب.",
      colorHex: "#b8860b",
      features: ["عزل حراري وصوتي", "مانع للأشعة فوق البنفسجية", "ملمس فائق النعومة"],
    },
    {
      id: "linen",
      title: "الكتان الإسباني الطبيعي (Natural Linen)",
      desc: "طراز مودرن كلاسيك راقي، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
      colorHex: "#d4af37",
      features: ["طبيعي 100%", "مظهر عصري أنيق", "سهل الغسيل والعناية"],
    },
    {
      id: "chiffon",
      title: "الشيفون والحرير الفرنسي المهدل (Soft Sheer)",
      desc: "طبقة ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
      colorHex: "#e8d8b0",
      features: ["شفافية شمسية ناعمة", "تطريز ذهبي يدوي", "مقاوم للتجعد"],
    },
  ];

  return (
    <section className="py-20 bg-[#07090e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[#ffd700] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Scissors className="w-4 h-4" /> تفصيل وتصميم حسب المقاس
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-serif mt-2">
              ستائر <span className="gold-gradient-text">السلطان الفاخرة</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-md">
            نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن.
          </p>
        </div>

        {/* Fabrics 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fabrics.map((item) => {
            const isSelected = selectedFabric === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedFabric(item.id);
                  onCurtainColorChange(item.colorHex);
                  onSelectMode("curtains");
                }}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-[#101522] border-[#ffd700] shadow-2xl shadow-[#d4af37]/20 scale-[1.02]"
                    : "bg-[#0b0e17] border-white/5 hover:border-white/20 hover:bg-[#0e121c]"
                }`}
              >
                <div>
                  <div className="w-full h-3 rounded-full mb-4 opacity-80" style={{ backgroundColor: item.colorHex }} />
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">{item.desc}</p>

                  <div className="space-y-2 mb-6">
                    {item.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#ffd700] font-bold">
                    معاينة باللون في الـ 3D
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 group-hover:bg-[#d4af37] group-hover:text-black transition font-bold">
                    اختر القماش
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tailoring & Installation Guarantee Bar */}
        <div className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#141926] via-[#10141f] to-[#141926] border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#ffd700] shrink-0">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">خدمة المعاينة المنزلية ورفع المقاسات مجاناً</h4>
              <p className="text-xs md:text-sm text-zinc-400">
                فريقنا المتخصص يصلك بأحدث كتالوجات الأقمشة ليقيس النوافذ ويقترح أفضل تصميم يلائم صالونك وغرفتك.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/201000000000?text=أود%20حجز%20موعد%20معاينة%20مجانية%20لرفع%20مقاسات%20الستائر"
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-6 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-sm shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <Phone className="w-4 h-4 fill-current" />
            <span>احجز موعد معاينة مجاني</span>
          </a>
        </div>

      </div>
    </section>
  );
}
