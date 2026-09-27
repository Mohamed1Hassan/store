import type { ComponentType } from "react";

interface SectionHeadingProps {
  icon: ComponentType<{ className?: string }>;
  badge: string;
  title: string;
  accent: string;
  description?: string;
  headingId?: string;
}

/** عنوان قسم موحّد: شارة ذهبية + عنوان بخط serif + وصف اختياري */
export default function SectionHeading({
  icon: Icon,
  badge,
  title,
  accent,
  description,
  headingId,
}: SectionHeadingProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#ffd700] text-xs font-bold mb-4">
        <Icon className="w-3.5 h-3.5" />
        {badge}
      </div>
      <h2 id={headingId} className="text-3xl md:text-5xl font-black text-white font-serif mb-4 leading-tight">
        {title} <span className="gold-gradient-text">{accent}</span>
      </h2>
      {description && (
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed">{description}</p>
      )}
    </div>
  );
}
