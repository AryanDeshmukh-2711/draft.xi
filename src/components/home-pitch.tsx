"use client";

import { motion } from "motion/react";
import { PitchSurface } from "@/components/pitch-surface";
import { getFormationById } from "@/lib/formations";

/**
 * An all-time XI laid out on the same 4-3-3 the draft uses, so the home page
 * shows the board people will actually play on.
 */
const lineup: Record<string, { number: number; name: string; flag: string; year: number }> = {
  gk: { number: 1, name: "Neuer", flag: "🇩🇪", year: 2014 },
  rb: { number: 4, name: "C. Alberto", flag: "🇧🇷", year: 1970 },
  "cb-r": { number: 5, name: "Beckenbauer", flag: "🇩🇪", year: 1974 },
  "cb-l": { number: 6, name: "Moore", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", year: 1970 },
  lb: { number: 6, name: "R. Carlos", flag: "🇧🇷", year: 2002 },
  "cm-r": { number: 8, name: "Gérson", flag: "🇧🇷", year: 1970 },
  "cm-c": { number: 10, name: "Maradona", flag: "🇦🇷", year: 1986 },
  "cm-l": { number: 14, name: "Cruyff", flag: "🇳🇱", year: 1974 },
  rw: { number: 10, name: "Messi", flag: "🇦🇷", year: 2022 },
  st: { number: 9, name: "Ronaldo", flag: "🇧🇷", year: 2002 },
  lw: { number: 10, name: "Pelé", flag: "🇧🇷", year: 1970 },
};

export function HomePitch() {
  const formation = getFormationById("4-3-3");

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden border border-[var(--border)] bg-[var(--pitch-turf)] sm:aspect-[1/1] lg:aspect-[4/5]">
      <PitchSurface />

      {formation.slots.map((slot, index) => {
        const player = lineup[slot.id];
        if (!player) return null;

        return (
          <motion.div
            key={slot.id}
            style={{ left: `${slot.x}%`, bottom: `${slot.y}%` }}
            className="absolute z-10 flex w-[19%] min-w-[52px] -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 text-center"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.25 + index * 0.07,
            }}
          >
            <span className="tnum flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[rgba(0,224,138,0.16)] text-[0.7rem] font-bold text-white shadow-[0_0_18px_-4px_var(--accent)] sm:h-10 sm:w-10">
              {player.number}
            </span>
            <span className="max-w-full truncate text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.04em] text-white sm:text-[0.66rem]">
              {player.name}
            </span>
            <span className="flex items-center gap-1 text-[0.52rem] font-semibold text-[var(--accent)] sm:text-[0.6rem]">
              <span>{player.flag}</span>
              <span className="tnum">{player.year}</span>
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
