"use client";

import { useState } from "react";
import {
  Save,
  Check,
  Megaphone,
  Layers,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Phone,
  RefreshCw,
} from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content-defaults";
import ContentHeroTab from "./ContentHeroTab";
import ContentMattressTab from "./ContentMattressTab";
import ContentCurtainsTab from "./ContentCurtainsTab";
import ContentTestimonialsTab from "./ContentTestimonialsTab";
import ContentFooterTab from "./ContentFooterTab";
import ContentContactFaqTab from "./ContentContactFaqTab";

interface Props {
  initialContent: SiteContent | null;
  onRefresh: () => void;
}

type SubTabId = "hero" | "mattress" | "curtains" | "testimonials" | "footer" | "contact";

const SUB_TABS: { id: SubTabId; label: string; icon: typeof Megaphone }[] = [
  { id: "hero", label: "البانر والهيرو والفيديوهات", icon: Megaphone },
  { id: "mattress", label: "مراتب السلطان والمواصفات", icon: Layers },
  { id: "curtains", label: "تفصيل الستائر الملكية", icon: Sparkles },
  { id: "testimonials", label: "آراء العملاء والتقييمات", icon: MessageSquare },
  { id: "footer", label: "الفوتر والضمانات الملكية", icon: ShieldCheck },
  { id: "contact", label: "التواصل والأسئلة الشائعة", icon: Phone },
];

export default function AdminContentTab({ initialContent, onRefresh }: Props) {
  const [content, setContent] = useState<SiteContent>(initialContent || DEFAULT_SITE_CONTENT);
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>("hero");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || `فشل الحفظ (${res.status})`);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      onRefresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء الحفظ.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* شريط علوي + زر الحفظ */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-[#d4af37]/20 bg-[#0b0e17] p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-black text-white">
            <span>إدارة محتوى الموقع والصفحة الرئيسية (CMS)</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            تحكّم كامل في جميع نصوص الصفحة الرئيسية، مشاهد الفيديو السينمائي، طبقات المراتب، والتقييمات.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
              <Check className="h-4 w-4" />
              تم حفظ التعديلات بنجاح!
            </span>
          )}
          {error && (
            <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400">
              {error}
            </span>
          )}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#ffd700] px-5 py-2.5 text-xs font-black text-black shadow-lg shadow-[#d4af37]/20 transition hover:opacity-95 disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* تبويبات فرعية */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
        {SUB_TABS.map((st) => {
          const Icon = st.icon;
          const active = activeSubTab === st.id;
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setActiveSubTab(st.id)}
              className={`flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? "bg-[#d4af37] font-black text-black shadow-lg shadow-[#d4af37]/20"
                  : "border border-white/5 bg-[#0b0e17] text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-black" : "text-[#d4af37]"}`} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* لوحات التبويبات */}
      {activeSubTab === "hero" && <ContentHeroTab content={content} onChange={setContent} />}
      {activeSubTab === "mattress" && <ContentMattressTab content={content} onChange={setContent} />}
      {activeSubTab === "curtains" && <ContentCurtainsTab content={content} onChange={setContent} />}
      {activeSubTab === "testimonials" && (
        <ContentTestimonialsTab content={content} onChange={setContent} />
      )}
      {activeSubTab === "footer" && <ContentFooterTab content={content} onChange={setContent} />}
      {activeSubTab === "contact" && (
        <ContentContactFaqTab content={content} onChange={setContent} />
      )}
    </div>
  );
}

