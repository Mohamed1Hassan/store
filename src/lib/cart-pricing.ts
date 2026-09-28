/**
 * تسعير السلة في السيرفر — P0.2 من PAYMENT-PLAN.md.
 * المبلغ يُحسب حصراً من أسعار القاعدة (`priceValue`) — المتصفح يرسل
 * slug + كمية فقط، فلا جدوى لتلاعب localStorage بالسعر.
 */

import type { CartItemInput } from "../schemas/lead";
import type { StoredProduct } from "./products-store";

/** دالة جلب المنتج — تُحقن من المسار (`getProductBySlug`) أو من الاختبارات */
export type CartLookup = (slug: string) => Promise<StoredProduct | null>;

export interface PricedCart {
  /** الإجمالي بالجنيه — رقم نظيف بدون تنسيق (P0.6) */
  amount: number;
  /** نص الطلب الكامل المبني من أسماء القاعدة — يتجاوز حد 160 حرف بأمان */
  summary: string;
}

export type PriceCartResult =
  | { ok: true; cart: PricedCart }
  | { ok: false; error: string };

/**
 * يحسب مبلغ السلة ويبني ملخص الطلب من الكتالوج.
 * يرفض أي slug غير موجود أو منتج غير متوفر (مع رسالة عربية).
 */
export async function priceCart(
  items: CartItemInput[],
  lookup: CartLookup
): Promise<PriceCartResult> {
  if (items.length === 0) {
    return { ok: false, error: "السلة فارغة — أضف منتجاً واحداً على الأقل." };
  }

  const lines: string[] = [];
  let amount = 0;

  for (const item of items) {
    const product = await lookup(item.slug);
    if (!product) {
      return { ok: false, error: "منتج غير موجود في الكتالوج — حدّث السلة وحاول مجدداً." };
    }
    if (product.available === false) {
      return { ok: false, error: `المنتج «${product.name}» غير متوفر حالياً — أزاله من السلة.` };
    }
    let unitPrice = product.priceValue;
    if (item.size && product.sizes && product.sizes.length > 0) {
      const matchedSize = product.sizes.find(s => s.label === item.size);
      if (matchedSize) {
        unitPrice = matchedSize.priceValue;
      }
    }
    amount += unitPrice * item.quantity;
    lines.push(
      `${product.name} (الكمية: ${item.quantity}${item.size ? ` - المقاس: ${item.size}` : ""})`
    );
  }

  return {
    ok: true,
    cart: {
      amount,
      summary: `سلة: ${lines.join(" + ")} | الإجمالي: ${amount} ج.م`,
    },
  };
}