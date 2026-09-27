/**
 * طبقة تخزين حجوزات المعاينة (Appointments).
 * نفس نمط `leads-store`: ملف محلي `.data/appointments.json` الآن،
 * والواجهة ثابتة للترقية إلى Prisma دون تغيير الـ API.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AppointmentInput } from "@/schemas/appointment";
import { prisma } from "./db";
import type { AppointmentStatus as PrismaAppointmentStatus } from "@prisma/client";

export type AppointmentStatus = "NEW" | "CONTACTED" | "SCHEDULED" | "DONE" | "CANCELLED";

export interface StoredAppointment extends Omit<AppointmentInput, "company"> {
  id: string;
  trackingCode?: string;
  status: AppointmentStatus;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "APT-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function readAll(): Promise<StoredAppointment[]> {
  try {
    const raw = await readFile(APPOINTMENTS_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAppointment[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(items: StoredAppointment[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(APPOINTMENTS_FILE, JSON.stringify(items, null, 2), "utf-8");
}

export async function saveAppointment(input: AppointmentInput): Promise<StoredAppointment> {
  const { company: _honeypot, ...rest } = input;
  void _honeypot;
  const trackingCode = generateTrackingCode();

  if (prisma) {
    try {
      const record = await prisma.appointment.create({
        data: {
          trackingCode,
          name: rest.name,
          phone: rest.phone,
          city: rest.city || null,
          fabricId: rest.fabricId || null,
          notes: rest.notes || null,
          source: rest.source || null,
          status: "NEW",
        },
      });

      return {
        id: record.id,
        trackingCode: record.trackingCode ?? trackingCode,
        name: record.name,
        phone: record.phone,
        city: record.city ?? "",
        fabricId: (record.fabricId as "velvet" | "linen" | "chiffon" | undefined) ?? undefined,
        notes: record.notes ?? "",
        source: record.source ?? "curtains-section",
        status: record.status as AppointmentStatus,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn("[appointments-store] Prisma failed, fallback:", err);
    }
  }

  const clean: StoredAppointment = {
    ...rest,
    id: randomUUID(),
    trackingCode,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  const items = await readAll();
  items.unshift(clean);
  await writeAll(items);
  return clean;
}

export async function listAppointments(limit = 50): Promise<StoredAppointment[]> {
  const safeLimit = Math.max(1, Math.min(limit, 200));

  if (prisma) {
    try {
      const items = await prisma.appointment.findMany({
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      });
      return items.map((rec) => ({
        id: rec.id,
        trackingCode: rec.trackingCode ?? undefined,
        name: rec.name,
        phone: rec.phone,
        city: rec.city ?? "",
        fabricId: (rec.fabricId as "velvet" | "linen" | "chiffon" | undefined) ?? undefined,
        notes: rec.notes ?? "",
        source: rec.source ?? "curtains-section",
        status: rec.status as AppointmentStatus,
        createdAt: rec.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("[appointments-store] Prisma findMany fallback:", err);
    }
  }

  const items = await readAll();
  return items.slice(0, safeLimit);
}

export async function getAppointmentById(id: string): Promise<StoredAppointment | null> {
  if (prisma) {
    try {
      const rec = await prisma.appointment.findUnique({ where: { id } });
      if (rec) {
        return {
          id: rec.id,
          trackingCode: rec.trackingCode ?? undefined,
          name: rec.name,
          phone: rec.phone,
          city: rec.city ?? "",
          fabricId: (rec.fabricId as "velvet" | "linen" | "chiffon" | undefined) ?? undefined,
          notes: rec.notes ?? "",
          source: rec.source ?? "curtains-section",
          status: rec.status as AppointmentStatus,
          createdAt: rec.createdAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("[appointments-store] Prisma findUnique fallback:", err);
    }
  }

  const items = await readAll();
  return items.find((item) => item.id === id) ?? null;
}

export async function getAppointmentByTrackingCode(code: string): Promise<StoredAppointment | null> {
  const needle = code.trim().toUpperCase();
  if (prisma) {
    try {
      const rec = await prisma.appointment.findUnique({ where: { trackingCode: needle } });
      if (rec) {
        return {
          id: rec.id,
          trackingCode: rec.trackingCode ?? undefined,
          name: rec.name,
          phone: rec.phone,
          city: rec.city ?? "",
          fabricId: (rec.fabricId as "velvet" | "linen" | "chiffon" | undefined) ?? undefined,
          notes: rec.notes ?? "",
          source: rec.source ?? "curtains-section",
          status: rec.status as AppointmentStatus,
          createdAt: rec.createdAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("[appointments-store] tracking fallback:", err);
    }
  }

  const items = await readAll();
  return items.find((item) => item.trackingCode?.toUpperCase() === needle) ?? null;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<StoredAppointment | null> {
  if (prisma) {
    try {
      const rec = await prisma.appointment.update({
        where: { id },
        data: { status: status as PrismaAppointmentStatus },
      });
      return {
        id: rec.id,
        trackingCode: rec.trackingCode ?? undefined,
        name: rec.name,
        phone: rec.phone,
        city: rec.city ?? "",
        fabricId: (rec.fabricId as "velvet" | "linen" | "chiffon" | undefined) ?? undefined,
        notes: rec.notes ?? "",
        source: rec.source ?? "curtains-section",
        status: rec.status as AppointmentStatus,
        createdAt: rec.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn("[appointments-store] Prisma update fallback:", err);
    }
  }

  const items = await readAll();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const current = items[index];
  if (!current) return null;
  const updated: StoredAppointment = { ...current, status };
  items[index] = updated;
  await writeAll(items);
  return updated;
}

export async function countAppointments(): Promise<number> {
  if (prisma) {
    try {
      return await prisma.appointment.count();
    } catch {
      // fallback
    }
  }
  return (await readAll()).length;
}
