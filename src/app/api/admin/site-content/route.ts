import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { getSiteContent, saveSiteContent } from "@/lib/site-content-store";
import { siteContentSchema } from "@/schemas/site-content";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const partialSchema = siteContentSchema.partial();
    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { error: issue ? issue.message : "بيانات غير صالحة." },
        { status: 400 }
      );
    }

    const updated = await saveSiteContent(parsed.data);

    try {
      revalidatePath("/");
      revalidatePath("/products");
    } catch (e) {
      console.warn("[admin-site-content] revalidatePath warning:", e);
    }

    return NextResponse.json({ ok: true, content: updated });
  } catch (err) {
    console.error("[admin-site-content] PATCH error:", err);
    return NextResponse.json(
      {
        error: "تعذر حفظ التعديلات.",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
