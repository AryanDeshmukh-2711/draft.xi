/**
 * Dataset and simulation sanity check. Run with `npm run check`.
 * Verifies the squad data is internally consistent and that the campaign
 * model produces sensible scorelines across the quality range.
 */
import { formations } from "../src/lib/formations";
import { squads } from "../src/lib/squads";
import { getSlotFit } from "../src/lib/draft-utils";
import { simulateDraft, rateSquad } from "../src/lib/simulation";
import type { Player, Position } from "../src/lib/types";

const problems: string[] = [];

const seenPlayerIds = new Set<string>();
const seenSquadIds = new Set<string>();

for (const squad of squads) {
  if (seenSquadIds.has(squad.id)) problems.push(`duplicate squad id: ${squad.id}`);
  seenSquadIds.add(squad.id);

  const numbers = new Set<number>();
  const names = new Set<string>();

  for (const player of squad.players) {
    if (seenPlayerIds.has(player.id)) problems.push(`duplicate player id: ${player.id}`);
    seenPlayerIds.add(player.id);

    if (numbers.has(player.number)) problems.push(`${squad.id}: duplicate shirt #${player.number}`);
    numbers.add(player.number);

    if (names.has(player.name)) problems.push(`${squad.id}: duplicate name ${player.name}`);
    names.add(player.name);

    if (player.positions.length === 0) problems.push(`${squad.id}: ${player.name} has no position`);
    for (const value of [player.attack, player.defense, player.passing, player.physical, player.rating]) {
      if (!Number.isFinite(value) || value < 1 || value > 99) {
        problems.push(`${squad.id}: ${player.name} has an out-of-range attribute (${value})`);
      }
    }
  }

  const keepers = squad.players.filter((player) => player.positions.includes("GK"));
  if (keepers.length < 1) problems.push(`${squad.id}: no goalkeeper`);
  if (squad.players.length < 16) problems.push(`${squad.id}: only ${squad.players.length} players`);
}

// Every formation slot must be fillable by somebody in the pool.
const allPlayers = squads.flatMap((squad) => squad.players);
for (const formation of formations) {
  for (const slot of formation.slots) {
    if (!allPlayers.some((player) => getSlotFit(player, slot.position) > 0)) {
      problems.push(`${formation.id}: nobody in the dataset can fill ${slot.position}`);
    }
  }
}

function bestFor(position: Position, used: Set<string>, worst = false) {
  const candidates = allPlayers
    .filter((player) => !used.has(player.id) && getSlotFit(player, position) > 0)
    .sort((left, right) => (worst ? left.rating - right.rating : right.rating - left.rating));
  return candidates[0] ?? null;
}

function buildXi(formationId: string, worst = false) {
  const formation = formations.find((item) => item.id === formationId)!;
  const used = new Set<string>();
  const xi: Array<{ slotId: string; player: Player }> = [];

  for (const slot of formation.slots) {
    const player = bestFor(slot.position, used, worst);
    if (!player) continue;
    used.add(player.id);
    xi.push({ slotId: slot.id, player });
  }

  return { formation, xi, used };
}

