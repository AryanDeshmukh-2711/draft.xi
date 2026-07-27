"use client";

import type { BenchSlot } from "@/lib/types";
import type { PickMap, SlotTarget } from "./draft-types";
import { surnameOf } from "./draft-types";

type BenchStripProps = {
  slots: BenchSlot[];
  picks: PickMap;
  target: SlotTarget | null;
  eligibleSlotIds: Set<string>;
  showRatings: boolean;
  onSelectSlot: (slotId: string) => void;
  onClearSlot: (slotId: string) => void;
};

export function BenchStrip({
  slots,
  picks,
  target,
  eligibleSlotIds,
  showRatings,
  onSelectSlot,
  onClearSlot,
}: BenchStripProps) {
  const filled = slots.filter((slot) => picks[slot.id]).length;

  return (
    <section className="rounded-[1.25rem] border border-[var(--border)] bg-black/25 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-white">
          Substitutes bench
        </h3>
        <p className="text-xs text-[var(--muted)]">
          {filled}/{slots.length} named · optional, but the campaign is long
        </p>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {slots.map((slot) => {
          const pick = picks[slot.id];
          const isTarget = target?.kind === "bench" && target.slotId === slot.id;
          const isEligible = eligibleSlotIds.has(slot.id);

          return (
            <div key={slot.id} className="relative">
              <button
                type="button"
                onClick={() => onSelectSlot(slot.id)}
                aria-label={`${slot.label}${pick ? `, ${pick.player.name}` : ", open"}`}
                aria-pressed={isTarget}
                className={`flex w-full flex-col items-center gap-1 rounded-xl border px-1.5 py-2 text-center transition ${
                  isTarget
                    ? "border-[var(--accent)] bg-[rgba(255,107,53,0.2)]"
                    : isEligible
                      ? "border-white/50 bg-white/10"
                      : "border-[var(--border)] bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="text-[0.55rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  {slot.role}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-[0.7rem] font-bold ${
                    pick ? "border-white/60 bg-black/40 text-white" : "border-dashed border-white/40 text-white/50"
                  }`}
                >
                  {pick ? pick.player.number : "+"}
                </span>
                <span className="w-full truncate text-[0.6rem] font-semibold text-white">
                  {pick ? surnameOf(pick.player.name) : slot.label}
                </span>
                {pick ? (
                  <span className="text-[0.55rem] text-white/70">
                    {pick.squad.flag} {showRatings ? pick.player.rating : pick.squad.year}
                  </span>
                ) : null}
              </button>

              {pick ? (
                <button
                  type="button"
                  onClick={() => onClearSlot(slot.id)}
                  aria-label={`Remove ${pick.player.name} from the bench`}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-xs text-white/80 transition hover:text-white"
                >
                  ×
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
