/** تبويبات الموقع وأقسام المعرض */
export type CategoryId = "room" | "mattress" | "curtains" | "pillows" | "specs";

export interface Product {
  id: string;
  name: string;
  category: string;
  tag: string;
  price: string;
  /** السعر كرقم بالجنيه (يُستخدم في بيانات Offer المنظمة) */
  priceValue: number;
  originalPrice?: string;
  /** مبلغ التوفير كما يظهر للزائر، مثال: "350 ج.م" */
  savingLabel?: string;
  description: string;
  features: string[];
  image?: string;
}

export const PRODUCTS_CATALOG: Product[] = [
  {
    id: "royal-bed-suite",
    name: "طقم سرير السلطان الملكي والستائر (غرفة متكاملة)",
    category: "مفروشات وستائر",
    tag: "الأكثر طلباً في المعرض",
    price: "18,900 ج.م",
    priceValue: 18900,
    originalPrice: "24,000 ج.م",
    savingLabel: "5,100 ج.م",
    description: "طقم غرفة النوم الملكية المتكاملة مع السرير الكابوتونيه الفاخر، المرتبة الطبية، الستائر المخملية ومفارش الأجنحة الملكية.",
    features: [
      "سرير كابوتونيه وتصميم فندقي 7 نجوم",
      "مرتبة بوكيت سبرينج نوابض منفصلة",
      "مفارش قطنية تركية مطرزة",
      "كافر وواقي حماية للمرتبة"
    ],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
  {
    id: "sultan-royal-mattress",
    name: "مرتبة السلطان رويال بوكيت الطبية (Royal Pocket)",
    category: "المرتبة الملكية",
    tag: "ضمان 10 سنوات",
    price: "9,400 ج.م",
    priceValue: 9400,
    originalPrice: "12,500 ج.م",
    savingLabel: "3,100 ج.م",
    description: "مرتبة السلطان رويال بوكيت مع نوابض منفصلة وطبقة ميموري فوم جل لراحة مثالية وتقويم العمود الفقري.",
    features: [
      "ارتفاع 32 سم فاخر",
      "شاسيه نوابض بوكيت معزولة لمنع انتقال الحركة",
      "طبقة ميموري فوم جل بارد",
      "قماش جاكار بلجيكي معالج ضد البكتيريا"
    ],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
  {
    id: "medical-mattress-protector",
    name: "كافر وواقي المرتبة الفندقي ضد السوائل (Mattress Protector)",
    category: "كافر المراتب",
    tag: "عازل 100% قطني",
    price: "850 ج.م",
    priceValue: 850,
    originalPrice: "1,200 ج.م",
    savingLabel: "350 ج.م",
    description: "كافر واقي للمرتبة عازل تماماً للسوائل والمياه مع طبقة قطنية تنفسية تمنع وصول أي رطوبة أو بكتيريا لجسم المرتبة.",
    features: [
      "عزل تام للمياه والسوائل بتقنية TPU المتطورة",
      "سطح قطني ناعم وصامت بدون أي أصوات مزعجة",
      "جوانب مطاطية كاملة تثبت بإحكام لكافة الارتفاعات",
      "قابل للغسيل المتكرر في الغسالة الأوتوماتيكية"
    ],
  },
  {
    id: "royal-curtains",
    name: "ستائر السلطان المخملية الفاخرة (Velvet Blackout)",
    category: "الستائر الملكية",
    tag: "عزل ضوئي 100%",
    price: "4,600 ج.م",
    priceValue: 4600,
    originalPrice: "6,000 ج.م",
    savingLabel: "1,400 ج.م",
    description: "ستائر قطيفة إيطالية ثقيلة مع عزل ضوئي وصوتي وحراري تام وإعطاء مظهر قصر ملكي للغرفة.",
    features: [
      "عزل ضوئي وحراري تام (Blackout 100%)",
      "أقمشة قطيفة وشانيل مستوردة فاخرة",
      "تطريز يدوي وحلقات ستانلس مذهبة ومقاومة للصدأ",
      "معاينة ورفع مقاسات وتفصيل مجاني حتى باب المنزل"
    ],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
  {
    id: "natural-linen-curtains",
    name: "ستائر الكتان الإسباني الطبيعي (Natural Linen)",
    category: "الستائر الملكية",
    tag: "مودرن كلاسيك",
    price: "3,800 ج.م",
    priceValue: 3800,
    originalPrice: "4,900 ج.م",
    savingLabel: "1,100 ج.م",
    description: "طراز مودرن كلاسيك راقي من الكتان الإسباني، يسمح بمرور نسيم الهواء والضوء الخافت الطبيعي.",
    features: [
      "طبيعي 100%",
      "مظهر عصري أنيق ومريح",
      "سهل الغسيل والعناية",
      "تفصيل حسب المقاس مجاناً"
    ],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
  {
    id: "chiffon-curtains",
    name: "ستائر الشيفون والحرير الفرنسي (Soft Sheer)",
    category: "الستائر الملكية",
    tag: "تطريز يدوي",
    price: "2,900 ج.م",
    priceValue: 2900,
    originalPrice: "3,800 ج.م",
    savingLabel: "900 ج.م",
    description: "طبقة شيفون وحرير فرنسي ناعمة كالضباب تضيف رومانسية ساحرة وفخامة للأجواء الملكية.",
    features: [
      "شفافية شمسية ناعمة",
      "تطريز ذهبي يدوي فاخر",
      "مقاوم للتجعد والغسيل المتكرر",
      "تركيب ومعاينة مجانية"
    ],
    // لا صورة احتياطية عمداً: الصورة تُدار من لوحة الإدارة، وأي قيمة هنا
    // ستظهر مجدداً على الرئيسية عند تعذّر الوصول لقاعدة البيانات.
  },
  {
    id: "hotel-pillow-suite",
    name: "طقم وسائد ومفروشات النخبة (Hotel Microfiber Pillows)",
    category: "المفروشات والوسائد",
    tag: "خامات فندقية فاخرة",
    price: "1,450 ج.م",
    priceValue: 1450,
    originalPrice: "1,950 ج.م",
    savingLabel: "500 ج.م",
    description: "وسائد فندقية طبية محشوة بألياف المايكروفايبر العذراء مع أغطية قطن مصري 100% لنوم مريح وصحي للرقبة والفقرات.",
    features: [
      "حشوة ألياف مايكروفايبر طبية عذراء بديلة للريش",
      "غطاء قطن مصري طويل التيلة ناعم الملمس",
      "دعم مثالي لفقرات العنق وتخفيف آلام النوم",
      "مضادة للبكتيريا وعثة الفراش ومسببات الحساسية"
    ],
    image: "https://res.cloudinary.com/aogjvfdt/image/upload/f_auto,q_auto/v1790535054/%D8%A7%D9%84%D9%83%D8%AA%D8%A7%D9%86_%D8%A7%D9%84%D8%A5%D8%B3%D8%A8%D8%A7%D9%86%D9%8A_%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%B9%D9%8A_Natural_Linen.jpg",
  },
];
