import { NextRequest, NextResponse } from "next/server";
import { getLeadByTrackingCode } from "@/lib/leads-store";
import { getAppointmentByTrackingCode } from "@/lib/appointments-store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  const { code } = await context.params;
  const cleanCode = code.trim().toUpperCase();

  // 1. Check in leads
  const lead = await getLeadByTrackingCode(cleanCode);
  if (lead) {
    return NextResponse.json({
      type: "order",
      trackingCode: lead.trackingCode || cleanCode,
      name: lead.name,
      status: lead.status,
      product: lead.product,
      size: lead.size,
      createdAt: lead.createdAt,
    });
  }

  // 2. Check in appointments
  const appointment = await getAppointmentByTrackingCode(cleanCode);
  if (appointment) {
    return NextResponse.json({
      type: "appointment",
      trackingCode: appointment.trackingCode || cleanCode,
      name: appointment.name,
      status: appointment.status,
      city: appointment.city,
      fabricId: appointment.fabricId,
      createdAt: appointment.createdAt,
    });
  }

  return NextResponse.json(
    { error: "لم يتم العثور على أي طلب أو حجز بهذا الكود." },
    { status: 404 }
  );
}
