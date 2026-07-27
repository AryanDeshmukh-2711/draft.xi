import { benchSlots, formations } from "./formations";
import { squads } from "./squads";
import type { Formation, Squad } from "./types";
import { createSeededRandom, pickRandom } from "./draft-utils";
import { readJsonFile, writeJsonFile } from "./server-json-store";

type SessionHistory = Record<string, string[]>;

const sessionHistoryFile = "session-history.json";

export type RollKind = "new" | "nation" | "year";

export function getFormations(): Formation[] {
  return formations;
}

export function getBenchSlots() {
  return benchSlots;
}

export function getSquadById(squadId: string) {
  return squads.find((squad) => squad.id === squadId) ?? null;
}

const playerIndex = new Map(squads.flatMap((squad) => squad.players.map((player) => [player.id, player])));

const playerSquadIndex = new Map(
  squads.flatMap((squad) => squad.players.map((player) => [player.id, squad] as const)),
);

export function getPlayerById(playerId: string) {
  return playerIndex.get(playerId) ?? null;
}

export function getSquadForPlayer(playerId: string) {
  return playerSquadIndex.get(playerId) ?? null;
}

export function getFormationById(formationId: string) {
  return formations.find((formation) => formation.id === formationId) ?? null;
}

function selectPool(kind: RollKind, current: Squad | null) {
  if (!current) return squads;

  if (kind === "nation") {
    const sameYear = squads.filter((squad) => squad.year === current.year && squad.nation !== current.nation);
    return sameYear.length > 0 ? sameYear : squads.filter((squad) => squad.nation !== current.nation);
  }

  if (kind === "year") {
    const sameNation = squads.filter((squad) => squad.nation === current.nation && squad.year !== current.year);
    return sameNation.length > 0 ? sameNation : squads.filter((squad) => squad.year !== current.year);
  }

  return squads.filter((squad) => squad.id !== current.id);
}

export async function getRandomSquad(
  sessionId: string,
  seed: number,
  kind: RollKind = "new",
  currentSquadId: string | null = null,
) {
  const random = createSeededRandom(seed);
  const history = await readJsonFile<SessionHistory>(sessionHistoryFile, {});
  const alreadyUsed = new Set(history[sessionId] ?? []);
  const current = currentSquadId ? getSquadById(currentSquadId) : null;

  const pool = selectPool(kind, current);
  const unused = pool.filter((squad) => !alreadyUsed.has(squad.id));
  const squad = pickRandom(unused.length > 0 ? unused : pool, random);

  history[sessionId] = [...alreadyUsed, squad.id];
  await writeJsonFile(sessionHistoryFile, history);

  return squad;
}

export async function resetSessionDraftHistory(sessionId: string) {
  const history = await readJsonFile<SessionHistory>(sessionHistoryFile, {});
  delete history[sessionId];
  await writeJsonFile(sessionHistoryFile, history);
}
