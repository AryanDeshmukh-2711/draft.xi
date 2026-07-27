import type { BenchRole, Player, Position } from "./types";

/**
 * Player positions accepted by each slot. The first entry is always the slot
 * itself; the rest are the roles a manager would realistically shuffle in.
 */
const slotEligibility: Record<Position, Position[]> = {
  GK: ["GK"],
  RB: ["RB", "RWB", "RM"],
  CB: ["CB"],
  LB: ["LB", "LWB", "LM"],
  RWB: ["RWB", "RB", "RM"],
  LWB: ["LWB", "LB", "LM"],
  CDM: ["CDM", "CM", "CB"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM", "RM", "LM"],
  RM: ["RM", "RW", "RWB", "CM"],
  LM: ["LM", "LW", "LWB", "CM"],
  RW: ["RW", "RM", "CAM", "ST"],
  LW: ["LW", "LM", "CAM", "ST"],
  ST: ["ST", "CAM", "RW", "LW"],
};

const benchRolePositions: Record<BenchRole, Position[]> = {
  GK: ["GK"],
  DEF: ["RB", "CB", "LB", "RWB", "LWB", "CDM"],
  MID: ["CDM", "CM", "CAM", "RM", "LM"],
  ATT: ["RW", "LW", "ST", "CAM"],
  ANY: ["GK", "RB", "CB", "LB", "RWB", "LWB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "ST"],
};

/**
 * How well a player suits a slot. 1 is a natural fit, anything lower is a
 * player playing out of position, and 0 means the slot is closed to them.
 */
export function getSlotFit(player: Player, slot: Position) {
  if (player.positions.includes(slot)) {
    return player.positions[0] === slot ? 1 : 0.97;
  }

  const accepted = slotEligibility[slot];
  const covered = player.positions.some((position) => accepted.includes(position));
  return covered ? 0.88 : 0;
}

export function isPlayerEligibleForSlot(player: Player, slot: Position) {
  return getSlotFit(player, slot) > 0;
}

export function isPlayerEligibleForBench(player: Player, role: BenchRole) {
  const accepted = benchRolePositions[role];
  return player.positions.some((position) => accepted.includes(position));
}

export function formatPositions(player: Player) {
  return player.positions.join("/");
}

export function createSeededRandom(seed: number) {
  let value = Math.abs(Math.trunc(seed)) % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function pickRandom<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}
