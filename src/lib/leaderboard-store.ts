import { readJsonFile, writeJsonFile } from "./server-json-store";

export type LeaderboardEntry = {
  id: string;
  nickname: string;
  formationId: string;
  style: string;
  overall: number;
  attack: number;
  defense: number;
  benchStrength: number;
  scoreline: string;
  finish: string;
  headline: string;
  xi: string[];
  createdAt: string;
};

const leaderboardFile = "leaderboard.json";

function rank(entry: LeaderboardEntry) {
  // Overall first, then the campaign itself as the tie-break.
  const finishBonus = entry.finish === "World Champions" ? 6 : entry.finish === "Runners-up" ? 3 : 0;
  return entry.overall * 10 + finishBonus;
}

export async function listLeaderboardEntries(limit = 100) {
  const entries = await readJsonFile<LeaderboardEntry[]>(leaderboardFile, []);
  return [...entries].sort((left, right) => rank(right) - rank(left)).slice(0, limit);
}

export async function addLeaderboardEntry(entry: LeaderboardEntry) {
  const entries = await readJsonFile<LeaderboardEntry[]>(leaderboardFile, []);
  entries.unshift(entry);
  // Keep the file bounded; the page only ever shows the top 100.
  await writeJsonFile(leaderboardFile, entries.slice(0, 1000));
  return entry;
}

const submissionWindowMs = 20_000;
const recentSubmissions = new Map<string, number>();

/** Crude per-client throttle so the board cannot be spammed from one tab. */
export function canSubmit(clientKey: string) {
  const now = Date.now();
  const last = recentSubmissions.get(clientKey) ?? 0;

  if (now - last < submissionWindowMs) return false;

  recentSubmissions.set(clientKey, now);
  if (recentSubmissions.size > 5000) recentSubmissions.clear();
  return true;
}
