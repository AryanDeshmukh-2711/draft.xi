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
  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.5rem] border border-[rgba(255,255,255,0.16)] bg-[linear-gradient(180deg,#1f6b3f_0%,#1a5d37_45%,#15522f_100%)] sm:aspect-[4/5]">
      <PitchMarkings />

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
            className={`absolute z-10 flex w-[19%] min-w-[52px] -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-center transition ${
              isTarget
                ? "bg-[rgba(255,107,53,0.28)] ring-2 ring-[var(--accent)]"
                : isEligible
                  ? "bg-[rgba(255,255,255,0.16)] ring-1 ring-[rgba(255,255,255,0.55)]"
                  : "hover:bg-white/10"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-[0.7rem] font-bold sm:h-11 sm:w-11 sm:text-sm ${
                pick
                  ? "border-white/70 bg-[rgba(6,20,12,0.85)] text-white"
                  : "border-dashed border-white/55 bg-black/20 text-white/70"
              }`}
            >
              {pick ? pick.player.number : slot.position}
            </span>

            <span className="max-w-full truncate text-[0.6rem] font-semibold leading-tight text-white drop-shadow sm:text-[0.7rem]">
              {pick ? surnameOf(pick.player.name) : "Open"}
            </span>

            {pick ? (
              <span className="text-[0.55rem] font-semibold text-white/80 sm:text-[0.65rem]">
                {pick.squad.flag} {showRatings ? pick.player.rating : pick.squad.year}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function PitchMarkings() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <div className="absolute inset-[3%] rounded-[0.75rem] border border-white/30" />
      <div className="absolute left-[3%] right-[3%] top-1/2 h-px bg-white/30" />
      <div className="absolute left-1/2 top-1/2 h-[16%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />
      <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/50" />
      <div className="absolute bottom-[3%] left-1/2 h-[15%] w-[52%] -translate-x-1/2 border-x border-t border-white/30" />
      <div className="absolute bottom-[3%] left-1/2 h-[6%] w-[26%] -translate-x-1/2 border-x border-t border-white/30" />
      <div className="absolute top-[3%] left-1/2 h-[15%] w-[52%] -translate-x-1/2 border-x border-b border-white/30" />
      <div className="absolute top-[3%] left-1/2 h-[6%] w-[26%] -translate-x-1/2 border-x border-b border-white/30" />
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, #ffffff 0 8%, transparent 8% 16%)",
        }}
      />
    </div>
  );
}
