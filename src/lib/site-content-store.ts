import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "./db";
import { siteContentSchema, type SiteContent } from "@/schemas/site-content";
import { FAQ_ITEMS } from "@/data/faq";
import { PHONE_DISPLAY, STORE_HOURS, WHATSAPP_NUMBER } from "@/data/site";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  announcement: {
    badge: "عرض اليوم:",
    text: "كافر مراتب مجاني + خصم حتى",
    highlight: "5,100 ج.م",
    suffix: "على الغرفة المتكاملة",
    enabled: true,
  },
  hero: {
    badge: "الاسم الأول في عالم الفخامة والراحة الملكية",
    titleLine1: "السلطان",
    titleLine2: "للمفروشات والستائر",
    titleLine3: "وكافر المراتب الطبية",
    description:
      "نصنع لك أرقى غرف النوم الملكية بتوليفة استثنائية من المراتب الطبية بنوابض منفصلة، والستائر الفاخرة المفصلة على مقاسك، والمفروشات الفندقية الحريرية.",
    ctaText: "تواصل واطلب مقاسك الآن",
    features: [
      { label: "ضمان استبدال 10 سنوات" },
      { label: "تفصيل فوري لجميع المقاسات" },
      { label: "توصيل ومعاينة مجانية" },
      { label: "كافر هدية مع كل مرتبة" },
    ],
  },
  contact: {
    phoneDisplay: PHONE_DISPLAY,
    whatsappNumber: WHATSAPP_NUMBER,
    storeHours: STORE_HOURS,
    location: "القاهرة، جمهورية مصر العربية",
  },
  faq: FAQ_ITEMS.map((item) => ({
    question: item.question,
    answer: item.answer,
  })),
};

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
        const parsed = siteContentSchema.safeParse(rec.data);
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
    const parsed = siteContentSchema.safeParse(JSON.parse(raw));
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
