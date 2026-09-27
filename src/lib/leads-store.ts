/**
 * طبقة تخزين الطلبات (Leads).
 * المرحلة B1: مخزن ملفات محلي `.data/leads.json` يعمل فوراً بدون أي DB خارجية.
 * المرحلة B1.2: عند ضبط `DATABASE_URL` سنستبدل الداخل بـ Prisma دون تغيير واجهة الدوال.
 */

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { LeadInput } from "@/schemas/lead";
import { prisma } from "./db";
import type { LeadStatus as PrismaLeadStatus } from "@prisma/client";

export type LeadStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "DELIVERED" | "CANCELLED";

export interface StoredLead extends Omit<LeadInput, "company"> {
  id: string;
  trackingCode?: string;
  status: LeadStatus;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

function generateTrackingCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "SLT-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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
  const trackingCode = generateTrackingCode();

  if (prisma) {
    try {
      const record = await prisma.lead.create({
        data: {
          trackingCode,
          name: rest.name,
          phone: rest.phone,
          product: rest.product,
          size: rest.size || null,
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
        product: record.product,
        size: record.size ?? "",
        notes: record.notes ?? "",
        source: record.source ?? "order-form",
        status: record.status as LeadStatus,
        createdAt: record.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn("[leads-store] Prisma failed, fallback:", err);
    }
  }

  const clean: StoredLead = {
    ...rest,
    id: randomUUID(),
    trackingCode,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  const leads = await readAll();
  leads.unshift(clean);
  await writeAll(leads);
  return clean;
}

export async function listLeads(limit = 50): Promise<StoredLead[]> {
  const safeLimit = Math.max(1, Math.min(limit, 200));

  if (prisma) {
    try {
      const items = await prisma.lead.findMany({
        take: safeLimit,
        orderBy: { createdAt: "desc" },
      });
      return items.map((rec) => ({
        id: rec.id,
        trackingCode: rec.trackingCode ?? undefined,
        name: rec.name,
        phone: rec.phone,
        product: rec.product,
        size: rec.size ?? "",
        notes: rec.notes ?? "",
        source: rec.source ?? "order-form",
        status: rec.status as LeadStatus,
        createdAt: rec.createdAt.toISOString(),
      }));
    } catch (err) {
      console.warn("[leads-store] Prisma findMany fallback:", err);
    }
  }

  const leads = await readAll();
  return leads.slice(0, safeLimit);
}

export async function getLeadById(id: string): Promise<StoredLead | null> {
  if (prisma) {
    try {
      const rec = await prisma.lead.findUnique({ where: { id } });
      if (rec) {
        return {
          id: rec.id,
          trackingCode: rec.trackingCode ?? undefined,
          name: rec.name,
          phone: rec.phone,
          product: rec.product,
          size: rec.size ?? "",
          notes: rec.notes ?? "",
          source: rec.source ?? "order-form",
          status: rec.status as LeadStatus,
          createdAt: rec.createdAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("[leads-store] Prisma findUnique fallback:", err);
    }
  }

  const leads = await readAll();
  return leads.find((lead) => lead.id === id) ?? null;
}

export async function getLeadByTrackingCode(code: string): Promise<StoredLead | null> {
  const needle = code.trim().toUpperCase();
  if (prisma) {
    try {
      const rec = await prisma.lead.findUnique({ where: { trackingCode: needle } });
      if (rec) {
        return {
          id: rec.id,
          trackingCode: rec.trackingCode ?? undefined,
          name: rec.name,
          phone: rec.phone,
          product: rec.product,
          size: rec.size ?? "",
          notes: rec.notes ?? "",
          source: rec.source ?? "order-form",
          status: rec.status as LeadStatus,
          createdAt: rec.createdAt.toISOString(),
        };
      }
    } catch (err) {
      console.warn("[leads-store] tracking fallback:", err);
    }
  }

  const leads = await readAll();
  return leads.find((lead) => lead.trackingCode?.toUpperCase() === needle) ?? null;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<StoredLead | null> {
  if (prisma) {
    try {
      const rec = await prisma.lead.update({
        where: { id },
        data: { status: status as PrismaLeadStatus },
      });
      return {
        id: rec.id,
        trackingCode: rec.trackingCode ?? undefined,
        name: rec.name,
        phone: rec.phone,
        product: rec.product,
        size: rec.size ?? "",
        notes: rec.notes ?? "",
        source: rec.source ?? "order-form",
        status: rec.status as LeadStatus,
        createdAt: rec.createdAt.toISOString(),
      };
    } catch (err) {
      console.warn("[leads-store] Prisma update fallback:", err);
    }
  }

  const leads = await readAll();
  const index = leads.findIndex((lead) => lead.id === id);
  if (index === -1) return null;
  const current = leads[index];
  if (!current) return null;
  const updated: StoredLead = { ...current, status };
  leads[index] = updated;
  await writeAll(leads);
  return updated;
}

export async function countLeads(): Promise<number> {
  if (prisma) {
    try {
      return await prisma.lead.count();
    } catch {
      // fallback
    }
  }
  return (await readAll()).length;
}
