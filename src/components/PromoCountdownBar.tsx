"use client";

import { useSyncExternalStore } from "react";
import { Clock, Truck } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

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

interface Props {
  announcement?: SiteContent["announcement"];
}

export default function PromoCountdownBar({ announcement }: Props) {
  const remaining = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (announcement && !announcement.enabled) {
    return null;
  }

  const badge = announcement?.badge ?? "عرض اليوم:";
  const text = announcement?.text ?? "كافر مراتب مجاني + خصم حتى";
  const highlight = announcement?.highlight ?? "5,100 ج.م";
  const suffix = announcement?.suffix ?? "على الغرفة المتكاملة";

  return (
    <div className="relative z-40 flex items-center justify-center gap-2 border-b border-[#d4af37]/30 bg-gradient-to-l from-[#2a2008] via-[#171204] to-[#2a2008] px-4 py-2 text-center">
      <Truck className="h-4 w-4 shrink-0 text-[#ffd700]" />
      <p className="text-[11px] font-bold text-zinc-100 sm:text-xs">
        {badge} {text}{" "}
        <span className="text-[#ffd700]">{highlight}</span> {suffix}
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

