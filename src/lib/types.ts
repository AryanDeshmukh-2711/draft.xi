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
  /** Shirt number worn in that tournament. */
  number: number;
  name: string;
  /** Primary position first, then the roles the player also covered. */
  positions: Position[];
  rating: number;
};

export type Squad = {
  id: string;
  nation: string;
  code: string;
  /** Flag emoji used on the draw card. */
  flag: string;
  year: number;
  players: Player[];
};

/**
 * A slot on the pitch. `x` runs left to right and `y` runs from own goal
 * (0) to the opposition goal (100), so a formation can be drawn without a
 * separate row-count table.
 */
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

/** A bench slot only constrains the broad role, the way a manager's bench does. */
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
  /** Substitution the bench forced during the match, if any. */
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
