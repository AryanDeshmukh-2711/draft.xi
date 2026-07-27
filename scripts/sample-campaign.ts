/**
 * Prints example campaigns so the match narration can be eyeballed.
 * Run with `npx tsx scripts/sample-campaign.ts [style] [benchSize]`.
 */
import { benchSlots, getFormationById } from "../src/lib/formations";
import { getSlotFit, isPlayerEligibleForBench } from "../src/lib/draft-utils";
import { simulateDraft } from "../src/lib/simulation";
import { squads } from "../src/lib/squads";
import type { DraftStyle, Player } from "../src/lib/types";

const style = (process.argv[2] as DraftStyle) ?? "balanced";
const benchSize = Number(process.argv[3] ?? 7);

const formation = getFormationById("4-3-3");
const pool = squads.flatMap((squad) => squad.players);
const used = new Set<string>();

const take = (predicate: (player: Player) => boolean) => {
  const found = pool
    .filter((player) => !used.has(player.id) && predicate(player))
    .sort((a, b) => b.rating - a.rating)[0];
  if (found) used.add(found.id);
  return found;
};

const xi = formation.slots.map((slot) => ({
  slotId: slot.id,
  player: take((player) => getSlotFit(player, slot.position) > 0)!,
}));

const bench = benchSlots
  .slice(0, benchSize)
  .map((slot) => ({
    slotId: slot.id,
    player: take((player) => isPlayerEligibleForBench(player, slot.role))!,
  }))
  .filter((entry) => entry.player);

let shown = 0;
for (let seed = 1; seed <= 400 && shown < 3; seed += 1) {
  const result = simulateDraft({ xi, bench, formation, style, seed });
  if (result.injuries === 0) continue;

  shown += 1;
  console.log(`\n--- seed ${seed} · ${style} · bench ${bench.length} ---`);
  console.log(result.headline, "|", result.summary);
  for (const match of result.matches) {
    console.log(`  ${match.round.padEnd(15)} ${match.scoreFor}-${match.scoreAgainst}  ${match.note}`);
    if (match.injury) console.log(`      INJURY  ${match.injury}`);
    if (match.substitution) console.log(`      SUB     ${match.substitution}`);
  }
}

if (shown === 0) console.log("No injuries across 400 seeds — that would be a bug.");
