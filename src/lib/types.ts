export type Position =
  | "GK"
  | "RB"
  | "CB"
  | "LB"
  | "RWB"
  | "LWB"
  | "CDM"
  | "CM"
  | "CAM"
  | "RM"
  | "LM"
  | "RW"
  | "LW"
  | "ST";

export type PlayerAttributes = {
  attack: number;
  defense: number;
  passing: number;
  physical: number;
};

export type Player = PlayerAttributes & {
  id: string;
  number: number;
  name: string;
  /** Primary role first. */
  positions: Position[];
  rating: number;
};

export type Squad = {
  id: string;
  nation: string;
  code: string;
  flag: string;
  year: number;
  players: Player[];
};

/** x runs left to right, y from own goal (0) to the opposition goal (100). */
export type FormationSlot = {
  id: string;
  position: Position;
  x: number;
  y: number;
};

export type Formation = {
  id: string;
  name: string;
  description: string;
  slots: FormationSlot[];
};

export type BenchRole = "GK" | "DEF" | "MID" | "ATT" | "ANY";

export type BenchSlot = {
  id: string;
  role: BenchRole;
  label: string;
};

export type DraftMode = "classic" | "almanac";

export type DraftStyle = "defensive" | "balanced" | "attacking";

export type MatchReport = {
  round: string;
  opponent: string;
  scoreFor: number;
  scoreAgainst: number;
  outcome: "win" | "draw" | "loss";
  note: string;
  substitution: string | null;
};

export type DraftResult = {
  seed: number;
  overall: number;
  attack: number;
  defense: number;
  balance: number;
  benchStrength: number;
  goalsFor: number;
  goalsAgainst: number;
  scoreline: string;
  headline: string;
  summary: string;
  finish: string;
  matches: MatchReport[];
};
