"use client";

import { Plus, Trash2, Star, MessageSquare } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentTestimonialsTab({ content, onChange }: Props) {
  const testimonials = content.testimonials;

  const handleItemChange = (
    index: number,
    field: "name" | "city" | "purchase" | "text" | "rating",
    val: string | number
  ) => {
    onChange((prev) => {
      const items = [...(prev.testimonials.items || [])];
      if (items[index]) items[index] = { ...items[index], [field]: val };
      return { ...prev, testimonials: { ...prev.testimonials, items } };
    });
  };

  const handleAddItem = () => {
    onChange((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: [
          ...(prev.testimonials.items || []),
          {
            id: `t-${Date.now()}`,
            name: "عميل جديد",
            city: "القاهرة",
            rating: 5,
            purchase: "طقم سرير ملكي",
            text: "تجربة ممتازة وتعامل راقي جداً.",
          },
        ],
      },
    }));
  };

  const handleRemoveItem = (index: number) => {
    onChange((prev) => ({
      ...prev,
      testimonials: {
        ...prev.testimonials,
        items: (prev.testimonials.items || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. عنوان القسم وإحصائيات التقييم */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          عنوان القسم وإحصائيات التقييم العام
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة القسم</label>
            <input
              type="text"
              value={testimonials.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان الرئيسي</label>
            <input
              type="text"
              value={testimonials.title}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان البارز (الذهبي)</label>
            <input
              type="text"
              value={testimonials.accent}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, accent: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">الوصف الترويجي</label>
          <textarea
            rows={2}
            value={testimonials.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                testimonials: { ...prev.testimonials, description: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-white/5 pt-2 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">متوسط التقييم</label>
            <input
              type="text"
              value={testimonials.ratingAverage}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, ratingAverage: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">عدد التقييمات الإجمالي</label>
            <input
              type="text"
              value={testimonials.ratingCount}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, ratingCount: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص تسمية التقييم</label>
            <input
              type="text"
              value={testimonials.ratingLabel}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  testimonials: { ...prev.testimonials, ratingLabel: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>


      {/* 2. بطاقات آراء العملاء */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">
              بطاقات التقييمات ({testimonials.items.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة تقييم</span>
          </button>
        </div>

        {testimonials.items.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-zinc-400">
            لا توجد تقييمات مخصصة — سيتم استخدام التقييمات الافتراضية في الصفحة الرئيسية.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {testimonials.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#ffd700]">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleItemChange(idx, "rating", sIdx + 1)}
                      aria-label={`تقييم ${sIdx + 1} نجوم`}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          sIdx < item.rating ? "fill-[#ffd700] text-[#ffd700]" : "text-zinc-600"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="mr-2 text-xs font-bold text-zinc-400">({item.rating} نجوم)</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  aria-label="حذف التقييم"
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-400">اسم العميل</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-400">المدينة / المنطقة</label>
                  <input
                    type="text"
                    value={item.city}
                    onChange={(e) => handleItemChange(idx, "city", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">المنتج الذي اشتراه</label>
                <input
                  type="text"
                  value={item.purchase}
                  onChange={(e) => handleItemChange(idx, "purchase", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">نص التقييم والتجربة</label>
                <textarea
                  rows={2}
                  value={item.text}
                  onChange={(e) => handleItemChange(idx, "text", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

