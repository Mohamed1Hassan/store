/**
 * إشعارات صاحب المتجر عند وصول طلب جديد — سلسلة بدائل لا تكسر الحفظ أبداً:
 * 1) WhatsApp Cloud API (إن توفرت كل إعداداته)
 * 2) Resend إيميل (إن توفر المفتاح + إيميل المالك)
 * 3) Google Sheets Webhook نسخة احتياطية (إن توفر الرابط)
 * أي فشل يُسجَّل في console فقط ولا يمنع الرد 201.
 */

import { env, ownerEmail } from "./env";
import { buildLeadMessage } from "@/schemas/lead";
import type { StoredLead } from "./leads-store";

export type NotifyChannel = "whatsapp" | "email" | "sheets";

export interface NotifyResult {
  channel: NotifyChannel;
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

function withTimeout(ms: number): { signal: AbortSignal; done: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

async function notifyWhatsApp(lead: StoredLead): Promise<NotifyResult> {
  const token = env.WHATSAPP_TOKEN;
  const phoneId = env.WHATSAPP_PHONE_NUMBER_ID;
  const to = env.OWNER_WHATSAPP_NUMBER;
  if (!token || !phoneId || !to) return { channel: "whatsapp", ok: false, skipped: true };

  const { signal, done } = withTimeout(8000);
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      signal,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: buildLeadMessage(lead) },
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { channel: "whatsapp", ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    return { channel: "whatsapp", ok: true };
  } catch (error) {
    return { channel: "whatsapp", ok: false, error: error instanceof Error ? error.message : "unknown" };
  } finally {
    done();
  }
}

async function notifyEmail(lead: StoredLead): Promise<NotifyResult> {
  const to = ownerEmail();
  if (!env.RESEND_API_KEY || !to) return { channel: "email", ok: false, skipped: true };

  const { signal, done } = withTimeout(8000);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal,
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "متجر السلطان <orders@sultan-notify.local>",
        to: [to],
        subject: `طلب جديد: ${lead.name} — ${lead.product.slice(0, 40)}`,
        text: `${buildLeadMessage(lead)}\n\nالمصدر: ${lead.source}\nالوقت: ${lead.createdAt}`,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { channel: "email", ok: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
    }
    return { channel: "email", ok: true };
  } catch (error) {
    return { channel: "email", ok: false, error: error instanceof Error ? error.message : "unknown" };
  } finally {
    done();
  }
}

async function backupToSheets(lead: StoredLead): Promise<NotifyResult> {
  const url = env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) return { channel: "sheets", ok: false, skipped: true };

  const { signal, done } = withTimeout(8000);
  try {
    const payload = {
      name: lead.name,
      phone: lead.phone,
      product: lead.product,
      size: lead.size,
      notes: lead.notes,
      source: lead.source,
      id: lead.id,
      status: lead.status,
      createdAt: lead.createdAt,
    };
    const res = await fetch(url, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { channel: "sheets", ok: false, error: `HTTP ${res.status}` };
    }
    return { channel: "sheets", ok: true };
  } catch (error) {
    return { channel: "sheets", ok: false, error: error instanceof Error ? error.message : "unknown" };
  } finally {
    done();
  }
}

/** يرسل كل القنوات المهيأة بالتوازي — لا يرمي أبداً */
export async function notifyOwner(lead: StoredLead): Promise<NotifyResult[]> {
  const results = await Promise.all([notifyWhatsApp(lead), notifyEmail(lead), backupToSheets(lead)]);
  for (const result of results) {
    if (result.skipped) continue;
    if (result.ok) {
      console.info(`[notify] ${result.channel} sent for lead ${lead.id}`);
    } else {
      console.warn(`[notify] ${result.channel} failed for lead ${lead.id}: ${result.error}`);
    }
  }
  return results;
}
