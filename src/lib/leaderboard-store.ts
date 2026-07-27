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

// Overall first, campaign finish as the tie-break.
function rank(entry: LeaderboardEntry) {
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
  await writeJsonFile(leaderboardFile, entries.slice(0, 1000));
  return entry;
}

const submissionWindowMs = 20_000;
const recentSubmissions = new Map<string, number>();

export function canSubmit(clientKey: string) {
  const now = Date.now();
  const last = recentSubmissions.get(clientKey) ?? 0;

  if (now - last < submissionWindowMs) return false;

  recentSubmissions.set(clientKey, now);
  if (recentSubmissions.size > 5000) recentSubmissions.clear();
  return true;
}
