import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products-store";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return NextResponse.json(
      { error: "المنتج غير موجود أو غير متوفر حالياً." },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { product },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
