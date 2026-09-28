"use client";

import { Plus, Trash2, Phone, HelpCircle } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentContactFaqTab({ content, onChange }: Props) {
  const handleFaqChange = (index: number, field: "question" | "answer", val: string) => {
    onChange((prev) => {
      const updated = [...prev.faq];
      const target = updated[index];
      if (target) target[field] = val;
      return { ...prev, faq: updated };
    });
  };

  const handleAddFaq = () => {
    onChange((prev) => ({
      ...prev,
      faq: [...prev.faq, { question: "", answer: "" }],
    }));
  };

  const handleRemoveFaq = (index: number) => {
    onChange((prev) => ({
      ...prev,
      faq: prev.faq.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. بيانات التواصل */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Phone className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">بيانات الاتصال وساعات العمل</h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">رقم الهاتف الظاهر للعملاء</label>
            <input
              type="text"
              value={content.contact.phoneDisplay}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phoneDisplay: e.target.value },
                }))
              }
              dir="ltr"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">
              رقم الواتساب للطلبات (مع كود الدولة)
            </label>
            <input
              type="text"
              value={content.contact.whatsappNumber}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, whatsappNumber: e.target.value },
                }))
              }
              dir="ltr"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">مواعيد وساعات العمل</label>
            <input
              type="text"
              value={content.contact.storeHours}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, storeHours: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">موقع المعرض / المدينة</label>
            <input
              type="text"
              value={content.contact.location}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, location: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* 2. الأسئلة الشائعة */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">الأسئلة الشائعة ({content.faq.length})</h3>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة سؤال</span>
          </button>
        </div>

        <div className="space-y-3">
          {content.faq.map((faq, idx) => (
            <div key={idx} className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">سؤال #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(idx)}
                  aria-label="حذف السؤال"
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">السؤال</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(idx, "question", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">الإجابة</label>
                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(idx, "answer", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

