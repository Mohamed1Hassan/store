import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";

/**
 * POST /api/admin/uploads — رفع صورة من جهاز الأدمن إلى مجلد public/uploads.
 * - محمي بجلسة الإدارة (كوكي sultan_admin).
 * - يقبل حتى 8MB من الأنواع: jpeg/png/webp/gif/avif.
 * - يعيد { url } وهو المسار العام للصورة المرفوعة.
 * ملاحظة: على Vercel نظام الملفات مؤقت (ephemeral) — للإنتاج الدائم
 * يُنصح لاحقاً بربط Cloudinary عبر NEXT_PUBLIC_CLOUDINARY_*.
 */

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/avif", ".avif"],
]);

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "غير مصرح لك بالدخول." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "تعذر قراءة بيانات الرفع." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "اختر ملف صورة أولاً." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES.get(file.type);
  if (!ext) {
    return NextResponse.json(
      { error: "نوع الملف غير مدعوم — اختر صورة JPG أو PNG أو WebP." },
      { status: 400 }
    );
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: "الملف فارغ." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم الصورة كبير — الحد الأقصى 8MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // المجلد موجود مسبقاً غالباً — نتجاهل
    }

    await writeFile(path.join(uploadsDir, fileName), buffer);
    return NextResponse.json({ ok: true, url: `/uploads/${fileName}` });
  } catch (err) {
    console.error("[admin-uploads] write error:", err);
    return NextResponse.json({ error: "تعذر حفظ الصورة على الخادم." }, { status: 500 });
  }
}
