import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";

/** قواعد الزحف لمحركات البحث (4.1) */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
