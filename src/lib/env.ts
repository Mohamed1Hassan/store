/**
 * قراءة متغيرات البيئة مع تحقق صارم بـ zod + فشل سريع عند الإقلاع.
 * القاعدة: أي متغير سرّي يُقرأ من هنا فقط — ممنوع `process.env.X` مباشرة في الـ handlers.
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // اختياري في B1: عند غيابه يعمل المخزن المحلي (ملف JSON) تلقائياً
  DATABASE_URL: z.string().min(1).optional(),
  // ── إدارة اللوحة (B2) ──
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL غير صالح.").optional(),
  /** كلمة مرور لوحة الإدارة (8 أحرف على الأقل) — تُضبط في .env.local وعلى Vercel فقط */
  ADMIN_PASSWORD: z.string().min(8, "ADMIN_PASSWORD يجب أن تكون 8 أحرف على الأقل.").optional(),
  /** سر توقيع جلسة الإدارة — إن غاب يُستخدم NEXTAUTH_SECRET */
  ADMIN_SESSION_SECRET: z.string().min(16, "ADMIN_SESSION_SECRET يجب أن يكون 16 حرفاً على الأقل.").optional(),
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET يجب أن يكون 16 حرفاً على الأقل.").optional(),
  // ── إشعارات صاحب المتجر (B2) ──
  /** الإيميل الذي يستقبل تنبيهات الطلبات الجديدة (إن غاب يُستخدم ADMIN_EMAIL) */
  OWNER_EMAIL: z.string().email("OWNER_EMAIL غير صالح.").optional(),
  WHATSAPP_TOKEN: z.string().min(1).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
  /** رقم واتساب صاحب المتجر بصيغة دولية لاستقبال التنبيهات */
  OWNER_WHATSAPP_NUMBER: z.string().min(8).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  /** رابط Webhook لنسخة Google Sheets الاحتياطية (اختياري) */
  GOOGLE_SHEETS_WEBHOOK_URL: z.string().url("GOOGLE_SHEETS_WEBHOOK_URL غير صالح.").optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

function loadEnv(): AppEnv {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL || undefined,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || undefined,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET || undefined,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || undefined,
    OWNER_EMAIL: process.env.OWNER_EMAIL || undefined,
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || undefined,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || undefined,
    OWNER_WHATSAPP_NUMBER: process.env.OWNER_WHATSAPP_NUMBER || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL || undefined,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL || undefined,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || undefined,
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(" | ");
    throw new Error(`[env] متغيرات بيئة غير صالحة: ${details}`);
  }

  return parsed.data;
}

export const env: AppEnv = loadEnv();

/** هل قاعدة البيانات السحابية مهيأة؟ (B1.2: Neon/Supabase) */
export const hasDatabase = (): boolean => Boolean(env.DATABASE_URL);

/** هل لوحة الإدارة مهيأة (بريد + كلمة مرور)؟ */
export const isAdminConfigured = (): boolean =>
  Boolean(env.ADMIN_EMAIL && env.ADMIN_PASSWORD);

/**
 * سر توقيع جلسة الإدارة — ADMIN_SESSION_SECRET أولاً ثم NEXTAUTH_SECRET.
 * يقرأ process.env مباشرة للسماح بتغييره أثناء الاختبارات أو التهيئات الديناميكية.
 */
export function adminSessionSecret(): string | null {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    env.ADMIN_SESSION_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    env.NEXTAUTH_SECRET ??
    null
  );
}


/** إيميل استقبال التنبيهات — OWNER_EMAIL أولاً ثم ADMIN_EMAIL */
export function ownerEmail(): string | null {
  return env.OWNER_EMAIL ?? env.ADMIN_EMAIL ?? null;
}

