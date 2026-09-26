/**
 * مخطط التحقق من حجز معاينة الستائر (Appointment) بـ zod.
 * نفس قواعد الهاتف المصري في `lead.ts` — أي تغيير يجب أن ينعكس في الاثنين.
 */

import { z } from "zod";
import { EGYPTIAN_PHONE_REGEX, normalizeEgyptianPhone } from "./lead";

export const EGYPTIAN_CITIES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "الشرقية",
  "أسيوط",
  "المنيا",
  "سوهاج",
  "أسوان",
  "الأقصر",
  "أخرى",
] as const;

export const FABRIC_IDS = ["velvet", "linen", "chiffon"] as const;

export const appointmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "اكتب الاسم بالكامل (3 حروف على الأقل).")
    .max(80, "الاسم طويل جداً (80 حرفاً كحد أقصى)."),
  phone: z
    .string()
    .trim()
    .transform(normalizeEgyptianPhone)
    .pipe(
      z
        .string()
        .regex(
          EGYPTIAN_PHONE_REGEX,
          "اكتب رقم موبايل مصري صحيح: 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015."
        )
    ),
  city: z.string().trim().max(60, "اسم المدينة طويل جداً.").optional().default(""),
  /** نوع القماش المختار من قسم الستائر */
  fabricId: z.enum(FABRIC_IDS).optional(),
  notes: z.string().trim().max(1000, "الملاحظات طويلة جداً.").optional().default(""),
  /** مصدر الحجز — يُستخدم في الإحصائيات */
  source: z.string().trim().max(60).optional().default("curtains-section"),
  /** حقل عسل ضد البوتات: يجب أن يبقى فارغاً */
  company: z.string().max(0, "تم رفض الطلب.").optional().default(""),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

/** يبني نص رسالة الواتساب لحجز المعاينة */
export function buildAppointmentMessage(
  appointment: Pick<AppointmentInput, "name" | "phone" | "city" | "notes">
): string {
  return [
    "حجز معاينة مجانية لرفع مقاسات الستائر:",
    `الاسم: ${appointment.name}`,
    `الموبايل: ${appointment.phone}`,
    appointment.city ? `المدينة: ${appointment.city}` : "",
    appointment.notes ? `ملاحظات: ${appointment.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
