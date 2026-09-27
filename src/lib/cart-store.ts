import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // product id / slug
  slug: string;
  name: string;
  price: string;
  priceValue: number;
  image?: string;
  size?: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item, quantity = 1) => {
        set((state) => {
          const index = state.items.findIndex(
            (i) => i.id === item.id && (i.size || "") === (item.size || "")
          );
          if (index > -1) {
            const updated = [...state.items];
            const existing = updated[index];
            if (existing) {
              updated[index] = {
                ...existing,
                quantity: existing.quantity + quantity,
              };
            }
            return { items: updated, isOpen: true };
          }
          return {
            items: [...state.items, { ...item, quantity }],
            isOpen: true,
          };
        });
      },
      removeItem: (id, size) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && (i.size || "") === (size || ""))
          ),
        }));
      },
      updateQuantity: (id, quantity, size) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id === id && (i.size || "") === (size || "")) {
              return { ...i, quantity };
            }
            return i;
          }),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce(
          (acc, item) => acc + item.priceValue * item.quantity,
          0
        );
      },
    }),
    {
      name: "alsultan-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
