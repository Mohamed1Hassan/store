import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/site-content-store";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(
    { content },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
