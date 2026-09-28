import type { Metadata } from "next";
import { listProducts } from "@/lib/products-store";
import { SITE_NAME, SITE_URL } from "@/data/site";
import ProductsCatalogClient from "./ProductsCatalogClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `كتالوج المنتجات والأسعار | ${SITE_NAME}`,
  description:
    "تصفح تشكيلة السلطان الكاملة من المراتب الطبية بوكيت سبرينج، والستائر الملكية المفصلة، وكافر المراتب ومفروشات السرير بأفضل الأسعار وضمان 10 سنوات.",
  openGraph: {
    title: `كتالوج المنتجات والأسعار | ${SITE_NAME}`,
    description:
      "تصفح تشكيلة السلطان الكاملة من المراتب الطبية والستائر الملكية وكافر المراتب والمفروشات بأسعار واضحة وضمان استبدال مباشر.",
    url: `${SITE_URL}/products`,
    type: "website",
  },
  alternates: {
    canonical: `${SITE_URL}/products`,
  },
};

export default async function ProductsPage() {
  const products = await listProducts();
  return <ProductsCatalogClient products={products} />;
}


