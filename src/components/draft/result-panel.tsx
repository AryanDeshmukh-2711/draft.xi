"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/motion";
import type { DraftResult, Formation } from "@/lib/types";
import type { PickMap } from "./draft-types";
import { surnameOf } from "./draft-types";

const ease = [0.16, 1, 0.3, 1] as const;

type ResultPanelProps = {
  result: DraftResult;
  formation: Formation;
  xi: PickMap;
  nickname: string;
  message: string;
  submitting: boolean;
  onNicknameChange: (value: string) => void;
  onSubmit: () => void;
  onCopy: () => void;
  onPlayAgain: () => void;
};

const outcomeStyle = {
  win: { text: "text-[var(--accent)]", bar: "var(--accent)" },
  draw: { text: "text-[var(--amber)]", bar: "var(--amber)" },
  loss: { text: "text-[var(--magenta)]", bar: "var(--magenta)" },
} as const;

export function ResultPanel({
  result,
  formation,
  xi,
  nickname,
  message,
  submitting,
  onNicknameChange,
  onSubmit,
  onCopy,
  onPlayAgain,
}: ResultPanelProps) {
  return (
    <motion.section
      className="hud hud-lit hud-rule p-5 sm:p-6"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Campaign result</p>
          <motion.h2
            className="display mt-2 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
          >
            {result.headline}
          </motion.h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">{result.summary}</p>
        </div>
        <motion.div
          className="text-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
        >
          <p className="eyebrow">Overall</p>
          <p className="tnum display text-6xl font-bold leading-none text-[var(--accent)]">
            <CountUp value={result.overall} duration={1.1} />
          </p>
        </motion.div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Attack" value={result.attack} color="var(--magenta)" />
        <Stat label="Defense" value={result.defense} color="var(--cyan)" />
        <Stat label="Balance" value={result.balance} color="var(--accent)" />
        <Stat label="Bench" value={result.benchStrength} color="var(--amber)" />
        <Stat label="Goals" value={`${result.goalsFor}:${result.goalsAgainst}`} color="var(--muted)" />
        <Stat
          label="Injuries"
          value={result.injuries}
          color={result.injuries > 0 ? "var(--magenta)" : "var(--muted)"}
        />
      </div>

      <ol className="mt-6 space-y-1.5">
        {result.matches.map((match, index) => {
          const style = outcomeStyle[match.outcome];
          return (
            <motion.li
              key={match.round}
              className="clip-btn flex items-center gap-3 border border-[var(--border)] bg-white/[0.03] px-3 py-2.5"
              style={{ borderLeft: `2px solid ${style.bar}` }}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.25 + index * 0.12 }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {match.round} · v {match.opponent}
                </p>
                <p className="mt-0.5 truncate text-xs text-white/70">{match.note}</p>
                {match.injury ? (
                  <p className="mt-0.5 truncate text-xs text-[var(--magenta)]">✚ {match.injury}</p>
                ) : null}
                {match.substitution ? (
                  <p className="mt-0.5 truncate text-xs text-[var(--amber)]">↔ {match.substitution}</p>
                ) : null}
              </div>
              <motion.span
                className={`tnum display shrink-0 text-2xl font-bold ${style.text}`}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 20,
                  delay: 0.35 + index * 0.12,
                }}
              >
                {match.scoreFor}–{match.scoreAgainst}
              </motion.span>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-6 border-t border-[var(--border)] pt-4">
        <p className="eyebrow">Your XI · {formation.name}</p>
        <p className="mt-2 text-sm leading-7 text-white">
          {formation.slots
            .map((slot) => (xi[slot.id] ? surnameOf(xi[slot.id].player.name) : "—"))
            .join("  ·  ")}
        </p>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={nickname}
          maxLength={24}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder="Nickname for the Top 100"
          className="clip-btn w-full border border-[var(--border)] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)]"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="clip-btn display bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Submit"}
        </button>
      </div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="clip-btn border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Copy result card
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="clip-btn border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Draft again
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-[var(--accent)]">{message}</p> : null}
    </motion.section>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="clip-btn border border-[var(--border)] bg-white/[0.03] px-3 py-2.5 text-center">
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
        {label}
      </div>
      <div className="tnum display mt-0.5 text-2xl font-bold" style={{ color }}>
        {typeof value === "number" ? <CountUp value={value} /> : value}
      </div>
    </div>
  );
}
