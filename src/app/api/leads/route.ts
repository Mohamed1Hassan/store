import { NextResponse } from "next/server";
import { leadSchema } from "@/schemas/lead";
import { countLeads, saveLead } from "@/lib/leads-store";
import { checkRateLimit } from "@/lib/rate-limit";
import { trackEventName } from "@/lib/analytics-server";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * POST /api/leads — استقبال طلب عميل جديد.
 * 201 { id } عند النجاح | 400 أخطاء عربية | 429 تجاوز الحد
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const limit = checkRateLimit(`leads:${ip}`, 5, 60_000);

  if (!limit.allowed) {
    return NextResponse.json(
      { error: "وصلت للحد الأقصى من الطلبات. حاول مرة أخرى بعد دقيقة." },
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
    return NextResponse.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message ?? "تحقق من البيانات وحاول مرة أخرى.", field: first?.path.join(".") },
      { status: 400 }
    );
  }

  const lead = await saveLead(parsed.data);

  return NextResponse.json(
    { id: lead.id, message: "تم استلام طلبك بنجاح، وسيتواصل معك فريق السلطان قريباً." },
    { status: 201 }
  );
}

/**
 * GET /api/leads — عدّاد بسيط للمرحلة B1 (تُحمى في B2 بالمصادقة).
 * حالياً تعيد العدد فقط حتى لا تُكشف بيانات العملاء قبل بناء لوحة الإدارة.
 */
export async function GET() {
  void trackEventName;
  const total = await countLeads();
  return NextResponse.json({ total, protected: true });
}
