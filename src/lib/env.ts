/**
 * قراءة متغيرات البيئة مع تحقق صارم بـ zod + فشل سريع عند الإقلاع.
 * القاعدة: أي متغير سرّي يُقرأ من هنا فقط — ممنوع `process.env.X` مباشرة في الـ handlers.
 */

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  // اختياري في B1: عند غيابه يعمل المخزن المحلي (ملف JSON) تلقائياً
  DATABASE_URL: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email("ADMIN_EMAIL غير صالح.").optional(),
  NEXTAUTH_SECRET: z.string().min(16, "NEXTAUTH_SECRET يجب أن يكون 16 حرفاً على الأقل.").optional(),
  WHATSAPP_TOKEN: z.string().min(1).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

function loadEnv(): AppEnv {
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL || undefined,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || undefined,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || undefined,
    WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || undefined,
    WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
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
