"use client";

import { Plus, Trash2, Layers, CheckCircle } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";
import AdminImageField from "./AdminImageField";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentMattressTab({ content, onChange }: Props) {
  const mattress = content.mattress;

  const handleLayerChange = (index: number, field: "title" | "desc" | "tag", val: string) => {
    onChange((prev) => {
      const layers = [...(prev.mattress.layers || [])];
      if (layers[index]) layers[index] = { ...layers[index], [field]: val };
      return { ...prev, mattress: { ...prev.mattress, layers } };
    });
  };

  const handleAddLayer = () => {
    onChange((prev) => ({
      ...prev,
      mattress: {
        ...prev.mattress,
        layers: [...(prev.mattress.layers || []), { title: "", desc: "", tag: "طبقة جديدة" }],
      },
    }));
  };

  const handleRemoveLayer = (index: number) => {
    onChange((prev) => ({
      ...prev,
      mattress: {
        ...prev.mattress,
        layers: (prev.mattress.layers || []).filter((_, i) => i !== index),
      },
    }));
  };

  const handleSpecChange = (index: number, field: "label" | "val", val: string) => {
    onChange((prev) => {
      const specs = [...(prev.mattress.specs || [])];
      if (specs[index]) specs[index] = { ...specs[index], [field]: val };
      return { ...prev, mattress: { ...prev.mattress, specs } };
    });
  };

  const handleAddSpec = () => {
    onChange((prev) => ({
      ...prev,
      mattress: {
        ...prev.mattress,
        specs: [...(prev.mattress.specs || []), { label: "", val: "" }],
      },
    }));
  };

  const handleRemoveSpec = (index: number) => {
    onChange((prev) => ({
      ...prev,
      mattress: {
        ...prev.mattress,
        specs: (prev.mattress.specs || []).filter((_, i) => i !== index),
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* 1. نصوص رأس القسم وكارت الموديل */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          عنوان القسم وكارت المرتبة الملكية
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة القسم</label>
            <input
              type="text"
              value={mattress.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان الرئيسي</label>
            <input
              type="text"
              value={mattress.title}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, title: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان المميز (الذهبي)</label>
            <input
              type="text"
              value={mattress.accent}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, accent: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">الوصف الترويجي للقسم</label>
          <textarea
            rows={2}
            value={mattress.description}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                mattress: { ...prev.mattress, description: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-white/5 pt-2 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">اسم الموديل</label>
            <input
              type="text"
              value={mattress.modelName}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, modelName: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">النص الترويجي المصاحب</label>
            <input
              type="text"
              value={mattress.modelEyebrow}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, modelEyebrow: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">السعر الحالي</label>
            <input
              type="text"
              value={mattress.price}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, price: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-black text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">السعر قبل الخصم</label>
            <input
              type="text"
              value={mattress.oldPrice}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, oldPrice: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-400 line-through outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>


      {/* 2. طبقات المرتبة */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">
              طبقات المرتبة التشريحية ({mattress.layers.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddLayer}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة طبقة</span>
          </button>
        </div>

        {mattress.layers.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-zinc-400">
            لا توجد طبقات مخصصة — سيتم استخدام الطبقات الافتراضية في الصفحة الرئيسية.
          </p>
        )}

        <div className="space-y-3">
          {mattress.layers.map((layer, idx) => (
            <div key={idx} className="space-y-3 rounded-2xl border border-white/5 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-black text-[#ffd700]">الطبقة #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveLayer(idx)}
                  className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>حذف</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-[10px] font-bold text-zinc-400">اسم الطبقة</label>
                  <input
                    type="text"
                    value={layer.title}
                    onChange={(e) => handleLayerChange(idx, "title", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-bold text-zinc-400">شارة الطبقة (Tag)</label>
                  <input
                    type="text"
                    value={layer.tag}
                    onChange={(e) => handleLayerChange(idx, "tag", e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-[#ffd700] outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[10px] font-bold text-zinc-400">وصف الطبقة ومميزاتها</label>
                <textarea
                  rows={2}
                  value={layer.desc}
                  onChange={(e) => handleLayerChange(idx, "desc", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* 3. جدول المواصفات الفنية */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">
              المواصفات الفنية السريعة ({mattress.specs.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddSpec}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة خاصية</span>
          </button>
        </div>

        {mattress.specs.length === 0 && (
          <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-zinc-400">
            لا توجد مواصفات مخصصة — سيتم استخدام المواصفات الافتراضية في الصفحة الرئيسية.
          </p>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
          {mattress.specs.map((spec, idx) => (
            <div key={idx} className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400">خاصية #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSpec(idx)}
                  aria-label="حذف الخاصية"
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <input
                type="text"
                placeholder="اسم الخاصية"
                value={spec.label}
                onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
              />
              <input
                type="text"
                placeholder="القيمة"
                value={spec.val}
                onChange={(e) => handleSpecChange(idx, "val", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#07090e] px-2.5 py-1.5 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3.5. صورة الموديل وبطاقة الهدية */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          صورة الموديل وبطاقة الهدية المجانية
        </h3>

        <AdminImageField
          label="رابط صورة المرتبة (يُعرض داخل كارت الموديل — فارغ = مخفي)"
          value={mattress.modelImage || ""}
          placeholder="https://... أو ارفع صورة من جهازك"
          onChange={(url) =>
            onChange((prev) => ({
              ...prev,
              mattress: { ...prev.mattress, modelImage: url },
            }))
          }
        />

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">
            عنوان قائمة الطبقات
          </label>
          <input
            type="text"
            value={mattress.layersHeading}
            onChange={(e) =>
              onChange((prev) => ({
                ...prev,
                mattress: { ...prev.mattress, layersHeading: e.target.value },
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة الهدية</label>
            <input
              type="text"
              value={mattress.giftBadge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, giftBadge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">عنوان بطاقة الهدية</label>
            <input
              type="text"
              value={mattress.giftTitle}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, giftTitle: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">وصف بطاقة الهدية</label>
            <input
              type="text"
              value={mattress.giftDesc}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, giftDesc: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص زر بطاقة الهدية</label>
            <input
              type="text"
              value={mattress.giftCta}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  mattress: { ...prev.mattress, giftCta: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


