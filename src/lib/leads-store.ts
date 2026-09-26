/**
 * طبقة تخزين الطلبات (Leads).
 * المرحلة B1: مخزن ملفات محلي `.data/leads.json` يعمل فوراً بدون أي DB خارجية.
 * المرحلة B1.2: عند ضبط `DATABASE_URL` سنستبدل الداخل بـ Prisma دون تغيير واجهة الدوال.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeadInput } from "@/schemas/lead";

export type LeadStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

export interface StoredLead extends Omit<LeadInput, "company"> {
  id: string;
  status: LeadStatus;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

async function readAll(): Promise<StoredLead[]> {
  try {
    const raw = await readFile(LEADS_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredLead[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(leads: StoredLead[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(LEADS_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function saveLead(input: LeadInput): Promise<StoredLead> {
  const { company: _honeypot, ...rest } = input;
  void _honeypot;
  const clean: StoredLead = {
    ...rest,
    id: randomUUID(),
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  const leads = await readAll();
  leads.unshift(clean);
  await writeAll(leads);
  return clean;
}

export async function listLeads(limit = 50): Promise<StoredLead[]> {
  const leads = await readAll();
  return leads.slice(0, Math.max(1, Math.min(limit, 200)));
}

export async function countLeads(): Promise<number> {
  return (await readAll()).length;
}
