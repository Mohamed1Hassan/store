import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "./db";
import { siteContentSchema, type SiteContent } from "@/schemas/site-content";
import { DEFAULT_SITE_CONTENT, DEFAULT_SUITE_SCENES } from "./site-content-defaults";

// نُعيد التصدير للتوافق مع الاستيرادات القديمة (server-only).
export { DEFAULT_SITE_CONTENT, DEFAULT_SUITE_SCENES };

const DATA_DIR = path.join(process.cwd(), ".data");
const CONTENT_FILE = path.join(DATA_DIR, "site-content.json");

function jsonFallbackWritable(): boolean {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return true;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (prisma) {
    try {
      const rec = await prisma.siteContent.findUnique({
        where: { id: "default" },
      });
      if (rec && rec.data) {
        const parsed = siteContentSchema.safeParse({
          ...DEFAULT_SITE_CONTENT,
          ...(typeof rec.data === "object" && rec.data !== null ? (rec.data as object) : {}),
        });
        if (parsed.success) {
          return parsed.data;
        }
      }
    } catch (err) {
      console.warn("[site-content-store] Prisma getSiteContent fallback:", err);
    }
  }

  try {
    const raw = await readFile(CONTENT_FILE, "utf-8");
    const json = JSON.parse(raw);
    const parsed = siteContentSchema.safeParse({
      ...DEFAULT_SITE_CONTENT,
      ...(typeof json === "object" && json !== null ? json : {}),
    });
    if (parsed.success) {
      return parsed.data;
    }
  } catch {
    // fallback to defaults
  }

  return DEFAULT_SITE_CONTENT;
}

export async function saveSiteContent(partial: Partial<SiteContent>): Promise<SiteContent> {
  const current = await getSiteContent();
  const merged: SiteContent = {
    ...current,
    ...partial,
    announcement: {
      ...current.announcement,
      ...(partial.announcement || {}),
    },
    hero: {
      ...current.hero,
      ...(partial.hero || {}),
      scenes: partial.hero?.scenes !== undefined ? partial.hero.scenes : current.hero.scenes,
      features: partial.hero?.features !== undefined ? partial.hero.features : current.hero.features,
    },
    mattress: {
      ...current.mattress,
      ...(partial.mattress || {}),
      layers: partial.mattress?.layers !== undefined ? partial.mattress.layers : current.mattress.layers,
      specs: partial.mattress?.specs !== undefined ? partial.mattress.specs : current.mattress.specs,
    },
    curtains: {
      ...current.curtains,
      ...(partial.curtains || {}),
    },
    testimonials: {
      ...current.testimonials,
      ...(partial.testimonials || {}),
      items: partial.testimonials?.items !== undefined ? partial.testimonials.items : current.testimonials.items,
    },
    footer: {
      ...current.footer,
      ...(partial.footer || {}),
      guarantees: partial.footer?.guarantees !== undefined ? partial.footer.guarantees : current.footer.guarantees,
    },
    contact: {
      ...current.contact,
      ...(partial.contact || {}),
    },
    faq: partial.faq !== undefined ? partial.faq : current.faq,
  };

  const parsed = siteContentSchema.parse(merged);

  if (prisma) {
    try {
      await prisma.siteContent.upsert({
        where: { id: "default" },
        update: { data: parsed as any },
        create: { id: "default", data: parsed as any },
      });
      return parsed;
    } catch (err) {
      console.warn("[site-content-store] Prisma saveSiteContent fallback:", err);
    }
  }

  if (jsonFallbackWritable()) {
    try {
      await mkdir(DATA_DIR, { recursive: true });
      await writeFile(CONTENT_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    } catch (err) {
      console.warn("[site-content-store] فشل الكتابة على site-content.json:", err);
    }
  }

  return parsed;
}
