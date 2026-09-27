/**
 * تتبّع أحداث التحويل (CTA / إرسال الطلب).
 * يعمل بدون أي اعتماد خارجي: يدفع الحدث إلى `window.dataLayer`
 * (جاهز لـ GA4/GTM إن أُضيف لاحقاً) ويبث `CustomEvent` على `window`
 * ليسهل الربط بأي نظام تحليلات قادم — ولا يكسر الـ SSR.
 */
export type TrackEventName = "whatsapp_click" | "order_submit";

export function trackEvent(name: TrackEventName, params?: Record<string, string>): void {
  if (typeof window === "undefined") return;

  try {
    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
    };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({ event: name, ...params });
  } catch {
    /* تجاهل أي خطأ في التتبّع — لا يجب أن يمنع إرسال الطلب */
  }

  try {
    window.dispatchEvent(new CustomEvent("sultan-track", { detail: { name, ...params } }));
  } catch {
    /* بيئات قديمة بدون CustomEvent — تجاهل */
  }
}
