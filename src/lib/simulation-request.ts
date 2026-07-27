import { z } from "zod";
import { benchSlots } from "./formations";
import { getFormationById, getPlayerById } from "./draft-store";
import type { BenchSelection, XiSelection } from "./simulation";
import type { DraftStyle, Formation } from "./types";

export const selectionSchema = z.object({
  slotId: z.string().min(1).max(40),
  playerId: z.string().min(1).max(120),
});

export const simulationRequestSchema = z.object({
  formationId: z.string().min(1).max(20),
  style: z.enum(["defensive", "balanced", "attacking"]),
  seed: z.number().int().min(0).max(2147483646),
  xi: z.array(selectionSchema).max(11),
  bench: z.array(selectionSchema).max(7).default([]),
});

export type SimulationRequest = z.infer<typeof simulationRequestSchema>;

export type ResolvedSelection = {
  formation: Formation;
  style: DraftStyle;
  seed: number;
  xi: XiSelection[];
  bench: BenchSelection[];
};

const benchSlotIds = new Set(benchSlots.map((slot) => slot.id));

/**
 * Rebuilds the picks from the dataset. Anything the client invented — an
 * unknown player, a slot that is not in the formation, a duplicate — is
 * rejected rather than scored.
 */
export function resolveSimulationRequest(request: SimulationRequest): ResolvedSelection | { error: string } {
  const formation = getFormationById(request.formationId);
  if (!formation) return { error: "Unknown formation" };

  const slotIds = new Set(formation.slots.map((slot) => slot.id));
  const usedSlots = new Set<string>();
  const usedPlayers = new Set<string>();

  const xi: XiSelection[] = [];
  for (const entry of request.xi) {
    if (!slotIds.has(entry.slotId)) return { error: `Unknown slot ${entry.slotId}` };
    if (usedSlots.has(entry.slotId)) return { error: `Duplicate slot ${entry.slotId}` };
    if (usedPlayers.has(entry.playerId)) return { error: "A player cannot fill two slots" };

    const player = getPlayerById(entry.playerId);
    if (!player) return { error: `Unknown player ${entry.playerId}` };

    usedSlots.add(entry.slotId);
    usedPlayers.add(entry.playerId);
    xi.push({ slotId: entry.slotId, player });
  }

  const usedBenchSlots = new Set<string>();
  const bench: BenchSelection[] = [];
  for (const entry of request.bench) {
    if (!benchSlotIds.has(entry.slotId)) return { error: `Unknown bench slot ${entry.slotId}` };
    if (usedBenchSlots.has(entry.slotId)) return { error: `Duplicate bench slot ${entry.slotId}` };
    if (usedPlayers.has(entry.playerId)) return { error: "A player cannot be in the XI and on the bench" };

    const player = getPlayerById(entry.playerId);
    if (!player) return { error: `Unknown player ${entry.playerId}` };

    usedBenchSlots.add(entry.slotId);
    usedPlayers.add(entry.playerId);
    bench.push({ slotId: entry.slotId, player });
  }

  return { formation, style: request.style, seed: request.seed, xi, bench };
}
