/** أنواع أقمشة الستائر — مفصولة عن العرض حسب قاعدة المشروع */

export interface CurtainFabric {
  id: string;
  title: string;
  desc: string;
  colorHex: string;
  features: string[];
}

export const CURTAIN_FABRICS: CurtainFabric[] = [
  {
    id: "velvet",
    title: "القطيفة المخملية الثقيلة (Velvet Blackout)",
    desc: "عزل تام للضوء بنسبة 100% مع عزل صوتي وحراري فائق وانسدال ملكي جذاب.",
    colorHex: "#b8860b",
    features: ["عزل حراري وصوتي", "مانع للأشعة فوق البنفسجية", "ملمس فائق النعومة"],
  },
  {
    id: "linen",
    title: "الكتان الإسباني الطبيعي (Natural Linen)",
    desc: "طراز مودرن كلاسيك راقي، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
    colorHex: "#d4af37",
    features: ["طبيعي 100%", "مظهر عصري أنيق", "سهل الغسيل والعناية"],
  },
  {
    id: "chiffon",
    title: "الشيفون والحرير الفرنسي المهدل (Soft Sheer)",
    desc: "طبقة ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
    colorHex: "#e8d8b0",
    features: ["شفافية شمسية ناعمة", "تطريز ذهبي يدوي", "مقاوم للتجعد"],
  },
];

/** أنواع أقمشة الستائر المعروضة افتراضياً */
export const DEFAULT_FABRIC_ID = "velvet";
