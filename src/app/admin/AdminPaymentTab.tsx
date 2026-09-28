"use client";

import { useState } from "react";
import { Save, Check, CreditCard, Plus, Trash2, ShieldCheck, Info } from "lucide-react";
import type { PaymentMethod, SiteContent } from "@/schemas/site-content";

interface Props {
  initialContent: SiteContent | null;
  onRefresh: () => void;
}

const FIELD_CLASS =
  "w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]";

/** حقل نصي متكرر داخل كل طريقة دفع */
function Field({
  label,
  value,
  onChange,
  placeholder,
  ltr,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  ltr?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-[11px] font-bold text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={ltr ? "ltr" : undefined}
        className={`${FIELD_CLASS} ${ltr ? "font-bold text-[#ffd700]" : ""}`}
      />
    </div>
  );
}

export default function AdminPaymentTab({ initialContent, onRefresh }: Props) {
  const [payment, setPayment] = useState<SiteContent["payment"]>(
    initialContent?.payment ?? {
      enabled: false,
      codLabel: "الدفع عند الاستلام",
      requireReceipt: true,
      methods: [],
    }
  );
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMethod = (index: number, patch: Partial<PaymentMethod>) => {
    setPayment((prev) => ({
      ...prev,
      methods: prev.methods.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  };

  const addMethod = () => {
    setPayment((prev) => ({
      ...prev,
      methods: [
        ...prev.methods,
        {
          id: `custom-${Date.now()}`,
          label: "",
          enabled: false,
          accountHolder: "",
          bankName: "",
          accountNumber: "",
          extra: "",
          instructions: "",
        },
      ],
    }));
  };

  const removeMethod = (index: number) => {
    setPayment((prev) => ({ ...prev, methods: prev.methods.filter((_, i) => i !== index) }));
  };

  const handleSave = async () => {
    // تحقق مسبق: طريقة مفعّلة بلا رقم حساب = خطأ إدخال
    const broken = payment.methods.find((m) => m.enabled && !m.accountNumber.trim());
    if (broken) {
      setError(`طريقة «${broken.label || broken.id}» مفعّلة — اكتب رقم الحساب أولاً.`);
      return;
    }

    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      // حفظ جزئي: قسم payment فقط — لا نمسّ محتوى الصفحة الرئيسية
      const res = await fetch("/api/admin/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || `فشل الحفظ (${res.status})`);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط علوي + الحفظ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#d4af37]/20 bg-[#0b0e17] p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-white">
            <CreditCard className="h-5 w-5 text-[#ffd700]" />
            <span>إعدادات الدفع وحساب التحصيل</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            أنت الوحيد الذي يضبط هنا الحساب/البطاقة التي تُحوَّل عليها الفلوس — تظهر للعملاء عند إتمام الطلب.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Check className="h-4 w-4" /> تم الحفظ
            </span>
          )}
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] px-5 py-2.5 text-xs font-black text-black hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "جاري الحفظ..." : "حفظ إعدادات الدفع"}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs font-bold text-red-300">
          {error}
        </p>
      )}

      {/* المفاتيح العامة */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <ShieldCheck className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">المفاتيح العامة</h3>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={payment.enabled}
            onChange={(e) => setPayment((prev) => ({ ...prev, enabled: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-[#d4af37]"
          />
          <span>
            <span className="block text-xs font-bold text-white">تفعيل طرق التحويل البنكي والمحافظ</span>
            <span className="mt-0.5 block text-[11px] text-zinc-500">
              عند الإيقاف يُعرض للعملاء «{payment.codLabel}» فقط (الوضع الآمن).
            </span>
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <input
            type="checkbox"
            checked={payment.requireReceipt}
            onChange={(e) => setPayment((prev) => ({ ...prev, requireReceipt: e.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-[#d4af37]"
          />
          <span>
            <span className="block text-xs font-bold text-white">إلزامي رفع صورة إيصال التحويل</span>
            <span className="mt-0.5 block text-[11px] text-zinc-500">
              يمنع إتمام طلب التحويل بدون صورة إثبات (لا ينطبق على الدفع عند الاستلام).
            </span>
          </span>
        </label>

        <div className="max-w-sm">
          <Field
            label="الاسم الظاهر لطريقة الدفع عند الاستلام"
            value={payment.codLabel}
            onChange={(val) => setPayment((prev) => ({ ...prev, codLabel: val }))}
            placeholder="الدفع عند الاستلام"
          />
        </div>
      </div>

      {/* طرق الدفع — الحسابات */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">حسابات استقبال الفلوس ({payment.methods.length})</h3>
          </div>
          <button
            type="button"
            onClick={addMethod}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-2 text-[11px] font-bold text-[#ffd700] hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" /> إضافة طريقة دفع
          </button>
        </div>

        <div className="flex items-start gap-2 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3 text-[11px] font-bold text-sky-300">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            الرقم الذي تكتبه هنا هو مصدر العرض الوحيد للعملاء — غيّره من هنا في أي وقت وينعكس فوراً بعد الحفظ.
          </span>
        </div>

        {payment.methods.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-xs font-bold text-zinc-500">
            لا توجد طرق دفع بعد — أضف طريقة وفعّلها.
          </p>
        ) : (
          <div className="space-y-4">
            {payment.methods.map((method, index) => (
              <div
                key={method.id}
                className={`space-y-4 rounded-2xl border p-5 transition ${
                  method.enabled ? "border-[#d4af37]/40 bg-[#d4af37]/[0.04]" : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={method.enabled}
                      onChange={(e) => updateMethod(index, { enabled: e.target.checked })}
                      className="h-4 w-4 accent-[#d4af37]"
                    />
                    <span className="text-xs font-black text-white">
                      {method.label || method.id}
                      {method.enabled && (
                        <span className="mr-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                          مفعّلة
                        </span>
                      )}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeMethod(index)}
                    className="flex items-center gap-1 rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 text-[11px] font-bold text-red-300 hover:bg-red-500/20"
                    aria-label={`حذف طريقة الدفع ${method.label || method.id}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> حذف
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field
                    label="الاسم الظاهر للعملاء"
                    value={method.label}
                    onChange={(val) => updateMethod(index, { label: val })}
                    placeholder="تحويل بنكي (CIB)"
                  />
                  <Field
                    label="اسم صاحب الحساب / البطاقة"
                    value={method.accountHolder}
                    onChange={(val) => updateMethod(index, { accountHolder: val })}
                    placeholder="محمد أحمد السيد"
                  />
                  <Field
                    label="اسم البنك أو المحفظة"
                    value={method.bankName}
                    onChange={(val) => updateMethod(index, { bankName: val })}
                    placeholder="البنك التجاري الدولي"
                  />
                  <Field
                    label="رقم الآيبان / البطاقة / المحفظة"
                    value={method.accountNumber}
                    onChange={(val) => updateMethod(index, { accountNumber: val })}
                    placeholder="EG00 0000 0000 0000 0000 0000 0000"
                    ltr
                  />
                  <Field
                    label="تفصيل إضافي (رابط InstaPay أو رقم إضافي)"
                    value={method.extra}
                    onChange={(val) => updateMethod(index, { extra: val })}
                    placeholder="https://instapay.me/... أو رقم فرعي"
                    ltr
                  />
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-[11px] font-bold text-zinc-400">
                      تعليمات التحويل (تظهر للعميل)
                    </label>
                    <textarea
                      rows={2}
                      value={method.instructions}
                      onChange={(e) => updateMethod(index, { instructions: e.target.value })}
                      placeholder="حوّل المبلغ ثم ارفع صورة الإيصال قبل تأكيد الطلب."
                      className={`${FIELD_CLASS} resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
