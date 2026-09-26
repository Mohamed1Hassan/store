import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  countEventsByType,
  listEvents,
  logEvent,
  ServerTrackEvent,
} from "@/lib/analytics-server";
import { z } from "zod";

const trackInputSchema = z.object({
  type: z.enum(["whatsapp_click", "order_submit", "lead_created", "appointment_created"]),
  source: z.string().trim().max(100).optional().default("unknown"),
  payload: z.record(z.string(), z.string()).optional(),
});

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

/**
 * تسجيل حدث تحويل server-side (B4.3).
 * مفتوح للعموم مع حد معدل 60 طلب/دقيقة لمنع الإغراق.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`track:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ ok: false, error: "تم تجاوز الحد" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "بيانات غير صالحة" }, { status: 400 });
  }

  const parsed = trackInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "نوع الحدث غير مدعوم" }, { status: 400 });
  }

  const logged = await logEvent(
    parsed.data.type as ServerTrackEvent,
    parsed.data.source,
    parsed.data.payload,
    ip
  );

  return NextResponse.json({ ok: true, id: logged.id }, { status: 201 });
}

/**
 * قراءة ملخص وأحدث الأحداث — محمي للأدمن فقط.
 */
export async function GET(request: Request): Promise<NextResponse> {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: "غير مصرح" }, { status: 401 });
  }

  const [counts, recent] = await Promise.all([
    countEventsByType(),
    listEvents(50),
  ]);

  return NextResponse.json({
    ok: true,
    counts,
    recent,
  });
}
