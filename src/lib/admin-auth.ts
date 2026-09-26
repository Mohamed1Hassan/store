/**
 * جلسة لوحة الإدارة — توقيع HMAC خفيف بدون أي اعتماد خارجي.
 * الكوكي: `sultan_admin = base64(payload).base64(sig)` حيث sig = HMAC-SHA256(payload, secret).
 * الصلاحية 7 أيام، `HttpOnly + SameSite=Lax + Secure` في الإنتاج.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import { adminSessionSecret, env, isAdminConfigured } from "./env";

export const ADMIN_COOKIE_NAME = "sultan_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface AdminPayload {
  email: string;
  exp: number;
}

function b64urlEncode(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function b64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf-8");
}

function sign(payloadB64: string, secret: string): string {
  return createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf-8");
  const bb = Buffer.from(b, "utf-8");
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** مقارنة كلمتي المرور بتوقيت ثابت لمنع هجمات التوقيت */
export function verifyPassword(provided: string, expected: string): boolean {
  return safeEqual(provided, expected);
}

/** هل بيانات الدخول صحيحة؟ */
export function checkAdminCredentials(email: string, password: string): boolean {
  if (!isAdminConfigured()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), (env.ADMIN_EMAIL ?? "").toLowerCase());
  const passOk = verifyPassword(password, env.ADMIN_PASSWORD ?? "");
  return emailOk && passOk;
}

/** إصدار قيمة الكوكي لجلسة جديدة — يعيد null إن لم يكن السر مهيأً */
export function issueAdminSession(email: string): string | null {
  const secret = adminSessionSecret();
  if (!secret) return null;
  const payload: AdminPayload = { email, exp: Date.now() + SESSION_TTL_MS };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  return `${payloadB64}.${sign(payloadB64, secret)}`;
}

/** التحقق من قيمة الكوكي — يعيد الإيميل أو null */
export function verifyAdminSession(cookieValue: string | undefined | null): string | null {
  const secret = adminSessionSecret();
  if (!secret || !cookieValue) return null;
  const [payloadB64, sig] = cookieValue.split(".");
  if (!payloadB64 || !sig) return null;
  if (!safeEqual(sign(payloadB64, secret), sig)) return null;
  try {
    const payload = JSON.parse(b64urlDecode(payloadB64)) as AdminPayload;
    if (typeof payload.email !== "string" || typeof payload.exp !== "number") return null;
    if (Date.now() > payload.exp) return null;
    return payload.email;
  } catch {
    return null;
  }
}

/** هل طلب الإدارة مصرح؟ يُستخدم داخل Route Handlers */
export function isAdminRequest(request: Request): boolean {
  const header = request.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
  const value = match ? decodeURIComponent(match.slice(ADMIN_COOKIE_NAME.length + 1)) : null;
  return verifyAdminSession(value) !== null;
}
