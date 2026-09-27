"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import type { StoredProduct } from "@/lib/products-store";
import AdminNewProductForm from "./AdminNewProductForm";

interface Props {
  products: StoredProduct[];
  onRefresh: () => void;
}

export default function AdminProductsTab({ products, onRefresh }: Props) {
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editPriceValue, setEditPriceValue] = useState(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState("");
  const [editSavingLabel, setEditSavingLabel] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFeatures, setEditFeatures] = useState("");

  const startEdit = (p: StoredProduct) => {
    setEditingSlug(p.slug || p.id);
    setEditName(p.name);
    setEditCategory(p.category);
    setEditTag(p.tag);
    setEditPrice(p.price);
    setEditPriceValue(p.priceValue);
    setEditOriginalPrice(p.originalPrice || "");
    setEditSavingLabel(p.savingLabel || "");
    setEditImage(p.image || "");
    setEditDescription(p.description);
    setEditFeatures(p.features.join("\n"));
  };

  const handleUpdate = async (slug: string) => {
    setSaving(true);
    try {
      const featArray = editFeatures.split("\n").map((f) => f.trim()).filter(Boolean);
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          category: editCategory,
          tag: editTag,
          price: editPrice,
          priceValue: Number(editPriceValue),
          originalPrice: editOriginalPrice.trim() || undefined,
          savingLabel: editSavingLabel.trim() || undefined,
          image: editImage.trim() || undefined,
          description: editDescription,
          features: featArray.length > 0 ? featArray : ["خامات ممتازة وضمان معتمد"],
        }),
      });
      if (!res.ok) throw new Error();
      setEditingSlug(null);
      onRefresh();
    } catch {
      alert("تعذر تعديل المنتج.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    try {
      const res = await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onRefresh();
    } catch {
      alert("حدث خطأ أثناء الحذف.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-white">إدارة كتالوج المنتجات</h2>
          <p className="text-xs text-zinc-400">إضافة وتعديل وحذف المنتجات والأسعار لحظياً.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-xs shadow-md hover:brightness-110 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? "إلغاء الإضافة" : "إضافة منتج جديد"}</span>
        </button>
      </div>

      {showAddForm && (
        <AdminNewProductForm
          onCreated={() => {
            setShowAddForm(false);
            onRefresh();
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => {
          const pSlug = p.slug || p.id;
          const isEditing = editingSlug === pSlug;
          return (
            <div key={pSlug} className="rounded-3xl border border-white/10 bg-[#0b0e17] p-5 flex flex-col justify-between">
              {isEditing ? (
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">اسم المنتج</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">القسم</label>
                      <input type="text" value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">الشارة (Tag)</label>
                      <input type="text" value={editTag} onChange={(e) => setEditTag(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">السعر المكتوب</label>
                      <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">السعر رقماً</label>
                      <input type="number" value={editPriceValue} onChange={(e) => setEditPriceValue(Number(e.target.value))} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">السعر القديم (اختياري)</label>
                      <input type="text" value={editOriginalPrice} onChange={(e) => setEditOriginalPrice(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-400 mb-1">قيمة التوفير (اختياري)</label>
                      <input type="text" value={editSavingLabel} onChange={(e) => setEditSavingLabel(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">رابط الصورة (Image URL)</label>
                    <input type="text" value={editImage} onChange={(e) => setEditImage(e.target.value)} placeholder="https://..." dir="ltr" className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">الوصف المختصر</label>
                    <textarea rows={2} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-400 mb-1">المميزات والخامات (ميزة في كل سطر)</label>
                    <textarea rows={3} value={editFeatures} onChange={(e) => setEditFeatures(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white resize-none" />
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  {p.image && (
                    <div className="relative w-full h-36 mb-3 rounded-xl overflow-hidden bg-black/30 border border-white/10">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <span className="text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-full">{p.tag}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mb-2 line-clamp-2">{p.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-black text-[#ffd700] font-mono">{p.price}</span>
                    {p.originalPrice && <span className="text-xs text-zinc-500 line-through font-mono">{p.originalPrice}</span>}
                  </div>
                  {p.features && p.features.length > 0 && (
                    <div className="text-[11px] text-zinc-300 bg-white/5 rounded-xl p-2.5 border border-white/5 space-y-1">
                      <p className="text-[10px] font-bold text-[#ffd700]">الخامات والمميزات:</p>
                      {p.features.map((f, i) => (
                        <p key={i} className="truncate">• {f}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[10px] text-zinc-500 font-mono" dir="ltr">/{pSlug}</span>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => void handleUpdate(pSlug)} disabled={saving} className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><Check className="w-4 h-4" /></button>
                      <button type="button" onClick={() => setEditingSlug(null)} className="p-1.5 rounded-lg bg-white/5 text-zinc-400"><X className="w-4 h-4" /></button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => startEdit(p)} className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-[#ffd700]"><Edit2 className="w-4 h-4" /></button>
                      <button type="button" onClick={() => void handleDelete(pSlug)} className="p-1.5 rounded-lg bg-white/5 text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
