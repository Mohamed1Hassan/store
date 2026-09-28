"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, Phone, Menu, X, ShoppingBag, Store } from "lucide-react";
import { PRODUCTS_INQUIRY_MESSAGE, whatsappLink } from "@/data/site";
import type { CategoryId } from "@/data/products";
import { useCartStore } from "@/lib/cart-store";

interface NavbarProps {
  onSelectCategory: (cat: CategoryId) => void;
  activeCategory: CategoryId;
}

export default function Navbar({ onSelectCategory, activeCategory }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const totalCartCount = useCartStore((s) => s.getTotalCount());

  const navItems: { id: CategoryId; label: string; href?: string }[] = [
    { id: "room", label: "الرئيسية", href: "/" },
    { id: "mattress", label: "المراتب" },
    { id: "curtains", label: "الستائر" },
    { id: "pillows", label: "المفروشات" },
    { id: "specs", label: "كافر المراتب" },
  ];

  return (
    <header className="relative bg-[#07090e]/80 backdrop-blur-xl border-b border-[#d4af37]/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <button
            type="button"
            onClick={() => onSelectCategory("room")}
            aria-label="الرئيسية الملكية"
            className="flex items-center gap-4 cursor-pointer text-right"
          >
            <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] via-[#fff2be] to-[#996515] shadow-lg shadow-[#d4af37]/20 group">
              <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                <Image
                  src="/logo.jpg"
                  alt="السلطان للمفروشات والستائر"
                  fill
                  sizes="56px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  priority
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-[#ffd700]" />
                <span className="text-xl md:text-2xl font-black tracking-wide gold-gradient-text font-serif">
                  السلطان
                </span>
              </div>
              <p className="text-[11px] text-[#c8aa6e] tracking-tight">
                للمفروشات والمراتب والستائر وكافر المراتب
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#10141f]/80 p-1.5 rounded-full border border-[#d4af37]/30 shadow-inner">
            <Link
              href="/products"
              className="px-4 py-2 rounded-full text-sm font-bold text-[#ffd700] hover:bg-[#d4af37]/20 flex items-center gap-1.5 transition-all duration-300"
            >
              <Store className="w-3.5 h-3.5" />
              <span>المتجر والأسعار</span>
            </Link>
            {navItems.map((item) => {
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectCategory(item.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#07090e] shadow-md shadow-[#d4af37]/30 font-bold"
                      : "text-zinc-300 hover:text-[#ffd700] hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Call Button & Cart & WhatsApp */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              className="relative p-2.5 rounded-full bg-[#10141f] border border-[#d4af37]/30 text-[#ffd700] hover:bg-[#d4af37]/15 transition"
              aria-label="فتح سلة المشتريات"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-black text-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={whatsappLink(PRODUCTS_INQUIRY_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="navbar-desktop-cta"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-[#07090e] font-bold text-sm shadow-lg shadow-[#d4af37]/25 hover:shadow-[#d4af37]/50 hover:scale-[1.03] transition-all"
              >
                <Phone className="w-4 h-4 fill-current" />
                <span>تواصل مع السلطان</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-[#141824] border border-[#d4af37]/40 text-[#ffd700] hover:bg-[#1f2638] transition"
                aria-label="القائمة"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden bg-[#0a0d16]/98 border-b border-[#d4af37]/30 px-6 py-6 animate-fade-in">
          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-right py-3 px-4 rounded-xl text-base font-bold bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#ffd700] flex items-center gap-2 transition"
            >
              <Store className="w-4 h-4" />
              <span>تصفح كل المنتجات والأسعار (/products)</span>
            </Link>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectCategory(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-right py-3 px-4 rounded-xl text-base font-bold transition ${
                  activeCategory === item.id
                    ? "bg-[#d4af37] text-black"
                    : "text-zinc-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}

            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              data-track="navbar-mobile-cta"
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold shadow-lg"
            >
              <Phone className="w-5 h-5" />
              <span>طلب واستفسار فوري</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
