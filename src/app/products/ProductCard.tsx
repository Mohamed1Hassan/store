"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Phone, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";
import { whatsappLink } from "@/data/site";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="flex flex-col p-6 rounded-3xl bg-[#0b0e17] border border-white/5 hover:border-[#d4af37]/40 hover:bg-[#0e121c] transition-all duration-300 group">
      {product.image && (
        <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-black/40 border border-white/10">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2.5 py-0.5 rounded-full">
          {product.tag || product.category}
        </span>
        <span className="text-[11px] text-zinc-400">{product.category}</span>
      </div>

      <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#ffd700] transition">
        {product.name}
      </h3>
      <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-2">
        {product.description}
      </p>

      <ul className="space-y-1.5 mb-6">
        {product.features.slice(0, 3).map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-[11px] text-zinc-300">
            <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5" />
            <span className="line-clamp-1">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-end justify-between gap-2 mb-4">
          <span className="text-xl font-black text-[#ffd700]">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {product.originalPrice}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                slug: product.id,
                name: product.name,
                price: product.price,
                priceValue: product.priceValue,
              })
            }
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-black text-xs shadow-md flex items-center justify-center gap-1.5 hover:brightness-110 transition"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>إضافة إلى السلة</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-bold text-[11px] transition flex items-center justify-center gap-1 hover:border-[#d4af37]/40 hover:text-white"
            >
              <span>التفاصيل</span>
              <ArrowUpRight className="w-3 h-3 text-[#ffd700]" />
            </Link>

            <a
              href={whatsappLink(
                `مرحباً مفروشات السلطان، أود طلب أو الاستفسار عن ${product.name} (السعر: ${product.price})`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#ffd700] font-bold text-[11px] transition flex items-center justify-center gap-1 hover:bg-[#d4af37] hover:text-black"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}


