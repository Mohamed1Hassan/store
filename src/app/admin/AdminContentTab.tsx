"use client";

import { useState } from "react";
import { Check, Plus, Trash2, Save, Sparkles, Megaphone, Phone, HelpCircle } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  initialContent: SiteContent | null;
  onRefresh: () => void;
}
export default function AdminContentTab({ initialContent, onRefresh }: Props) {
  const [content, setContent] = useState<SiteContent>(
    initialContent || {
      announcement: {
        badge: "عرض اليوم:",
        text: "كافر مراتب مجاني + خصم حتى",
        highlight: "5,100 ج.م",
        suffix: "على الغرفة المتكاملة",
        enabled: true,
      },
      hero: {
        badge: "الاسم الأول في عالم الفخامة والراحة الملكية",
        titleLine1: "السلطان",
        titleLine2: "للمفروشات والستائر",
        titleLine3: "وكافر المراتب الطبية",
        description:
          "نصنع لك أرقى غرف النوم الملكية بتوليفة استثنائية من المراتب الطبية بنوابض منفصلة، والستائر الفاخرة المفصلة على مقاسك، والمفروشات الفندقية الحريرية.",
        ctaText: "تواصل واطلب مقاسك الآن",
        features: [
          { label: "ضمان استبدال 10 سنوات" },
          { label: "تفصيل فوري لجميع المقاسات" },
          { label: "توصيل ومعاينة مجانية" },
          { label: "كافر هدية مع كل مرتبة" },
        ],
      },
      contact: {
        phoneDisplay: "01055280865",
        whatsappNumber: "201055280865",
        storeHours: "يومياً من 10 صباحاً حتى 11 مساءً",
        location: "القاهرة، جمهورية مصر العربية",
      },
      faq: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
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

  const handleAddFaq = () => {
    setContent((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    setContent((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", val: string) => {
    setContent((prev) => {
      const updated = [...prev.faq];
      const target = updated[index];
      if (target) target[field] = val;
      return { ...prev, faq: updated };
    });
  };

  const handleHeroFeatureChange = (index: number, val: string) => {
    setContent((prev) => {
      const updated = [...prev.hero.features];
      if (updated[index]) updated[index] = { label: val };
      return { ...prev, hero: { ...prev.hero, features: updated } };
    });
  };

  const handleAddHeroFeature = () => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        features: [...prev.hero.features, { label: "" }],
      },
    }));
  };

  const handleRemoveHeroFeature = (index: number) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        features: prev.hero.features.filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">إدارة محتوى الموقع والواجهة</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            تعديل نصوص الصفحة الرئيسية، البانر العلوي، أرقام التواصل والأسئلة الشائعة
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] px-6 py-3 text-xs font-black text-[#07090e] shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
        >
          {saving ? (
            <span>جاري الحفظ...</span>
          ) : saveSuccess ? (
            <>
              <Check className="h-4 w-4" />
              <span>تم الحفظ بنجاح!</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>حفظ كل التعديلات</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-bold text-red-300">
          {error}
        </div>
      )}

      {/* 1. البانر الترويجي العلوي */}
      <section className="rounded-3xl border border-white/10 bg-[#0b0e17] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">شريط الإعلان العلوي (Promo Banner)</h3>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-300">
            <input
              type="checkbox"
              checked={content.announcement.enabled}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, enabled: e.target.checked },
                }))
              }
              className="rounded border-zinc-700 bg-zinc-900 text-[#d4af37] focus:ring-[#d4af37]"
            />
            <span>تفعيل الشريط</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">شارة البداية</label>
            <input
              type="text"
              value={content.announcement.badge}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">نص العرض الأساسي</label>
            <input
              type="text"
              value={content.announcement.text}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, text: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">النص الملوّن</label>
            <input
              type="text"
              value={content.announcement.highlight}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, highlight: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">التكملة</label>
            <input
              type="text"
              value={content.announcement.suffix}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, suffix: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </section>

      {/* 2. قسم الهيرو */}
      <section className="rounded-3xl border border-white/10 bg-[#0b0e17] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Sparkles className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">الواجهة الرئيسية (Hero Section)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">السطر الأول للعنوان</label>
            <input
              type="text"
              value={content.hero.titleLine1}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, titleLine1: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">السطر الثاني (ملوّن بالذهبي)</label>
            <input
              type="text"
              value={content.hero.titleLine2}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, titleLine2: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">السطر الثالث</label>
            <input
              type="text"
              value={content.hero.titleLine3}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, titleLine3: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">شارة التاج العلوية</label>
            <input
              type="text"
              value={content.hero.badge}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">نص زر الدعوة للطلب (CTA)</label>
            <input
              type="text"
              value={content.hero.ctaText}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  hero: { ...prev.hero, ctaText: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-zinc-400 mb-1">الوصف التعريفي</label>
          <textarea
            rows={3}
            value={content.hero.description}
            onChange={(e) =>
              setContent((prev) => ({
                ...prev,
                hero: { ...prev.hero, description: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37] leading-relaxed"
          />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300">بطاقات المميزات السريعة:</span>
            <button
              type="button"
              onClick={handleAddHeroFeature}
              className="flex items-center gap-1 text-[11px] font-bold text-[#ffd700] hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>إضافة ميزة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.hero.features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat.label}
                  onChange={(e) => handleHeroFeatureChange(idx, e.target.value)}
                  placeholder={`ميزة ${idx + 1}`}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHeroFeature(idx)}
                  className="p-2 text-zinc-400 hover:text-red-400 transition"
                  aria-label="حذف الميزة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. بيانات التواصل */}
      <section className="rounded-3xl border border-white/10 bg-[#0b0e17] p-6 space-y-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Phone className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">بيانات التواصل الموحدة (Contact Info)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">الرقم كما يظهر للزائر</label>
            <input
              type="text"
              value={content.contact.phoneDisplay}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phoneDisplay: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">رقم الواتساب الدولي (بدون +)</label>
            <input
              type="text"
              value={content.contact.whatsappNumber}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, whatsappNumber: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">ساعات العمل</label>
            <input
              type="text"
              value={content.contact.storeHours}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, storeHours: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 mb-1">الموقع / العنوان</label>
            <input
              type="text"
              value={content.contact.location}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, location: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </section>

      {/* 4. الأسئلة الشائعة */}
      <section className="rounded-3xl border border-white/10 bg-[#0b0e17] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">الأسئلة الشائعة ({content.faq.length})</h3>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] hover:bg-[#d4af37]/20 transition"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة سؤال</span>
          </button>
        </div>

        <div className="space-y-3">
          {content.faq.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/5 bg-white/5 p-4 space-y-2 transition hover:border-white/10"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-black text-[#ffd700]">سؤال #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <input
                type="text"
                value={item.question}
                onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                placeholder="نص السؤال"
                className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-white font-bold outline-none focus:border-[#d4af37]"
              />

              <textarea
                rows={2}
                value={item.answer}
                onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                placeholder="إجابة السؤال الوافية..."
                className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37] leading-relaxed"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}