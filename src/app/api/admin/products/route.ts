import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listProducts, saveProduct } from "@/lib/products-store";
import { productSchema } from "@/schemas/product";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  const items = await listProducts(true); // include hidden/inactive
  return NextResponse.json({ items, total: items.length });
}

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : "بيانات المنتج غير صالحة." },
        { status: 400 }
      );
    }

    const saved = await saveProduct(parsed.data);
    return NextResponse.json({ item: saved }, { status: 201 });
  } catch (err) {
    console.error("[admin-products] error saving product:", err);
    return NextResponse.json({ error: "حدث خطأ أثناء حفظ المنتج." }, { status: 500 });
  }
}
