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

export const curtainFabricSchema = z.object({
  id: z.string().default("velvet"),
  title: z.string().min(1, "اسم القماش مطلوب"),
  desc: z.string().min(1, "وصف القماش مطلوب"),
  image: z.string().default(""),
  features: z.array(z.string()).default([]),
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
      modelImage: z.string().default(""),
      layersHeading: z.string().default("طبقات المرتبة من الداخل للخارج:"),
      giftBadge: z.string().default("هدية"),
      giftTitle: z.string().default("كافر وواقي مرتبة ضد السوائل والمياه مجاناً"),
      giftDesc: z.string().default("طبقة عازلة بتقنية TPU تنفسية قطنية 100% مع كل مرتبة"),
      giftCta: z.string().default("اطلب الآن مع الكافر المجاني"),
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
      modelImage: "",
      layersHeading: "طبقات المرتبة من الداخل للخارج:",
      giftBadge: "هدية",
      giftTitle: "كافر وواقي مرتبة ضد السوائل والمياه مجاناً",
      giftDesc: "طبقة عازلة بتقنية TPU تنفسية قطنية 100% مع كل مرتبة",
      giftCta: "اطلب الآن مع الكافر المجاني",
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
      originBadge: z.string().default("خامات أصلية مضمونة"),
      cardFooter: z.string().default("تفصيل على المقاس لكل نافذة"),
      selectLabel: z.string().default("اختر القماش"),
      fabrics: z.array(curtainFabricSchema).default([
        {
          id: "velvet",
          title: "ستائر السلطان المخملية الفاخرة (Velvet Blackout)",
          desc: "عزل تام للضوء بنسبة 100% مع عزل صوتي وحراري فائق وانسدال ملكي جذاب.",
          image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535057/%D8%A7%D9%84%D9%82%D8%B7%D9%8A%D9%81%D8%A9_%D8%A7%D9%84%D9%85%D8%AE%D9%85%D9%84%D9%8A%D8%A9_%D8%A7%D9%84%D8%AB%D9%82%D9%8A%D9%84%D8%A9_Velvet_Blackout.jpg",
          features: ["عزل ضوئي وحراري تام (Blackout 100%)", "أقمشة قطيفة وشانيل مستوردة فاخرة", "تطريز يدوي وحلقات ستانلس مذهبة"],
        },
        {
          id: "linen",
          title: "ستائر الكتان الإسباني الطبيعي (Natural Linen)",
          desc: "طراز مودرن كلاسيك راقي، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
          image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
          features: ["طبيعي 100%", "مظهر عصري أنيق ومريح", "سهل الغسيل والعناية"],
        },
        {
          id: "chiffon",
          title: "ستائر الشيفون والحرير الفرنسي (Soft Sheer)",
          desc: "طبقة ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
          image: "",
          features: ["شفافية شمسية ناعمة", "تطريز ذهبي يدوي فاخر", "مقاوم للتجعد والغسيل المتكرر"],
        },
      ]),
    })
    .default({
      badge: "تفصيل وتصميم حسب المقاس",
      title: "ستائر",
      accent: "السلطان الفاخرة",
      description:
        "نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن.",
      freeInspectionNote: "خدمة المعاينة المنزلية ورفع المقاسات مجاناً",
      originBadge: "خامات أصلية مضمونة",
      cardFooter: "تفصيل على المقاس لكل نافذة",
      selectLabel: "اختر القماش",
      fabrics: [
        {
          id: "velvet",
          title: "ستائر السلطان المخملية الفاخرة (Velvet Blackout)",
          desc: "عزل تام للضوء بنسبة 100% مع عزل صوتي وحراري فائق وانسدال ملكي جذاب.",
          image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535057/%D8%A7%D9%84%D9%82%D8%B7%D9%8A%D9%81%D8%A9_%D8%A7%D9%84%D9%85%D8%AE%D9%85%D9%84%D9%8A%D8%A9_%D8%A7%D9%84%D8%AB%D9%82%D9%8A%D9%84%D8%A9_Velvet_Blackout.jpg",
          features: ["عزل ضوئي وحراري تام (Blackout 100%)", "أقمشة قطيفة وشانيل مستوردة فاخرة", "تطريز يدوي وحلقات ستانلس مذهبة"],
        },
        {
          id: "linen",
          title: "ستائر الكتان الإسباني الطبيعي (Natural Linen)",
          desc: "طراز مودرن كلاسيك راقي، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
          image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
          features: ["طبيعي 100%", "مظهر عصري أنيق ومريح", "سهل الغسيل والعناية"],
        },
        {
          id: "chiffon",
          title: "ستائر الشيفون والحرير الفرنسي (Soft Sheer)",
          desc: "طبقة ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
          image: "",
          features: ["شفافية شمسية ناعمة", "تطريز ذهبي يدوي فاخر", "مقاوم للتجعد والغسيل المتكرر"],
        },
      ],
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
  protector: z
    .object({
      badge: z.string().default("حماية كاملة لمرتبتك"),
      title: z.string().default("كافر وواقي"),
      accent: z.string().default("المراتب ضد السوائل"),
      giftTitle: z.string().default("هدية مجانية مع كل مرتبة"),
      giftDesc: z.string().default(
        "يتضمن الكافر والواقي مجاناً مع أي مرتبة من مراتب السلطان الطبية."
      ),
      ctaText: z.string().default("اطلب الكافر الآن"),
      image: z.string().default(""),
    })
    .default({
      badge: "حماية كاملة لمرتبتك",
      title: "كافر وواقي",
      accent: "المراتب ضد السوائل",
      giftTitle: "هدية مجانية مع كل مرتبة",
      giftDesc: "يتضمن الكافر والواقي مجاناً مع أي مرتبة من مراتب السلطان الطبية.",
      ctaText: "اطلب الكافر الآن",
      image: "",
    }),
  pillows: z
    .object({
      badge: z.string().default("نوم فندقي 7 نجوم"),
      title: z.string().default("مفروشات ووسائد"),
      accent: z.string().default("النخبة الفاخرة"),
      ctaText: z.string().default("اطلب طقم الوسائد الآن"),
      highlights: z
        .array(z.string())
        .default(["قطن مصري 100%", "مضادة للبكتيريا", "تفصيل حسب المقاس"]),
      image: z.string().default(""),
    })
    .default({
      badge: "نوم فندقي 7 نجوم",
      title: "مفروشات ووسائد",
      accent: "النخبة الفاخرة",
      ctaText: "اطلب طقم الوسائد الآن",
      highlights: ["قطن مصري 100%", "مضادة للبكتيريا", "تفصيل حسب المقاس"],
      image: "",
    }),
  duvet: z
    .object({
      badge: z.string().default("دفء ملكي طوال الشتاء"),
      title: z.string().default("لحاف السلطان"),
      accent: z.string().default("الملكي الفاخر"),
      ctaText: z.string().default("اطلب اللحاف الملكي الآن"),
      highlights: z
        .array(z.string())
        .default(["مايكروفايبر عذراء", "قطن مصري 100%", "ضد الحساسية"]),
      image: z.string().default(""),
    })
    .default({
      badge: "دفء ملكي طوال الشتاء",
      title: "لحاف السلطان",
      accent: "الملكي الفاخر",
      ctaText: "اطلب اللحاف الملكي الآن",
      highlights: ["مايكروفايبر عذراء", "قطن مصري 100%", "ضد الحساسية"],
      image: "https://res.cloudinary.com/aogjvfdt/image/upload/v1790637937/WhatsApp_Image_2026-09-28_at_2.58.11_PM.jpg",
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
  payment: z
    .object({
      enabled: z.boolean().default(false),
      methods: z
        .array(
          z.object({
            id: z.string().default("bank"),
            label: z.string().default(""),
            enabled: z.boolean().default(false),
            accountHolder: z.string().default(""),
            bankName: z.string().default(""),
            accountNumber: z.string().max(34, "رقم الحساب طويل جداً").default(""),
            extra: z.string().default(""),
            instructions: z.string().default(""),
          })
        )
        .default([]),
      codLabel: z.string().default("الدفع عند الاستلام"),
      requireReceipt: z.boolean().default(true),
    })
    .default({ enabled: false, methods: [], codLabel: "الدفع عند الاستلام", requireReceipt: true }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
export type HeroScene = z.infer<typeof heroSceneSchema>;
export type MattressLayer = z.infer<typeof mattressLayerSchema>;
export type MattressSpec = z.infer<typeof mattressSpecSchema>;
export type TestimonialItem = z.infer<typeof testimonialItemSchema>;
export type CurtainFabricItem = z.infer<typeof curtainFabricSchema>;
export type PaymentMethod = SiteContent["payment"]["methods"][number];

