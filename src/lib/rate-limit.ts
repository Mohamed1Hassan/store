/**
 * تحديد معدل الطلبات (Rate Limit) بذاكرة محلية.
 * يكفي للمرحلة B1 (مثيل واحد) — عند التوسع نستبدله بـ Upstash Redis دون تغيير الواجهة.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}

/**
 * @param key مفتاح التحديد (مثال: IP)
 * @param limit عدد الطلبات المسموحة داخل النافذة
 * @param windowMs طول النافذة بالمللي ثانية
 */
export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || now >= current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAfterMs: windowMs };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAfterMs: current.resetAt - now };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count, resetAfterMs: current.resetAt - now };
}

/** للاختبارات فقط: تصفير كل العدادات */
export function resetRateLimits(): void {
  buckets.clear();
}
