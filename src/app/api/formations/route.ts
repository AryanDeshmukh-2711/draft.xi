import { NextResponse } from "next/server";
import { getFormations } from "@/lib/draft-store";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json({ formations: getFormations() });
}
