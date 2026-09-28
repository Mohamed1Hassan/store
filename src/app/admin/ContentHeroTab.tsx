"use client";

import { useState } from "react";
import { Plus, Trash2, Film } from "lucide-react";
import type { SiteContent } from "@/schemas/site-content";
import AdminImageField from "./AdminImageField";

interface Props {
  content: SiteContent;
  onChange: (updater: (prev: SiteContent) => SiteContent) => void;
}

export default function ContentHeroTab({ content, onChange }: Props) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const handleFeatureChange = (index: number, val: string) => {
    onChange((prev) => {
      const updated = [...prev.hero.features];
      if (updated[index]) updated[index] = { label: val };
      return { ...prev, hero: { ...prev.hero, features: updated } };
    });
  };

  const handleAddFeature = () => {
    onChange((prev) => ({
      ...prev,
      hero: { ...prev.hero, features: [...prev.hero.features, { label: "" }] },
    }));
  };

  const handleRemoveFeature = (index: number) => {
    onChange((prev) => ({
      ...prev,
      hero: { ...prev.hero, features: prev.hero.features.filter((_, i) => i !== index) },
    }));
  };

  const handleSceneChange = (
    index: number,
    field: "short" | "tag" | "videoSrc" | "poster",
    val: string
  ) => {
    onChange((prev) => {
      const scenes = [...(prev.hero.scenes || [])];
      if (scenes[index]) scenes[index] = { ...scenes[index], [field]: val };
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
  };

  const handleAddScene = () => {
    onChange((prev) => {
      const scenes = [
        ...(prev.hero.scenes || []),
        {
          id: `scene-${Date.now()}`,
          short: "مشهد جديد",
          tag: "New Showcase Scene",
          videoSrc: "",
          poster: "",
          badges: [],
        },
      ];
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
    // يتم ضبط المؤشر على آخر مشهد مضاف في نفس الدورة.
    setActiveSceneIndex(scenes.length);
  };

  const handleRemoveScene = (index: number) => {
    onChange((prev) => {
      const scenes = (prev.hero.scenes || []).filter((_, i) => i !== index);
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
    setActiveSceneIndex(0);
  };

  const handleBadgeChange = (sceneIndex: number, badgeIndex: number, val: string) => {
    onChange((prev) => {
      const scenes = [...(prev.hero.scenes || [])];
      const scene = scenes[sceneIndex];
      if (scene) {
        const badges = [...scene.badges];
        badges[badgeIndex] = val;
        scenes[sceneIndex] = { ...scene, badges };
      }
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
  };

  const handleAddBadge = (sceneIndex: number) => {
    onChange((prev) => {
      const scenes = [...(prev.hero.scenes || [])];
      const scene = scenes[sceneIndex];
      if (scene) scenes[sceneIndex] = { ...scene, badges: [...scene.badges, ""] };
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
  };

  const handleRemoveBadge = (sceneIndex: number, badgeIndex: number) => {
    onChange((prev) => {
      const scenes = [...(prev.hero.scenes || [])];
      const scene = scenes[sceneIndex];
      if (scene) {
        scenes[sceneIndex] = {
          ...scene,
          badges: scene.badges.filter((_, i) => i !== badgeIndex),
        };
      }
      return { ...prev, hero: { ...prev.hero, scenes } };
    });
  };

  const scenes = content.hero.scenes || [];
  const safeIndex = Math.min(activeSceneIndex, Math.max(scenes.length - 1, 0));
  const currentScene = scenes[safeIndex];


  return (
    <div className="space-y-6">
      {/* 1. شريط الإعلان الترويجي العلوي */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <h3 className="text-sm font-bold text-white">شريط الإعلان الترويجي العلوي</h3>
          <label className="flex cursor-pointer items-center gap-2">
            <span className="text-xs text-zinc-400">تفعيل الشريط</span>
            <input
              type="checkbox"
              checked={content.announcement.enabled}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, enabled: e.target.checked },
                }))
              }
              className="h-4 w-4 rounded accent-[#d4af37]"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة البداية</label>
            <input
              type="text"
              value={content.announcement.badge}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, badge: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">النص الأساسي</label>
            <input
              type="text"
              value={content.announcement.text}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, text: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">النص البارز الذهبي</label>
            <input
              type="text"
              value={content.announcement.highlight}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, highlight: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص الخاتمة</label>
            <input
              type="text"
              value={content.announcement.suffix}
              onChange={(e) =>
                onChange((prev) => ({
                  ...prev,
                  announcement: { ...prev.announcement, suffix: e.target.value },
                }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>
      </div>

      {/* 2. نصوص البانر الرئيسي */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <h3 className="border-b border-white/5 pb-3 text-sm font-bold text-white">
          نصوص البانر الرئيسي (Hero Texts)
        </h3>

        <div>
          <label className="mb-1 block text-[11px] font-bold text-zinc-400">شارة الهيرو العلوية</label>
          <input
            type="text"
            value={content.hero.badge}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, hero: { ...prev.hero, badge: e.target.value } }))
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان - السطر 1</label>
            <input
              type="text"
              value={content.hero.titleLine1}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, hero: { ...prev.hero, titleLine1: e.target.value } }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان - السطر 2 (الذهبي)</label>
            <input
              type="text"
              value={content.hero.titleLine2}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, hero: { ...prev.hero, titleLine2: e.target.value } }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">العنوان - السطر 3</label>
            <input
              type="text"
              value={content.hero.titleLine3}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, hero: { ...prev.hero, titleLine3: e.target.value } }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">الوصف التسويقي</label>
            <textarea
              rows={3}
              value={content.hero.description}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold text-zinc-400">نص زر الطلب المباشر</label>
            <input
              type="text"
              value={content.hero.ctaText}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, hero: { ...prev.hero, ctaText: e.target.value } }))
              }
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-[#ffd700] outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        {/* مميزات الهيرو */}
        <div className="pt-2">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[11px] font-bold text-zinc-400">مميزات الهيرو السريعة</label>
            <button
              type="button"
              onClick={handleAddFeature}
              className="flex items-center gap-1 text-[11px] font-bold text-[#ffd700] hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>إضافة ميزة</span>
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {content.hero.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feat.label}
                  onChange={(e) => handleFeatureChange(i, e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-[#d4af37]"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(i)}
                  aria-label="حذف الميزة"
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* 3. مشاهد الفيديو السينمائي */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b0e17] p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-[#ffd700]" />
            <h3 className="text-sm font-bold text-white">
              مشاهد الفيديو السينمائي ({scenes.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={handleAddScene}
            className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-3 py-1.5 text-xs font-bold text-[#ffd700] transition hover:bg-[#d4af37]/20"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>إضافة مشهد</span>
          </button>
        </div>

        {scenes.length === 0 ? (
          <p className="rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-zinc-400">
            لا توجد مشاهد مخصصة — سيتم استخدام المشاهد الافتراضية في الصفحة الرئيسية.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {scenes.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setActiveSceneIndex(idx)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    safeIndex === idx
                      ? "bg-[#d4af37] text-black shadow-lg"
                      : "bg-white/5 text-zinc-300 hover:bg-white/10"
                  }`}
                >
                  المشهد {idx + 1}: {s.short || "مشهد"}
                </button>
              ))}
            </div>


            {currentScene && (
              <div className="space-y-4 rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#ffd700]">المشهد #{safeIndex + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveScene(safeIndex)}
                    className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>حذف المشهد</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-zinc-400">اسم المشهد (القصير)</label>
                    <input
                      type="text"
                      value={currentScene.short}
                      onChange={(e) => handleSceneChange(safeIndex, "short", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-white outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-zinc-400">الوصف اللاتيني (Tag)</label>
                    <input
                      type="text"
                      value={currentScene.tag}
                      onChange={(e) => handleSceneChange(safeIndex, "tag", e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-300 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-zinc-400">رابط الفيديو (MP4)</label>
                    <input
                      type="text"
                      value={currentScene.videoSrc}
                      onChange={(e) => handleSceneChange(safeIndex, "videoSrc", e.target.value)}
                      dir="ltr"
                      className="w-full rounded-xl border border-white/10 bg-[#07090e] px-3 py-2 text-xs text-zinc-200 outline-none focus:border-[#d4af37]"
                    />
                  </div>
                  <AdminImageField
                    label="صورة البوستر (Poster)"
                    value={currentScene.poster}
                    placeholder="https://... أو ارفع صورة من جهازك"
                    onChange={(url) => handleSceneChange(safeIndex, "poster", url)}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-[11px] font-bold text-zinc-400">شارات المشهد (Badges)</label>
                    <button
                      type="button"
                      onClick={() => handleAddBadge(safeIndex)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#ffd700] hover:underline"
                    >
                      <Plus className="h-3 w-3" />
                      <span>إضافة شارة</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentScene.badges.map((b, bIdx) => (
                      <div
                        key={bIdx}
                        className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#07090e] px-2 py-1"
                      >
                        <input
                          type="text"
                          value={b}
                          onChange={(e) => handleBadgeChange(safeIndex, bIdx, e.target.value)}
                          className="w-36 bg-transparent text-xs text-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveBadge(safeIndex, bIdx)}
                          aria-label="حذف الشارة"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

