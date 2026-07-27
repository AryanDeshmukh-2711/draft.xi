"use client";

import type { Formation } from "@/lib/types";
import type { PickMap, SlotTarget } from "./draft-types";
import { surnameOf } from "./draft-types";

type PitchProps = {
  formation: Formation;
  picks: PickMap;
  target: SlotTarget | null;
  eligibleSlotIds: Set<string>;
  showRatings: boolean;
  onSelectSlot: (slotId: string) => void;
};

export function Pitch({
  formation,
  picks,
  target,
  eligibleSlotIds,
  showRatings,
  onSelectSlot,
}: PitchProps) {
  const filled = formation.slots.filter((slot) => picks[slot.id]).length;

  return (
    <div className="hud hud-lit relative aspect-[3/4] w-full overflow-hidden bg-[var(--pitch-turf)] sm:aspect-[4/5]">
      <Turf />

      <div className="pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2">
        <span className="clip-tag bg-[var(--accent)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#04070d]">
          {formation.name}
        </span>
        <span className="tnum text-[0.7rem] font-bold text-[var(--accent)]">{filled}/11</span>
      </div>

      {formation.slots.map((slot) => {
        const pick = picks[slot.id];
        const isTarget = target?.kind === "xi" && target.slotId === slot.id;
        const isEligible = eligibleSlotIds.has(slot.id);

        return (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelectSlot(slot.id)}
            aria-label={`${slot.position} slot${pick ? `, ${pick.player.name}` : ", open"}`}
            aria-pressed={isTarget}
            style={{ left: `${slot.x}%`, bottom: `${slot.y}%` }}
            className="absolute z-10 flex w-[19%] min-w-[54px] -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 px-0.5 py-1 text-center outline-none"
          >
            <span
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-[0.72rem] font-bold transition sm:h-12 sm:w-12 sm:text-sm ${
                isTarget ? "slot-active" : ""
              } ${
                pick
                  ? "border-[var(--accent)] bg-[rgba(0,224,138,0.16)] text-white shadow-[0_0_18px_-4px_var(--accent)]"
                  : isTarget
                    ? "border-[var(--accent)] bg-[rgba(0,224,138,0.1)] text-[var(--accent)]"
                    : isEligible
                      ? "border-[var(--cyan)] bg-[rgba(45,212,245,0.1)] text-[var(--cyan)]"
                      : "border-dashed border-white/25 bg-black/40 text-white/45"
              }`}
            >
              <span className="tnum">{pick ? pick.player.number : slot.position}</span>
            </span>

            <span
              className={`max-w-full truncate text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.04em] sm:text-[0.68rem] ${
                pick ? "text-white" : "text-white/40"
              }`}
            >
              {pick ? surnameOf(pick.player.name) : slot.position}
            </span>

            {pick ? (
              <span className="flex items-center gap-1 text-[0.55rem] font-semibold text-[var(--accent)] sm:text-[0.62rem]">
                <span>{pick.squad.flag}</span>
                <span className="tnum">{showRatings ? pick.player.rating : pick.squad.year}</span>
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function Turf() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {/* mown stripes */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(0,224,138,0.05) 0 9%, transparent 9% 18%)",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(4,7,13,0.85)_100%)]" />

      <div className="absolute inset-[4%] border border-[var(--pitch-line)]" />
      <div className="absolute left-[4%] right-[4%] top-1/2 h-px bg-[var(--pitch-line)]" />
      <div className="absolute left-1/2 top-1/2 h-[15%] w-[21%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--pitch-line)]" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)]" />

      <div className="absolute bottom-[4%] left-1/2 h-[14%] w-[50%] -translate-x-1/2 border-x border-t border-[var(--pitch-line)]" />
      <div className="absolute bottom-[4%] left-1/2 h-[6%] w-[25%] -translate-x-1/2 border-x border-t border-[var(--pitch-line)]" />
      <div className="absolute top-[4%] left-1/2 h-[14%] w-[50%] -translate-x-1/2 border-x border-b border-[var(--pitch-line)]" />
      <div className="absolute top-[4%] left-1/2 h-[6%] w-[25%] -translate-x-1/2 border-x border-b border-[var(--pitch-line)]" />

      <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(0,224,138,0.07),transparent)]" />
    </div>
  );
}
