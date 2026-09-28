"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, ExternalLink, X } from "lucide-react";

/**
 * حقل صورة موحّد للوحة الإدارة:
 * - زر «اختيار صورة من الجهاز» يرفع الملف فعلياً عبر /api/admin/uploads
 * - معاينة فورية للصورة المرفوعة أو الرابط الملصوق
 * - إمكانية لصق رابط مباشر أيضاً + زر مسح
 */
interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
const MAX_MB = 8;

/** إن وُضعت متغيرات Cloudinary تُرفع الصورة سحابياً (تعمل على Vercel)، وإلا عبر /api/admin/uploads. */
const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function AdminImageField({ label, value, onChange, placeholder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined | null) => {
    setError(null);
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("نوع الملف غير مدعوم — اختر صورة JPG أو PNG أو WebP.");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`حجم الصورة كبير — الحد الأقصى ${MAX_MB}MB.`);
      return;
    }

    setUploading(true);
    try {
      let url: string;

      if (CLOUDINARY_CLOUD && CLOUDINARY_PRESET) {
        // رفع غير موقّع مباشرة من المتصفح إلى Cloudinary.
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", CLOUDINARY_PRESET);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`,
          { method: "POST", body: form }
        );
        const payload = await res.json().catch(() => null);
        if (!res.ok || !payload?.secure_url) {
          throw new Error(payload?.error?.message || `فشل الرفع (${res.status})`);
        }
        url = payload.secure_url as string;
      } else {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/admin/uploads", {
          method: "POST",
          body: form,
        });
        const payload = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(payload?.error || `فشل الرفع (${res.status})`);
        }
        if (!payload?.url) throw new Error("تعذر الحصول على رابط الصورة.");
        url = payload.url;
      }

      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصورة.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold text-zinc-400">{label}</label>

      {/* معاينة الصورة */}
      {value ? (
        <div className="relative mb-2 h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="معاينة الصورة" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-black/60 px-2 py-1 backdrop-blur-sm">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-[#ffd700] hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              <span>فتح الرابط</span>
            </a>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-[10px] font-bold text-red-400 hover:text-red-300"
            >
              <X className="h-3 w-3" />
              <span>إزالة</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* حقل الرابط المباشر */}
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setError(null);
          onChange(e.target.value);
        }}
        dir="ltr"
        placeholder={placeholder || "https://... أو اختر صورة من جهازك"}
        className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-[#d4af37]"
      />

      {/* زر الرفع من الجهاز */}
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="mt-2 flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20 disabled:opacity-50"
      >
        {uploading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>جاري رفع الصورة...</span>
          </>
        ) : (
          <>
            <ImagePlus className="h-3.5 w-3.5" />
            <span>اختيار صورة من الجهاز ورفعها</span>
          </>
        )}
      </button>

      {error && (
        <p role="alert" className="mt-2 rounded-xl border border-red-500/40 bg-red-500/10 p-2 text-[11px] font-bold text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
