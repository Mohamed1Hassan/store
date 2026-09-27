/**
 * الصفحة الرئيسية (Server Component) — تركيب الأقسام التفاعلية من `HomeClient`.
 * هذا الفصل مقصود: صفحة الـ Server تتيح فهرسة أفضل وتجنّب مشاكل الـ client manifest.
 */

import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { SITE_NAME, SITE_URL } from "@/data/site";

export const metadata: Metadata = {
  title: `${SITE_NAME} | مفروشات ومراتب وستائر فاخرة في مصر`,
  description:
    "مفروشات السلطان: مراتب طبية بنوابض منفصلة، ستائر بلاك أوت مفصلة على المقاس، كافر مراتب عازل، ومفروشات فندقية. ضمان 10 سنوات وتوصيل لكل المحافظات.",
  alternates: { canonical: SITE_URL },
};

export default function HomePage() {
  return <HomeClient />;
}
