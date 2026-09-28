"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarCheck, Check, Phone, Scissors, Send } from "lucide-react";
import { whatsappLink } from "@/data/site";
import { CURTAIN_FABRICS, DEFAULT_FABRIC_ID } from "@/data/curtains";
import { buildAppointmentMessage, EGYPTIAN_CITIES } from "@/schemas/appointment";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/data/products";
import type { SiteContent } from "@/schemas/site-content";

interface Props {
  products?: Product[];
  curtainsContent?: SiteContent["curtains"];
}

export default function CurtainSection({ products = [], curtainsContent }: Props) {
  const [selectedFabric, setSelectedFabric] = useState(DEFAULT_FABRIC_ID);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [booked, setBooked] = useState(false);

  const badge = curtainsContent?.badge || "تفصيل وتصميم حسب المقاس";
  const title = curtainsContent?.title || "ستائر";
  const accent = curtainsContent?.accent || "السلطان الفاخرة";
  const description =
    curtainsContent?.description ||
    "نقدم لكم أرقى الأقمشة العالمية المفصلة خصيصاً على أيدي أمهر فناني الديكور والستائر الكلاسيكية والمودرن.";
  const freeInspectionNote =
    curtainsContent?.freeInspectionNote || "خدمة المعاينة المنزلية ورفع المقاسات مجاناً";
  const originBadge = curtainsContent?.originBadge || "خامات أصلية مضمونة";
  const cardFooter = curtainsContent?.cardFooter || "تفصيل على المقاس لكل نافذة";
  const selectLabel = curtainsContent?.selectLabel || "اختر القماش";

  const baseFabrics =
    curtainsContent?.fabrics && curtainsContent.fabrics.length > 0
      ? curtainsContent.fabrics.map((f) => ({
          id: f.id,
          title: f.title,
          desc: f.desc,
          image: f.image || "",
          features: f.features,
        }))
      : CURTAIN_FABRICS;

  // خريطة لربط نوع القماش بمنتج الستارة المقابل له في الكتالوج المحدث من الأدمن
  const fabricToSlugMap: Record<string, string> = {
    velvet: "royal-curtains",
    linen: "natural-linen-curtains",
    chiffon: "chiffon-curtains",
  };

  // دمج بيانات وصور الأقمشة مع أحدث المنتجات من لوحة الأدمن إن وُجدت
  const dynamicFabrics = baseFabrics.map((fabric) => {
    const matchedSlug = fabricToSlugMap[fabric.id];
    const matchedProduct = products.find(
      (p) => p.id === matchedSlug || p.id === fabric.id
    );

    return {
      ...fabric,
      title: matchedProduct?.name || fabric.title,
      desc: matchedProduct?.description || fabric.desc,
      image: matchedProduct?.image || fabric.image,
      features: matchedProduct?.features?.length ? matchedProduct.features : fabric.features,
    };
  });

  const selectedFabricTitle =
    dynamicFabrics.find((fabric) => fabric.id === selectedFabric)?.title ?? "";

  const handleBooking = async (event: FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (name.trim().length < 3) {
      setFormError("اكتب الاسم بالكامل (3 حروف على الأقل).");
      return;
    }
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^01[0125][0-9]{8}$/.test(cleanPhone)) {
      setFormError("اكتب رقم موبايل مصري صحيح: 11 رقم يبدأ بـ 010 أو 011 أو 012 أو 015.");
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          fabricId: selectedFabric,
          notes: selectedFabricTitle ? `القماش المفضل: ${selectedFabricTitle}` : "",
          source: "curtains-section",
        }),
      });
      if (!res.ok && res.status !== 429) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setFormError(data?.error ?? "تعذر حفظ الحجز، لكن يمكنك إكماله عبر واتساب.");
      }
    } catch {
      // انقطاع الشبكة: نكمل لواتساب مباشرة
    } finally {
      setSending(false);
    }

    const message = buildAppointmentMessage({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      notes: selectedFabricTitle ? `القماش المفضل: ${selectedFabricTitle}` : "",
    });
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    trackEvent("order_submit", { product: "curtain-appointment" });
    setBooked(true);
  };

  return (
    <section className="py-20 bg-[#07090e] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-[#ffd700] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <Scissors className="w-4 h-4" /> {badge}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white font-serif mt-2">
              {title} <span className="gold-gradient-text">{accent}</span>
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-md">
            {description}
          </p>
        </div>

        {/* Fabrics 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dynamicFabrics.map((item) => {
            const isSelected = selectedFabric === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedFabric(item.id)}
                aria-pressed={isSelected}
                className={`w-full text-right p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? "bg-[#101522] border-[#ffd700] shadow-2xl shadow-[#d4af37]/20 scale-[1.02]"
                    : "bg-[#0b0e17] border-white/5 hover:border-white/20 hover:bg-[#0e121c]"
                }`}
              >
                <div>
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-5 border border-white/10 group-hover:border-[#d4af37]/40 transition">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07090e]/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2 right-3 left-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-black bg-[#ffd700] px-2.5 py-0.5 rounded-full shadow">
                        {originBadge}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-zinc-400 text-xs leading-relaxed mb-6">{item.desc}</p>

                  <div className="space-y-2 mb-6">
                    {item.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-[#ffd700] font-bold">
                    {cardFooter}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 group-hover:bg-[#d4af37] group-hover:text-black transition font-bold">
                    {selectLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Booking + Guarantee Bar */}
        <div className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#141926] via-[#10141f] to-[#141926] border border-[#d4af37]/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center text-[#ffd700] shrink-0">
                <Scissors className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{freeInspectionNote}</h4>
                <p className="text-xs md:text-sm text-zinc-400">
                  فريقنا المتخصص يصلك بأحدث كتالوجات الأقمشة ليقيس النوافذ ويقترح أفضل تصميم يلائم صالونك وغرفتك.
                </p>
              </div>
            </div>
            <a
              href={whatsappLink("أود حجز موعد معاينة مجانية لرفع مقاسات الستائر")}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-6 py-3 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 text-[#ffd700] font-bold text-sm hover:bg-[#d4af37]/20 transition flex items-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>استفسار سريع واتساب</span>
            </a>
          </div>

          <form onSubmit={handleBooking} noValidate className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 border-t border-white/10 pt-6">
            <div>
              <label htmlFor="curtain-book-name" className="block text-xs font-bold text-zinc-300 mb-2">
                الاسم بالكامل <span className="text-[#ffd700]">*</span>
              </label>
              <input
                id="curtain-book-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => { setName(event.target.value); setBooked(false); setFormError(null); }}
                placeholder="مثال: أحمد محمد"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25"
              />
            </div>
            <div>
              <label htmlFor="curtain-book-phone" className="block text-xs font-bold text-zinc-300 mb-2">
                رقم الموبايل <span className="text-[#ffd700]">*</span>
              </label>
              <input
                id="curtain-book-phone"
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                value={phone}
                onChange={(event) => { setPhone(event.target.value); setBooked(false); setFormError(null); }}
                placeholder="01xxxxxxxxx"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/25 text-left"
              />
            </div>
            <div>
              <label htmlFor="curtain-book-city" className="block text-xs font-bold text-zinc-300 mb-2">
                المدينة <span className="font-normal text-zinc-300">(اختياري)</span>
              </label>
              <select
                id="curtain-book-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-sm text-zinc-100 outline-none transition focus:border-[#d4af37] [color-scheme:dark]"
              >
                <option value="">— اختر المدينة —</option>
                {EGYPTIAN_CITIES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-extrabold text-sm shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {booked ? <CalendarCheck className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>{sending ? "جاري الحجز..." : "احجز موعد معاينة مجاني"}</span>
              </button>
            </div>
            {formError && (
              <p role="alert" className="sm:col-span-2 lg:col-span-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-[11px] font-bold text-red-300">
                {formError}
              </p>
            )}
            {booked && !formError && (
              <p role="status" className="sm:col-span-2 lg:col-span-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-[11px] font-bold text-emerald-300">
                تم استلام طلب المعاينة وفتح واتساب للتأكيد — سنتصل بك لتحديد الموعد المناسب.
              </p>
            )}
          </form>
        </div>

      </div>
    </section>
  );
}
