/**
 * PATCH /api/leads/[id] — تحديث حالة الطلب (للإدارة فقط).
 * body: { status: NEW|CONTACTED|CONFIRMED|DELIVERED|CANCELLED }
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-auth";
import { getLeadById, updateLeadStatus, type LeadStatus } from "@/lib/leads-store";

const bodySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح. سجّل الدخول أولاً." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "معرّف الطلب مطلوب." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بيانات غير صالحة." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "الحالة المطلوبة غير صالحة." }, { status: 400 });
  }

  const updated = await updateLeadStatus(id, parsed.data.status as LeadStatus);
  if (!updated) {
    return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح. سجّل الدخول أولاً." }, { status: 401 });
  }
  const { id } = await context.params;
  const lead = await getLeadById(id);
  if (!lead) {
    return NextResponse.json({ error: "الطلب غير موجود." }, { status: 404 });
  }
  return NextResponse.json({ item: lead });
}
