"use client";

import { useSyncExternalStore } from "react";
import { Clock, Truck } from "lucide-react";

/** يحسب الوقت المتبقي حتى منتصف الليل (عرض اليوم) */
function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.max(0, midnight.getTime() - now.getTime());
}

function formatCountdown(ms: number): string {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/* ── مصدر وقت خارجي (External Store) ──
 * القيمة تُحسب مرة كل ثانية وتُخزَّن (كاش) حتى تبقى ثابتة بين قراءات React،
 * وهذا هو النمط الرسمي لمنع hydration mismatch: الخادم يقرأ `0`،
 * والعميل يقرأ `0` أثناء الـ hydration ثم ينتقل للقيمة الحقيقية فور اكتماله.
 */
let cachedSecond = -1;
let cachedRemaining = 0;

function getSnapshot(): number {
  const second = Math.floor(Date.now() / 1000);
  if (second !== cachedSecond) {
    cachedSecond = second;
    cachedRemaining = msUntilMidnight();
  }
  return cachedRemaining;
}

function getServerSnapshot(): number {
  return 0;
}

function subscribe(onStoreChange: () => void): () => void {
  const timer = setInterval(onStoreChange, 1000);
  return () => clearInterval(timer);
}

/**
 * شريط عرض عاجل (3.4): عرض اليوم — كافر مجاني + خصم، مع عدّاد تنازلي
 * حتى منتصف الليل. يعمل بدون JS (يعرض نصاً ثابتاً) ويحدّث العدّاد كل ثانية.
 */
export default function PromoCountdownBar() {
  const remaining = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div className="relative z-40 flex items-center justify-center gap-2 border-b border-[#d4af37]/30 bg-gradient-to-l from-[#2a2008] via-[#171204] to-[#2a2008] px-4 py-2 text-center">
      <Truck className="h-4 w-4 shrink-0 text-[#ffd700]" />
      <p className="text-[11px] font-bold text-zinc-100 sm:text-xs">
        عرض اليوم: كافر مراتب مجاني + خصم حتى{" "}
        <span className="text-[#ffd700]">5,100 ج.م</span> على الغرفة المتكاملة
      </p>
      <span className="flex items-center gap-1.5 rounded-full border border-[#d4af37]/40 bg-black/50 px-2.5 py-0.5 text-[11px] font-black text-[#ffd700]">
        <Clock className="h-3 w-3" />
        <span dir="ltr" aria-live="off">
          {formatCountdown(remaining)}
        </span>
      </span>
    </div>
  );
}
