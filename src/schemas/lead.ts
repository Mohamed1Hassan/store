/**
 * مخطط التحقق من طلبات العملاء (Lead) بـ zod.
 * نفس قواعد `OrderForm` الحالية حرفياً — أي تغيير هنا يجب أن ينعكس هناك.
 */

import { z } from "zod";

/** تطبيع رقم الموبايل المصري: إزالة المسافات والشرطات قبل التحقق */
export function normalizeEgyptianPhone(raw: string): string {
  return raw.replace(/[\s-]/g, "");
}

export const EGYPTIAN_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export const leadSchema = z.object({
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
  product: z
    .string()
    .trim()
    .min(1, "اختر المنتج المطلوب من القائمة.")
    .max(160, "اسم المنتج طويل جداً."),
  size: z.string().trim().max(120, "المقاس طويل جداً.").optional().default(""),
  notes: z.string().trim().max(1000, "الملاحظات طويلة جداً.").optional().default(""),
  /** مصدر الطلب: hero/navbar/float/form/admin — يُستخدم في الإحصائيات */
  source: z.string().trim().max(60).optional().default("order-form"),
  /** حقل عسل ضد البوتات: يجب أن يبقى فارغاً */
  company: z.string().max(0, "تم رفض الطلب.").optional().default(""),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** يبني نص رسالة الواتساب بنفس صيغة `OrderForm` الحالية */
export function buildLeadMessage(lead: Pick<LeadInput, "name" | "phone" | "product" | "size" | "notes">): string {
  return [
    "طلب جديد من موقع السلطان:",
    `الاسم: ${lead.name}`,
    `الموبايل: ${lead.phone}`,
    `المنتج: ${lead.product}`,
    lead.size ? `المقاس: ${lead.size}` : "",
    lead.notes ? `ملاحظات: ${lead.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
