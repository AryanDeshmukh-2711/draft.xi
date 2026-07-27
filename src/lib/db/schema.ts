import {
  boolean,
  pgEnum,
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  uuid,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const positionEnum = pgEnum("position_enum", [
  "GK",
  "RB",
  "CB",
  "LB",
  "RWB",
  "LWB",
  "CDM",
  "CM",
  "CAM",
  "RM",
  "LM",
  "RW",
  "LW",
  "ST",
]);

export const modeEnum = pgEnum("draft_mode_enum", ["classic", "almanac"]);

export const styleEnum = pgEnum("draft_style_enum", ["defensive", "balanced", "attacking"]);

export const nations = pgTable("nations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  flag: text("flag"),
  flagAsset: text("flag_asset"),
}, (table) => ({
  codeIndex: uniqueIndex("nations_code_idx").on(table.code),
}));

export const squads = pgTable(
  "squads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    nationId: uuid("nation_id").notNull(),
    tournamentYear: integer("tournament_year").notNull(),
    meta: jsonb("meta").notNull().default({}),
    datasetVersion: text("dataset_version").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  },
  (table) => ({
    nationYearIndex: uniqueIndex("squads_nation_year_idx").on(table.nationId, table.tournamentYear),
  }),
);

export const players = pgTable("players", {
  id: uuid("id").defaultRandom().primaryKey(),
  squadId: uuid("squad_id").notNull(),
  externalId: text("external_id").notNull(),
  shirtNumber: integer("shirt_number").notNull(),
  name: text("name").notNull(),
  /** Primary position, kept as an enum so it can be filtered on. */
  position: positionEnum("position").notNull(),
  /** Every role the player covered, primary first. */
  positions: jsonb("positions").notNull().default([]),
  rating: integer("rating").notNull(),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  passing: integer("passing").notNull(),
  physical: integer("physical").notNull(),
  imageAsset: text("image_asset"),
});

export const formations = pgTable("formations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slotList: jsonb("slot_list").notNull(),
});

export const draftSessions = pgTable("draft_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userSessionId: text("user_session_id").notNull(),
  formationId: uuid("formation_id").notNull(),
  mode: modeEnum("mode").notNull(),
  style: styleEnum("style").notNull().default("balanced"),
  datasetVersion: text("dataset_version").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const draftPicks = pgTable("draft_picks", {
  id: uuid("id").defaultRandom().primaryKey(),
  draftSessionId: uuid("draft_session_id").notNull(),
  squadId: uuid("squad_id").notNull(),
  playerId: uuid("player_id").notNull(),
  /** Formation slot id (`cb-r`) or bench slot id (`bench-def-1`). */
  slotId: text("slot_id").notNull(),
  position: positionEnum("position").notNull(),
  onBench: boolean("on_bench").notNull().default(false),
  turnNumber: integer("turn_number").notNull(),
});

export const simulationResults = pgTable("simulation_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  draftSessionId: uuid("draft_session_id").notNull(),
  seed: integer("seed").notNull(),
  outcomeJson: jsonb("outcome_json").notNull(),
  scoreSummary: text("score_summary").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const leaderboardEntries = pgTable("leaderboard_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  simulationResultId: uuid("simulation_result_id").notNull(),
  nickname: text("nickname").notNull(),
  overall: integer("overall").notNull(),
  attack: integer("attack").notNull(),
  defense: integer("defense").notNull(),
  benchStrength: integer("bench_strength").notNull().default(0),
  finish: text("finish").notNull(),
  score: text("score").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});
