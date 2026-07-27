import type { DraftStyle, Formation } from "./types";

/**
 * How far each band of the pitch shifts, and how much wider the flanks sit.
 * A defensive side drops off and narrows; an attacking one pushes up and
 * stretches the pitch. The formation itself never changes — only where the
 * same eleven slots stand.
 */
const shapeByStyle: Record<DraftStyle, { back: number; middle: number; front: number; width: number }> = {
  defensive: { back: -4, middle: -10, front: -9, width: -5 },
  balanced: { back: 0, middle: 0, front: 0, width: 0 },
  attacking: { back: 7, middle: 10, front: 5, width: 5 },
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function applyStyleShape(formation: Formation, style: DraftStyle): Formation {
  const shape = shapeByStyle[style];
  if (shape.back === 0 && shape.middle === 0 && shape.front === 0 && shape.width === 0) {
    return formation;
  }

  return {
    ...formation,
    slots: formation.slots.map((slot) => {
      // The keeper stays on his line whatever the instructions are.
      if (slot.position === "GK") return slot;

      const band = slot.y <= 32 ? shape.back : slot.y <= 62 ? shape.middle : shape.front;

      // Only the genuinely wide players move sideways. Squeezing the centre
      // as well would push centre-backs on top of each other.
      let x = slot.x;
      if (slot.x >= 72) x = clamp(slot.x + shape.width, 10, 90);
      else if (slot.x <= 28) x = clamp(slot.x - shape.width, 10, 90);

      // Floor the outfield above the keeper so a deep block never crowds him.
      return { ...slot, x, y: clamp(slot.y + band, 18, 91) };
    }),
  };
}

export const styleShapeLabel: Record<DraftStyle, string> = {
  defensive: "Deep block, narrow flanks",
  balanced: "Even lines, standard width",
  attacking: "High line, stretched flanks",
};
