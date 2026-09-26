/**
 * GET /api/products — الكتالوج العمومي من مصدر واحد (B3.1).
 * يقرأ من `PRODUCTS_CATALOG` مباشرة — عند نقل البيانات للـ DB سيقرأ
 * من الجدول مع نفس الشكل، دون تغيير أي مستهلك.
 */

import { NextResponse } from "next/server";
import { PRODUCTS_CATALOG } from "@/data/products";

export async function GET() {
  return NextResponse.json(
    {
      items: PRODUCTS_CATALOG,
      total: PRODUCTS_CATALOG.length,
      currency: "EGP",
    },
    {
      headers: {
        // الكتالوج يتغير نادراً — كاش قصير على الحافة
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
