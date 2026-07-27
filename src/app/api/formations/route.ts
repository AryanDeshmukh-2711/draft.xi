import { NextResponse } from "next/server";
import { getBenchSlots, getFormations } from "@/lib/draft-store";
import { datasetStats } from "@/lib/squads";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({
    formations: getFormations(),
    benchSlots: getBenchSlots(),
    stats: datasetStats,
  });
}
