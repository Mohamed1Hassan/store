"use client";

import { Plus, Trash2, Snowflake } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";
import AdminImageField from "./AdminImageField";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentDuvetTab({ content, onChange }: Props) {
  const duvet = content.duvet;

  const handleHighlightChange = (index: number, val: string) => {
    onChange((prev) => {
      const highlights = [...(prev.duvet.highlights || [])];
      highlights[index] = val;
      return { ...prev, duvet: { ...prev.duvet, highlights } };
    });
  };

  const handleAddHighlight = () => {
    onChange((prev) => ({
      ...prev,
      duvet: {
        ...prev.duvet,
        highlights: [...(prev.duvet.highlights || []), ""],
      },
    }));
  };

  const handleRemoveHighlight = (index: number) => {
    onChange((prev) => ({
      ...prev,
      duvet: {
        ...prev.duvet,
        highlights: (prev.duvet.highlights || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Snowflake className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">
            نصوص قسم لحاف السلطان الملكي الفاخر
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة القسم</label>
            <input
              type="text"
              value={duvet.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  duvet: { ...prev.duvet, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان الرئيسي</label>
            <input
              type="text"
              value={duvet.title}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  duvet: { ...prev.duvet, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان المميز (الذهبي)</label>
            <input
              type="text"
              value={duvet.accent}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  duvet: { ...prev.duvet, accent: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص زر الطلب</label>
          <input
            type="text"
            value={duvet.ctaText}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                duvet: { ...prev.duvet, ctaText: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] font-bold text-zinc-400">شارات المميزات السريعة</label>
            <button
              type="button"
              onClick={handleAddHighlight}
              className="flex items-center gap-1 text-[11px] font-bold text-[#ffd700] hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>إضافة شارة</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {duvet.highlights.map((h, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-2 py-1"
              >
                <input
                  type="text"
                  value={h}
                  onChange={(e) => handleHighlightChange(idx, e.target.value)}
                  className="w-36 bg-transparent text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHighlight(idx)}
                  aria-label="حذف الشارة"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <AdminImageField
          label="صورة اللحاف (تُعرض داخل كارت السعر)"
          value={duvet.image || ""}
          placeholder="https://res.cloudinary.com/..."
          onChange={(url) =>
            onChange((prev) => ({
              ...prev,
              duvet: { ...prev.duvet, image: url },
            }))
          }
        />

        <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs leading-relaxed text-zinc-400">
          ملاحظة: اسم المنتج والسعر والوصف والمميزات التفصيلية لهذا القسم تأتي من تبويب
          المنتجات (منتج لحاف السلطان الملكي) ويمكن تعديلها من هناك مباشرة.
        </p>
      </div>
    </div>
  );
}
