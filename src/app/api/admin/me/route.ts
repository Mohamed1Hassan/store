/**
 * POST /api/admin/logout — مسح كوكي جلسة الإدارة.
 * GET /api/admin/me — فحص الجلسة الحالية (للوحة).
 */

import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/admin-auth";

function sessionFrom(request: Request): string | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_COOKIE_NAME}=`));
  const value = match ? decodeURIComponent(match.slice(ADMIN_COOKIE_NAME.length + 1)) : null;
  return verifyAdminSession(value);
}

export async function GET(request: Request) {
  const email = sessionFrom(request);
  if (!email) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, email });
}
