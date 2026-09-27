import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // ⚠️ إلزامي: بدون هذا يرفض next/image أي نطاق خارجي ويرجع 400
    // فتظهر أيقونة صورة مكسورة في الرئيسية ولوحة الإدارة.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // أصول الفيديو الثابتة: كاش طويل لأن أسماء الملفات لا تتغير
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
