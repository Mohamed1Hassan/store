"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play, Sparkles } from "lucide-react";

/* --------------------------------  Data  -------------------------------- */

interface SuiteScene {
  id: string;
  short: string;
  tag: string;
  videoSrc: string;
  poster: string;
  badges: string[];
}

const SUITE_SCENES: SuiteScene[] = [
  {
    id: "royal-suite",
    short: "الجناح الملكي",
    tag: "Master Presidential Suite",
    videoSrc: "/videos/luxury-bed-suite.mp4",
    poster: "/videos/luxury-bed-suite.jpg",
    badges: ["قطن مصري 100%", "عزل كامل للضوء", "شاسيه بوكيت ألماني"],
  },
  {
    id: "bespoke-curtains",
    short: "الستائر الفاخرة",
    tag: "Bespoke Royal Drapery",
    videoSrc: "/videos/curtain-sunlight.mp4",
    poster: "/videos/curtain-sunlight.jpg",
    badges: ["عزل حراري وصوتي", "مقاومة للتجعد", "خياطة ليزر دقيقة"],
  },
  {
    id: "ultimate-comfort",
    short: "الراحة الملكية",
    tag: "Orthopedic Sleep Comfort",
    videoSrc: "/videos/hotel-detail-4197.mp4",
    poster: "/videos/hotel-detail-4197.jpg",
    badges: ["دعم فقرات الظهر", "معالجة ضد البكتيريا", "ضمان 10 سنوات"],
  },
];

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
export default function CinematicSuiteBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scene = SUITE_SCENES[activeIdx];

  /* The ambient films are silent, so they stay muted — which is what lets every
     browser autoplay them. Switching a scene restarts the film. */
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    el.muted = true;
    const attempt = el.play();
    if (attempt && typeof attempt.then === "function") {
      attempt.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [activeIdx]);

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
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <video
            ref={videoRef}
            src={scene.videoSrc}
            poster={scene.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
          />

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
                {SUITE_SCENES.map((item, i) => {
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
