"use client";

import { useCartStore } from "@/lib/cart-store";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItemsList() {
  const { items, updateQuantity, removeItem } = useCartStore();

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={`${item.id}-${item.size || ""}`}
          className="flex gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5"
        >
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
            {item.size && <p className="text-[11px] text-zinc-400 mb-1">المقاس: {item.size}</p>}
            <p className="text-xs font-black text-[#ffd700] mb-2">{item.price}</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity - 1, item.size)}
                  className="p-1 text-zinc-400 hover:text-white"
                  aria-label="إنقاص الكمية"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-mono font-bold text-white">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
                  className="p-1 text-zinc-400 hover:text-white"
                  aria-label="زيادة الكمية"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id, item.size)}
                className="text-zinc-500 hover:text-red-400 transition"
                aria-label="حذف المنتج من السلة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
