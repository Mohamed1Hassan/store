

import { Boxes, Check, Phone, ShoppingBag, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SectionHeading from "./SectionHeading";
import { SITE_URL, whatsappLink } from "@/data/site";
import { PRODUCTS_CATALOG } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";

/** بيانات منظمة لمحركات البحث: كل منتج في الكتالوج كـ Product + Offer */
const PRODUCTS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: PRODUCTS_CATALOG.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Product",
      name: product.name,
      description: product.description,
      category: product.category,
      url: `${SITE_URL}/#products-section`,
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/#order-section`,
        priceCurrency: "EGP",
        price: product.priceValue,
        availability: "https://schema.org/InStock",
      },
    },
  })),
};

/** شبكة كتالوج المنتجات الكامل بالأسعار وأزرار الطلب */
export default function ProductsGrid() {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <section
      id="products-section"
      className="py-20 bg-[#090d16] border-t border-[#d4af37]/20 relative"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCTS_JSON_LD) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={Boxes}
          badge="كل ما يقدمه السلطان"
          title="تشكيلة"
          accent="المنتجات الكاملة"
          description="أسعار واضحة وتفصيل على المقاس لكل المنتجات: مراتب طبية، ستائر فاخرة، كافر مراتب، ومفروشات فندقية."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRODUCTS_CATALOG.map((product) => (
            <article
              key={product.id}
              className="flex flex-col p-6 rounded-3xl bg-[#0b0e17] border border-white/5 hover:border-[#d4af37]/40 hover:bg-[#0e121c] hover:shadow-2xl hover:shadow-[#d4af37]/10 transition-all duration-300 relative overflow-hidden"
            >
              {product.image && (
                <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-black/20">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              <span className="self-start text-[10px] font-bold text-[#ffd700] bg-[#d4af37]/15 border border-[#d4af37]/30 px-2.5 py-1 rounded-full mb-4 z-10">
                {product.tag}
              </span>

              <span className="text-[11px] text-zinc-500 mb-1">{product.category}</span>
              <h3 className="text-base font-bold text-white leading-snug mb-3">{product.name}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">{product.description}</p>

              <ul className="space-y-1.5 mb-5">
                {product.features.slice(0, 3).map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[11px] text-zinc-300">
                    <Check className="w-3.5 h-3.5 text-[#ffd700] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-white/10">
                <div className="flex items-end justify-between gap-2 mb-3">
                  <span className="text-xl font-black text-[#ffd700]">{product.price}</span>
                  <div className="text-left">
                    {product.originalPrice && (
                      <span className="block text-xs text-zinc-500 line-through">
                        {product.originalPrice}
                      </span>
                    )}
                    {product.savingLabel && (
                      <span className="block text-[10px] font-bold text-emerald-400">
                        توفير {product.savingLabel}
                      </span>
                    )}
                  </div>
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
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-extrabold text-xs shadow-md flex items-center justify-center gap-1.5 hover:brightness-110 transition"
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
                        `مرحباً مفروشات السلطان، أود الاستفسار عن ${product.name} (السعر: ${product.price})`
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
          ))}
        </div>
      </div>
    </section>
  );
}
