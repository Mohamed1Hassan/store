"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  RotateCw, 
  Palette, 
  Check, 
  Info, 
  ShieldCheck, 
  Truck, 
  Award, 
  Eye,
  Sliders
} from "lucide-react";
import confetti from "canvas-confetti";
import type { ProductMode } from "./Scene3D";
import { Product3D } from "@/data/products";


interface ControlsProps {
  currentMode: ProductMode;
  onModeChange: (mode: ProductMode) => void;
  isRotating: boolean;
  onToggleRotate: () => void;
  mattressColor: string;
  onMattressColorChange: (color: string) => void;
  curtainColor: string;
  onCurtainColorChange: (color: string) => void;
  selectedPartName: string | null;
  productsList: Product3D[];
  activeProduct: Product3D;
  onSelectProduct: (product: Product3D) => void;
}

export default function ControlsPanel({
  currentMode,
  onModeChange,
  isRotating,
  onToggleRotate,
  mattressColor,
  onMattressColorChange,
  curtainColor,
  onCurtainColorChange,
  selectedPartName,
  productsList,
  activeProduct,
  onSelectProduct,
}: ControlsProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const mattressColors = [
    { name: "أبيض ملكي كلاسيك", hex: "#f8f9fa", label: "أبيض ناصع" },
    { name: "عاجي فاخر (Ivory)", hex: "#f4ede2", label: "أوف وايت" },
    { name: "رمادي بلاتيني مريح", hex: "#ced4da", label: "بلاتيني" },
    { name: "كحلي ملكي داكن", hex: "#1a2538", label: "كحلي" },
  ];

  const curtainColors = [
    { name: "ذهبي ملكي براق", hex: "#d4af37", label: "ذهبي" },
    { name: "كحلي أندلسي مخملي", hex: "#13233e", label: "كحلي" },
    { name: "نبيتي ملكي خمري", hex: "#5a111a", label: "خمري" },
    { name: "زمردي إمبراطوري", hex: "#0f3a2c", label: "زمردي" },
  ];

  const handleOrderClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d4af37", "#ffd700", "#ffffff"],
    });
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Product Switcher Bar */}
      <div className="bg-[#0e121d]/90 backdrop-blur-md p-4 rounded-3xl border border-[#d4af37]/40 shadow-2xl">
        <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
          <span className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ffd700]" />
            اختر المنتج المعروض في المشهد 3D:
          </span>
          <span className="text-[10px] text-[#ffd700] bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full font-bold">
            {activeProduct.tag}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {productsList.map((prod) => {
            const isSelected = activeProduct.id === prod.id;
            return (
              <button
                key={prod.id}
                onClick={() => onSelectProduct(prod)}
                className={`p-2.5 rounded-2xl text-right transition-all duration-300 border flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#161d2d] border-[#ffd700] shadow-lg shadow-[#d4af37]/25 scale-[1.02]"
                    : "bg-[#0b0e17] border-white/5 hover:border-white/20 text-zinc-400"
                }`}
              >
                <div>
                  <span className={`text-[10px] block font-semibold mb-0.5 ${isSelected ? "text-[#ffd700]" : "text-zinc-500"}`}>
                    {prod.category}
                  </span>
                  <h4 className={`text-xs font-bold leading-tight ${isSelected ? "text-white" : "text-zinc-300"}`}>
                    {prod.name.split(" ")[0]} {prod.name.split(" ")[1]}
                  </h4>
                </div>
                <div className="mt-2 pt-1.5 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[11px] font-black ${isSelected ? "text-[#ffd700]" : "text-zinc-400"}`}>
                    {prod.price}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#ffd700]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Short Product Highlights */}
        <div className="mt-3 p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-xs">
          <div className="text-zinc-300 line-clamp-1 text-[11px]">
            <span className="text-[#ffd700] font-bold ml-1.5">★ {activeProduct.name}:</span>
            <span>{activeProduct.description}</span>
          </div>
        </div>
      </div>

      {/* 3D Interactive Controller Bar */}
      <div className="bg-[#0e121d]/90 backdrop-blur-md p-4 rounded-3xl border border-[#d4af37]/30 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#ffd700]">
              <Eye className="w-4 h-4" />
            </span>
            <span className="text-xs md:text-sm font-bold text-zinc-200">
              اختر زاوية العرض ثلاثي الأبعاد:
            </span>
          </div>

          <button
            onClick={onToggleRotate}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              isRotating
                ? "bg-[#d4af37]/20 border-[#d4af37] text-[#ffd700]"
                : "bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
            <span>{isRotating ? "دوران تلقائي نشط" : "تفعيل الدوران"}</span>
          </button>
        </div>

        {/* View Mode Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          {[
            { id: "room", label: "الغرفة كاملة", sub: "360° View" },
            { id: "mattress", label: "المرتبة والفرش", sub: "Orthopedic" },
            { id: "curtains", label: "الستائر الفاخرة", sub: "Royal Velvet" },
            { id: "pillows", label: "المفروشات والوسائد", sub: "Hotel Soft" },
          ].map((mode) => {
            const active = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id as ProductMode)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 text-center ${
                  active
                    ? "bg-gradient-to-b from-[#d4af37] to-[#aa7c11] text-black font-extrabold shadow-lg shadow-[#d4af37]/30 scale-[1.02]"
                    : "bg-[#141926] text-zinc-300 hover:bg-[#1a2133] hover:text-[#ffd700]"
                }`}
              >
                <span className="text-xs font-bold leading-tight">{mode.label}</span>
                <span className="text-[10px] opacity-75 hidden sm:inline">{mode.sub}</span>
              </button>
            );
          })}
        </div>

        {/* Color Customizer Section */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-[#ffd700]" /> لون مفرش وسطح المرتبة:
              </span>
              <span className="text-[11px] text-[#ffd700]">تخصيص مباشر 3D</span>
            </div>
            <div className="flex items-center gap-2">
              {mattressColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => onMattressColorChange(color.hex)}
                  title={color.name}
                  className={`group relative flex-1 h-9 rounded-xl border transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
                    mattressColor === color.hex
                      ? "border-[#ffd700] ring-2 ring-[#d4af37]/50 scale-105"
                      : "border-white/15 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    className={`text-[10px] px-1 rounded ${
                      color.hex === "#1a2538" ? "text-white" : "text-black"
                    }`}
                  >
                    {color.label}
                  </span>
                  {mattressColor === color.hex && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        color.hex === "#1a2538" ? "text-white" : "text-black"
                      }`}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#ffd700]" /> لون قماش الستائر القطيفة:
              </span>
              <span className="text-[11px] text-zinc-400">مخمل إيطالي</span>
            </div>
            <div className="flex items-center gap-2">
              {curtainColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => onCurtainColorChange(color.hex)}
                  title={color.name}
                  className={`group relative flex-1 h-9 rounded-xl border transition-all flex items-center justify-center gap-1 text-[11px] font-bold ${
                    curtainColor === color.hex
                      ? "border-[#ffd700] ring-2 ring-[#d4af37]/50 scale-105"
                      : "border-white/15 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="text-[10px] text-white px-1 drop-shadow">
                    {color.label}
                  </span>
                  {curtainColor === color.hex && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Part Alert */}
        {selectedPartName && (
          <div className="mt-4 p-3 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#ffd700]" />
              <div className="text-xs">
                <span className="text-zinc-400">القطعة المحددة: </span>
                <span className="font-bold text-[#ffd700]">{selectedPartName}</span>
              </div>
            </div>
            <span className="text-[10px] bg-[#d4af37]/30 text-[#ffd700] px-2 py-0.5 rounded-full font-bold">
              متوفر للتفصيل
            </span>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-4 pt-3 flex flex-col gap-2">
          <a
            href={`https://wa.me/201000000000?text=${encodeURIComponent(`أهلاً مفروشات السلطان، أرغب في الاستفسار والطلب الخاص لمنتج: ${activeProduct.name} (السعر: ${activeProduct.price})`)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleOrderClick}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-black text-center text-sm md:text-base tracking-wide shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] hover:shadow-[#d4af37]/40 transition duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 fill-current" />
            <span>طلب {activeProduct.name.split(" ")[0]} {activeProduct.name.split(" ")[1]} بالقياسات الخاصة</span>
          </a>

          {copiedNotification && (
            <div className="text-center text-xs text-emerald-400 font-bold animate-pulse">
              ✓ تم تجهيز طلبك الملكي بنجاح، جاري تحويلك للمستشار الخاص!
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex flex-col items-center">
          <ShieldCheck className="w-5 h-5 text-[#ffd700] mb-1" />
          <span className="text-[11px] font-bold text-zinc-200">ضمان 10 سنوات</span>
          <span className="text-[9px] text-zinc-500">على الهيكل والاسفنج</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex flex-col items-center">
          <Truck className="w-5 h-5 text-[#ffd700] mb-1" />
          <span className="text-[11px] font-bold text-zinc-200">توصيل وتركيب</span>
          <span className="text-[9px] text-zinc-500">لباب المنزل بعناية</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#0c101a] border border-white/5 flex flex-col items-center">
          <Award className="w-5 h-5 text-[#ffd700] mb-1" />
          <span className="text-[11px] font-bold text-zinc-200">أقمشة أوروبية</span>
          <span className="text-[9px] text-zinc-500">معالجة ضد البكتيريا</span>
        </div>
      </div>
    </div>
  );
}
