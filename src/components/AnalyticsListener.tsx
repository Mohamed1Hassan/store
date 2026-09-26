"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * مستمع عام لتتبّع ضغطات واتساب (3.5).
 * يلتقط أي ضغطة على رابط `wa.me` في الصفحة ويسجّل حدث `whatsapp_click`
 * مع مصدر الضغطة (من `data-track` أو `aria-label`) — بدون تعديل كل زر يدوياً.
 */
export default function AnalyticsListener() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href*="wa.me"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const source =
        anchor.dataset.track ||
        anchor.getAttribute("aria-label") ||
        (anchor.textContent ?? "").trim().slice(0, 60) ||
        "unknown";

      trackEvent("whatsapp_click", { source });

      // تزامن server-side fire-and-forget لـ EventLog (B4)
      try {
        void fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "whatsapp_click", source }),
          keepalive: true,
        });
      } catch {
        /* تجاهل */
      }

    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
