import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/site";
import { listProducts } from "@/lib/products-store";

/** خريطة الموقع (4.1): الصفحة الرئيسية + صفحات المنتجات + متابعة الطلب */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug || product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...productEntries,
    {
      url: `${SITE_URL}/orders/track`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
