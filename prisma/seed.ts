import { PrismaClient } from "@prisma/client";
import { PRODUCTS_CATALOG } from "../src/data/products";

// تحميل .env يدوياً لأن tsx لا يقرأه تلقائياً (Node 20.12+)
try {
  process.loadEnvFile?.();
} catch {
  // لا يوجد ملف .env — يُفترض أن DATABASE_URL مضبوط في البيئة
}

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products to database...");
  for (let i = 0; i < PRODUCTS_CATALOG.length; i++) {
    const item = PRODUCTS_CATALOG[i];
    if (!item) continue;
    await prisma.product.upsert({
      where: { slug: item.id },
      update: {
        name: item.name,
        category: item.category,
        tag: item.tag,
        price: item.price,
        priceValue: item.priceValue,
        originalPrice: item.originalPrice ?? null,
        savingLabel: item.savingLabel ?? null,
        description: item.description,
        features: item.features,
        image: item.image ?? null,
        displayOrder: i,
        available: true,
      },
      create: {
        slug: item.id,
        name: item.name,
        category: item.category,
        tag: item.tag,
        price: item.price,
        priceValue: item.priceValue,
        originalPrice: item.originalPrice ?? null,
        savingLabel: item.savingLabel ?? null,
        description: item.description,
        features: item.features,
        image: item.image ?? null,
        displayOrder: i,
        available: true,
      },
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
