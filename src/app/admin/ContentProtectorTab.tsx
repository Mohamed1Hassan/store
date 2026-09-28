"use client";

import { Droplets } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentProtectorTab({ content, onChange }: Props) {
  const protector = content.protector;

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <Droplets className="h-4 w-4 text-[#ffd700]" />
          <h3 className="text-sm font-bold text-white">
            نصوص قسم كافر وواقي المراتب ضد السوائل
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة القسم</label>
            <input
              type="text"
              value={protector.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان الرئيسي</label>
            <input
              type="text"
              value={protector.title}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان المميز (الذهبي)</label>
            <input
              type="text"
              value={protector.accent}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, accent: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">عنوان بطاقة الهدية</label>
            <input
              type="text"
              value={protector.giftTitle}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, giftTitle: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">وصف بطاقة الهدية</label>
            <input
              type="text"
              value={protector.giftDesc}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, giftDesc: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص زر الطلب</label>
            <input
              type="text"
              value={protector.ctaText}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  protector: { ...prev.protector, ctaText: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs leading-relaxed text-zinc-400">
          ملاحظة: اسم المنتج والسعر والوصف والمميزات التفصيلية لهذا القسم تأتي من تبويب
          المنتجات (منتج كافر وواقي المرتبة الفندقي) ويمكن تعديلها من هناك مباشرة مع الصورة.
        </p>
      </div>
    </div>
  );
}
