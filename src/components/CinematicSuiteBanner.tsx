"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";
import type { HeroScene } from "@/schemas/site-content";
import { DEFAULT_SUITE_SCENES } from "@/lib/site-content-defaults";

/* ----------  Full-bleed veils: melt the film into the page colour  ---------- */

const PAGE_BG = "7, 9, 14";
const tint = (alpha: number) => `rgba(${PAGE_BG}, ${alpha})`;

const melt = (direction: string, stops: [number, number][]) =>
  `linear-gradient(${direction}, ${stops
    .map(([pos, alpha]) => `${tint(alpha)} ${pos}%`)
    .join(", ")})`;

const VEILS = [
  // right side: the headline column, deep enough for large white type
  {
    className: "inset-y-0 right-0 w-[72%] sm:w-[58%] lg:w-[52%]",
    background: melt("to left", [
      [0, 0.92],
      [24, 0.62],
      [58, 0.2],
      [100, 0],
    ]),
  },
  // left side: gentle balance so the frame never feels lopsided
  {
    className: "inset-y-0 left-0 w-[46%]",
    background: melt("to right", [
      [0, 0.62],
      [40, 0.24],
      [100, 0],
    ]),
  },
  // top: meets the fixed navigation bar seamlessly
  {
    className: "inset-x-0 top-0 h-[30%]",
    background: melt("to bottom", [
      [0, 0.95],
      [10, 0.6],
      [22, 0.2],
      [34, 0],
    ]),
  },
  // bottom: seats the media bar and flows into the next section
  {
    className: "inset-x-0 bottom-0 h-[55%]",
    background: melt("to top", [
      [0, 1],
      [14, 0.92],
      [34, 0.5],
      [58, 0],
    ]),
  },
];

/* ----------------------------  Component  ---------------------------- */

/**
 * Full-bleed cinematic hero film.
 * The footage bleeds edge to edge and melts into the page colour, with a slim
 * media bar for playback and for switching between the three showcase scenes.
 */
interface Props {
  scenes?: HeroScene[];
}

export default function CinematicSuiteBanner({ scenes: passedScenes }: Props) {
  const scenes = passedScenes && passedScenes.length > 0 ? passedScenes : DEFAULT_SUITE_SCENES;
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [inView, setInView] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scene = scenes[activeIdx] || scenes[0];

  /* 5.2: لا نحمّل الفيديو الا عند دخول الهيرو نطاق الرؤية، مع احترام prefers-reduced-motion */
  useEffect(() => {
    const host = sectionRef.current;
    if (!host || typeof IntersectionObserver === "undefined") { setInView(true); return; }
    const observer = new IntersectionObserver(
      (entries) => { if (entries.some((e) => e.isIntersecting)) { setInView(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  /* اشتراك أحداث DOM (play/pause) — مصدر الحالة الوحيد لزر التشغيل، بدون أي
   * setState متزامن داخل الـ effect (يلزم قواعد react-hooks). */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || typeof window === "undefined") return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    el.addEventListener("play", handlePlay);
    el.addEventListener("pause", handlePause);
    return () => {
      el.removeEventListener("play", handlePlay);
      el.removeEventListener("pause", handlePause);
    };
  }, [inView, videoFailed, activeIdx]);

  /* الفيديوهات صامتة ليُسمح بالتشغيل التلقائي. تبديل المشهد يعيد التشغيل. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !inView || videoFailed) return;
    el.muted = true;
    const prefersReducedMotion = typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) { el.pause(); return; }
    const attempt = el.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [activeIdx, inView, videoFailed]);

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;

    if (el.paused) {
      el.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Full-bleed footage + dissolving veils */}
      <div ref={sectionRef} className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          {(!inView || videoFailed) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={scene.poster} alt="" aria-hidden={true} className="absolute inset-0 h-full w-full object-cover" />
          )}
          {inView && !videoFailed && (
            <video
              ref={videoRef}
              key={scene.id}
              src={scene.videoSrc}
              poster={scene.poster}
              onError={() => setVideoFailed(true)}
              loop
              muted
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
            />
          )}

          {VEILS.map((veil) => (
            <div
              key={veil.className}
              aria-hidden
              className={`pointer-events-none absolute ${veil.className}`}
              style={{ background: veil.background }}
            />
          ))}

          <div className="pointer-events-none absolute inset-0 bg-[#07090e]/25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#d4af37]/12 via-transparent to-[#0b1a2e]/25 mix-blend-soft-light" />
        </div>
      </div>

      {/* Media bar */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="mx-auto w-full max-w-7xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-7">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "إيقاف الفيلم مؤقتاً" : "تشغيل الفيلم"}
                aria-pressed={!isPlaying}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[#f4efe6] backdrop-blur-md transition hover:border-[#ffd700]/60 hover:text-[#ffd700]"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 fill-current" />
                )}
              </button>

              <div
                role="group"
                aria-label="مشاهد المعرض"
                className="flex items-center gap-1 rounded-full border border-white/10 bg-[#07090e]/45 p-1 backdrop-blur-md"
              >
                {scenes.map((item, i) => {
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      aria-current={isActive}
                      className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all duration-300 sm:px-4 sm:text-xs ${
                        isActive
                          ? "bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#07090e] shadow-md shadow-black/30"
                          : "text-zinc-300 hover:bg-white/10 hover:text-[#ffd700]"
                      }`}
                    >
                      {item.short}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col items-start gap-1.5 text-right">
              <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c8aa6e]">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                {scene.tag}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {scene.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
