export interface Product3D {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: string;
  originalPrice?: string;
  description: string;
  modelType: "custom" | "gltf";
  modelPath?: string;
  scale?: number;
  yOffset?: number;
  cameraPosition: { x: number; y: number; z: number };
  cameraLookAt: { x: number; y: number; z: number };
  features: string[];
}

export const PRODUCTS_CATALOG: Product3D[] = [
  {
    id: "royal-bed-suite",
    name: "طقم سرير السلطان الملكي والستائر (غرفة متكاملة)",
    category: "مفروشات وستائر",
    tag: "موديل 3D ملكي فائق الدقة",
    price: "18,900 ج.م",
    originalPrice: "24,000 ج.م",
    description: "طقم غرفة النوم الملكية المتكاملة مع السرير الكابوتونيه الفاخر، المرتبة الطبية، الستائر المخملية ومفارش الأجنحة الملكية.",
    modelType: "gltf",
    modelPath: "/models/bed.glb",
    scale: 1.15,
    yOffset: 0.1,
    cameraPosition: { x: 0, y: 2.8, z: 6.2 },
    cameraLookAt: { x: 0, y: 1.0, z: 0.2 },
    features: [
      "سرير كابوتونيه وتصميم فندقي 7 نجوم",
      "مرتبة بوكيت سبرينج نوابض منفصلة",
      "مفارش قطنية تركية مطرزة",
      "كافر وواقي حماية للمرتبة"
    ],
  },
  {
    id: "medical-mattress-protector",
    name: "كافر وواقي المرتبة الفندقي ضد السوائل (Mattress Protector)",
    category: "كافر المراتب",
    tag: "عازل 100% قطني",
    price: "850 ج.م",
    originalPrice: "1,200 ج.م",
    description: "كافر واقي للمرتبة عازل تماماً للسوائل والمياه مع طبقة قطنية تنفسية تمنع وصول أي رطوبة أو بكتيريا لجسم المرتبة.",
    modelType: "custom",
    cameraPosition: { x: 0, y: 2.4, z: 4.8 },
    cameraLookAt: { x: 0, y: 0.9, z: 0.2 },
    features: [
      "عزل تام للمياه والسوائل بتقنية TPU المتطورة",
      "سطح قطني ناعم وصامت بدون أي أصوات مزعجة",
      "جوانب مطاطية كاملة تثبت بإحكام لكافة الارتفاعات",
      "قابل للغسيل المتكرر في الغسالة الأوتوماتيكية"
    ],
  },
  {
    id: "royal-curtains",
    name: "ستائر السلطان المخملية الفاخرة (Royal Velvet Curtains)",
    category: "الستائر الملكية",
    tag: "تفصيل حسب المقاس",
    price: "4,600 ج.م",
    originalPrice: "6,000 ج.م",
    description: "ستائر قطيفة إيطالية ثقيلة مع طبقة شيفون فرنسية مهدلة لعزل الضوء بنسبة 100% وإعطاء مظهر قصر ملكي للغرفة.",
    modelType: "custom",
    cameraPosition: { x: 0, y: 2.9, z: 5.5 },
    cameraLookAt: { x: 0, y: 2.5, z: -1.6 },
    features: [
      "عزل ضوئي وحراري تام (Blackout 100%)",
      "أقمشة قطيفة وشانيل مستوردة فاخرة",
      "تطريز يدوي وحلقات ستانلس مذهبة ومقاومة للصدأ",
      "معاينة ورفع مقاسات وتفصيل مجاني حتى باب المنزل"
    ],
  },
  {
    id: "hotel-pillow-suite",
    name: "طقم وسائد ومفروشات النخبة (Hotel Microfiber Pillows)",
    category: "المفروشات والوسائد",
    tag: "موديل 3D واقعي",
    price: "1,450 ج.م",
    originalPrice: "1,950 ج.م",
    description: "وسائد فندقية طبية محشوة بألياف المايكروفايبر العذراء مع أغطية قطن مصري 100% لنوم مريح وصحي للرقبة والفقرات.",
    modelType: "gltf",
    modelPath: "/models/pillow.glb",
    scale: 1.5,
    yOffset: 0.8,
    cameraPosition: { x: 0, y: 2.0, z: 3.5 },
    cameraLookAt: { x: 0, y: 0.8, z: 0 },
    features: [
      "حشوة ألياف مايكروفايبر طبية عذراء بديلة للريش",
      "غطاء قطن مصري طويل التيلة ناعم الملمس",
      "دعم مثالي لفقرات العنق وتخفيف آلام النوم",
      "مضادة للبكتيريا وعثة الفراش ومسببات الحساسية"
    ],
  },
];
