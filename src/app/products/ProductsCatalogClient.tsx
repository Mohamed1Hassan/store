"use client";

import { useState, useMemo } from "react";
import { Crown, Filter, Search, ShieldCheck, Sparkles, Truck } from "lucide-react";
import type { Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export default function ProductsCatalogClient({ products }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.priceValue - b.priceValue;
        if (sortBy === "price-desc") return b.priceValue - a.priceValue;
        return 0;
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col font-sans">
      <Navbar onSelectCategory={() => {}} activeCategory="room" />

      <main className="flex-1 pb-24">
        {/* Header */}
        <div className="py-16 md:py-20 bg-[#0b0e17] border-b border-[#d4af37]/20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#ffd700] text-xs font-bold mb-4">
              <Crown className="w-4 h-4 text-[#ffd700]" /> كتالوج ومنتجات السلطان
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white font-serif mb-4">
              تشكيلة <span className="gold-gradient-text">المنتجات الكاملة</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto mb-6">
              تصفح مراتبنا الطبية والستائر الملكية والمفروشات مع إمكانية الفلترة والطلب الفوري.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-300">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <ShieldCheck className="w-4 h-4 text-[#ffd700]" /> ضمان استبدال 10 سنوات
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Truck className="w-4 h-4 text-[#ffd700]" /> شحن ومعاينة لجميع المحافظات
              </span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <Sparkles className="w-4 h-4 text-[#ffd700]" /> كافر هدية مع كل مرتبة
              </span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="relative w-full md:w-80">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="ابحث عن منتج بالاسم أو المواصفات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0e17] border border-white/10 rounded-2xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
              <span className="text-zinc-400">
                عرض <b className="text-white">{filteredProducts.length}</b> منتج
              </span>
              <select
                aria-label="ترتيب المنتجات"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#0b0e17] border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-[#d4af37]"
              >
                <option value="featured">الأكثر تميزاً</option>
                <option value="price-asc">السعر: من الأقل للأعلى</option>
                <option value="price-desc">السعر: من الأعلى للأقل</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#07090e]"
                    : "bg-[#0b0e17] border border-white/10 text-zinc-300 hover:text-white"
                }`}
              >
                {cat === "all" ? "جميع المنتجات" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#0b0e17] rounded-3xl border border-white/5">
              <Filter className="w-10 h-10 text-[#ffd700]/50 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-2">لا توجد منتجات مطابقة</h3>
              <button
                type="button"
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-bold text-white"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloatButton />
      <CartDrawer />
    </div>
  );
}
