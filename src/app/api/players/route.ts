import { NextRequest, NextResponse } from "next/server";
import { getPlayerFormMap, getTournamentCount, listPlayerRankings } from "@/lib/player-stats";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const view = request.nextUrl.searchParams.get("view");

  if (view === "form") {
    return NextResponse.json({ form: await getPlayerFormMap() });
  }

  const limit = Number(request.nextUrl.searchParams.get("limit") ?? "100");

  return NextResponse.json({
    players: await listPlayerRankings(Number.isFinite(limit) ? Math.min(500, Math.max(1, limit)) : 100),
    tournaments: await getTournamentCount(),
  });
}
