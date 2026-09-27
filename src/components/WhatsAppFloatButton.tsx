"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/data/site";

/** زر واتساب عائم يظهر بعد تمرير 300px */
export default function WhatsAppFloatButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href={whatsappLink("مرحباً مفروشات السلطان، أود الاستفسار عن المنتجات والأسعار")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل معنا على واتساب"
      data-track="whatsapp-float"
      className={`fixed bottom-5 left-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3 pr-4 font-black text-[#052e16] shadow-2xl shadow-black/50 ring-2 ring-[#d4af37]/60 transition-all duration-300 hover:scale-105 sm:bottom-6 sm:left-6`}
    >
      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#052e16]/10">
        <MessageCircle className="h-5 w-5" />
        <span aria-hidden className="absolute inset-0 rounded-full bg-[#052e16]/25 animate-ping-soft" />
      </span>
      <span className="hidden text-sm sm:inline">اطلب على واتساب</span>
    </a>
  );
}
