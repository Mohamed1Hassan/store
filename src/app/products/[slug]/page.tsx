import { notFound } from "next/navigation";

// الرئيسية تُقرأ من قاعدة البيانات، فلا يجوز تجميدها في كاش المنصة.
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { getProductBySlug, listProducts } from "@/lib/products-store";
import { SITE_NAME, SITE_URL } from "@/data/site";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await listProducts();
  return products.map((p) => ({
    slug: p.slug || p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود",
    };
  }

  const title = `${product.name} | ${SITE_NAME}`;
  const description = product.description.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/products/${product.slug || product.id}`,
    },
    alternates: {
      canonical: `${SITE_URL}/products/${product.slug || product.id}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
