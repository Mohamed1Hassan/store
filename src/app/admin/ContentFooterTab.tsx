"use client";

import { Plus, Trash2, ShieldCheck } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentFooterTab({ content, onChange }: Props) {
  const footer = content.footer;

  const handleGuaranteeChange = (index: number, val: string) => {
    onChange((prev) => {
      const guarantees = [...(prev.footer.guarantees || [])];
      guarantees[index] = val;
      return { ...prev, footer: { ...prev.footer, guarantees } };
    });
  };

  const handleAddGuarantee = () => {
    onChange((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        guarantees: [...(prev.footer.guarantees || []), ""],
      },
    }));
  };

  const handleRemoveGuarantee = (index: number) => {
    onChange((prev) => ({
      ...prev,
      footer: {
        ...prev.footer,
        guarantees: (prev.footer.guarantees || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. نصوص الفوتر */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          شعار ونبذة الفوتر
        </h3>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">النبذة التعريفية الرئيسية</label>
          <textarea
            rows={2}
            value={footer.tagline}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                footer: { ...prev.footer, tagline: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">الشعار الفرعي</label>
          <input
            type="text"
            value={footer.subTagline}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                footer: { ...prev.footer, subTagline: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* 2. الضمانات */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">
              بنود الضمانات الملكية ({footer.guarantees.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddGuarantee}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة بند ضمان</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {footer.guarantees.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 p-2.5"
            >
              <input
                type="text"
                value={item}
                onChange={(e) => handleGuaranteeChange(idx, e.target.value)}
                className="flex-1 bg-transparent px-2 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveGuarantee(idx)}
                aria-label="حذف بند الضمان"
                className="p-1 text-red-400 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
