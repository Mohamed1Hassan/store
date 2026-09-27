/**
 * POST /api/appointments — حجز معاينة مجانية لرفع مقاسات الستائر (عمومي).
 * 201 { id } عند النجاح | 400 أخطاء عربية | 429 تجاوز الحد (3/دقيقة/IP)
 *
 * GET /api/appointments — للإدارة فقط (كوكي sultan_admin).
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { appointmentSchema } from "@/schemas/appointment";
import { trackEventName } from "@/lib/analytics-server";

import {
  countAppointments,
  listAppointments,
  saveAppointment,
} from "@/lib/appointments-store";
import { isAdminRequest } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { notifyAppointment } from "@/lib/notify";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

const querySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "SCHEDULED", "DONE", "CANCELLED"]).optional(),
  search: z.string().trim().max(40).optional(),
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = await checkRateLimit(`appointments:${ip}`, 3, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "وصلت للحد الأقصى من الحجوزات. حاول مرة أخرى بعد دقيقة." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.resetAfterMs / 1000)) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات الحجز غير صالحة." }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "تحقق من البيانات وحاول مرة أخرى.", field: first?.path.join(".") },
      { status: 400 }
    );
  }

  const appointment = await saveAppointment(parsed.data);

  // B4: تسجيل الحدث في EventLog
  trackEventName("appointment_created", {
    appointmentId: appointment.id,
    source: appointment.source ?? "unknown",
    city: appointment.city ?? "unknown",
  });

  // B3: إشعار المالك — fire-and-forget ولا يمنع الرد 201 أبداً

  notifyAppointment(appointment).catch((error) => {
    console.warn("[notify] appointment failure:", error instanceof Error ? error.message : error);
  });

  return NextResponse.json(
    { id: appointment.id, message: "تم استلام طلب المعاينة، وسنتصل بك لتحديد الموعد." },
    { status: 201 }
  );
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح. سجّل الدخول أولاً." }, { status: 401 });
  }

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    status: url.searchParams.get("status") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "معاملات البحث غير صالحة." }, { status: 400 });
  }

  const { status, search, page, pageSize } = parsed.data;
  let items = await listAppointments(200);

  if (status) items = items.filter((item) => item.status === status);
  if (search) {
    const needle = search.trim();
    items = items.filter((item) => item.name.includes(needle) || item.phone.includes(needle));
  }

  const total = items.length;
  const start = (page - 1) * pageSize;

  return NextResponse.json({
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    counts: { total: await countAppointments(), filtered: total },
  });
}
