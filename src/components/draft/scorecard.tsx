"use client";

import type { BenchSlot, Formation } from "@/lib/types";
import type { PickMap } from "./draft-types";
import { surnameOf } from "./draft-types";

type ScorecardProps = {
  formation: Formation;
  benchSlots: BenchSlot[];
  xi: PickMap;
  bench: PickMap;
  attack: number;
  defense: number;
  balance: number;
  overall: number;
  showRatings: boolean;
};

export function Scorecard({
  formation,
  benchSlots,
  xi,
  bench,
  attack,
  defense,
  balance,
  overall,
  showRatings,
}: ScorecardProps) {
  const filled = formation.slots.filter((slot) => xi[slot.id]).length;
  const benchFilled = benchSlots.filter((slot) => bench[slot.id]).length;
  const hasPicks = filled > 0;

  return (
    <section className="rounded-[1.25rem] border border-[var(--border)] bg-black/25 p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-white">
          Scorecard · {filled}/{formation.slots.length}
        </h3>
        <span className="text-2xl font-bold text-white">{hasPicks && showRatings ? overall : "—"}</span>
      </div>

      <div className="mt-3 space-y-2">
        <Meter label="Attack" value={hasPicks && showRatings ? attack : null} tone="attack" />
        <Meter label="Defense" value={hasPicks && showRatings ? defense : null} tone="defense" />
        <Meter label="Balance" value={hasPicks && showRatings ? balance : null} tone="balance" />
      </div>

      <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
        Starting XI
      </p>
      <ul className="mt-2 space-y-1">
        {formation.slots.map((slot) => {
          const pick = xi[slot.id];
          return (
            <li
              key={slot.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs"
            >
              <span className="w-10 shrink-0 font-bold text-[var(--muted)]">{slot.position}</span>
              <span className="min-w-0 flex-1 truncate text-white">
                {pick ? `${pick.squad.flag} ${surnameOf(pick.player.name)}` : "—"}
              </span>
              <span className="shrink-0 font-semibold text-white/80">
                {pick && showRatings ? pick.player.rating : ""}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
        Bench · {benchFilled}/{benchSlots.length}
      </p>
      <ul className="mt-2 space-y-1">
        {benchSlots.map((slot) => {
          const pick = bench[slot.id];
          return (
            <li
              key={slot.id}
              className="flex items-center justify-between gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs"
            >
              <span className="w-10 shrink-0 font-bold text-[var(--muted)]">{slot.role}</span>
              <span className="min-w-0 flex-1 truncate text-white">
                {pick ? `${pick.squad.flag} ${surnameOf(pick.player.name)}` : "—"}
              </span>
              <span className="shrink-0 font-semibold text-white/80">
                {pick && showRatings ? pick.player.rating : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const toneColors: Record<string, string> = {
  attack: "bg-[var(--accent)]",
  defense: "bg-[#4d9de0]",
  balance: "bg-[#5fd08a]",
};

function Meter({ label, value, tone }: { label: string; value: number | null; tone: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        <span>{label}</span>
        <span className="text-white">{value ?? "—"}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${toneColors[tone]}`}
          style={{ width: `${value ?? 0}%` }}
        />
      </div>
    </div>
  );
}
