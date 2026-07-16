import { NextRequest, NextResponse } from "next/server";
import { getRandomSquad } from "@/lib/draft-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId") ?? "anonymous";
  const seed = Number(request.nextUrl.searchParams.get("seed") ?? `${Date.now()}`);
  const squad = await getRandomSquad(sessionId, seed);

  return NextResponse.json({ squad });
}
