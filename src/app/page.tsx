/**
 * الصفحة الرئيسية (Server Component) — تركيب الأقسام التفاعلية من `HomeClient`.
 * هذا الفصل مقصود: صفحة الـ Server تتيح فهرسة أفضل وتجنّب مشاكل الـ client manifest.
 */

import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { SITE_NAME, SITE_URL } from "@/data/site";
import { listProducts } from "@/lib/products-store";
import type { Product } from "@/data/products";

// الصفحة تُبنى مسبقاً على Vercel؛ نُبقيها ديناميكية لتقرأ أحدث المنتجات من القاعدة.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${SITE_NAME} | مفروشات ومراتب وستائر فاخرة في مصر`,
  description:
    "مفروشات السلطان: مراتب طبية بنوابض منفصلة، ستائر بلاك أوت مفصلة على المقاس، كافر مراتب عازل، ومفروشات فندقية. ضمان 10 سنوات وتوصيل لكل المحافظات.",
  alternates: { canonical: SITE_URL },
};

export default async function HomePage() {
  // مصدر البيانات الموحّد: قاعدة البيانات (مع دمج الكتالوج كاحتياط في listProducts).
  // وبهذا أي تعديل من لوحة الإدارة ينعكس فوراً على الصفحة الرئيسية.
  const stored = await listProducts();

  // نصغّر الحقول المُرسلة للعميل: نحتاج فقط ما تعرضه مكونات الصفحة.
  const products: Product[] = stored.map((p) => ({
    id: p.slug || p.id,
    name: p.name,
    category: p.category,
    tag: p.tag,
    price: p.price,
    priceValue: p.priceValue,
    originalPrice: p.originalPrice,
    savingLabel: p.savingLabel,
    description: p.description,
    features: p.features,
    image: p.image,
  }));

  return <HomeClient products={products} />;
}
