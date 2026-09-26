/**
 * حماية صفحات /admin على مستوى الـ middleware — يُحوَّل غير المسجل لنموذج الدخول.
 * ملاحظة: التحقق الحقيقي في الـ Route Handlers عبر isAdminRequest دائماً.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  const session = request.cookies.get("sultan_admin")?.value;
  // لا نرفض هنا — صفحة /admin نفسها تعرض نموذج الدخول عند غياب الجلسة.
  // لكن نمنع فهرسة أي صفحة إدارية.
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  void session;
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
