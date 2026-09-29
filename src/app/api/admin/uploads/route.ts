import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { isAdminRequest } from "@/lib/admin-auth";
import { v2 as cloudinary } from "cloudinary";

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
    const base64DataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    // 1. استخدام Cloudinary إن وُجد مفتاح CLOUDINARY_URL
    if (process.env.CLOUDINARY_URL) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            base64DataUri,
            { folder: "sultan_products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        return NextResponse.json({ ok: true, url: (uploadResult as any).secure_url });
      } catch (cloudErr) {
        console.warn("[admin-uploads] فشل الرفع إلى Cloudinary, الاعتماد على البديل:", cloudErr);
      }
    }

    // 2. المحاولة المحتلمة للحفظ المحلي (لو في بيئة تدعم الملفات مثل localhost)
    if (!process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
      try {
        const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
        const uploadsDir = path.join(process.cwd(), "public", "uploads");

        try {
          await mkdir(uploadsDir, { recursive: true });
        } catch {
          // المجلد موجود مسبقاً
        }

        await writeFile(path.join(uploadsDir, fileName), buffer);
        return NextResponse.json({ ok: true, url: `/uploads/${fileName}` });
      } catch (fsErr) {
        console.warn("[admin-uploads] فشل حفظ الملف محلياً, تحويل إلى Data URI:", fsErr);
      }
    }

    // 3. البديل السريع المضمون 100% على Vercel بدون أي إعدادات خارجية (Data URI)
    return NextResponse.json({ ok: true, url: base64DataUri });
  } catch (err) {
    console.error("[admin-uploads] Error:", err);
    return NextResponse.json({ error: "تعذر معالجة الصورة." }, { status: 500 });
  }
}
