type LeaderboardEntry = {
  id: string;
  nickname: string;
  scoreline: string;
  headline: string;
  strength: number;
  createdAt: string;
};

import { readJsonFile, writeJsonFile } from "./server-json-store";

const leaderboardFile = "leaderboard.json";

export async function listLeaderboardEntries() {
  const entries = await readJsonFile<LeaderboardEntry[]>(leaderboardFile, []);
  return [...entries].sort((left, right) => right.strength - left.strength).slice(0, 100);
}

export async function addLeaderboardEntry(entry: LeaderboardEntry) {
  const entries = await readJsonFile<LeaderboardEntry[]>(leaderboardFile, []);
  entries.unshift(entry);
  await writeJsonFile(leaderboardFile, entries);
  return entry;
}
