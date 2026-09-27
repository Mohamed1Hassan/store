"use client";

import { CalendarCheck, CheckCircle2, Package, Phone, XCircle } from "lucide-react";
import { whatsappLink } from "@/data/site";

export interface TrackResult {
  type: "order" | "appointment";
  trackingCode: string;
  name: string;
  status: string;
  product?: string;
  size?: string;
  city?: string;
  fabricId?: string;
  createdAt: string;
}

const ORDER_STATUS_MAP: Record<string, { label: string; desc: string; step: number; color: string }> = {
  NEW: { label: "تم استلام الطلب", desc: "طلبك قيد المراجعة لدى فريق مبيعات السلطان", step: 1, color: "text-amber-400" },
  CONTACTED: { label: "تم التواصل", desc: "تم التواصل هاتفياً لتأكيد التفاصيل والمقاسات", step: 2, color: "text-sky-400" },
  CONFIRMED: { label: "تم التأكيد والتجهيز", desc: "الطلب قيد التجهيز في ورش ومصانع السلطان", step: 3, color: "text-indigo-400" },
  DELIVERED: { label: "تم التسليم بنجاح", desc: "تم تسليم المنتج للعميل مع شهادة الضمان", step: 4, color: "text-emerald-400" },
  CANCELLED: { label: "تم الإلغاء", desc: "تم إلغاء هذا الطلب", step: 0, color: "text-red-400" },
};

export default function OrderTrackResultCard({ result }: { result: TrackResult }) {
  const current = ORDER_STATUS_MAP[result.status] || {
    label: result.status,
    desc: "حالة الطلب الحالية",
    step: 1,
    color: "text-zinc-300",
  };

  return (
    <div className="rounded-3xl border border-[#d4af37]/40 bg-[#0b0e17] p-6 md:p-8 shadow-2xl animate-fade-in">
      <div className="flex items-start justify-between border-b border-white/10 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {result.type === "order" ? <Package className="w-5 h-5 text-[#ffd700]" /> : <CalendarCheck className="w-5 h-5 text-[#ffd700]" />}
            <h2 className="text-lg font-black text-white font-serif">
              {result.type === "order" ? "طلب شراء" : "حجز معاينة ستائر"}
            </h2>
          </div>
          <p className="text-xs text-zinc-400">صاحب الطلب: <span className="text-white font-bold">{result.name}</span></p>
        </div>
        <div className="text-left">
          <span className="text-[10px] text-zinc-500 block">كود المتابعة</span>
          <span className="text-sm font-mono font-black text-[#ffd700]" dir="ltr">{result.trackingCode}</span>
        </div>
      </div>

      {result.status !== "CANCELLED" ? (
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[{ step: 1, label: "استلام" }, { step: 2, label: "تواصل" }, { step: 3, label: "تجهيز" }, { step: 4, label: "تسليم" }].map((s) => {
            const isDone = current.step >= s.step;
            const isCurrent = current.step === s.step;
            return (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition ${isCurrent ? "bg-[#ffd700] text-black shadow-lg shadow-[#ffd700]/30 ring-4 ring-[#ffd700]/20" : isDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-white/5 text-zinc-600 border border-white/10"}`}>
                  {isDone && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                </div>
                <span className={`text-[11px] font-bold ${isCurrent ? "text-[#ffd700]" : isDone ? "text-zinc-200" : "text-zinc-600"}`}>{s.label}</span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 text-center mb-6">
          <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-red-300">الطلب ملغي</p>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs mb-6">
        <div className="flex justify-between"><span className="text-zinc-400">الحالة:</span><span className={`font-bold ${current.color}`}>{current.label}</span></div>
        <div className="flex justify-between"><span className="text-zinc-400">التفاصيل:</span><span className="text-zinc-200">{current.desc}</span></div>
        {result.product && <div className="flex justify-between"><span className="text-zinc-400">المنتج:</span><span className="text-zinc-200">{result.product}</span></div>}
        {result.city && <div className="flex justify-between"><span className="text-zinc-400">المدينة:</span><span className="text-zinc-200">{result.city}</span></div>}
        <div className="flex justify-between"><span className="text-zinc-400">تاريخ التسجيل:</span><span className="text-zinc-500">{new Date(result.createdAt).toLocaleString("ar-EG")}</span></div>
      </div>

      <div className="text-center pt-2">
        <a href={whatsappLink(`مرحباً مفروشات السلطان، أود الاستفسار عن طلبي برقم: ${result.trackingCode}`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#ffd700] font-bold text-xs hover:bg-[#d4af37]/20 transition">
          <Phone className="w-3.5 h-3.5" />
          <span>تحدث مع خدمة العملاء بخصوص هذا الطلب</span>
        </a>
      </div>
    </div>
  );
}
