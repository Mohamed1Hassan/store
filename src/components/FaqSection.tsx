import { ChevronDown, Headphones, MessagesSquare, Phone } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { FAQ_ITEMS } from "@/data/faq";
import { whatsappLink } from "@/data/site";

/** بيانات منظمة لمحركات البحث (FAQPage) */
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function FaqSection() {
  return (
    <section id="faq-section" className="py-20 bg-[#0b0f18] border-t border-[#d4af37]/20 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          icon={MessagesSquare}
          badge="أسئلة يسألها عملاؤنا"
          title="كل اللي محتاج"
          accent="تعرفه قبل الطلب"
          description="لو لقيت سؤال مش موجود، ابعتلنا على واتساب وهنرد عليك فوراً."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ list */}
          <div className="lg:col-span-8 space-y-3">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group p-5 rounded-2xl bg-[#0b0e17] border border-white/5 hover:border-[#d4af37]/40 transition-colors duration-300"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                  <h3 className="text-sm md:text-base font-bold text-white">{item.question}</h3>
                  <ChevronDown className="w-5 h-5 text-[#ffd700] shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-xs md:text-sm text-zinc-400 leading-relaxed">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          {/* Help card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 p-6 rounded-3xl bg-gradient-to-br from-[#121828] to-[#0a0d16] border border-[#d4af37]/30 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#ffd700] mb-4">
              <Headphones className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">لسه عندك سؤال؟</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              فريق السلطان جاهز يساعدك في اختيار المرتبة المناسبة أو تفصيل الستائر على مقاسك.
            </p>

            <a
              href={whatsappLink("مرحباً مفروشات السلطان، عندي استفسار عن المنتجات")}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#b8860b] text-black font-black text-sm text-center shadow-xl shadow-[#d4af37]/20 hover:scale-[1.02] transition duration-300 flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 fill-current" />
              <span>كلّمنا على واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
