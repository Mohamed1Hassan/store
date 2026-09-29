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
const DELETED_FILE = path.join(DATA_DIR, "deleted-products.json");

async function readDeletedSlugs(): Promise<Set<string>> {
  const set = new Set<string>();
  if (prisma) {
    try {
      const records = await prisma.deletedProduct.findMany({ select: { slug: true } });
      for (const r of records) set.add(r.slug);
      return set;
    } catch (err) {
      console.warn("[products-store] Prisma deletedProduct read fallback:", err);
    }
  }

  try {
    const raw = await readFile(DELETED_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      for (const s of parsed) {
        if (typeof s === "string") set.add(s);
      }
    }
  } catch {
    // fallback
  }
  return set;
}

async function markSlugDeleted(slug: string): Promise<void> {
  if (prisma) {
    try {
      await prisma.deletedProduct.upsert({
        where: { slug },
        create: { slug },
        update: {},
      });
      return;
    } catch (err) {
      console.warn("[products-store] Prisma markSlugDeleted fallback:", err);
    }
  }

  if (!jsonFallbackWritable()) {
    return;
  }
  try {
    await mkdir(DATA_DIR, { recursive: true });
    let list: string[] = [];
    try {
      const raw = await readFile(DELETED_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed.filter((x): x is string => typeof x === "string");
    } catch {
      // file might not exist
    }
    if (!list.includes(slug)) {
      list.push(slug);
      await writeFile(DELETED_FILE, JSON.stringify(list, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("[products-store] فشل كتابة deleted-products.json:", err);
  }
}

async function unmarkSlugDeleted(slug: string): Promise<void> {
  if (prisma) {
    try {
      await prisma.deletedProduct.deleteMany({ where: { slug } });
    } catch (err) {
      console.warn("[products-store] Prisma unmarkSlugDeleted fallback:", err);
    }
  }

  if (!jsonFallbackWritable()) return;
  try {
    const raw = await readFile(DELETED_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const filtered = parsed.filter((s) => s !== slug);
      await writeFile(DELETED_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    }
  } catch {
    // ignore
  }
}

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
  const deletedSlugs = await readDeletedSlugs();

  // دائمًا دمج منتجات الكتالوج الأساسية غير المحذوفة مع المخزن
  const catalogProducts: StoredProduct[] = PRODUCTS_CATALOG
    .filter((p) => !deletedSlugs.has(p.id))
    .map((p, idx) => ({
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
        storedItems = dbItems
          .filter((item) => !deletedSlugs.has(item.slug))
          .map((item) => ({
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
            sizes: (item.sizes as any) ?? undefined,
            available: item.available,
            displayOrder: item.displayOrder,
          }));
      }
    } catch (err) {
      console.warn("[products-store] Prisma findMany fallback:", err);
    }
  }

  if (storedItems.length === 0) {
    const fromJson = await readAll();
    storedItems = fromJson.filter((p) => !deletedSlugs.has(p.slug || p.id));
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
  const deletedSlugs = await readDeletedSlugs();
  if (deletedSlugs.has(slug)) return null;

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
          sizes: (rec.sizes as any) ?? undefined,
          available: rec.available,
          displayOrder: rec.displayOrder,
        };
      }
    } catch (err) {
      console.warn("[products-store] Prisma getProduct fallback:", err);
    }
  }

  const all = await readAll();
  const found = all.find((p) => (p.slug || p.id) === slug);
  if (found) return found;

  const catalogItem = PRODUCTS_CATALOG.find((p) => p.id === slug);
  if (catalogItem) {
    return {
      ...catalogItem,
      slug: catalogItem.id,
      available: true,
      displayOrder: 0,
    };
  }

  return null;
}

export async function saveProduct(input: ProductInput): Promise<StoredProduct> {
  // إزالة الـ slug من قائمة المحذوفات إن وُجد
  await unmarkSlugDeleted(input.slug);

  if (prisma) {
    try {
      const rec = await prisma.product.upsert({
        where: { slug: input.slug },
        create: {
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
          sizes: (input.sizes as any) || null,
          available: input.available,
          displayOrder: input.displayOrder,
        },
        update: {
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
          sizes: (input.sizes as any) || null,
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
        sizes: (rec.sizes as any) ?? undefined,
        available: rec.available,
        displayOrder: rec.displayOrder,
      };
    } catch (err) {
      console.warn("[products-store] Prisma upsert fallback:", err);
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
    sizes: input.sizes,
    available: input.available,
    displayOrder: input.displayOrder,
  };

  if (existingIdx !== -1) {
    all[existingIdx] = item;
  } else {
    all.push(item);
  }
  if (jsonFallbackWritable()) {
    try {
      await writeAll(all);
    } catch (err) {
      console.warn("[products-store] فشل الكتابة على JSON:", err);
    }
  }
  return item;
}

export async function updateProduct(
  slug: string,
  partial: Partial<ProductInput>
): Promise<StoredProduct | null> {
  const existingProduct = await getProductBySlug(slug);
  if (!existingProduct) return null;

  const merged = { ...existingProduct, ...partial };

  if (prisma) {
    try {
      const rec = await prisma.product.upsert({
        where: { slug },
        create: {
          slug,
          name: merged.name,
          category: merged.category,
          tag: merged.tag,
          price: merged.price,
          priceValue: merged.priceValue,
          originalPrice: merged.originalPrice || null,
          savingLabel: merged.savingLabel || null,
          description: merged.description,
          features: merged.features,
          image: merged.image || null,
          sizes: (merged.sizes as any) || null,
          available: merged.available !== undefined ? merged.available : true,
          displayOrder: merged.displayOrder || 0,
        },
        update: {
          ...(partial.name !== undefined && { name: partial.name }),
          ...(partial.category !== undefined && { category: partial.category }),
          ...(partial.tag !== undefined && { tag: partial.tag }),
          ...(partial.price !== undefined && { price: partial.price }),
          ...(partial.priceValue !== undefined && { priceValue: partial.priceValue }),
          ...(partial.originalPrice !== undefined && { originalPrice: partial.originalPrice || null }),
          ...(partial.savingLabel !== undefined && { savingLabel: partial.savingLabel || null }),
          ...(partial.description !== undefined && { description: partial.description }),
          ...(partial.features !== undefined && { features: partial.features }),
          ...(partial.image !== undefined && { image: partial.image || null }),
          ...(partial.sizes !== undefined && { sizes: (partial.sizes as any) || null }),
          ...(partial.available !== undefined && { available: partial.available }),
          ...(partial.displayOrder !== undefined && { displayOrder: partial.displayOrder }),
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
        sizes: (rec.sizes as any) ?? undefined,
        available: rec.available,
        displayOrder: rec.displayOrder,
      };
    } catch (err) {
      console.warn("[products-store] Prisma upsert fallback:", err);
    }
  }

  const all = await readAll();
  const index = all.findIndex((p) => (p.slug || p.id) === slug);

  const updated: StoredProduct = {
    ...merged,
    id: slug,
    slug,
  };

  if (index !== -1) {
    all[index] = updated;
  } else {
    all.push(updated);
  }

  if (jsonFallbackWritable()) {
    try {
      await writeAll(all);
    } catch (err) {
      console.warn("[products-store] فشل الكتابة على JSON:", err);
    }
  }
  return updated;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  let found = false;

  if (prisma) {
    try {
      await prisma.product.delete({ where: { slug } });
      found = true;
    } catch (err: unknown) {
      // P2025: Record to delete does not exist (e.g. static catalog product)
      const code = (err as { code?: string })?.code;
      if (code !== "P2025") {
        console.warn("[products-store] Prisma delete fallback:", err);
      }
    }
  }

  const all = await readAll();
  const filtered = all.filter((p) => (p.slug || p.id) !== slug);
  if (filtered.length !== all.length) {
    found = true;
    if (jsonFallbackWritable()) {
      try {
        await writeAll(filtered);
      } catch (err) {
        console.warn("[products-store] فشل الكتابة على JSON:", err);
      }
    }
  }

  const isStatic = PRODUCTS_CATALOG.some((p) => p.id === slug);
  if (isStatic) {
    found = true;
  }

  if (found) {
    await markSlugDeleted(slug);
    return true;
  }

  return false;
}
