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
  const [editPrice, setEditPrice] = useState("");
  const [editPriceValue, setEditPriceValue] = useState(0);

  const startEdit = (p: StoredProduct) => {
    setEditingSlug(p.slug || p.id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditPriceValue(p.priceValue);
  };

  const handleUpdate = async (slug: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          price: editPrice,
          priceValue: Number(editPriceValue),
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
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} className="rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                    <input type="number" value={editPriceValue} onChange={(e) => setEditPriceValue(Number(e.target.value))} className="rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white" />
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-white">{p.name}</h3>
                    <span className="text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2 py-0.5 rounded-full">{p.tag}</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{p.description}</p>
                  <p className="text-sm font-black text-[#ffd700] font-mono">{p.price}</p>
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
