import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteProduct, getProductBySlug, updateProduct } from "@/lib/products-store";
import { productSchema } from "@/schemas/product";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  const { slug } = await context.params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "المنتج غير موجود." }, { status: 404 });
  }

  return NextResponse.json({ item: product });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  const { slug } = await context.params;

  try {
    const body = await request.json();
    const partialSchema = productSchema.partial();
    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : "بيانات التحديث غير صالحة." },
        { status: 400 }
      );
    }

    const updated = await updateProduct(slug, parsed.data);
    if (!updated) {
      return NextResponse.json({ error: "تعذر العثور على المنتج لتحديثه." }, { status: 404 });
    }

    // تفعيل التحديث الفوري للكاش للصفحة الرئيسية والمتجر وصفحة المنتج
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${slug}`);
      if (updated.slug && updated.slug !== slug) {
        revalidatePath(`/products/${updated.slug}`);
      }
    } catch (e) {
      console.warn("[admin-products] revalidatePath warning:", e);
    }

    return NextResponse.json({ item: updated });
  } catch (err) {
    console.error("[admin-products] PATCH error:", err);
    return NextResponse.json(
      {
        error: "تعذر حفظ التعديلات. تأكد من ضبط DATABASE_URL في إعدادات Vercel وتشغيل prisma db push، فبيئة الاستضافة لا تدعم التخزين المحلي.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  const { slug } = await context.params;
  try {
    const ok = await deleteProduct(slug);
    if (!ok) {
      return NextResponse.json({ error: "تعذر العثور على المنتج لحذفه." }, { status: 404 });
    }

    // مسح الكاش فوراً بعد الحذف
    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${slug}`);
    } catch (e) {
      console.warn("[admin-products] revalidatePath warning:", e);
    }

    return NextResponse.json({ ok: true, message: "تم حذف المنتج بنجاح." });
  } catch (err) {
    console.error("[admin-products] DELETE error:", err);
    return NextResponse.json(
      {
        error: "تعذر حذف المنتج. تأكد من ضبط DATABASE_URL في إعدادات Vercel.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

