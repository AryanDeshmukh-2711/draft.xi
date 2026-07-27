"use client";

import { motion } from "motion/react";

export type Phase = "setup" | "drafting" | "bench" | "kickoff" | "result";

type PhaseBarProps = {
  phase: Phase;
  xiFilled: number;
  xiTotal: number;
  benchFilled: number;
  benchTotal: number;
  rerollsLeft: number;
  prompt: string;
};

const steps: Array<{ id: Phase; label: string }> = [
  { id: "setup", label: "Set up" },
  { id: "drafting", label: "Draft the XI" },
  { id: "bench", label: "Name a bench" },
  { id: "result", label: "Campaign" },
];

const order: Record<Phase, number> = { setup: 0, drafting: 1, bench: 2, kickoff: 2, result: 3 };

export function PhaseBar({
  phase,
  xiFilled,
  xiTotal,
  benchFilled,
  benchTotal,
  rerollsLeft,
  prompt,
}: PhaseBarProps) {
  const current = order[phase];
  const progress = phase === "result" ? 100 : (xiFilled / xiTotal) * 100;

  return (
    <section className="hud hud-rule p-4">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <ol className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-2">
          {steps.map((step, index) => {
            const state = index < current ? "done" : index === current ? "active" : "todo";

            return (
              <li key={step.id} className="flex items-center gap-2">
                <span
                  className={`tnum flex h-6 w-6 items-center justify-center rounded-full border text-[0.65rem] font-bold transition ${
                    state === "done"
                      ? "border-[var(--accent)] bg-[var(--accent)] text-[#04070d]"
                      : state === "active"
                        ? "slot-active border-[var(--accent)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                >
                  {state === "done" ? "✓" : index + 1}
                </span>
                <span
                  className={`text-[0.7rem] font-bold uppercase tracking-[0.12em] ${
                    state === "todo" ? "text-[var(--muted)]" : "text-white"
                  }`}
                >
                  {step.label}
                </span>
                {index < steps.length - 1 ? (
                  <span className="mx-1 hidden h-px w-6 bg-[var(--border)] sm:block" />
                ) : null}
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-4 text-[0.7rem] font-bold uppercase tracking-[0.12em]">
          <span className="text-[var(--muted)]">
            XI <span className="tnum text-white">{xiFilled}/{xiTotal}</span>
          </span>
          <span className="text-[var(--muted)]">
            Bench <span className="tnum text-white">{benchFilled}/{benchTotal}</span>
          </span>
          <span className="text-[var(--muted)]">
            Rerolls <span className="tnum text-[var(--accent)]">{rerollsLeft}</span>
          </span>
        </div>
      </div>

      <div className="seg-track mt-3.5">
        <motion.div
          className="h-full bg-[var(--accent)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="mt-3 text-sm text-white">
        <span className="mr-2 text-[var(--accent)]">▸</span>
        {prompt}
      </p>
    </section>
  );
}
