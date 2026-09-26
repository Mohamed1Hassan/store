/**
 * POST /api/admin/login — تسجيل دخول المالك.
 * حد 10 محاولات/IP/دقيقة + رسائل عربية + كوكي جلسة موقعة.
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { ADMIN_COOKIE_NAME, checkAdminCredentials, issueAdminSession } from "@/lib/admin-auth";
import { adminSessionSecret, env, isAdminConfigured } from "@/lib/env";
import { checkRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().trim().email("اكتب بريداً إلكترونياً صحيحاً."),
  password: z.string().min(1, "اكتب كلمة المرور."),
});

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!isAdminConfigured() || !adminSessionSecret()) {
    return NextResponse.json(
      {
        error:
          "لوحة الإدارة غير مهيأة بعد. اضبط ADMIN_EMAIL وADMIN_PASSWORD وADMIN_SESSION_SECRET في .env.local.",
      },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const limit = checkRateLimit(`admin-login:${ip}`, 10, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "محاولات كثيرة. حاول مرة أخرى بعد دقيقة." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات الدخول غير صالحة." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "تحقق من البيانات." },
      { status: 400 }
    );
  }

  const ok = checkAdminCredentials(parsed.data.email, parsed.data.password);
  if (!ok) {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
  }

  const session = issueAdminSession(parsed.data.email.trim().toLowerCase());
  if (!session) {
    return NextResponse.json({ error: "تعذر إنشاء الجلسة." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true, email: env.ADMIN_EMAIL });
  response.cookies.set(ADMIN_COOKIE_NAME, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return response;
}
