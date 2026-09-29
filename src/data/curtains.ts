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
    id: "blackout",
    title: "ستائر بلاك أوت بألوان مزدوجة",
    desc: "ألوان مزدوجة راقية لونين في بعض، تحجب الإضاءة تماماً وتعطي شكل شيك وراقي لأي غرفة.",
    colorHex: "#b8860b",
    features: ["حجب تام للضوء", "ألوان مزدوجة راقية", "مقاسات حسب الطلب"],
    image: "",
  },
  {
    id: "barcelona",
    title: "ستائر سادة برشلونة",
    desc: "تصميم بسيط وراقي يناسب مختلف الديكورات ويضيف لمسة هادية وأنيقة لبيتك.",
    colorHex: "#d4af37",
    features: ["تصميم بسيط وأنيق", "يناسب جميع الديكورات", "خامات وتشطيبات عالية الجودة"],
    image: "",
  },
];

/** أنواع أقمشة الستائر المعروضة افتراضياً */
export const DEFAULT_FABRIC_ID = "velvet";
