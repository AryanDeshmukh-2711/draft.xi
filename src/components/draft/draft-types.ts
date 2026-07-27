import type { Player, Squad } from "@/lib/types";

export type SquadMeta = Pick<Squad, "id" | "nation" | "code" | "flag" | "year">;

export type DraftPick = {
  player: Player;
  squad: SquadMeta;
};

export type PickMap = Record<string, DraftPick>;

export type SlotTarget = { kind: "xi" | "bench"; slotId: string };

export function surnameOf(name: string) {
  const parts = name.trim().split(" ");
  return parts.length === 1 ? parts[0] : parts.slice(1).join(" ");
}
