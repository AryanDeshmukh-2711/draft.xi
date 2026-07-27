"use client";

import { AnimatePresence, motion } from "motion/react";
import { CountUp } from "@/components/motion";
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
  const live = filled > 0 && showRatings;

  return (
    <section className="hud hud-rule p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Scorecard</p>
          <p className="tnum mt-1 text-sm font-bold text-[var(--accent)]">
            {filled}/{formation.slots.length} named
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Overall</p>
          <p className="tnum display text-4xl font-bold leading-none text-white">
            {live ? <CountUp value={overall} /> : "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <Meter label="Attack" value={live ? attack : null} color="var(--magenta)" />
        <Meter label="Defense" value={live ? defense : null} color="var(--cyan)" />
        <Meter label="Balance" value={live ? balance : null} color="var(--accent)" />
      </div>

      <SlotList
        title="Starting XI"
        rows={formation.slots.map((slot) => ({
          key: slot.id,
          tag: slot.position,
          pick: xi[slot.id],
        }))}
        showRatings={showRatings}
      />

      <SlotList
        title={`Bench · ${benchFilled}/${benchSlots.length}`}
        rows={benchSlots.map((slot) => ({
          key: slot.id,
          tag: slot.role,
          pick: bench[slot.id],
        }))}
        showRatings={showRatings}
      />
    </section>
  );
}

function SlotList({
  title,
  rows,
  showRatings,
}: {
  title: string;
  rows: Array<{ key: string; tag: string; pick?: PickMap[string] }>;
  showRatings: boolean;
}) {
  return (
    <>
      <p className="eyebrow mt-5">{title}</p>
      <ul className="mt-2 divide-y divide-[var(--border)] border-y border-[var(--border)]">
        {rows.map((row) => (
          <li key={row.key} className="flex items-center gap-2 py-1.5 text-xs">
            <span className="w-9 shrink-0 font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
              {row.tag}
            </span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={row.pick ? row.pick.player.id : "empty"}
                className={`min-w-0 flex-1 truncate ${row.pick ? "text-white" : "text-white/25"}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {row.pick ? `${row.pick.squad.flag} ${surnameOf(row.pick.player.name)}` : "—"}
              </motion.span>
            </AnimatePresence>
            <span className="tnum shrink-0 font-bold text-[var(--accent)]">
              {row.pick && showRatings ? row.pick.player.rating : ""}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

function Meter({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-[0.68rem] font-bold uppercase tracking-[0.14em]">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="tnum text-white">{value === null ? "—" : <CountUp value={value} />}</span>
      </div>
      <div className="seg-track mt-1.5">
        <motion.div
          className="h-full"
          style={{ background: color }}
          initial={false}
          animate={{ width: `${value ?? 0}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
