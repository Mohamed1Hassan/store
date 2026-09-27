"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Check,
  Crown,
  Heart,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import type { StoredProduct } from "@/lib/products-store";
import { useCartStore } from "@/lib/cart-store";
import { SITE_URL, whatsappLink } from "@/data/site";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

export default function ProductDetailClient({ product }: { product: StoredProduct }) {
  const [selectedSize, setSelectedSize] = useState<string>("مقاس قياسي");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const productSlug = product.slug || product.id;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category,
    url: `${SITE_URL}/products/${productSlug}`,
    brand: { "@type": "Brand", name: "السلطان للمفروشات والستائر" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${productSlug}`,
      priceCurrency: "EGP",
      price: product.priceValue,
      availability: product.available === false
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  const handleAddToCart = () => {
    addItem(
      {
        id: productSlug,
        slug: productSlug,
        name: product.name,
        price: product.price,
        priceValue: product.priceValue,
        size: selectedSize,
      },
      quantity
    );
  };

  const productWhatsAppUrl = whatsappLink(
    `مرحباً مفروشات السلطان، أود طلب: ${product.name} (المقاس: ${selectedSize}) - السعر: ${product.price}`
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-[#f4efe6] selection:bg-[#ffd700] selection:text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <header className="border-b border-[#d4af37]/20 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-300 hover:text-[#ffd700] text-sm font-bold transition"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <Link href="/" className="flex items-center gap-1.5 font-serif font-black text-xl text-white">
            <Crown className="w-5 h-5 text-[#ffd700]" />
            <span className="gold-gradient-text">السلطان</span>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="p-2.5 rounded-full bg-[#10141f] border border-[#d4af37]/30 text-[#ffd700] hover:bg-[#d4af37]/15 transition"
            aria-label="فتح السلة"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#121724] to-[#0a0d16] border border-[#d4af37]/30 p-8 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between z-10">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#ffd700] backdrop-blur-md">
                  {product.tag}
                </span>
                <span className="text-xs text-zinc-400 backdrop-blur-md bg-black/40 px-2 py-1 rounded-lg">{product.category}</span>
              </div>

              {product.image ? (
                <div className="absolute inset-0 z-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>
              ) : (
                <div className="my-auto text-center z-10 py-8">
                  <Boxes className="w-20 h-20 text-[#d4af37]/40 mx-auto mb-4 stroke-1" />
                  <h1 className="text-2xl md:text-3xl font-black text-white font-serif max-w-md mx-auto leading-tight">
                    {product.name}
                  </h1>
                </div>
              )}

              {product.image && (
                 <h1 className="text-2xl md:text-3xl font-black text-white font-serif max-w-md mx-auto leading-tight z-10 text-center drop-shadow-lg mb-8">
                    {product.name}
                 </h1>
              )}

              <div className="flex items-center justify-between border-t border-white/10 pt-4 z-10 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#ffd700]" /> ضمان ملكي معتمد
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" /> جودة فندقية 7 نجوم
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <Truck className="w-5 h-5 text-[#ffd700] mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-zinc-200">توصيل سريع</p>
                <p className="text-[9px] text-zinc-500">لكافة محافظات مصر</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <ShieldCheck className="w-5 h-5 text-[#ffd700] mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-zinc-200">ضمان 10 سنوات</p>
                <p className="text-[9px] text-zinc-500">استبدال وصيانة</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
                <Heart className="w-5 h-5 text-[#ffd700] mx-auto mb-1.5" />
                <p className="text-[11px] font-bold text-zinc-200">صنع بحرفية</p>
                <p className="text-[9px] text-zinc-500">خامات تركية ومصرية</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#ffd700] mb-2">{product.category}</span>
            <h2 className="text-2xl md:text-3xl font-serif font-black text-white leading-tight mb-4">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-4 p-4 rounded-2xl bg-[#0b0e17] border border-[#d4af37]/30 mb-6">
              <span className="text-3xl font-black text-[#ffd700] font-mono">{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-500 line-through">{product.originalPrice}</span>
              )}
              {product.savingLabel && (
                <span className="text-xs font-bold text-emerald-400 mr-auto">
                  وفرت {product.savingLabel}
                </span>
              )}
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-zinc-400 mb-3">أبرز المواصفات والمميزات:</h3>
              <ul className="grid grid-cols-1 gap-2.5">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-xs text-zinc-200 p-2 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <Check className="w-4 h-4 text-[#ffd700] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-zinc-300 mb-2">المقاس المطلوب:</label>
              <div className="flex flex-wrap gap-2">
                {["مقاس قياسي", "120 × 200 سم", "160 × 200 سم", "180 × 200 سم", "تفصيل خاص"].map(
                  (size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                        selectedSize === size
                          ? "bg-[#d4af37] text-black shadow-md shadow-[#d4af37]/30"
                          : "bg-white/5 border border-white/10 text-zinc-300 hover:border-[#d4af37]/40"
                      }`}
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/15 rounded-xl bg-black/40 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-2 text-zinc-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-bold text-white font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 text-zinc-400 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>إضافة إلى السلة ({quantity})</span>
                </button>
              </div>

              <a
                href={productWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-2xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#ffd700] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d4af37]/20 transition"
              >
                <Phone className="w-4 h-4" />
                <span>طلب فوري ومباشر عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* شريط الأزرار الثابت للموبايل (Sticky Mobile CTA) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#07090e]/90 backdrop-blur-xl border-t border-white/10 md:hidden flex items-center gap-3 animate-fade-in pb-6">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.25)]"
        >
          <ShoppingBag className="w-5 h-5" />
          <span>إضافة للسلة</span>
        </button>
        <a
          href={productWhatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-white/5 border border-white/10 p-3.5 rounded-xl text-zinc-300 hover:text-[#ffd700] hover:border-[#d4af37]/40 transition"
          aria-label="تواصل عبر واتساب"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      <CartDrawer />
      <WhatsAppFloatButton />
    </div>
  );
}
