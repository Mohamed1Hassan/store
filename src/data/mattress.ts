/** محتوى قسم المراتب — مفصول عن العرض حسب قاعدة المشروع */

export interface MattressLayer {
  title: string;
  desc: string;
  tag: string;
}

export interface MattressSpec {
  label: string;
  val: string;
}

export const MATTRESS_MODEL = {
  eyebrow: "مرتبة عملية وأرضية",
  name: "المرتبة الأرضية",
  oldPrice: "",
  price: "يبدأ من 1,100 ج.م",
};

export const MATTRESS_LAYERS: MattressLayer[] = [
  {
    title: "قماش قطن ناعم ومريح",
    desc: "قماش قطني ناعم الملمس يمنحك إحساساً بالراحة والجودة في كل لحظة.",
    tag: "الطبقة الخارجية",
  },
  {
    title: "حشو فايبر هولو سوبر سوفت",
    desc: "حشو فايبر هولو فائق النعومة يمنحك راحة عالية وإحساساً بالدفء الخفيف.",
    tag: "طبقة الراحة",
  },
  {
    title: "بنية خفيفة الوزن ومتينة",
    desc: "هيكل داخلي خفيف الوزن (حوالي 5 كجم فقط) يسهّل الحمل والتخزين والسفر.",
    tag: "الهيكل الداخلي",
  },
  {
    title: "شريطا إسكوتش للطي والتثبيت",
    desc: "مزودة بشريطين لتجميع المرتبة بسهولة عند اللف والتخزين في أي مكان.",
    tag: "نظام التثبيت",
  },
];

export const MATTRESS_SPECS: MattressSpec[] = [
  { label: "الارتفاع", val: "15 سم" },
  { label: "العرض", val: "حتى 210 سم" },
  { label: "الوزن", val: "حوالي 5 كجم" },
  { label: "الضمان", val: "24 شهر على الجودة" },
  { label: "الاستخدام", val: "ضيوف · أطفال · سفر" },
  { label: "المقاسات", val: "متر / متر و20" },
];
