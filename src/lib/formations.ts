import type { BenchSlot, Formation, FormationSlot, Position } from "./types";

function slot(id: string, position: Position, x: number, y: number): FormationSlot {
  return { id, position, x, y };
}

const keeper = slot("gk", "GK", 50, 6);

export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    description: "Width from the wingers, three central midfielders holding the middle.",
    slots: [
      keeper,
      slot("rb", "RB", 84, 26),
      slot("cb-r", "CB", 62, 21),
      slot("cb-l", "CB", 38, 21),
      slot("lb", "LB", 16, 26),
      slot("cm-r", "CM", 71, 50),
      slot("cm-c", "CM", 50, 44),
      slot("cm-l", "CM", 29, 50),
      slot("rw", "RW", 82, 78),
      slot("st", "ST", 50, 86),
      slot("lw", "LW", 18, 78),
    ],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    description: "Two banks of four and a strike partnership. The safest shape to draft.",
    slots: [
      keeper,
      slot("rb", "RB", 84, 26),
      slot("cb-r", "CB", 62, 21),
      slot("cb-l", "CB", 38, 21),
      slot("lb", "LB", 16, 26),
      slot("rm", "RM", 84, 52),
      slot("cm-r", "CM", 61, 48),
      slot("cm-l", "CM", 39, 48),
      slot("lm", "LM", 16, 52),
      slot("st-r", "ST", 62, 84),
      slot("st-l", "ST", 38, 84),
    ],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    description: "A double pivot behind a creative three. Rewards a real number ten.",
    slots: [
      keeper,
      slot("rb", "RB", 84, 26),
      slot("cb-r", "CB", 62, 21),
      slot("cb-l", "CB", 38, 21),
      slot("lb", "LB", 16, 26),
      slot("cdm-r", "CDM", 62, 42),
      slot("cdm-l", "CDM", 38, 42),
      slot("rw", "RW", 83, 68),
      slot("cam", "CAM", 50, 66),
      slot("lw", "LW", 17, 68),
      slot("st", "ST", 50, 88),
    ],
  },
  {
    id: "4-2-4",
    name: "4-2-4",
    description: "Two midfielders and four forwards. All the attack, none of the cover.",
    slots: [
      keeper,
      slot("rb", "RB", 84, 26),
      slot("cb-r", "CB", 62, 21),
      slot("cb-l", "CB", 38, 21),
      slot("lb", "LB", 16, 26),
      slot("cm-r", "CM", 63, 48),
      slot("cm-l", "CM", 37, 48),
      slot("rw", "RW", 85, 80),
      slot("st-r", "ST", 61, 86),
      slot("st-l", "ST", 39, 86),
      slot("lw", "LW", 15, 80),
    ],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    description: "Wing-backs supply the width, three centre-backs hold the base.",
    slots: [
      keeper,
      slot("cb-r", "CB", 68, 21),
      slot("cb-c", "CB", 50, 19),
      slot("cb-l", "CB", 32, 21),
      slot("rwb", "RWB", 88, 50),
      slot("cm-r", "CM", 66, 48),
      slot("cdm", "CDM", 50, 40),
      slot("cm-l", "CM", 34, 48),
      slot("lwb", "LWB", 12, 50),
      slot("st-r", "ST", 61, 84),
      slot("st-l", "ST", 39, 84),
    ],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    description: "A back five that absorbs pressure and springs two strikers.",
    slots: [
      keeper,
      slot("rb", "RB", 87, 28),
      slot("cb-r", "CB", 67, 21),
      slot("cb-c", "CB", 50, 19),
      slot("cb-l", "CB", 33, 21),
      slot("lb", "LB", 13, 28),
      slot("cm-r", "CM", 66, 52),
      slot("cm-c", "CM", 50, 46),
      slot("cm-l", "CM", 34, 52),
      slot("st-r", "ST", 61, 84),
      slot("st-l", "ST", 39, 84),
    ],
  },
  {
    id: "4-5-1",
    name: "4-5-1",
    description: "A packed midfield and a lone striker. Hard to beat, hard to score with.",
    slots: [
      keeper,
      slot("rb", "RB", 84, 26),
      slot("cb-r", "CB", 62, 21),
      slot("cb-l", "CB", 38, 21),
      slot("lb", "LB", 16, 26),
      slot("rm", "RM", 86, 56),
      slot("cm-r", "CM", 66, 50),
      slot("cdm", "CDM", 50, 42),
      slot("cm-l", "CM", 34, 50),
      slot("lm", "LM", 14, 56),
      slot("st", "ST", 50, 86),
    ],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    description: "A back three and a front three. High risk, high reward on the counter.",
    slots: [
      keeper,
      slot("cb-r", "CB", 68, 21),
      slot("cb-c", "CB", 50, 19),
      slot("cb-l", "CB", 32, 21),
      slot("rm", "RM", 86, 50),
      slot("cm-r", "CM", 62, 46),
      slot("cm-l", "CM", 38, 46),
      slot("lm", "LM", 14, 50),
      slot("rw", "RW", 80, 80),
      slot("st", "ST", 50, 86),
      slot("lw", "LW", 20, 80),
    ],
  },
];

// A tournament matchday bench: reserve keeper, cover in each third, one free slot.
export const benchSlots: BenchSlot[] = [
  { id: "bench-gk", role: "GK", label: "Reserve GK" },
  { id: "bench-def-1", role: "DEF", label: "Defensive cover" },
  { id: "bench-def-2", role: "DEF", label: "Defensive cover" },
  { id: "bench-mid-1", role: "MID", label: "Midfield cover" },
  { id: "bench-mid-2", role: "MID", label: "Midfield cover" },
  { id: "bench-att-1", role: "ATT", label: "Attacking cover" },
  { id: "bench-flex", role: "ANY", label: "Impact sub" },
];

export function getFormationById(formationId: string) {
  return formations.find((formation) => formation.id === formationId) ?? formations[0];
}
