"use client";

import { AnimatePresence, motion } from "motion/react";
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
  formMap: Record<string, number>;
  armedPlayerId: string | null;
  isPlayerAvailable: (player: Player) => boolean;
  onRoll: () => void;
  onReroll: (kind: "nation" | "year") => void;
  onSelect: (player: Player) => void;
  onCancel: () => void;
};

export function SquadBoard({
  squad,
  rerollsLeft,
  rolling,
  showRatings,
  formMap,
  armedPlayerId,
  isPlayerAvailable,
  onRoll,
  onReroll,
  onSelect,
  onCancel,
}: SquadBoardProps) {
  // No `mode="wait"` here on purpose: a backgrounded tab stops firing
  // animation frames, and gating the incoming squad on an exit animation
  // would leave the board stuck until the tab is focused again.
  return (
    <AnimatePresence initial={false}>
      {squad ? (
        <motion.section
          key={squad.id}
          className="hud hud-rule p-4"
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <DrawHeader
            squad={squad}
            rerollsLeft={rerollsLeft}
            rolling={rolling}
            onReroll={onReroll}
          />

          <div className="mt-5 flex items-center justify-between gap-3">
            <p className="eyebrow">{armedPlayerId ? "Now choose a position" : "Pick a player"}</p>
            {armedPlayerId ? (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-[var(--muted)] underline underline-offset-2 transition hover:text-[var(--magenta)]"
              >
                Cancel
              </button>
            ) : null}
          </div>

          <PlayerGrid
            squad={squad}
            showRatings={showRatings}
            formMap={formMap}
            armedPlayerId={armedPlayerId}
            isPlayerAvailable={isPlayerAvailable}
            onSelect={onSelect}
          />

          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
            {armedPlayerId
              ? "Tap a highlighted slot on the pitch or the bench to place him."
              : "One draw, one squad, one player. Taking a name ends this turn."}
          </p>
        </motion.section>
      ) : (
        <motion.section
          key="empty"
          className="hud hud-rule relative overflow-hidden p-8 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {rolling ? <div className="sweep pointer-events-none absolute inset-0" /> : null}
          <p className="eyebrow">Draft zone</p>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Draw a nation and a World Cup year. One squad, one decision.
          </p>
          <motion.button
            type="button"
            onClick={onRoll}
            disabled={rolling}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="clip-btn display glow mt-5 bg-[var(--accent)] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-[#04070d] disabled:opacity-50"
          >
            <motion.span
              className="inline-block"
              animate={rolling ? { rotate: [0, 360] } : { rotate: 0 }}
              transition={rolling ? { duration: 0.7, repeat: Infinity, ease: "linear" } : undefined}
            >
              🎲
            </motion.span>
            <span className="ml-2">{rolling ? "Drawing" : "Roll"}</span>
          </motion.button>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function DrawHeader({
  squad,
  rerollsLeft,
  rolling,
  onReroll,
}: {
  squad: Squad;
  rerollsLeft: number;
  rolling: boolean;
  onReroll: (kind: "nation" | "year") => void;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="eyebrow">Drawn</p>
        <p className="display mt-1.5 flex items-center gap-2.5 text-2xl font-bold leading-none text-white">
          <motion.span
            className="text-3xl"
            initial={{ scale: 0.5, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
          >
            {squad.flag}
          </motion.span>
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
          {(
            [
              ["nation", "↺ Another nation"],
              ["year", "↺ Another World Cup"],
            ] as const
          ).map(([kind, label]) => (
            <motion.button
              key={kind}
              type="button"
              onClick={() => onReroll(kind)}
              disabled={rerollsLeft <= 0 || rolling}
              whileHover={rerollsLeft > 0 ? { scale: 1.04 } : undefined}
              whileTap={rerollsLeft > 0 ? { scale: 0.96 } : undefined}
              className="clip-btn border border-[var(--border)] bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-35 disabled:hover:border-[var(--border)] disabled:hover:text-white"
            >
              {label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayerGrid({
  squad,
  showRatings,
  formMap,
  armedPlayerId,
  isPlayerAvailable,
  onSelect,
}: {
  squad: Squad;
  showRatings: boolean;
  formMap: Record<string, number>;
  armedPlayerId: string | null;
  isPlayerAvailable: (player: Player) => boolean;
  onSelect: (player: Player) => void;
}) {
  const sorted = [...squad.players].sort((a, b) => {
    const delta = groupOrder[groupOf[a.positions[0]]] - groupOrder[groupOf[b.positions[0]]];
    return delta !== 0 ? delta : a.number - b.number;
  });

  return (
    <motion.div
      className="scrollbar-thin mt-2.5 grid max-h-[27rem] grid-cols-2 gap-1.5 overflow-y-auto pr-1 sm:grid-cols-3"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.022 } } }}
    >
      {sorted.map((player) => {
        const available = isPlayerAvailable(player);
        const accent = groupAccent[groupOf[player.positions[0]]];
        const form = formMap[player.id] ?? 0;
        const armed = armedPlayerId === player.id;
        const dimmed = Boolean(armedPlayerId) && !armed;

        return (
          <motion.button
            key={player.id}
            type="button"
            onClick={() => onSelect(player)}
            disabled={!available}
            aria-pressed={armed}
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={available ? { y: -2 } : undefined}
            whileTap={available ? { scale: 0.97 } : undefined}
            style={available && !armed ? { borderLeftColor: accent } : undefined}
            className={`clip-btn flex items-stretch justify-between gap-2 border border-l-2 px-2.5 py-2 text-left transition-colors ${
              armed
                ? "border-[var(--accent)] bg-[rgba(0,224,138,0.2)] text-white shadow-[0_0_24px_-8px_var(--accent)]"
                : available
                  ? `border-[var(--border)] bg-white/[0.04] text-white hover:bg-white/[0.09] ${dimmed ? "opacity-45" : ""}`
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

            <span className="flex shrink-0 flex-col items-end justify-center">
              <span className="tnum text-lg font-bold leading-none">
                {showRatings ? player.rating : "?"}
              </span>
              {showRatings && form !== 0 ? (
                <span
                  className="tnum mt-0.5 text-[0.58rem] font-bold leading-none"
                  style={{ color: form > 0 ? "var(--accent)" : "var(--magenta)" }}
                  title="Form from past campaigns"
                >
                  {form > 0 ? `▲${form}` : `▼${Math.abs(form)}`}
                </span>
              ) : null}
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
