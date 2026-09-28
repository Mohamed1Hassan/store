import Image from "next/image";
import { Crown, Phone, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL, STORE_HOURS } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-[#05070a] border-t border-[#d4af37]/20 pt-16 pb-12 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-[#d4af37] to-[#aa7c11]">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-black">
                  <Image src="/logo.jpg" alt="السلطان" fill sizes="48px" className="object-cover" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-white font-serif">السلطان</h2>
                <p className="text-[10px] text-[#ffd700]">للمفروشات والمراتب والستائر وكافر المراتب</p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              عنوان الفخامة والجودة العالية لأكثر من 20 عاماً في صناعة المراتب الطبية وتفصيل أرقى الستائر والمفروشات الفندقية والمنزلية.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#ffd700]">
              <Sparkles className="w-4 h-4" />
              <span>راحة ملكية تستحقها في كل تفصيلة</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-r-2 border-[#d4af37] pr-3">
              أقسام المعرض
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li><a href="/products" className="text-[#ffd700] font-bold hover:underline transition">⭐ متجر المنتجات والكتالوج الكامل (/products)</a></li>
              <li><a href="/#mattress-section" className="hover:text-[#ffd700] transition">مراتب طبية بوكيت سوست منفصلة</a></li>
              <li><a href="/#curtains-section" className="hover:text-[#ffd700] transition">ستائر بلاك أوت وقطيفة وشيفون</a></li>
              <li><a href="/orders/track" className="hover:text-[#ffd700] text-[#ffd700]/90 font-bold transition">متابعة حالة الطلب والمعاينة (Tracking)</a></li>
              <li><a href="/#pillows-section" className="hover:text-[#ffd700] transition">مفروشات وألحفة سرير تركي</a></li>
              <li><a href="/#protector-section" className="hover:text-[#ffd700] transition">كافر وواقي المراتب ضد السوائل</a></li>
              <li><a href="/#order-section" className="hover:text-[#ffd700] transition">اطلب الآن من المعرض</a></li>
              <li><a href="/#testimonials-section" className="hover:text-[#ffd700] transition">آراء العملاء وتقييماتهم</a></li>
              <li><a href="/#faq-section" className="hover:text-[#ffd700] transition">الأسئلة الشائعة</a></li>
            </ul>
          </div>

          {/* Guarantees */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-r-2 border-[#d4af37] pr-3">
              ضمانات السلطان
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
                <span>ضمان استبدال مباشر 10 سنوات</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
                <span>خامات معالجة طبياً ضد عتة الفراش</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
                <span>تجربة نوم مريحة وداعمة للفقرات</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ffd700]" />
                <span>فريق فني متخصص لرفع المقاسات والتركيب</span>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-r-2 border-[#d4af37] pr-3">
              خدمة العملاء
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#ffd700] shrink-0 mt-0.5" />
                <span>معارضنا في خدمة عملائنا بأرقى المواقع ونوفر الشحن لكافة المحافظات</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span>{STORE_HOURS}</span>
              </div>
              <a href={`tel:${PHONE_TEL}`} className="flex items-center gap-2.5 hover:text-[#ffd700] transition">
                <Phone className="w-4 h-4 text-[#ffd700] shrink-0" />
                <span dir="ltr">{PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-300 gap-4">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ مفروشات ومراتب وستائر السلطان (Al-Sultan).</p>
          <div className="flex items-center gap-1 text-[#ffd700]">
            <span>صُنع بفخامة ملكية</span>
            <Crown className="w-3.5 h-3.5 fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
}
