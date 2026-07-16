import type { Player, Position } from "./types";

const positionMap: Record<Position, Position[]> = {
  GK: ["GK"],
  RB: ["RB", "RWB", "CB"],
  CB: ["CB", "RB", "LB"],
  LB: ["LB", "LWB", "CB"],
  RWB: ["RWB", "RB"],
  LWB: ["LWB", "LB"],
  CDM: ["CDM", "CM", "CB"],
  CM: ["CM", "CDM", "CAM"],
  CAM: ["CAM", "CM", "RW", "LW"],
  RM: ["RM", "RW", "CM", "CAM"],
  LM: ["LM", "LW", "CM", "CAM"],
  RW: ["RW", "CAM", "ST"],
  LW: ["LW", "CAM", "ST"],
  ST: ["ST", "RW", "LW", "CAM"],
};

export function isPlayerEligibleForSlot(player: Player, slot: Position) {
  return positionMap[player.position].includes(slot);
}

export function getEligibleSlotsForPlayer(player: Player, slots: Position[]) {
  return slots.filter((slot) => isPlayerEligibleForSlot(player, slot));
}

export function createSeededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function pickRandom<T>(items: T[], random: () => number) {
  return items[Math.floor(random() * items.length)];
}
