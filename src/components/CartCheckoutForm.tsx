"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { ArrowLeft, Send } from "lucide-react";

interface Props {
  onBack: () => void;
  onSuccess: (code: string | null) => void;
}

export default function CartCheckoutForm({ onBack, onSuccess }: Props) {
  const { items, clearCart, getTotalPrice } = useCartStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPrice = getTotalPrice();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.length < 3) {
      setError("يرجى إدخال اسم صحيح بالكامل (3 أحرف على الأقل).");
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      setError("اكتب رقم موبايل مصري صحيح (11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015).");
      return;
    }

    setSubmitting(true);
    setError(null);

    const itemsSummary = items
      .map((i) => `${i.name} (الكمية: ${i.quantity}${i.size ? ` - المقاس: ${i.size}` : ""})`)
      .join(" + ");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: cleanPhone,
          product: `سلة: ${itemsSummary} | الإجمالي: ${totalPrice.toLocaleString("ar-EG")} ج.م`,
          notes: notes.trim() || undefined,
          source: "cart-drawer",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر إرسال الطلب، يرجى المحاولة مجدداً.");
      }

      clearCart();
      onSuccess(data.trackingCode || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#ffd700] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> العودة للسلة
        </button>
        <span className="text-xs text-zinc-400">بيانات الاستلام والتأكيد</span>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-1.5">الاسم بالكامل *</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="مثال: محمد السيد"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#d4af37]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-1.5">رقم الموبايل *</label>
        <input
          type="tel"
          required
          dir="ltr"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="01012345678"
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white text-right outline-none focus:border-[#d4af37]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-300 mb-1.5">
          تفاصيل العنوان أو المقاسات
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي تعليمات للمقاس أو وقت التوصيل..."
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#d4af37] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-50"
      >
        {submitting ? (
          <span>جاري الإرسال...</span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>تأكيد الطلب الآن ({totalPrice.toLocaleString("ar-EG")} ج.م)</span>
          </>
        )}
      </button>
    </form>
  );
}
