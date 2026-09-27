"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Crown, Search } from "lucide-react";
import OrderTrackResultCard, { type TrackResult } from "./OrderTrackResultCard";

export default function OrderTrackClient() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = code.trim().toUpperCase();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "تعذر العثور على الطلب، تأكد من صحة الكود.");
      }
      setResult(data as TrackResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء البحث.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f4efe6] selection:bg-[#ffd700] selection:text-black">
      <header className="border-b border-[#d4af37]/20 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-300 hover:text-[#ffd700] text-sm font-bold transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <Link href="/" className="flex items-center gap-1.5 font-serif font-black text-xl text-white">
            <Crown className="w-5 h-5 text-[#ffd700]" />
            <span className="gold-gradient-text">السلطان</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/30 px-3 py-1 rounded-full">
            خدمة عملاء السلطان الملكية
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-black text-white mt-3 mb-2">
            متابعة حالة <span className="gold-gradient-text">الطلب والمعاينة</span>
          </h1>
          <p className="text-xs md:text-sm text-zinc-400">
            أدخل كود المتابعة (مثال: SLT-XXXXX أو APT-XXXXX) لمعرفة خط سير طلبك لحظة بلحظة.
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-10">
          <div className="flex gap-2 p-2 rounded-2xl bg-[#0b0e17] border border-[#d4af37]/40 shadow-xl">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="اكتب كود الطلب هنا (مثال: SLT-A1B2C)..."
              dir="ltr"
              className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none uppercase font-mono font-bold"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-xs flex items-center gap-2 hover:brightness-110 transition disabled:opacity-50"
            >
              {loading ? (
                <span>جاري البحث...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>تتبع</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold text-center mb-8">
            {error}
          </div>
        )}

        {result && <OrderTrackResultCard result={result} />}
      </main>
    </div>
  );
}
