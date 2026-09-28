import { z } from "zod";

export const heroFeatureSchema = z.object({
  label: z.string().trim().min(1, "عنوان الميزة مطلوب"),
});

export const siteContentSchema = z.object({
  announcement: z.object({
    badge: z.string().default("عرض اليوم:"),
    text: z.string().default("كافر مراتب مجاني + خصم حتى"),
    highlight: z.string().default("5,100 ج.م"),
    suffix: z.string().default("على الغرفة المتكاملة"),
    enabled: z.boolean().default(true),
  }),
  hero: z.object({
    badge: z.string().default("الاسم الأول في عالم الفخامة والراحة الملكية"),
    titleLine1: z.string().default("السلطان"),
    titleLine2: z.string().default("للمفروشات والستائر"),
    titleLine3: z.string().default("وكافر المراتب الطبية"),
    description: z.string().default(
      "نصنع لك أرقى غرف النوم الملكية بتوليفة استثنائية من المراتب الطبية بنوابض منفصلة، والستائر الفاخرة المفصلة على مقاسك، والمفروشات الفندقية الحريرية."
    ),
    ctaText: z.string().default("تواصل واطلب مقاسك الآن"),
    features: z
      .array(heroFeatureSchema)
      .default([
        { label: "ضمان استبدال 10 سنوات" },
        { label: "تفصيل فوري لجميع المقاسات" },
        { label: "توصيل ومعاينة مجانية" },
        { label: "كافر هدية مع كل مرتبة" },
      ]),
  }),
  contact: z.object({
    phoneDisplay: z.string().default("01055280865"),
    whatsappNumber: z.string().default("201055280865"),
    storeHours: z.string().default("يومياً من 10 صباحاً حتى 11 مساءً"),
    location: z.string().default("القاهرة، جمهورية مصر العربية"),
  }),
  faq: z
    .array(
      z.object({
        question: z.string().min(1, "السؤال مطلوب"),
        answer: z.string().min(1, "الإجابة مطلوبة"),
      })
    )
    .default([]),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
