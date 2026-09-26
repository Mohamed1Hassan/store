import { NextResponse } from "next/server";
import { z } from "zod";
import { leadSchema } from "@/schemas/lead";
import { countLeads, listLeads, saveLead } from "@/lib/leads-store";
import { checkRateLimit } from "@/lib/rate-limit";
import { isAdminRequest } from "@/lib/admin-auth";
import { notifyOwner } from "@/lib/notify";
import { trackEventName } from "@/lib/analytics-server";


function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

const querySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "DELIVERED", "CANCELLED"]).optional(),
  search: z.string().trim().max(40).optional(),
  page: z.coerce.number().int().min(1).max(1000).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});

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

  // B4: تسجيل الحدث في EventLog
  trackEventName("lead_created", {
    leadId: lead.id,
    source: lead.source ?? "unknown",
    product: lead.product,
  });

  // B2: إشعار المالك — fire-and-forget ولا يمنع الرد 201 أبداً

  notifyOwner(lead).catch((error) => {
    console.warn("[notify] unexpected failure:", error instanceof Error ? error.message : error);
  });

  return NextResponse.json(
    { id: lead.id, message: "تم استلام طلبك بنجاح، وسيتواصل معك فريق السلطان قريباً." },
    { status: 201 }
  );
}

/**
 * GET /api/leads — للإدارة فقط (كوكي sultan_admin).
 * معاملات: status / search (اسم أو هاتف) / page / pageSize
 */
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
  let leads = await listLeads(200);

  if (status) leads = leads.filter((lead) => lead.status === status);
  if (search) {
    const needle = search.trim();
    leads = leads.filter((lead) => lead.name.includes(needle) || lead.phone.includes(needle));
  }

  const total = leads.length;
  const start = (page - 1) * pageSize;
  const items = leads.slice(start, start + pageSize);
  const counts = {
    total: await countLeads(),
    filtered: total,
  };

  return NextResponse.json({ items, total, page, pageSize, counts });
}
