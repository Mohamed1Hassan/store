import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAfterMs: number;
}

// In-memory fallback for local development or if Upstash is not configured
interface Bucket {
  count: number;
  resetAt: number;
}
const buckets = new Map<string, Bucket>();

let ratelimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, "1 m"), // default sliding window
    analytics: true,
  });
}

/**
 * @param key مفتاح التحديد (مثال: IP)
 * @param limit عدد الطلبات المسموحة داخل النافذة
 * @param windowMs طول النافذة بالمللي ثانية
 */
export async function checkRateLimit(key: string, limit = 5, windowMs = 60_000): Promise<RateLimitResult> {
  // If Upstash is configured, use it
  if (ratelimit) {
    const { success, remaining, reset } = await ratelimit.limit(key);
    return {
      allowed: success,
      remaining,
      resetAfterMs: reset - Date.now(),
    };
  }

  // Fallback to in-memory
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

export function resetRateLimits(): void {
  buckets.clear();
}
