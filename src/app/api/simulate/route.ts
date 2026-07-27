import { NextRequest, NextResponse } from "next/server";
import { simulateDraft } from "@/lib/simulation";
import { resolveSimulationRequest, simulationRequestSchema } from "@/lib/simulation-request";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const parsed = simulationRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid simulation request" }, { status: 400 });
  }

  const resolved = resolveSimulationRequest(parsed.data);
  if ("error" in resolved) {
    return NextResponse.json({ error: resolved.error }, { status: 400 });
  }

  if (resolved.xi.length !== resolved.formation.slots.length) {
    return NextResponse.json({ error: "The XI is not complete" }, { status: 400 });
  }

  return NextResponse.json({ result: simulateDraft(resolved) });
}
