/**
 * GET /api/products — الكتالوج العمومي من مصدر واحد (B3.1).
 * يقرأ من `PRODUCTS_CATALOG` مباشرة — عند نقل البيانات للـ DB سيقرأ
 * من الجدول مع نفس الشكل، دون تغيير أي مستهلك.
 */

import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products-store";

export async function GET() {
  const items = await listProducts();
  return NextResponse.json(
    {
      items,
      total: items.length,
      currency: "EGP",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
