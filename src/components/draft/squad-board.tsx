"use client";

import { formatPositions } from "@/lib/draft-utils";
import type { Player, Position, Squad } from "@/lib/types";

type Group = "GK" | "DEF" | "MID" | "ATT";

const groupOrder: Record<Group, number> = { GK: 0, DEF: 1, MID: 2, ATT: 3 };

const groupOf: Record<Position, Group> = {
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

const groupAccent: Record<Group, string> = {
  GK: "var(--amber)",
  DEF: "var(--cyan)",
  MID: "var(--accent)",
  ATT: "var(--magenta)",
};

type SquadBoardProps = {
  squad: Squad | null;
  rerollsLeft: number;
  rolling: boolean;
  showRatings: boolean;
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
  isPlayerAvailable,
  onRoll,
  onReroll,
  onPick,
}: SquadBoardProps) {
  if (!squad) {
    return (
      <section className="hud hud-rule relative overflow-hidden p-8 text-center">
        <div className="sweep pointer-events-none absolute inset-0" />
        <p className="eyebrow">Draft zone</p>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Draw a nation and a World Cup year. One squad, one decision.
        </p>
        <button
          type="button"
          onClick={onRoll}
          disabled={rolling}
          className="clip-btn display glow mt-5 bg-[var(--accent)] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#04070d] transition hover:brightness-110 disabled:opacity-50"
        >
          {rolling ? "Drawing…" : "Roll 🎲"}
        </button>
      </section>
    );
  }

  const sorted = [...squad.players].sort((a, b) => {
    const delta = groupOrder[groupOf[a.positions[0]]] - groupOrder[groupOf[b.positions[0]]];
    return delta !== 0 ? delta : a.number - b.number;
  });

  return (
    <section className="hud hud-rule p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Drawn</p>
          <p className="display mt-1.5 flex items-center gap-2.5 text-2xl font-bold leading-none text-white">
            <span className="text-3xl">{squad.flag}</span>
            {squad.nation}
          </p>
          <p className="tnum mt-1.5 text-sm font-semibold text-[var(--accent)]">
            World Cup {squad.year}
          </p>
        </div>

        <div className="text-right">
          <p className="eyebrow">
            Reroll · <span className="tnum text-[var(--accent)]">{rerollsLeft}</span> left
          </p>
          <div className="mt-2 flex flex-wrap justify-end gap-1.5">
            <button
              type="button"
              onClick={() => onReroll("nation")}
              disabled={rerollsLeft <= 0 || rolling}
              className="clip-btn border border-[var(--border)] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-35 disabled:hover:border-[var(--border)] disabled:hover:text-white"
            >
              ↺ Another nation
            </button>
            <button
              type="button"
              onClick={() => onReroll("year")}
              disabled={rerollsLeft <= 0 || rolling}
              className="clip-btn border border-[var(--border)] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-35 disabled:hover:border-[var(--border)] disabled:hover:text-white"
            >
              ↺ Another World Cup
            </button>
          </div>
        </div>
      </div>

      <p className="eyebrow mt-5">Pick a player</p>

      <div className="scrollbar-thin mt-2.5 grid max-h-[27rem] grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-3">
        {sorted.map((player) => {
          const available = isPlayerAvailable(player);
          const accent = groupAccent[groupOf[player.positions[0]]];

          return (
            <button
              key={player.id}
              type="button"
              onClick={() => onPick(player)}
              disabled={!available}
              style={available ? { borderLeftColor: accent } : undefined}
              className={`clip-btn flex items-stretch justify-between gap-2 border border-l-2 px-2.5 py-2 text-left transition ${
                available
                  ? "border-[var(--border)] bg-white/[0.04] text-white hover:bg-white/[0.09]"
                  : "cursor-not-allowed border-transparent bg-white/[0.02] text-[var(--muted)] opacity-45"
              }`}
            >
              <span className="min-w-0">
                <span className="tnum block text-[0.6rem] font-bold text-[var(--muted)]">
                  #{player.number}
                </span>
                <span className="block truncate text-sm font-semibold leading-tight">
                  {player.name}
                </span>
                <span
                  className="block text-[0.62rem] font-bold uppercase tracking-[0.08em]"
                  style={{ color: available ? accent : undefined }}
                >
                  {formatPositions(player)}
                </span>
              </span>
              <span className="tnum shrink-0 self-center text-lg font-bold">
                {showRatings ? player.rating : "?"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        One draw, one squad, one player. Taking a name ends this turn.
      </p>
    </section>
  );
}
