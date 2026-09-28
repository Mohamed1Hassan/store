/**
 * القيم الافتراضية لمحتوى الموقع (Client-safe).
 * لا تستورد هنا أي شيء من `node:*` أو Prisma حتى يمكن استخدامها داخل
 * مكوّنات العميل (لوحة الأدمن) بدون كسر الحزمة.
 */

import type { SiteContent } from "@/schemas/site-content";
import { FAQ_ITEMS } from "@/data/faq";
import { PHONE_DISPLAY, STORE_HOURS, WHATSAPP_NUMBER } from "@/data/site";
import { MATTRESS_LAYERS, MATTRESS_MODEL, MATTRESS_SPECS } from "@/data/mattress";
import { RATING_SUMMARY, TESTIMONIALS } from "@/data/testimonials";

export const DEFAULT_SUITE_SCENES: SiteContent["hero"]["scenes"] = [
  {
    id: "royal-suite",
    short: "الجناح الملكي",
    tag: "Master Presidential Suite",
    videoSrc: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468749/luxury-bed-suite.mp4",
    poster: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468749/luxury-bed-suite.jpg",
    badges: ["قطن مصري 100%", "عزل كامل للضوء", "شاسيه بوكيت ألماني"],
  },
  {
    id: "bespoke-curtains",
    short: "الستائر الفاخرة",
    tag: "Bespoke Royal Drapery",
    videoSrc: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468512/curtain-sunlight.mp4",
    poster: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468512/curtain-sunlight.jpg",
    badges: ["عزل حراري وصوتي", "مقاومة للتجعد", "خياطة ليزر دقيقة"],
  },
  {
    id: "ultimate-comfort",
    short: "الراحة الملكية",
    tag: "Orthopedic Sleep Comfort",
    videoSrc: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468618/hotel-detail-4197.mp4",
    poster: "https://res.cloudinary.com/aogjvfdt/video/upload/f_auto,q_auto/v1790468618/hotel-detail-4197.jpg",
    badges: ["دعم فقرات الظهر", "معالجة ضد البكتيريا", "ضمان 10 سنوات"],
  },
];

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
    scenes: DEFAULT_SUITE_SCENES,
  },
  mattress: {
    badge: "هندسة النوم الملكي",
    title: "مراتب",
    accent: "السلطان الطبية",
    description:
      "صُممت بعناية فائقة لتمنحك نوماً هنيئاً وراحة لا تضاهى. هيكل مدعم بنوابض منفصلة وتقنيات العزل الحراري المتقدمة.",
    modelName: MATTRESS_MODEL.name,
    modelEyebrow: MATTRESS_MODEL.eyebrow,
    price: MATTRESS_MODEL.price,
    oldPrice: MATTRESS_MODEL.oldPrice,
    layers: MATTRESS_LAYERS.map((l) => ({
      title: l.title,
      desc: l.desc,
      tag: l.tag,
    })),
    specs: MATTRESS_SPECS.map((s) => ({
      label: s.label,
      val: s.val,
    })),
  },
  curtains: {
    badge: "تفصيل وتصميم حسب المقاس",
    title: "ستائر",
    accent: "السلطان الفاخرة",
    description:
      "نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن.",
    freeInspectionNote: "خدمة المعاينة المنزلية ورفع المقاسات مجاناً",
  },
  testimonials: {
    badge: "آراء عملاء المعرض",
    title: "ثقة",
    accent: "نعتز بها",
    description: "آراء من عملاء جهّزوا غرف نومهم وصالوناتهم من مفروشات ومراتب وستائر السلطان.",
    ratingAverage: RATING_SUMMARY.average,
    ratingCount: String(RATING_SUMMARY.count),
    ratingLabel: RATING_SUMMARY.label,
    items: TESTIMONIALS.map((t) => ({
      id: t.id,
      name: t.name,
      city: t.city,
      rating: t.rating,
      purchase: t.purchase,
      text: t.text,
    })),
  },
  footer: {
    tagline:
      "عنوان الفخامة والجودة العالية لأكثر من 20 عاماً في صناعة المراتب الطبية وتفصيل أرقى الستائر والمفروشات الفندقية والمنزلية.",
    subTagline: "راحة ملكية تستحقها في كل تفصيلة",
    guarantees: [
      "ضمان استبدال مباشر 10 سنوات",
      "خامات معالجة طبياً ضد عتة الفراش",
      "تجربة نوم مريحة وداعمة للفقرات",
      "فريق فني متخصص لرفع المقاسات والتركيب",
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
