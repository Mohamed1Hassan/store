/** أنواع أقمشة الستائر — مفصولة عن العرض حسب قاعدة المشروع */

export interface CurtainFabric {
  id: string;
  title: string;
  desc: string;
  colorHex: string;
  features: string[];
  image: string;
}

export const CURTAIN_FABRICS: CurtainFabric[] = [
  {
    id: "velvet",
    title: "القطيفة المخملية الثقيلة (Velvet Blackout)",
    desc: "عزل تام للضوء بنسبة 100% مع عزل صوتي وحراري فائق وانسدال ملكي جذاب.",
    colorHex: "#b8860b",
    features: ["عزل حراري وصوتي", "مانع للأشعة فوق البنفسجية", "ملمس فائق النعومة"],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535057/%D8%A7%D9%84%D9%82%D8%B7%D9%8A%D9%81%D8%A9_%D8%A7%D9%84%D9%85%D8%AE%D9%85%D9%84%D9%8A%D8%A9_%D8%A7%D9%84%D8%AB%D9%82%D9%8A%D9%84%D8%A9_Velvet_Blackout.jpg",
  },
  {
    id: "linen",
    title: "الكتان الإسباني الطبيعي (Natural Linen)",
    desc: "طراز مودرن كلاسيك راقي، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
    colorHex: "#d4af37",
    features: ["طبيعي 100%", "مظهر عصري أنيق", "سهل الغسيل والعناية"],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
  {
    id: "chiffon",
    title: "الشيفون والحرير الفرنسي المهدل (Soft Sheer)",
    desc: "طبقة ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
    colorHex: "#e8d8b0",
    features: ["شفافية شمسية ناعمة", "تطريز ذهبي يدوي", "مقاوم للتجعد"],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535056/%D8%A7%D9%84%D8%B4%D9%8A%D9%81%D9%88%D9%86_%D9%88%D8%A7%D9%84%D8%AD%D8%B1%D9%8A%D8%B0_%D8%A7%D9%84%D9%81%D8%B1%D9%86%D8%B3%D9%8A_%D8%A7%D9%84%D9%85%D9%87%D8%AF%D9%84_Soft_Sheer.jpg",
  },
];

/** أنواع أقمشة الستائر المعروضة افتراضياً */
export const DEFAULT_FABRIC_ID = "velvet";
