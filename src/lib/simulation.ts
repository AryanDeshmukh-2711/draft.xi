import { createSeededRandom, getSlotFit } from "./draft-utils";
import type {
  BenchRole,
  DraftResult,
  DraftStyle,
  Formation,
  MatchReport,
  Player,
  Position,
} from "./types";

export type XiSelection = { slotId: string; player: Player };
export type BenchSelection = { slotId: string; player: Player };

export type SimulationInput = {
  xi: XiSelection[];
  bench: BenchSelection[];
  formation: Formation;
  style: DraftStyle;
  seed: number;
};

const attackWeight: Record<Position, number> = {
  GK: 0.02,
  CB: 0.06,
  RB: 0.16,
  LB: 0.16,
  RWB: 0.24,
  LWB: 0.24,
  CDM: 0.2,
  CM: 0.46,
  CAM: 0.85,
  RM: 0.6,
  LM: 0.6,
  RW: 0.95,
  LW: 0.95,
  ST: 1,
};

const defenseWeight: Record<Position, number> = {
  GK: 1,
  CB: 0.95,
  RB: 0.76,
  LB: 0.76,
  RWB: 0.58,
  LWB: 0.58,
  CDM: 0.82,
  CM: 0.5,
  CAM: 0.2,
  RM: 0.32,
  LM: 0.32,
  RW: 0.12,
  LW: 0.12,
  ST: 0.08,
};

const styleWeights: Record<DraftStyle, { attack: number; defense: number; balance: number }> = {
  defensive: { attack: 0.32, defense: 0.52, balance: 0.16 },
  balanced: { attack: 0.42, defense: 0.42, balance: 0.16 },
  attacking: { attack: 0.53, defense: 0.31, balance: 0.16 },
};

const styleGoalBias: Record<DraftStyle, { scored: number; conceded: number }> = {
  defensive: { scored: -0.22, conceded: -0.3 },
  balanced: { scored: 0, conceded: 0 },
  attacking: { scored: 0.32, conceded: 0.34 },
};

/**
 * Opponent strength sits on the same 0-99 scale as the squad ratings, so a
 * well-drafted XI outguns the group and has to work for the knockout rounds.
 */
const rounds = [
  { round: "Group match 1", opponent: "Costa Rica", strength: 64, knockout: false },
  { round: "Group match 2", opponent: "Serbia", strength: 68, knockout: false },
  { round: "Group match 3", opponent: "Denmark", strength: 71, knockout: false },
  { round: "Round of 16", opponent: "Mexico", strength: 73, knockout: true },
  { round: "Quarter-final", opponent: "Netherlands", strength: 77, knockout: true },
  { round: "Semi-final", opponent: "Germany", strength: 80, knockout: true },
  { round: "Final", opponent: "Brazil", strength: 83, knockout: true },
];

const baseGoals = 1.2;
const goalScale = 10;

const benchRoleValue: Record<BenchRole, number> = {
  GK: 0.9,
  DEF: 1,
  MID: 1,
  ATT: 1,
  ANY: 0.85,
};

function clamp(value: number, min = 0, max = 99) {
  return Math.max(min, Math.min(max, value));
}

function samplePoisson(mean: number, random: () => number) {
  const limit = Math.exp(-Math.max(0.05, mean));
  let count = 0;
  let product = random();

  while (product > limit && count < 9) {
    count += 1;
    product *= random();
  }

  return count;
}

/**
 * Splits the XI into the numbers the scorecard shows. Playing someone out of
 * position scales their contribution down rather than blocking the pick.
 */
export function rateSquad(xi: XiSelection[], formation: Formation, style: DraftStyle) {
  const slotById = new Map(formation.slots.map((slot) => [slot.id, slot]));

  let attackTotal = 0;
  let attackWeightTotal = 0;
  let defenseTotal = 0;
  let defenseWeightTotal = 0;
  let fitTotal = 0;
  let passingTotal = 0;
  let physicalTotal = 0;

  for (const entry of xi) {
    const slot = slotById.get(entry.slotId);
    if (!slot) continue;

    const fit = getSlotFit(entry.player, slot.position) || 0.7;
    const aWeight = attackWeight[slot.position];
    const dWeight = defenseWeight[slot.position];

    attackTotal += entry.player.attack * fit * aWeight;
    attackWeightTotal += aWeight;
    defenseTotal += entry.player.defense * fit * dWeight;
    defenseWeightTotal += dWeight;
    fitTotal += fit;
    passingTotal += entry.player.passing * fit;
    physicalTotal += entry.player.physical * fit;
  }

  const count = xi.length || 1;
  const rawAttack = attackWeightTotal > 0 ? attackTotal / attackWeightTotal : 0;
  const rawDefense = defenseWeightTotal > 0 ? defenseTotal / defenseWeightTotal : 0;
  const passing = passingTotal / count;
  const stamina = physicalTotal / count;
  const averageFit = fitTotal / count;

  // Circulation helps the attack, so a passing midfield lifts the final number.
  const attack = clamp(rawAttack * 0.86 + passing * 0.14);
  const defense = clamp(rawDefense * 0.92 + stamina * 0.08);

  const skew = Math.abs(attack - defense);
  const balance = clamp(100 - skew * 1.15 - (1 - averageFit) * 160, 10);

  const weights = styleWeights[style];
  const overall = clamp(attack * weights.attack + defense * weights.defense + balance * weights.balance);

  return {
    attack: Math.round(attack),
    defense: Math.round(defense),
    balance: Math.round(balance),
    stamina: Math.round(stamina),
    overall: Math.round(overall),
    averageFit,
  };
}

