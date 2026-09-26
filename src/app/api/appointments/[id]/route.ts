/**
 * PATCH /api/appointments/[id] — تحديث حالة حجز المعاينة (للإدارة فقط).
 * body: { status: NEW|CONTACTED|SCHEDULED|DONE|CANCELLED }
 */

import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-auth";
import {
  getAppointmentById,
  updateAppointmentStatus,
  type AppointmentStatus,
} from "@/lib/appointments-store";

const bodySchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "SCHEDULED", "DONE", "CANCELLED"]),
});

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح. سجّل الدخول أولاً." }, { status: 401 });
  }
  const { id } = await context.params;
  const item = await getAppointmentById(id);
  if (!item) {
    return NextResponse.json({ error: "الحجز غير موجود." }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح. سجّل الدخول أولاً." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ error: "معرّف الحجز مطلوب." }, { status: 400 });
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

  const updated = await updateAppointmentStatus(id, parsed.data.status as AppointmentStatus);
  if (!updated) {
    return NextResponse.json({ error: "الحجز غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ item: updated });
}
