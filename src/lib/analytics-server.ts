/**
 * سجل أحداث التحويل server-side (بديل دائم لـ dataLayer).
 * المرحلة B1: تسجيل في console فقط — المرحلة B4 تخزنه في جدول EventLog.
 */

export type ServerTrackEvent = "whatsapp_click" | "order_submit" | "lead_created";

export function trackEventName(name: ServerTrackEvent, params?: Record<string, string>): void {
  if (process.env.NODE_ENV === "test") return;
  console.info(`[track] ${name}`, params ?? {});
}