/**
 * A bench is only worth what it can actually cover. A full seven with a real
 * reserve keeper is worth far more than seven spare strikers.
 */
export function rateBench(bench: BenchSelection[], benchSlotRoles: Record<string, BenchRole>) {
  if (bench.length === 0) {
    return { strength: 0, depth: 0, hasKeeper: false };
  }

  let total = 0;
  let weightTotal = 0;
  let hasKeeper = false;

  for (const entry of bench) {
    const role = benchSlotRoles[entry.slotId] ?? "ANY";
    const weight = benchRoleValue[role];
    if (role === "GK" || entry.player.positions.includes("GK")) hasKeeper = true;
    total += entry.player.rating * weight;
    weightTotal += weight;
  }

  const average = weightTotal > 0 ? total / weightTotal : 0;
  const depth = bench.length / 7;
  const strength = clamp(average * (0.55 + depth * 0.45) * (hasKeeper ? 1 : 0.93));

  return { strength: Math.round(strength), depth, hasKeeper };
}

export function simulateDraft(input: SimulationInput): DraftResult {
  const { xi, bench, formation, style, seed } = input;
  const random = createSeededRandom(seed);

  const benchSlotRoles: Record<string, BenchRole> = {};
  for (const entry of bench) {
    benchSlotRoles[entry.slotId] = inferBenchRole(entry.slotId);
  }

  const ratings = rateSquad(xi, formation, style);
  const benchRating = rateBench(bench, benchSlotRoles);

  // A deep bench is worth a couple of points of overall quality, no more.
  const benchBonus = (benchRating.strength / 100) * 5;
  const overall = Math.round(clamp(ratings.overall + benchBonus));

  const bias = styleGoalBias[style];
  const availableSubs = [...bench].sort((left, right) => right.player.rating - left.player.rating);

  const matches: MatchReport[] = [];
  let goalsFor = 0;
  let goalsAgainst = 0;
  let eliminated = false;
  let finish = "World Champions";
  let fatigue = 0;

  for (let index = 0; index < rounds.length; index += 1) {
    const fixture = rounds[index];
    if (eliminated) break;

    // Legs pile up. Without cover on the bench the XI drops off late on.
    fatigue += Math.max(0, (100 - ratings.stamina) / 42);
    let substitution: string | null = null;
    const sub = availableSubs[index % Math.max(1, availableSubs.length)];

    if (bench.length > 0 && sub && fatigue > 0.8) {
      const minute = 58 + Math.floor(random() * 26);
      substitution = `${minute}' ${sub.player.name} on, ${Math.round(sub.player.rating)} rated`;
      fatigue = Math.max(0, fatigue - 0.55 - (sub.player.physical / 100) * 0.35);
    }

    const drop = fatigue * 1.6 + (bench.length === 0 ? index * 0.5 : 0);
    const effectiveAttack = ratings.attack - drop;
    const effectiveDefense = ratings.defense - drop;

    const opponentAttack = fixture.strength + (random() - 0.5) * 6;
    const opponentDefense = fixture.strength + (random() - 0.5) * 6;

    const expectedFor = Math.max(
      0.15,
      baseGoals + (effectiveAttack - opponentDefense) / goalScale + bias.scored,
    );
    const expectedAgainst = Math.max(
      0.15,
      baseGoals + (opponentAttack - effectiveDefense) / goalScale + bias.conceded,
    );

    let scoreFor = samplePoisson(expectedFor, random);
    let scoreAgainst = samplePoisson(expectedAgainst, random);
    let shootout = false;

    if (fixture.knockout && scoreFor === scoreAgainst) {
      // Knockout ties go to a shoot-out, decided by the keeper and the nerve
      // of a balanced side.
      shootout = true;
      const keeper = xi.find((entry) => entry.slotId === "gk");
      const nerve = (keeper?.player.defense ?? 70) + ratings.balance / 2 + random() * 30;
      if (nerve > 118) scoreFor += 1;
      else scoreAgainst += 1;
    }

    const outcome: MatchReport["outcome"] =
      scoreFor > scoreAgainst ? "win" : scoreFor === scoreAgainst ? "draw" : "loss";

    matches.push({
      round: fixture.round,
      opponent: fixture.opponent,
      scoreFor,
      scoreAgainst,
      outcome,
      note: buildMatchNote(outcome, scoreFor, scoreAgainst, shootout, bench.length === 0 && index > 2),
      substitution,
    });

    goalsFor += scoreFor;
    goalsAgainst += scoreAgainst;

    if (fixture.knockout && outcome !== "win") {
      eliminated = true;
      finish = fixture.round === "Final" ? "Runners-up" : `Out in the ${fixture.round.toLowerCase()}`;
    }
  }

  const groupPoints = matches
    .slice(0, 3)
    .reduce((total, match) => total + (match.outcome === "win" ? 3 : match.outcome === "draw" ? 1 : 0), 0);

  if (groupPoints < 4 && matches.length >= 3) {
    finish = "Group stage exit";
    matches.length = 3;
  }

  const lastMatch = matches[matches.length - 1];
  const scoreline = lastMatch ? `${lastMatch.scoreFor}-${lastMatch.scoreAgainst}` : "0-0";
  const bestWin = matches.reduce(
    (best, match) => (match.scoreFor - match.scoreAgainst > best.margin
      ? { margin: match.scoreFor - match.scoreAgainst, match }
      : best),
    { margin: -99, match: null as MatchReport | null },
  );

  return {
    seed,
    overall,
    attack: ratings.attack,
    defense: ratings.defense,
    balance: ratings.balance,
    benchStrength: benchRating.strength,
    goalsFor,
    goalsAgainst,
    scoreline,
    headline: buildHeadline(finish, bestWin.match),
    summary: buildSummary(ratings, benchRating, finish, style),
    finish,
    matches,
  };
}

