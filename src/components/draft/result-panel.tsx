"use client";

import type { DraftResult, Formation } from "@/lib/types";
import type { PickMap } from "./draft-types";
import { surnameOf } from "./draft-types";

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

const outcomeColor = {
  win: "text-[#5fd08a]",
  draw: "text-[#f0c14d]",
  loss: "text-[#e2705f]",
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
    <section className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-xl shadow-black/20">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
        Campaign result
      </p>
      <h2 className="mt-2 text-3xl font-bold text-white">{result.headline}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{result.summary}</p>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Stat label="Overall" value={result.overall} />
        <Stat label="Attack" value={result.attack} />
        <Stat label="Defense" value={result.defense} />
        <Stat label="Balance" value={result.balance} />
        <Stat label="Bench" value={result.benchStrength} />
      </div>

      <ol className="mt-5 space-y-2">
        {result.matches.map((match) => (
          <li
            key={match.round}
            className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                {match.round}
              </span>
              <span className={`text-lg font-bold ${outcomeColor[match.outcome]}`}>
                {match.scoreFor}–{match.scoreAgainst}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-[var(--muted)]">
              <span className="text-white/80">v {match.opponent}</span>
              <span>· {match.note}</span>
            </div>
            {match.substitution ? (
              <p className="mt-1 text-xs text-[var(--accent-strong)]">↔ {match.substitution}</p>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-xl border border-[var(--border)] bg-black/25 p-3">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Your XI · {formation.name}
        </p>
        <p className="mt-1.5 text-sm leading-6 text-white">
          {formation.slots
            .map((slot) => (xi[slot.id] ? surnameOf(xi[slot.id].player.name) : "—"))
            .join(" · ")}
        </p>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto]">
        <input
          value={nickname}
          maxLength={24}
          onChange={(event) => onNicknameChange(event.target.value)}
          placeholder="Nickname for the Top 100"
          className="w-full rounded-full border border-[var(--border)] bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-[var(--muted)] focus:border-[rgba(255,107,53,0.6)]"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit to Top 100"}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Copy result card
        </button>
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Draft again
        </button>
      </div>

      {message ? <p className="mt-3 text-sm text-[var(--muted)]">{message}</p> : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2 text-center">
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className="mt-0.5 text-xl font-bold text-white">{value}</div>
    </div>
  );
}
