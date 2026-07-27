"use client";

import { AnimatePresence, motion } from "motion/react";
import { PitchSurface } from "@/components/pitch-surface";
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
      <PitchSurface />

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
          <motion.button
            key={slot.id}
            type="button"
            onClick={() => onSelectSlot(slot.id)}
            aria-label={`${slot.position} slot${pick ? `, ${pick.player.name}` : ", open"}`}
            aria-pressed={isTarget}
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            style={{ left: `${slot.x}%`, bottom: `${slot.y}%` }}
            className="absolute z-10 flex w-[19%] min-w-[54px] -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 px-0.5 py-1 text-center outline-none"
          >
            <span
              className={`relative flex h-10 w-10 items-center justify-center rounded-full border text-[0.72rem] font-bold transition-colors sm:h-12 sm:w-12 sm:text-sm ${
                isTarget && !pick ? "slot-active" : ""
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
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={pick ? pick.player.id : "open"}
                  className="tnum"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.4 }}
                  transition={{ type: "spring", stiffness: 420, damping: 24 }}
                >
                  {pick ? pick.player.number : slot.position}
                </motion.span>
              </AnimatePresence>
            </span>

            <span
              className={`max-w-full truncate text-[0.6rem] font-semibold uppercase leading-tight tracking-[0.04em] sm:text-[0.68rem] ${
                pick ? "text-white" : "text-white/40"
              }`}
            >
              {pick ? surnameOf(pick.player.name) : "Open"}
            </span>

            <AnimatePresence>
              {pick ? (
                <motion.span
                  className="flex items-center gap-1 text-[0.55rem] font-semibold text-[var(--accent)] sm:text-[0.62rem]"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <span>{pick.squad.flag}</span>
                  <span className="tnum">{showRatings ? pick.player.rating : pick.squad.year}</span>
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
