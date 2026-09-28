"use client";

import { Plus, Trash2 } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";
import AdminImageField from "./AdminImageField";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentCurtainsTab({ content, onChange }: Props) {
  const curtains = content.curtains;

  const handleFabricChange = (
    index: number,
    field: "title" | "desc" | "image",
    val: string
  ) => {
    onChange((prev) => {
      const fabrics = [...(prev.curtains.fabrics || [])];
      if (fabrics[index]) fabrics[index] = { ...fabrics[index], [field]: val };
      return { ...prev, curtains: { ...prev.curtains, fabrics } };
    });
  };

  const handleFeatureChange = (fabricIndex: number, featureIndex: number, val: string) => {
    onChange((prev) => {
      const fabrics = [...(prev.curtains.fabrics || [])];
      const fabric = fabrics[fabricIndex];
      if (fabric) {
        const features = [...fabric.features];
        features[featureIndex] = val;
        fabrics[fabricIndex] = { ...fabric, features };
      }
      return { ...prev, curtains: { ...prev.curtains, fabrics } };
    });
  };

  const handleAddFeature = (fabricIndex: number) => {
    onChange((prev) => {
      const fabrics = [...(prev.curtains.fabrics || [])];
      const fabric = fabrics[fabricIndex];
      if (fabric) {
        fabrics[fabricIndex] = { ...fabric, features: [...fabric.features, ""] };
      }
      return { ...prev, curtains: { ...prev.curtains, fabrics } };
    });
  };

  const handleRemoveFeature = (fabricIndex: number, featureIndex: number) => {
    onChange((prev) => {
      const fabrics = [...(prev.curtains.fabrics || [])];
      const fabric = fabrics[fabricIndex];
      if (fabric) {
        fabrics[fabricIndex] = {
          ...fabric,
          features: fabric.features.filter((_, i) => i !== featureIndex),
        };
      }
      return { ...prev, curtains: { ...prev.curtains, fabrics } };
    });
  };

  const handleAddFabric = () => {
    onChange((prev) => ({
      ...prev,
      curtains: {
        ...prev.curtains,
        fabrics: [
          ...(prev.curtains.fabrics || []),
          {
            id: `fabric-${Date.now()}`,
            title: "قماش جديد",
            desc: "",
            image: "",
            features: [],
          },
        ],
      },
    }));
  };

  const handleRemoveFabric = (index: number) => {
    onChange((prev) => ({
      ...prev,
      curtains: {
        ...prev.curtains,
        fabrics: (prev.curtains.fabrics || []).filter((_, i) => i !== index),
      },
    }));
  };

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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
            <textarea
              rows={3}
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

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة الصورة (Badge)</label>
            <input
              type="text"
              value={curtains.originBadge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, originBadge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">تذييل الكارت (Footer)</label>
            <input
              type="text"
              value={curtains.cardFooter}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, cardFooter: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص زر الاختيار</label>
            <input
              type="text"
              value={curtains.selectLabel}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  curtains: { ...prev.curtains, selectLabel: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* 2. كروت الأقمشة: الصور والعناوين والمميزات */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-white">
            كروت الأقمشة والصور ({curtains.fabrics.length})
          </h3>
          <button
            type="button"
            onClick={handleAddFabric}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة قماش</span>
          </button>
        </div>

        {curtains.fabrics.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-zinc-400">
            لا توجد أقمشة مخصصة — سيتم استخدام الأقمشة الافتراضية مع صورها في الصفحة الرئيسية.
          </p>
        )}

        <div className="space-y-3">
          {curtains.fabrics.map((fabric, idx) => (
            <div key={fabric.id || idx} className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[#ffd700]">قماش #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFabric(idx)}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-400">اسم القماش</label>
                  <input
                    type="text"
                    value={fabric.title}
                    onChange={(e) => handleFabricChange(idx, "title", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <AdminImageField
                  label="صورة القماش (فارغ = صورة الكتالوج المرتبطة)"
                  value={fabric.image}
                  placeholder="https://... أو ارفع صورة من جهازك"
                  onChange={(url) => handleFabricChange(idx, "image", url)}
                />
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">وصف القماش</label>
                <textarea
                  rows={2}
                  value={fabric.desc}
                  onChange={(e) => handleFabricChange(idx, "desc", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[10px] font-bold text-zinc-400">مميزات القماش</label>
                  <button
                    type="button"
                    onClick={() => handleAddFeature(idx)}
                    className="flex items-center gap-1 text-[11px] font-bold text-[#ffd700] hover:underline"
                  >
                    <Plus className="h-3 w-3" />
                    <span>إضافة ميزة</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fabric.features.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#07090e] px-2 py-1"
                    >
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => handleFeatureChange(idx, fIdx, e.target.value)}
                        className="w-36 bg-transparent text-xs text-white outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx, fIdx)}
                        aria-label="حذف الميزة"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