function inferBenchRole(slotId: string): BenchRole {
  if (slotId.includes("gk")) return "GK";
  if (slotId.includes("def")) return "DEF";
  if (slotId.includes("mid")) return "MID";
  if (slotId.includes("att")) return "ATT";
  return "ANY";
}

function buildMatchNote(
  outcome: MatchReport["outcome"],
  scoreFor: number,
  scoreAgainst: number,
  shootout: boolean,
  benchEmptyLate: boolean,
) {
  if (scoreFor >= 7 && scoreAgainst === 0) return "The seven-nil. Nothing left to say.";
  if (shootout) {
    return outcome === "win"
      ? "Level after extra time, through on penalties."
      : "Level after extra time, out on penalties.";
  }
  if (benchEmptyLate) return "No substitutes available, the legs went in the last twenty minutes.";
  if (outcome === "win" && scoreFor - scoreAgainst >= 3) return "Comfortable, and it never looked otherwise.";
  if (outcome === "win") return "Won it the hard way.";
  if (outcome === "draw") return "A point, and a nervous look at the table.";
  if (scoreAgainst - scoreFor >= 3) return "Overrun. The shape never settled.";
  return "One goal short.";
}

function buildHeadline(finish: string, bestWin: MatchReport | null) {
  if (bestWin && bestWin.scoreFor >= 7 && bestWin.scoreAgainst === 0) return "Seven-nil statement";
  if (finish === "World Champions") return "World Champions";
  if (finish === "Runners-up") return "Beaten finalists";
  if (finish === "Group stage exit") return "Home before the postcards";
  return finish;
}

function buildSummary(
  ratings: ReturnType<typeof rateSquad>,
  bench: ReturnType<typeof rateBench>,
  finish: string,
  style: DraftStyle,
) {
  const parts: string[] = [];

  if (ratings.attack - ratings.defense > 12) parts.push("front-loaded and open at the back");
  else if (ratings.defense - ratings.attack > 12) parts.push("hard to beat but short of goals");
  else parts.push("a genuinely balanced side");

  if (ratings.averageFit < 0.95) parts.push("with players asked to cover unfamiliar roles");
  if (bench.strength === 0) parts.push("and no bench to turn to");
  else if (!bench.hasKeeper) parts.push("and no reserve keeper");
  else if (bench.strength > 78) parts.push("with a bench that changed matches");

  return `A ${style} XI: ${parts.join(", ")}. Finish: ${finish.toLowerCase()}.`;
}
