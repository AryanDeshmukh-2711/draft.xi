import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addLeaderboardEntry, canSubmit, listLeaderboardEntries } from "@/lib/leaderboard-store";
import { simulateDraft } from "@/lib/simulation";
import { resolveSimulationRequest, simulationRequestSchema } from "@/lib/simulation-request";

export const runtime = "nodejs";

const submissionSchema = simulationRequestSchema.extend({
  nickname: z.string().max(24).default(""),
});

export async function GET() {
  return NextResponse.json({ entries: await listLeaderboardEntries() });
}

export async function POST(request: NextRequest) {
  const parsed = submissionSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  const clientKey =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "local";

  if (!canSubmit(clientKey)) {
    return NextResponse.json({ error: "Slow down — one submission every 20 seconds." }, { status: 429 });
  }

  const resolved = resolveSimulationRequest(parsed.data);
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  if (resolved.xi.length !== resolved.formation.slots.length) {
    return NextResponse.json({ error: "The XI is not complete" }, { status: 400 });
  }

  // The score is recomputed here, so only the picks and the seed are trusted.
  const result = simulateDraft(resolved);

  const entry = await addLeaderboardEntry({
    id: crypto.randomUUID(),
    nickname: parsed.data.nickname.trim().slice(0, 24) || "Anonymous",
    formationId: resolved.formation.id,
    style: resolved.style,
    overall: result.overall,
    attack: result.attack,
    defense: result.defense,
    benchStrength: result.benchStrength,
    scoreline: result.scoreline,
    finish: result.finish,
    headline: result.headline,
    xi: resolved.xi.map((item) => item.player.name),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ entry, result });
}
