"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import confetti from "canvas-confetti";
import { Check, Phone, Send, ShieldCheck, Truck } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { PRODUCTS_CATALOG } from "@/data/products";
import { PHONE_DISPLAY, PHONE_TEL, STORE_HOURS, whatsappLink } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

interface FormState {
  name: string;
  phone: string;
  product: string;
  size: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMPTY_FORM: FormState = { name: "", phone: "", product: "", size: "", notes: "" };

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "ضمان استبدال 10 سنوات" },
  { icon: Truck, label: "توصيل وتركيب لباب المنزل" },
  { icon: Check, label: "كافر مراتب مجاني مع كل مرتبة" },
];

const ORDER_STEPS = [
  {
    title: "ابعت بياناتك",
    desc: "اكتب اسمك ورقمك والمنتج المطلوب والمقاس لو معروف.",
  },
  {
    title: "نتواصل معاك",
    desc: "بنأكد المقاس والسعر والمدة المتوقعة على واتساب أو بالتليفون.",
  },
  {
    title: "التسليم والتركيب",
    desc: "بنوصل ونركّب في كل المحافظات، والضمان موثّق مع الفاتورة.",
  },
];

const CUSTOM_PRODUCT = "تفصيل خاص / استفسار آخر";

export default function OrderForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target as { name: keyof FormState; value: string };
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSent(false);
    setServerError(null);
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (form.name.trim().length < 3) {
      nextErrors.name = "اكتب الاسم بالكامل (3 حروف على الأقل).";
    }

    const cleanPhone = form.phone.replace(/[\s-]/g, "");
    if (!/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      nextErrors.phone = "اكتب رقم موبايل مصري صحيح: 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015.";
    }

    if (!form.product) {
      nextErrors.product = "اختر المنتج المطلوب من القائمة.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const message = [
      "طلب جديد من موقع السلطان:",
      `الاسم: ${form.name.trim()}`,
      `الموبايل: ${form.phone.trim()}`,
      `المنتج: ${form.product}`,
      form.size.trim() ? `المقاس: ${form.size.trim()}` : "",
      form.notes.trim() ? `ملاحظات: ${form.notes.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // B1: حفظ الطلب في الباك-إند أولاً — الفشل لا يمنع فتح واتساب أبداً (fallback)
    setSending(true);
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          product: form.product,
          size: form.size.trim(),
          notes: form.notes.trim(),
          source: "order-form",
        }),
      });
      if (!res.ok && res.status !== 429) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setServerError(data?.error ?? "تعذر حفظ الطلب، لكن يمكنك إكماله عبر واتساب.");
      }
    } catch {
      // انقطاع الشبكة: نكمل لواتساب مباشرة بدون إزعاج العميل
    } finally {
      setSending(false);
    }

    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");

    trackEvent("order_submit", { product: form.product });

    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.7 },
      colors: ["#d4af37", "#ffd700", "#ffffff"],
    });

    setSent(true);
  };

  const fieldClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-xl bg-black/40 border text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25 ${
      hasError ? "border-red-500/60" : "border-white/10"
    }`;

  return (
    <section id="order-section" aria-labelledby="order-form-heading" className="py-20 bg-[#07090e] border-t border-[#d4af37]/20 relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-80 w-[32rem] -translate-x-1/2 rounded-full bg-[#d4af37]/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Send}
          badge="اطلب في أقل من دقيقة"
          title="جهّز طلبك"
          accent="وفريقنا هيكلمك"
          description="املأ البيانات وهنبعت طلبك مباشرة على واتساب المعرض مع كل التفاصيل — بدون أي رسوم وبدون التزام."
          headingId="order-form-heading"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="lg:col-span-7 p-6 md:p-8 rounded-3xl bg-[#0b0e17] border border-[#d4af37]/30 shadow-2xl space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="order-name" className="block text-xs font-bold text-zinc-300 mb-2">
                  الاسم بالكامل <span className="text-[#ffd700]">*</span>
                </label>
                <input
                  id="order-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="مثال: أحمد محمد"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "order-name-error" : undefined}
                  className={fieldClass(Boolean(errors.name))}
                />
                {errors.name && (
                  <p id="order-name-error" role="alert" className="mt-1.5 text-[11px] font-semibold text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="order-phone" className="block text-xs font-bold text-zinc-300 mb-2">
                  رقم الموبايل <span className="text-[#ffd700]">*</span>
                </label>
                <input
                  id="order-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxx"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "order-phone-error" : undefined}
                  className={`${fieldClass(Boolean(errors.phone))} text-left`}
                />
                {errors.phone && (
                  <p id="order-phone-error" role="alert" className="mt-1.5 text-[11px] font-semibold text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="order-product" className="block text-xs font-bold text-zinc-300 mb-2">
                المنتج المطلوب <span className="text-[#ffd700]">*</span>
              </label>
              <select
                id="order-product"
                name="product"
                value={form.product}
                onChange={handleChange}
                aria-invalid={Boolean(errors.product)}
                aria-describedby={errors.product ? "order-product-error" : undefined}
                className={`${fieldClass(Boolean(errors.product))} [color-scheme:dark]`}
              >
                <option value="">— اختر المنتج —</option>
                {PRODUCTS_CATALOG.map((product) => (
                  <option key={product.id} value={`${product.name} (${product.price})`}>
                    {product.name} — {product.price}
                  </option>
                ))}
                <option value={CUSTOM_PRODUCT}>{CUSTOM_PRODUCT}</option>
              </select>
              {errors.product && (
                <p id="order-product-error" role="alert" className="mt-1.5 text-[11px] font-semibold text-red-400">
                  {errors.product}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="order-size" className="block text-xs font-bold text-zinc-300 mb-2">
                المقاس المطلوب <span className="font-normal text-zinc-500">(اختياري)</span>
              </label>
              <input
                id="order-size"
                name="size"
                type="text"
                value={form.size}
                onChange={handleChange}
                placeholder="مثال: 160×200 سم أو مقاس نافذة 3×2.5 متر"
                className={fieldClass(false)}
              />
            </div>

            <div>
              <label htmlFor="order-notes" className="block text-xs font-bold text-zinc-300 mb-2">
                ملاحظات إضافية <span className="font-normal text-zinc-500">(اختياري)</span>
              </label>
              <textarea
                id="order-notes"
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="نوع القماش المفضل، اللون، وقت مناسب للتواصل..."
                className={`${fieldClass(false)} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-black text-sm md:text-base shadow-xl shadow-[#d4af37]/25 transition duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span>{sending ? "جاري إرسال الطلب..." : "أرسل الطلب على واتساب"}</span>
            </button>

            {serverError && (
              <div
                role="alert"
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold"
              >
                {serverError}
              </div>
            )}

            {sent && (
              <div
                role="status"
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-start gap-2"
              >
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  تم تجهيز طلبك وفتح واتساب في تاب جديد. لو مفتحش، اضغط زر الواتساب العائم أسفل الشاشة أو
                  <a href={`tel:${PHONE_TEL}`} className="mx-1 underline">
                    اتصل بينا
                  </a>
                  .
                </span>
              </div>
            )}

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              بياناتك تُستخدم فقط للتواصل بشأن الطلب — بدون أي رسوم وبدون التزام بالشراء.
            </p>
          </form>

          <aside className="lg:col-span-5 space-y-4">
            <div className="p-6 md:p-7 rounded-3xl bg-gradient-to-br from-[#121828] to-[#0a0d16] border border-[#d4af37]/30 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-5">إزاي بنجهّز طلبك؟</h3>
              <ol className="space-y-4">
                {ORDER_STEPS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-sm font-black text-[#ffd700]">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">{step.title}</h4>
                      <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-6 rounded-3xl bg-[#0b0e17] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4">أو اتصل بينا مباشرة</h3>
              <a href={`tel:${PHONE_TEL}`} className="group flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd700]">
                  <Phone className="w-5 h-5" />
                </span>
                <span>
                  <span dir="ltr" className="block text-lg font-black text-white transition group-hover:text-[#ffd700]">
                    {PHONE_DISPLAY}
                  </span>
                  <span className="block text-[11px] text-zinc-500">{STORE_HOURS}</span>
                </span>
              </a>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {TRUST_ITEMS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 rounded-2xl bg-[#0c101a] border border-white/5 p-3"
                >
                  <Icon className="w-4 h-4 shrink-0 text-[#ffd700]" />
                  <span className="text-[11px] font-semibold text-zinc-200">{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
