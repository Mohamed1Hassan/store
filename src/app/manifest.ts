import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/data/site";

/** أساسيات PWA (4.5): اسم التطبيق وألوانه وأيقونته */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "السلطان",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    dir: "rtl",
    lang: "ar",
    background_color: "#07090e",
    theme_color: "#07090e",
    icons: [
      {
        src: "/icon",
        sizes: "any",
        type: "image/jpeg",
      },
    ],
  };
}
