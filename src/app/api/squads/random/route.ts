import { NextRequest, NextResponse } from "next/server";
import { getRandomSquad, type RollKind } from "@/lib/draft-store";

export const runtime = "nodejs";

const rollKinds: RollKind[] = ["new", "nation", "year"];

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const sessionId = params.get("sessionId") ?? "anonymous";
  const seed = Number(params.get("seed") ?? `${Date.now()}`);
  const requestedKind = params.get("kind") ?? "new";
  const kind = rollKinds.includes(requestedKind as RollKind) ? (requestedKind as RollKind) : "new";
  const currentSquadId = params.get("currentSquadId");

  const squad = await getRandomSquad(
    sessionId,
    Number.isFinite(seed) ? seed : Date.now(),
    kind,
    currentSquadId,
  );

  return NextResponse.json({ squad });
}