console.log("=== calibration ===");
for (const worst of [false, true]) {
  const { formation, xi, used } = buildXi("4-3-3", worst);
  const ratings = rateSquad(xi, formation, "balanced");
  const benchPool = allPlayers
    .filter((player) => !used.has(player.id))
    .sort((left, right) => (worst ? left.rating - right.rating : right.rating - left.rating));

  for (const benchState of ["empty", "full"] as const) {
    const bench =
      benchState === "empty"
        ? []
        : [
            { slotId: "bench-gk", player: benchPool.find((p) => p.positions.includes("GK"))! },
            { slotId: "bench-def-1", player: benchPool.find((p) => p.positions.includes("CB"))! },
            { slotId: "bench-def-2", player: benchPool.find((p) => p.positions.includes("RB"))! },
            { slotId: "bench-mid-1", player: benchPool.find((p) => p.positions.includes("CM"))! },
            { slotId: "bench-mid-2", player: benchPool.find((p) => p.positions.includes("CDM"))! },
            { slotId: "bench-att-1", player: benchPool.find((p) => p.positions.includes("ST"))! },
            { slotId: "bench-flex", player: benchPool.find((p) => p.positions.includes("LW"))! },
          ].filter((entry) => entry.player);

    const finishes: Record<string, number> = {};
    let goalsFor = 0;
    let goalsAgainst = 0;
    let matches = 0;

    for (let seed = 1; seed <= 200; seed += 1) {
      const result = simulateDraft({ xi, bench, formation, style: "balanced", seed });
      finishes[result.finish] = (finishes[result.finish] ?? 0) + 1;
      goalsFor += result.goalsFor;
      goalsAgainst += result.goalsAgainst;
      matches += result.matches.length;
    }

    console.log(
      `${worst ? "weak " : "strong"} XI / ${benchState.padEnd(5)} bench | ATT ${ratings.attack} DEF ${ratings.defense} BAL ${ratings.balance} | ` +
        `goals ${(goalsFor / matches).toFixed(2)}-${(goalsAgainst / matches).toFixed(2)} per match | ` +
        Object.entries(finishes)
          .sort((a, b) => b[1] - a[1])
          .map(([key, count]) => `${key}: ${count}`)
          .join(", "),
    );
  }
}

console.log("\n=== style ===");
{
  const { formation, xi, used } = buildXi("4-3-3");
  const benchPool = allPlayers
    .filter((player) => !used.has(player.id))
    .sort((left, right) => right.rating - left.rating);
  const taken = new Set<string>();
  const grab = (positions: string[]) => {
    const found = benchPool.find(
      (p) => !taken.has(p.id) && p.positions.some((pos) => positions.includes(pos)),
    );
    if (found) taken.add(found.id);
    return found;
  };
  const bench = [
    { slotId: "bench-gk", player: grab(["GK"]) },
    { slotId: "bench-def-1", player: grab(["CB"]) },
    { slotId: "bench-def-2", player: grab(["RB", "LB"]) },
    { slotId: "bench-mid-1", player: grab(["CM"]) },
    { slotId: "bench-mid-2", player: grab(["CDM", "CAM"]) },
    { slotId: "bench-att-1", player: grab(["ST"]) },
    { slotId: "bench-flex", player: grab(["RW", "LW"]) },
  ].filter((entry): entry is { slotId: string; player: Player } => Boolean(entry.player));

  for (const style of ["defensive", "balanced", "attacking"] as const) {
    const ratings = rateSquad(xi, formation, style);
    let goalsFor = 0;
    let goalsAgainst = 0;
    let matches = 0;
    let injuries = 0;
    let unreplaced = 0;
    const finishes: Record<string, number> = {};

    for (let seed = 1; seed <= 300; seed += 1) {
      const result = simulateDraft({ xi, bench, formation, style, seed });
      goalsFor += result.goalsFor;
      goalsAgainst += result.goalsAgainst;
      matches += result.matches.length;
      injuries += result.injuries;
      unreplaced += result.matches.filter((m) => m.injury?.includes("no cover")).length;
      finishes[result.finish] = (finishes[result.finish] ?? 0) + 1;
    }

    console.log(
      `${style.padEnd(9)} | overall ${ratings.overall} | goals ${(goalsFor / matches).toFixed(2)}-${(goalsAgainst / matches).toFixed(2)} | ` +
        `injuries ${(injuries / 300).toFixed(2)}/run (${unreplaced} unreplaced) | ` +
        `titles ${finishes["World Champions"] ?? 0}/300`,
    );
  }
}

console.log("\n=== dataset ===");
console.log(
  `${new Set(squads.map((s) => s.nation)).size} nations, ${squads.length} squads, ${allPlayers.length} players`,
);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(` - ${problem}`);
  process.exitCode = 1;
} else {
  console.log("No dataset problems found.");
}
