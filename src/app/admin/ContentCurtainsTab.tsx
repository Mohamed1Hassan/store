"use client";

import type { SiteContent } from "@/schemas/site-content";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentCurtainsTab({ content, onChange }: Props) {
  const curtains = content.curtains;

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          نصوص قسم ستائر السلطان الملكية
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة القسم</label>
            <input
              type="text"
              value={curtains.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان الرئيسي</label>
            <input
              type="text"
              value={curtains.title}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان المميز (الذهبي)</label>
            <input
              type="text"
              value={curtains.accent}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, accent: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">الوصف الترويجي</label>
          <textarea
            rows={3}
            value={curtains.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                curtains: { ...prev.curtains, description: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">
            عنوان خدمة المعاينة المنزلية المجانية
          </label>
          <input
            type="text"
            value={curtains.freeInspectionNote}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                curtains: { ...prev.curtains, freeInspectionNote: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>
    </div>
  );
}
