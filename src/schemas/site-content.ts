import { z } from "zod";

export const heroFeatureSchema = z.object({
  label: z.string().trim().min(1, "عنوان الميزة مطلوب"),
});

export const heroSceneSchema = z.object({
  id: z.string().default("scene-1"),
  short: z.string().min(1, "اسم المشهد مطلوب"),
  tag: z.string().default(""),
  videoSrc: z.string().min(1, "رابط الفيديو مطلوب"),
  poster: z.string().default(""),
  badges: z.array(z.string()).default([]),
});

export const mattressLayerSchema = z.object({
  title: z.string().min(1, "اسم الطبقة مطلوب"),
  desc: z.string().min(1, "وصف الطبقة مطلوب"),
  tag: z.string().default("طبقة مميزة"),
});

export const mattressSpecSchema = z.object({
  label: z.string().min(1, "اسم الخاصية مطلوب"),
  val: z.string().min(1, "قيمة الخاصية مطلوبة"),
});

export const testimonialItemSchema = z.object({
  id: z.string().default("t-1"),
  name: z.string().min(1, "اسم العميل مطلوب"),
  city: z.string().default("القاهرة"),
  rating: z.number().min(1).max(5).default(5),
  purchase: z.string().min(1, "المنتج المشتري مطلوب"),
  text: z.string().min(1, "نص التقييم مطلوب"),
});

export const siteContentSchema = z.object({
  announcement: z
    .object({
      badge: z.string().default("عرض اليوم:"),
      text: z.string().default("كافر مراتب مجاني + خصم حتى"),
      highlight: z.string().default("5,100 ج.م"),
      suffix: z.string().default("على الغرفة المتكاملة"),
      enabled: z.boolean().default(true),
    })
    .default({
      badge: "عرض اليوم:",
      text: "كافر مراتب مجاني + خصم حتى",
      highlight: "5,100 ج.م",
      suffix: "على الغرفة المتكاملة",
      enabled: true,
    }),
  hero: z
    .object({
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
      scenes: z.array(heroSceneSchema).default([]),
    })
    .default({
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
      scenes: [],
    }),
  mattress: z
    .object({
      badge: z.string().default("هندسة النوم الملكي"),
      title: z.string().default("مراتب"),
      accent: z.string().default("السلطان الطبية"),
      description: z.string().default(
        "صُممت بعناية فائقة لتمنحك نوماً هنيئاً وراحة لا تضاهى. هيكل مدعم بنوابض منفصلة وتقنيات العزل الحراري المتقدمة."
      ),
      modelName: z.string().default("مرتبة السلطان رويال بوكيت"),
      modelEyebrow: z.string().default("موديل الأجنحة الملكية"),
      price: z.string().default("9,400 ج.م"),
      oldPrice: z.string().default("12,500 ج.م"),
      layers: z.array(mattressLayerSchema).default([]),
      specs: z.array(mattressSpecSchema).default([]),
    })
    .default({
      badge: "هندسة النوم الملكي",
      title: "مراتب",
      accent: "السلطان الطبية",
      description:
        "صُممت بعناية فائقة لتمنحك نوماً هنيئاً وراحة لا تضاهى. هيكل مدعم بنوابض منفصلة وتقنيات العزل الحراري المتقدمة.",
      modelName: "مرتبة السلطان رويال بوكيت",
      modelEyebrow: "موديل الأجنحة الملكية",
      price: "9,400 ج.م",
      oldPrice: "12,500 ج.م",
      layers: [],
      specs: [],
    }),
  curtains: z
    .object({
      badge: z.string().default("تفصيل وتصميم حسب المقاس"),
      title: z.string().default("ستائر"),
      accent: z.string().default("السلطان الفاخرة"),
      description: z.string().default(
        "نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن."
      ),
      freeInspectionNote: z.string().default("خدمة المعاينة المنزلية ورفع المقاسات مجاناً"),
    })
    .default({
      badge: "تفصيل وتصميم حسب المقاس",
      title: "ستائر",
      accent: "السلطان الفاخرة",
      description:
        "نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن.",
      freeInspectionNote: "خدمة المعاينة المنزلية ورفع المقاسات مجاناً",
    }),
  testimonials: z
    .object({
      badge: z.string().default("آراء عملاء المعرض"),
      title: z.string().default("ثقة"),
      accent: z.string().default("نعتز بها"),
      description: z.string().default(
        "آراء من عملاء جهّزوا غرف نومهم وصالوناتهم من مفروشات ومراتب وستائر السلطان."
      ),
      ratingAverage: z.string().default("4.9"),
      ratingCount: z.string().default("128"),
      ratingLabel: z.string().default("تقييم عملاء المعرض"),
      items: z.array(testimonialItemSchema).default([]),
    })
    .default({
      badge: "آراء عملاء المعرض",
      title: "ثقة",
      accent: "نعتز بها",
      description:
        "آراء من عملاء جهّزوا غرف نومهم وصالوناتهم من مفروشات ومراتب وستائر السلطان.",
      ratingAverage: "4.9",
      ratingCount: "128",
      ratingLabel: "تقييم عملاء المعرض",
      items: [],
    }),
  footer: z
    .object({
      tagline: z.string().default(
        "عنوان الفخامة والجودة العالية لأكثر من 20 عاماً في صناعة المراتب الطبية وتفصيل أرقى الستائر والمفروشات الفندقية والمنزلية."
      ),
      subTagline: z.string().default("راحة ملكية تستحقها في كل تفصيلة"),
      guarantees: z
        .array(z.string())
        .default([
          "ضمان استبدال مباشر 10 سنوات",
          "خامات معالجة طبياً ضد عتة الفراش",
          "تجربة نوم مريحة وداعمة للفقرات",
          "فريق فني متخصص لرفع المقاسات والتركيب",
        ]),
    })
    .default({
      tagline:
        "عنوان الفخامة والجودة العالية لأكثر من 20 عاماً في صناعة المراتب الطبية وتفصيل أرقى الستائر والمفروشات الفندقية والمنزلية.",
      subTagline: "راحة ملكية تستحقها في كل تفصيلة",
      guarantees: [
        "ضمان استبدال مباشر 10 سنوات",
        "خامات معالجة طبياً ضد عتة الفراش",
        "تجربة نوم مريحة وداعمة للفقرات",
        "فريق فني متخصص لرفع المقاسات والتركيب",
      ],
    }),
  contact: z
    .object({
      phoneDisplay: z.string().default("01055280865"),
      whatsappNumber: z.string().default("201055280865"),
      storeHours: z.string().default("يومياً من 10 صباحاً حتى 11 مساءً"),
      location: z.string().default("القاهرة، جمهورية مصر العربية"),
    })
    .default({
      phoneDisplay: "01055280865",
      whatsappNumber: "201055280865",
      storeHours: "يومياً من 10 صباحاً حتى 11 مساءً",
      location: "القاهرة، جمهورية مصر العربية",
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
export type HeroScene = z.infer<typeof heroSceneSchema>;
export type MattressLayer = z.infer<typeof mattressLayerSchema>;
export type MattressSpec = z.infer<typeof mattressSpecSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;

