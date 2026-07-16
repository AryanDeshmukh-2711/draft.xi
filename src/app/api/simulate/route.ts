import { NextRequest, NextResponse } from "next/server";
import { getFormationById } from "@/lib/draft-store";
import { simulateDraft } from "@/lib/simulation";
import type { Player } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { xi: Player[]; formationId: string; seed: number; performanceTick?: number };
  const formation = getFormationById(body.formationId);

  if (!formation) {
    return NextResponse.json({ error: "Unknown formation" }, { status: 400 });
  }

  if (!Array.isArray(body.xi) || body.xi.length !== formation.slots.length) {
    return NextResponse.json({ error: "XI does not match formation" }, { status: 400 });
  }

  const result = simulateDraft(body.xi, formation, body.seed, body.performanceTick ?? 0);
  return NextResponse.json({ result });
}
