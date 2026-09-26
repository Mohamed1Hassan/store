import { NextResponse } from "next/server";

/** GET /api/health — فحص حياة للـ CI و Vercel */
export async function GET() {
  return NextResponse.json({ ok: true, service: "3ezat-backend", stage: "B1" });
}
