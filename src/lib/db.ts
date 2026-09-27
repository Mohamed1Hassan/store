import { PrismaClient } from "@prisma/client";
import { env, hasDatabase } from "./env";

/**
 * اتصال Prisma واحد مشترك (Singleton) — يُنشأ فقط عند توفر DATABASE_URL.
 * عند غيابه تكون القيمة null فتتحول كل المخازن تلقائياً إلى ملفات JSON المحلية.
 */
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient | null =
  global.prismaGlobal ??
  (hasDatabase()
    ? new PrismaClient({
        log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      })
    : null);

if (process.env.NODE_ENV !== "production" && prisma) {
  global.prismaGlobal = prisma;
}
