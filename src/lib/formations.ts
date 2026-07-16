import type { Formation } from "./types";

export const formations: Formation[] = [
  {
    id: "4-3-3",
    name: "4-3-3",
    slots: ["GK", "RB", "CB", "CB", "LB", "CM", "CM", "CM", "RW", "ST", "LW"],
  },
  {
    id: "4-4-2",
    name: "4-4-2",
    slots: ["GK", "RB", "CB", "CB", "LB", "RM", "CM", "CM", "LM", "ST", "ST"],
  },
  {
    id: "4-2-3-1",
    name: "4-2-3-1",
    slots: ["GK", "RB", "CB", "CB", "LB", "CDM", "CDM", "RW", "CAM", "LW", "ST"],
  },
  {
    id: "4-3-2-1",
    name: "4-3-2-1",
    slots: ["GK", "RB", "CB", "CB", "LB", "CM", "CM", "CM", "CAM", "CAM", "ST"],
  },
  {
    id: "3-5-2",
    name: "3-5-2",
    slots: ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "CM", "LM", "ST", "ST"],
  },
  {
    id: "5-3-2",
    name: "5-3-2",
    slots: ["GK", "RB", "CB", "CB", "CB", "LB", "CM", "CM", "CM", "ST", "ST"],
  },
  {
    id: "3-4-3",
    name: "3-4-3",
    slots: ["GK", "CB", "CB", "CB", "RM", "CM", "CM", "LM", "RW", "ST", "LW"],
  },
];

export function getFormationById(formationId: string) {
  return formations.find((formation) => formation.id === formationId) ?? formations[0];
}
