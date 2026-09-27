"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { X, ShoppingBag, CheckCircle2 } from "lucide-react";
import { whatsappLink } from "@/data/site";
import confetti from "canvas-confetti";
import CartItemsList from "./CartItemsList";
import CartCheckoutForm from "./CartCheckoutForm";

export default function CartDrawer() {
  const { items, isOpen, closeCart, getTotalPrice } = useCartStore();

  const [checkoutMode, setCheckoutMode] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  const handleSuccess = (code: string | null) => {
    setTrackingCode(code);
    setSuccess(true);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffd700", "#d4af37", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  const buildCartWhatsAppMessage = () => {
    const itemsList = items
      .map((i) => `• ${i.name} × ${i.quantity} ${i.size ? `(مقاس: ${i.size})` : ""} - ${i.price}`)
      .join("\n");
    return [
      "طلب شراء سلة متكاملة من مفروشات السلطان:",
      itemsList,
      `إجمالي السلة: ${totalPrice.toLocaleString("ar-EG")} ج.م`,
    ].join("\n\n");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />
      <div className="fixed inset-y-0 left-0 flex max-w-full pl-0 md:pl-10">
        <aside
          aria-label="سلة المشتريات"
          className="w-screen max-w-md bg-[#0b0e17] border-r border-[#d4af37]/30 text-[#f4efe6] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 bg-[#07090e]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#ffd700]" />
              <h2 className="text-lg font-black font-serif text-white">سلة المشتريات</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#ffd700] font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
              aria-label="إغلاق السلة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            {success ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-white mb-2">تم تأكيد طلبك بنجاح!</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-xs">
                  سيتواصل معك فريق مبيعات مفروشات السلطان لتأكيد تفاصيل التوصيل والاستلام.
                </p>
                {trackingCode && (
                  <div className="mb-6 rounded-2xl bg-white/5 border border-[#d4af37]/30 p-4 w-full">
                    <p className="text-xs text-zinc-400 mb-1">كود متابعة الطلب الخاص بك:</p>
                    <p className="text-lg font-mono font-black text-[#ffd700] tracking-wider" dir="ltr">
                      {trackingCode}
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setCheckoutMode(false);
                    closeCart();
                  }}
                  className="px-6 py-3 rounded-full bg-[#d4af37] text-black font-extrabold text-sm hover:brightness-110 transition"
                >
                  متابعة التسوق
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-zinc-300 mb-1">سلتك فارغة حالياً</p>
                <p className="text-xs text-zinc-500 mb-6">
                  تصفح تشكيلة السلطان الفاخرة وأضف ما يناسب ذوقك الراقي.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full border border-[#d4af37]/40 text-[#ffd700] hover:bg-[#d4af37]/15 text-xs font-bold transition"
                >
                  تصفح المنتجات
                </button>
              </div>
            ) : checkoutMode ? (
              <CartCheckoutForm
                onBack={() => setCheckoutMode(false)}
                onSuccess={handleSuccess}
              />
            ) : (
              <CartItemsList />
            )}
          </div>

          {!success && items.length > 0 && !checkoutMode && (
            <div className="border-t border-white/10 p-6 bg-[#07090e] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">الإجمالي التقديري:</span>
                <span className="text-xl font-black text-[#ffd700] font-mono">
                  {totalPrice.toLocaleString("ar-EG")} ج.م
                </span>
              </div>

              <button
                type="button"
                onClick={() => setCheckoutMode(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition"
              >
                <span>إتمام الطلب الآن</span>
              </button>

              <a
                href={whatsappLink(buildCartWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#ffd700] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#d4af37]/20 transition"
              >
                <span>طلب السلة مباشرة عبر واتساب</span>
              </a>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
