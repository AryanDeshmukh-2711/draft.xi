import { NextRequest, NextResponse } from "next/server";
import { addLeaderboardEntry, listLeaderboardEntries } from "@/lib/leaderboard-store";
import { getFormationById } from "@/lib/draft-store";
import { simulateDraft } from "@/lib/simulation";
import type { Player } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ entries: await listLeaderboardEntries() });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    nickname: string;
    xi: Player[];
    formationId: string;
    seed: number;
    scoreline: string;
    performanceTick?: number;
  };

  const formation = getFormationById(body.formationId);
  if (!formation) {
    return NextResponse.json({ error: "Unknown formation" }, { status: 400 });
  }

  const result = simulateDraft(body.xi, formation, body.seed, body.performanceTick ?? 0);
  if (result.scoreline !== body.scoreline) {
    return NextResponse.json({ error: "Result verification failed" }, { status: 400 });
  }

  const entry = await addLeaderboardEntry({
    id: crypto.randomUUID(),
    nickname: body.nickname.trim() || "Anonymous",
    scoreline: result.scoreline,
    headline: result.headline,
    strength: result.strength,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ entry });
}
