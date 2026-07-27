"use client";

import { formatPositions } from "@/lib/draft-utils";
import type { Player, Position, Squad } from "@/lib/types";

const groupOrder: Record<string, number> = { GK: 0, DEF: 1, MID: 2, ATT: 3 };

const groupByPosition: Record<Position, keyof typeof groupOrder> = {
  GK: "GK",
  RB: "DEF",
  CB: "DEF",
  LB: "DEF",
  RWB: "DEF",
  LWB: "DEF",
  CDM: "MID",
  CM: "MID",
  CAM: "MID",
  RM: "MID",
  LM: "MID",
  RW: "ATT",
  LW: "ATT",
  ST: "ATT",
};

type SquadBoardProps = {
  squad: Squad | null;
  rerollsLeft: number;
  rolling: boolean;
  showRatings: boolean;
  hasRolled: boolean;
  isPlayerAvailable: (player: Player) => boolean;
  onRoll: () => void;
  onReroll: (kind: "nation" | "year") => void;
  onPick: (player: Player) => void;
};

export function SquadBoard({
  squad,
  rerollsLeft,
  rolling,
  showRatings,
  hasRolled,
  isPlayerAvailable,
  onRoll,
  onReroll,
  onPick,
}: SquadBoardProps) {
  if (!squad) {
    return (
      <section className="rounded-[1.25rem] border border-dashed border-[var(--border)] bg-black/20 p-8 text-center">
        <p className="text-sm text-[var(--muted)]">Roll to draw a nation and World Cup year.</p>
        <button
          type="button"
          onClick={onRoll}
          disabled={rolling}
          className="mt-4 rounded-full bg-[var(--accent)] px-8 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {rolling ? "Drawing…" : "Roll 🎲"}
        </button>
      </section>
    );
  }

  const sorted = [...squad.players].sort((left, right) => {
    const groupDelta =
      groupOrder[groupByPosition[left.positions[0]]] - groupOrder[groupByPosition[right.positions[0]]];
    if (groupDelta !== 0) return groupDelta;
    return left.number - right.number;
  });

  return (
    <section className="rounded-[1.25rem] border border-[var(--border)] bg-black/25 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">Drawn</p>
          <p className="mt-1 text-xl font-bold text-white">
            <span className="mr-2">{squad.flag}</span>
            {squad.nation}
          </p>
          <p className="text-sm text-[var(--muted)]">World Cup {squad.year}</p>
        </div>

        <div className="text-right">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Not convinced? Reroll · {rerollsLeft} left
          </p>
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => onReroll("nation")}
              disabled={rerollsLeft <= 0 || rolling}
              className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              ↺ Another nation
            </button>
            <button
              type="button"
              onClick={() => onReroll("year")}
              disabled={rerollsLeft <= 0 || rolling}
              className="rounded-full border border-[var(--border)] bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-40"
            >
              ↺ Another World Cup
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
        Pick a player
      </p>

      <div className="mt-2 grid max-h-[26rem] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
        {sorted.map((player) => {
          const available = isPlayerAvailable(player);

          return (
            <button
              key={player.id}
              type="button"
              onClick={() => onPick(player)}
              disabled={!available || !hasRolled}
              className={`flex items-center justify-between gap-2 rounded-xl border px-2.5 py-2 text-left transition ${
                available
                  ? "border-[rgba(255,107,53,0.32)] bg-[rgba(255,107,53,0.1)] text-white hover:bg-[rgba(255,107,53,0.2)]"
                  : "cursor-not-allowed border-[var(--border)] bg-white/5 text-[var(--muted)] opacity-50"
              }`}
            >
              <span className="min-w-0">
                <span className="block text-[0.6rem] font-bold text-[var(--muted)]">#{player.number}</span>
                <span className="block truncate text-sm font-semibold">{player.name}</span>
                <span className="block text-[0.65rem] uppercase tracking-[0.1em] text-[var(--muted)]">
                  {formatPositions(player)}
                </span>
              </span>
              <span className="shrink-0 text-base font-bold">{showRatings ? player.rating : "?"}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-[var(--muted)]">
        One draw, one squad, one player. Taking a name ends this turn.
      </p>
    </section>
  );
}
