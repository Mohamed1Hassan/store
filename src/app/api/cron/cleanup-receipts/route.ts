import { NextResponse } from "next/server";
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const receiptsDir = path.join(process.cwd(), "public", "uploads", "receipts");
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();
  let deletedCount = 0;

  try {
    const files = await readdir(receiptsDir);
    for (const file of files) {
      if (!file.startsWith("receipt-")) continue;
      
      const filePath = path.join(receiptsDir, file);
      const fileStat = await stat(filePath);
      
      if (now - fileStat.mtimeMs > ONE_DAY_MS) {
        const receiptUrl = `/uploads/receipts/${file}`;
        let isUsed = false;
        if (prisma) {
          const lead = await prisma.lead.findFirst({ where: { receiptUrl } });
          isUsed = !!lead;
        } else {
          const fs = require("node:fs/promises");
          try {
            const data = JSON.parse(await fs.readFile(path.join(process.cwd(), ".data", "leads.json"), "utf-8"));
            isUsed = data.some((l: any) => l.receiptUrl === receiptUrl);
          } catch {
            isUsed = false;
          }
        }

        if (!isUsed) {
          await unlink(filePath);
          deletedCount++;
        }
      }
    }
    return NextResponse.json({ ok: true, deletedCount });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
