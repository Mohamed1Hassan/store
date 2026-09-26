/**
 * سجل أحداث التحويل server-side (B4 EventLog).
 * يخزن الأحداث في `.data/events.json` محلياً مع حد أقصى للحجم
 * ليتمكن صاحب المتجر من معرفة مصادر كل نقرة (hero/navbar/form/curtains).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

export type ServerTrackEvent =
  | "whatsapp_click"
  | "order_submit"
  | "lead_created"
  | "appointment_created";

export interface LoggedEvent {
  id: string;
  type: ServerTrackEvent;
  source?: string;
  payload?: Record<string, string>;
  ip?: string;
  createdAt: string;
}

const EVENTS_DIR = path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(EVENTS_DIR, "events.json");
const MAX_EVENTS = 5000;

async function ensureFile(): Promise<void> {
  try {
    await fs.mkdir(EVENTS_DIR, { recursive: true });
    await fs.access(EVENTS_FILE);
  } catch {
    await fs.writeFile(EVENTS_FILE, "[]", "utf-8");
  }
}

async function readAll(): Promise<LoggedEvent[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(EVENTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LoggedEvent[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(events: LoggedEvent[]): Promise<void> {
  await ensureFile();
  const truncated = events.slice(-MAX_EVENTS);
  await fs.writeFile(EVENTS_FILE, JSON.stringify(truncated, null, 2), "utf-8");
}

export async function logEvent(
  type: ServerTrackEvent,
  source?: string,
  payload?: Record<string, string>,
  ip?: string
): Promise<LoggedEvent> {
  const item: LoggedEvent = {
    id: randomUUID(),
    type,
    source: source || "unknown",
    payload,
    ip: ip ? ip.replace(/^.*:/, "") : undefined,
    createdAt: new Date().toISOString(),
  };

  try {
    const all = await readAll();
    all.push(item);
    await writeAll(all);
  } catch (error) {
    console.error("[events-store] فشل حفظ الحدث:", error);
  }

  return item;
}

export async function listEvents(limit = 100): Promise<LoggedEvent[]> {
  const all = await readAll();
  return all.slice(-limit).reverse();
}

export async function countEventsByType(): Promise<Record<string, number>> {
  const all = await readAll();
  const counts: Record<string, number> = {};
  for (const ev of all) {
    counts[ev.type] = (counts[ev.type] ?? 0) + 1;
  }
  return counts;
}

/** بديل متوافق مع واجهة B1 السابقة */
export function trackEventName(name: ServerTrackEvent, params?: Record<string, string>): void {
  void logEvent(name, params?.source, params);
}

