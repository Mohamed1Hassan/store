import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { checkRateLimit } from "@/lib/rate-limit";
import { v2 as cloudinary } from "cloudinary";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limit = await checkRateLimit(`receipt:${ip}`, 3, 60_000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "محاولات رفع كثيرة — انتظر دقيقة ثم حاول مجدداً." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(limit.resetAfterMs / 1000)) },
      }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "تعذر قراءة بيانات الرفع." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "اختر صورة الإيصال أولاً." }, { status: 400 });
  }

  const ext = ALLOWED_TYPES.get(file.type);
  if (!ext) {
    return NextResponse.json(
      { error: "نوع الملف غير مدعوم — ارفع صورة JPG أو PNG أو WebP." },
      { status: 400 }
    );
  }

  if (file.size <= 0) {
    return NextResponse.json({ error: "الملف فارغ." }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم الصورة كبير — الحد الأقصى 5MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    if (process.env.CLOUDINARY_URL) {
      const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(base64Image, { folder: "sultan_receipts" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      return NextResponse.json({ ok: true, url: (uploadResult as any).secure_url });
    }

    const fileName = `receipt-${Date.now()}-${randomUUID().slice(0, 8)}${ext}`;
    const receiptsDir = path.join(process.cwd(), "public", "uploads", "receipts");

    try {
      await mkdir(receiptsDir, { recursive: true });
    } catch {
    }

    await writeFile(path.join(receiptsDir, fileName), buffer);
    return NextResponse.json({ ok: true, url: `/uploads/receipts/${fileName}` });
  } catch (err) {
    return NextResponse.json({ error: "تعذر حفظ الصورة على الخادم." }, { status: 500 });
  }
}
