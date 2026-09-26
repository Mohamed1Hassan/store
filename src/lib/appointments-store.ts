/**
 * طبقة تخزين حجوزات المعاينة (Appointments).
 * نفس نمط `leads-store`: ملف محلي `.data/appointments.json` الآن،
 * والواجهة ثابتة للترقية إلى Prisma دون تغيير الـ API.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { AppointmentInput } from "@/schemas/appointment";

export type AppointmentStatus = "NEW" | "CONTACTED" | "SCHEDULED" | "DONE" | "CANCELLED";

export interface StoredAppointment extends Omit<AppointmentInput, "company"> {
  id: string;
  status: AppointmentStatus;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const APPOINTMENTS_FILE = path.join(DATA_DIR, "appointments.json");

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
  const clean: StoredAppointment = {
    ...rest,
    id: randomUUID(),
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  const items = await readAll();
  items.unshift(clean);
  await writeAll(items);
  return clean;
}

export async function listAppointments(limit = 50): Promise<StoredAppointment[]> {
  const items = await readAll();
  return items.slice(0, Math.max(1, Math.min(limit, 200)));
}

export async function getAppointmentById(id: string): Promise<StoredAppointment | null> {
  const items = await readAll();
  return items.find((item) => item.id === id) ?? null;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<StoredAppointment | null> {
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
  return (await readAll()).length;
}
