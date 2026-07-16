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

export type Player = {
  id: string;
  name: string;
  position: Position;
  rating: number;
  attack: number;
  defense: number;
  passing: number;
  physical: number;
};

export type Squad = {
  id: string;
  nation: string;
  code: string;
  year: number;
  players: Player[];
};

export type Formation = {
  id: string;
  name: string;
  slots: Position[];
};

export type DraftMode = "classic" | "almanac";
