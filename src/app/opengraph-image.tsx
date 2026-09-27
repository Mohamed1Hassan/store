import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * صورة المشاركة الاجتماعية (4.3): 1200×630 تُولَّد تلقائياً.
 * تُستخدم عند مشاركة الرابط على واتساب/فيسبوك/تويتر عبر `/opengraph-image`.
 * ملاحظة: Satori لا يدعم الخطوط العربية الافتراضية، لذا النص لاتيني
 * مع الحفاظ على هوية العلامة بالألوان الذهبية.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#07090e",
          backgroundImage:
            "radial-gradient(circle at 50% 40%, rgba(212,175,55,0.25) 0%, rgba(7,9,14,0) 65%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 72,
            fontWeight: 900,
            color: "#ffd700",
            letterSpacing: 2,
          }}
        >
          AL-SULTAN
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 34,
            fontWeight: 700,
            color: "#f4efe6",
            letterSpacing: 1,
          }}
        >
          Luxury Living — Furnishings & Curtains
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 26,
            color: "#c8aa6e",
          }}
        >
          Medical Mattresses · Blackout Curtains · Hotel Bedding
        </div>
      </div>
    ),
    { ...size }
  );
}
