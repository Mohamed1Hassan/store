"use client";

import { useState } from "react";

interface Props {
  onCreated: () => void;
  onCancel: () => void;
}

export default function AdminNewProductForm({ onCreated, onCancel }: Props) {
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("مفروشات وستائر");
  const [tag, setTag] = useState("فاخر");
  const [price, setPrice] = useState("");
  const [priceValue, setPriceValue] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [savingLabel, setSavingLabel] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const featArray = features.split("\n").map((f) => f.trim()).filter(Boolean);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slug.trim().toLowerCase(),
          name: name.trim(),
          category: category.trim(),
          tag: tag.trim(),
          price: price.trim(),
          priceValue: Number(priceValue),
          originalPrice: originalPrice.trim() || undefined,
          savingLabel: savingLabel.trim() || undefined,
          image: image.trim() || undefined,
          description: description.trim(),
          features: featArray.length > 0 ? featArray : ["خامات ممتازة وضمان معتمد"],
          available: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "تعذر إضافة المنتج.");
      onCreated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "خطأ أثناء الإضافة.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-3xl border border-[#d4af37]/40 bg-[#07090e] space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#ffd700]">بيانات المنتج الجديد</h3>
        <button type="button" onClick={onCancel} className="text-xs text-zinc-400 hover:text-white">إلغاء</button>
      </div>
      {error && <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-300">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" required placeholder="المعرف (slug بالإنجليزية)" value={slug} onChange={(e) => setSlug(e.target.value)} dir="ltr" className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" required placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" required placeholder="القسم" value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" required placeholder="الشارة (Tag)" value={tag} onChange={(e) => setTag(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" required placeholder="السعر المكتوب (مثال: 1,850 ج.م)" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="number" required placeholder="السعر رقماً (1850)" value={priceValue} onChange={(e) => setPriceValue(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" placeholder="السعر القديم (اختياري - مثال: 2,400 ج.م)" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
        <input type="text" placeholder="قيمة التوفير (اختياري - مثال: 550 ج.م)" value={savingLabel} onChange={(e) => setSavingLabel(e.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
      </div>
      <input type="text" placeholder="رابط الصورة (Image URL)" value={image} onChange={(e) => setImage(e.target.value)} dir="ltr" className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white" />
      <textarea rows={2} required placeholder="الوصف المختصر..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white resize-none" />
      <textarea rows={2} placeholder="المميزات والخامات (ميزة في كل سطر)" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white resize-none" />
      <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-[#d4af37] text-black font-extrabold text-xs">
        {saving ? "جاري الحفظ..." : "حفظ المنتج"}
      </button>
    </form>
  );
}
