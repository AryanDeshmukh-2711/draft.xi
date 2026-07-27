"use client";

import type { BenchSlot } from "@/lib/types";
import type { PickMap, SlotTarget } from "./draft-types";
import { surnameOf } from "./draft-types";

type BenchStripProps = {
  slots: BenchSlot[];
  picks: PickMap;
  target: SlotTarget | null;
  eligibleSlotIds: Set<string>;
  placing: boolean;
  showRatings: boolean;
  onSelectSlot: (slotId: string) => void;
  onClearSlot: (slotId: string) => void;
};

export function BenchStrip({
  slots,
  picks,
  target,
  eligibleSlotIds,
  placing,
  showRatings,
  onSelectSlot,
  onClearSlot,
}: BenchStripProps) {
  const filled = slots.filter((slot) => picks[slot.id]).length;

  return (
    <section className="hud hud-rule p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="display text-sm font-bold uppercase tracking-[0.18em] text-white">
          Substitutes
        </h3>
        <span className="tnum text-xs font-bold text-[var(--accent)]">
          {filled}/{slots.length}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-1.5 sm:grid-cols-7">
        {slots.map((slot) => {
          const pick = picks[slot.id];
          const isTarget = target?.kind === "bench" && target.slotId === slot.id;
          const isEligible = eligibleSlotIds.has(slot.id);
          const muted = placing && !isEligible;

          return (
            <div key={slot.id} className="relative">
              <button
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                aria-label={`${slot.label}${pick ? `, ${pick.player.name}` : ", open"}${
                  placing && isEligible ? " — available for the selected player" : ""
                }`}
                aria-pressed={isTarget}
                className={`clip-btn flex w-full flex-col items-center gap-1 border px-1 py-2 text-center transition ${
                  muted ? "opacity-35" : ""
                } ${
                  placing && isEligible
                    ? "slot-active border-[var(--accent)] bg-[rgba(0,224,138,0.24)]"
                    : isTarget
                      ? "border-[var(--accent)] bg-[rgba(0,224,138,0.14)]"
                      : isEligible
                        ? "border-[var(--cyan)] bg-[rgba(45,212,245,0.08)]"
                        : "border-[var(--border)] bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                  {slot.role}
                </span>
                <span
                  className={`tnum flex h-8 w-8 items-center justify-center rounded-full border text-[0.7rem] font-bold ${
                    pick
                      ? "border-[var(--accent)] bg-[rgba(0,224,138,0.14)] text-white"
                      : "border-dashed border-white/25 text-white/40"
                  }`}
                >
                  {pick ? pick.player.number : "+"}
                </span>
                <span
                  className={`w-full truncate text-[0.6rem] font-semibold uppercase tracking-[0.03em] ${
                    pick ? "text-white" : "text-white/35"
                  }`}
                >
                  {pick ? surnameOf(pick.player.name) : slot.label}
                </span>
                {pick ? (
                  <span className="flex items-center gap-1 text-[0.55rem] font-semibold text-[var(--accent)]">
                    <span>{pick.squad.flag}</span>
                    <span className="tnum">
                      {showRatings ? pick.player.rating : pick.squad.year}
                    </span>
                  </span>
                ) : null}
              </button>

              {pick ? (
                <button
                  type="button"
                  onClick={() => onClearSlot(slot.id)}
                  aria-label={`Remove ${pick.player.name} from the bench`}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-xs leading-none text-[var(--muted)] transition hover:border-[var(--magenta)] hover:text-[var(--magenta)]"
                >
                  ×
                </button>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
        Optional, but a squad with nobody to bring on fades in the knockout rounds.
      </p>
    </section>
  );
}
