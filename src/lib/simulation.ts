import type { Formation, Player } from "./types";
import { createSeededRandom } from "./draft-utils";

export type DraftResult = {
  seed: number;
  scoreline: string;
  headline: string;
  campaign: Array<{ round: string; result: string }>;
  strength: number;
};

function getRoleWeight(position: Player["position"]) {
  switch (position) {
    case "GK":
      return 1.2;
    case "CB":
    case "CDM":
      return 1.15;
    case "CM":
    case "CAM":
      return 1.1;
    case "ST":
      return 1.05;
    default:
      return 1;
  }
}

function getLiveFormAdjustment(player: Player, performanceTick: number, seed: number) {
  const offset = ((performanceTick + seed + player.rating) % 7) - 3;
  const swing = Math.sin((performanceTick + seed + player.rating) / 3) * 1.4;
  return offset + swing;
}

export function simulateDraft(
  xi: Player[],
  formation: Formation,
  seed: number,
  performanceTick = 0,
): DraftResult {
  const random = createSeededRandom(seed);
  const total = xi.reduce(
    (sum, player) => sum + (player.rating + getLiveFormAdjustment(player, performanceTick, seed)) * getRoleWeight(player.position),
    0,
  );
  const spine = xi
    .filter((player) => ["GK", "CB", "CDM", "CM"].includes(player.position))
    .reduce((sum, player) => sum + player.rating + getLiveFormAdjustment(player, performanceTick, seed) * 0.85, 0);
  const strength = Math.round((total + spine * 0.35 + formation.slots.length * 2) / xi.length);

  const campaign = ["Group stage", "Round of 16", "Quarter-final", "Semi-final", "Final"].map((round) => {
    const variance = Math.round((random() - 0.5) * 4);
    const margin = Math.max(0, Math.round((strength - 78) / 8 + variance));
    const opponent = Math.max(0, Math.round(3 + (80 - strength) / 15 + Math.abs(variance)));
    return { round, result: `${margin}-${opponent}` };
  });

  const finalScore = campaign[campaign.length - 1]?.result ?? "0-0";
  const headline = strength >= 92 ? "Perfect campaign" : strength >= 86 ? "Deep run" : strength >= 80 ? "Respectable run" : "Needs a rebuild";

  return {
    seed,
    scoreline: finalScore,
    headline,
    campaign,
    strength,
  };
}
