import { formations } from "./formations";
import { squads } from "./squads";
import type { Formation, Player } from "./types";
import { createSeededRandom, pickRandom } from "./draft-utils";
import { readJsonFile, writeJsonFile } from "./server-json-store";

type SessionHistory = Record<string, string[]>;

const sessionHistoryFile = "session-history.json";

export function getFormations(): Formation[] {
  return formations;
}

export function getSquadById(squadId: string) {
  return squads.find((squad) => squad.id === squadId) ?? null;
}

export function getFormationById(formationId: string) {
  return formations.find((formation) => formation.id === formationId) ?? null;
}

export async function getRandomSquad(sessionId: string, seed: number) {
  const random = createSeededRandom(seed);
  const history = await readJsonFile<SessionHistory>(sessionHistoryFile, {});
  const alreadyUsed = new Set(history[sessionId] ?? []);
  const available = squads.filter((squad) => !alreadyUsed.has(squad.id));
  const pool = available.length > 0 ? available : squads;
  const squad = pickRandom(pool, random);

  history[sessionId] = [...alreadyUsed, squad.id];
  await writeJsonFile(sessionHistoryFile, history);

  return squad;
}

export async function resetSessionDraftHistory(sessionId: string) {
  const history = await readJsonFile<SessionHistory>(sessionHistoryFile, {});
  delete history[sessionId];
  await writeJsonFile(sessionHistoryFile, history);
}

export function pickPlayerForSlot(players: Player[], slot: string) {
  return players.find((player) => player.position === slot) ?? null;
}
