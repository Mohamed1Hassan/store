import { PRODUCTS_CATALOG, type Product } from "@/data/products";
import { prisma } from "./db";
import type { ProductInput } from "@/schemas/product";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface StoredProduct extends Product {
  slug?: string;
  image?: string;
  available?: boolean;
  displayOrder?: number;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

async function readAll(): Promise<StoredProduct[]> {
  try {
    const raw = await readFile(PRODUCTS_FILE, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as StoredProduct[];
    }
  } catch {
    // fallback
  }
  return PRODUCTS_CATALOG.map((p, idx) => ({
    ...p,
    slug: p.id,
    available: true,
    displayOrder: idx,
  }));
}

async function writeAll(products: StoredProduct[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf-8");
}

/**
 * ⚠️ على Vercel (ودوال بلا خادم) نظام الملفات للقراءة فقط، و `.data/` غير موجود
 * لأنه مُستثنى من git. أي محاولة كتابة هناك ترمي خطأ 500.
 * نتحقق مسبقاً ونُرجع false بدل رمي استثناء قاتل.
 */
function jsonFallbackWritable(): boolean {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return false;
  return true;
}

export async function listProducts(includeHidden = false): Promise<StoredProduct[]> {
  // دائمًا دمج منتجات الكتالوج الأساسية مع المخزن لضمان ظهور كافة المنتجات دائماً
  const catalogProducts: StoredProduct[] = PRODUCTS_CATALOG.map((p, idx) => ({
    ...p,
    slug: p.id,
    available: true,
    displayOrder: idx,
  }));

  let storedItems: StoredProduct[] = [];
  if (prisma) {
    try {
      const dbItems = await prisma.product.findMany({
        where: includeHidden ? undefined : { available: true },
        orderBy: { displayOrder: "asc" },
      });
      if (dbItems.length > 0) {
        storedItems = dbItems.map((item) => ({
          id: item.slug,
          slug: item.slug,
          name: item.name,
          category: item.category,
          tag: item.tag,
          price: item.price,
          priceValue: item.priceValue,
          originalPrice: item.originalPrice ?? undefined,
          savingLabel: item.savingLabel ?? undefined,
          description: item.description,
          features: item.features,
          image: item.image ?? undefined,
          available: item.available,
          displayOrder: item.displayOrder,
        }));
      }
    } catch (err) {
      console.warn("[products-store] Prisma findMany fallback:", err);
    }
  }

  if (storedItems.length === 0) {
    storedItems = await readAll();
  }

  // دمج الكتالوج مع المنتجات المخزنة بحيث لا تتكرر بناءً على الـ slug
  const map = new Map<string, StoredProduct>();
  for (const p of catalogProducts) {
    map.set(p.slug || p.id, p);
  }
  for (const p of storedItems) {
    map.set(p.slug || p.id, p);
  }

  const combined = Array.from(map.values());
  return includeHidden ? combined : combined.filter((p) => p.available !== false);
}

export async function getProductBySlug(slug: string): Promise<StoredProduct | null> {
  if (prisma) {
    try {
      const rec = await prisma.product.findUnique({ where: { slug } });
      if (rec) {
        return {
          id: rec.slug,
          slug: rec.slug,
          name: rec.name,
          category: rec.category,
          tag: rec.tag,
          price: rec.price,
          priceValue: rec.priceValue,
          originalPrice: rec.originalPrice ?? undefined,
          savingLabel: rec.savingLabel ?? undefined,
          description: rec.description,
          features: rec.features,
          image: rec.image ?? undefined,
          available: rec.available,
          displayOrder: rec.displayOrder,
        };
      }
    } catch (err) {
      console.warn("[products-store] Prisma getProduct fallback:", err);
    }
  }

  const all = await readAll();
  return all.find((p) => (p.slug || p.id) === slug) ?? null;
}

export async function saveProduct(input: ProductInput): Promise<StoredProduct> {
  if (prisma) {
    try {
      const rec = await prisma.product.create({
        data: {
          slug: input.slug,
          name: input.name,
          category: input.category,
          tag: input.tag,
          price: input.price,
          priceValue: input.priceValue,
          originalPrice: input.originalPrice || null,
          savingLabel: input.savingLabel || null,
          description: input.description,
          features: input.features,
          image: input.image || null,
          available: input.available,
          displayOrder: input.displayOrder,
        },
      });

      return {
        id: rec.slug,
        slug: rec.slug,
        name: rec.name,
        category: rec.category,
        tag: rec.tag,
        price: rec.price,
        priceValue: rec.priceValue,
        originalPrice: rec.originalPrice ?? undefined,
        savingLabel: rec.savingLabel ?? undefined,
        description: rec.description,
        features: rec.features,
        image: rec.image ?? undefined,
        available: rec.available,
        displayOrder: rec.displayOrder,
      };
    } catch (err) {
      console.warn("[products-store] Prisma create fallback:", err);
    }
  }

  const all = await readAll();
  const existingIdx = all.findIndex((p) => (p.slug || p.id) === input.slug);
  const item: StoredProduct = {
    id: input.slug,
    slug: input.slug,
    name: input.name,
    category: input.category,
    tag: input.tag,
    price: input.price,
    priceValue: input.priceValue,
    originalPrice: input.originalPrice,
    savingLabel: input.savingLabel,
    description: input.description,
    features: input.features,
    image: input.image || undefined,
    available: input.available,
    displayOrder: input.displayOrder,
  };

  if (existingIdx !== -1) {
    all[existingIdx] = item;
  } else {
    all.push(item);
  }
  if (!jsonFallbackWritable()) {
    throw new Error(
      "تعذّر الحفظ: لا توجد قاعدة بيانات (DATABASE_URL غير مضبوط على Vercel) ونظام الملفات للقراءة فقط."
    );
  }
  try {
    await writeAll(all);
  } catch (err) {
    console.warn("[products-store] فشل الكتابة على JSON:", err);
  }
  return item;
}

export async function updateProduct(
  slug: string,
  partial: Partial<ProductInput>
): Promise<StoredProduct | null> {
  if (prisma) {
    try {
      const rec = await prisma.product.update({
        where: { slug },
        data: {
          name: partial.name,
          category: partial.category,
          tag: partial.tag,
          price: partial.price,
          priceValue: partial.priceValue,
          originalPrice: partial.originalPrice || null,
          savingLabel: partial.savingLabel || null,
          description: partial.description,
          features: partial.features,
          image: partial.image || null,
          available: partial.available,
          displayOrder: partial.displayOrder,
        },
      });

      return {
        id: rec.slug,
        slug: rec.slug,
        name: rec.name,
        category: rec.category,
        tag: rec.tag,
        price: rec.price,
        priceValue: rec.priceValue,
        originalPrice: rec.originalPrice ?? undefined,
        savingLabel: rec.savingLabel ?? undefined,
        description: rec.description,
        features: rec.features,
        image: rec.image ?? undefined,
        available: rec.available,
        displayOrder: rec.displayOrder,
      };
    } catch (err) {
      console.warn("[products-store] Prisma update fallback:", err);
    }
  }

  const all = await readAll();
  const index = all.findIndex((p) => (p.slug || p.id) === slug);
  if (index === -1) return null;
  const current = all[index];
  if (!current) return null;

  const updated: StoredProduct = {
    ...current,
    ...partial,
  };
  all[index] = updated;
  if (!jsonFallbackWritable()) {
    throw new Error(
      "تعذّر التحديث: لا توجد قاعدة بيانات (DATABASE_URL غير مضبوط على Vercel) ونظام الملفات للقراءة فقط."
    );
  }
  try {
    await writeAll(all);
  } catch (err) {
    console.warn("[products-store] فشل الكتابة على JSON:", err);
  }
  return updated;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  if (prisma) {
    try {
      await prisma.product.delete({ where: { slug } });
      return true;
    } catch (err) {
      console.warn("[products-store] Prisma delete fallback:", err);
    }
  }

  const all = await readAll();
  const filtered = all.filter((p) => (p.slug || p.id) !== slug);
  if (filtered.length === all.length) return false;
  if (!jsonFallbackWritable()) {
    throw new Error(
      "تعذّر الحذف: لا توجد قاعدة بيانات (DATABASE_URL غير مضبوط على Vercel) ونظام الملفات للقراءة فقط."
    );
  }
  try {
    await writeAll(filtered);
  } catch (err) {
    console.warn("[products-store] فشل الكتابة على JSON:", err);
  }
  return true;
}
