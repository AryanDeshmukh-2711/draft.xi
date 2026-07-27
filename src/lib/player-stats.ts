import { getSquadForPlayer } from "./draft-store";
import { readJsonFile, writeJsonFile } from "./server-json-store";
import type { ResolvedSelection } from "./simulation-request";
import type { DraftResult, Position } from "./types";

export type PlayerRecord = {
  playerId: string;
  name: string;
  number: number;
  positions: Position[];
  baseRating: number;
  nation: string;
  flag: string;
  year: number;
  drafts: number;
  starts: number;
  benchCalls: number;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  titles: number;
  finals: number;
  points: number;
  updatedAt: string;
};

export type RankedPlayer = PlayerRecord & {
  rank: number;
  averagePoints: number;
  winRate: number;
  form: number;
  currentRating: number;
};

type StatsFile = {
  runs: string[];
  players: Record<string, PlayerRecord>;
};

const statsFile = "player-stats.json";
const emptyStats: StatsFile = { runs: [], players: {} };

const finishBonus: Record<string, number> = {
  "World Champions": 30,
  "Runners-up": 18,
  "Out in the semi-final": 12,
  "Out in the quarter-final": 7,
  "Out in the round of 16": 4,
  "Group stage exit": 0,
};

// A bench player shares in the run, but not on equal terms with a starter.
const benchShare = 0.45;

// Roughly a semi-final campaign. Above it a player trends up, below it down.
const formBaseline = 35;

function runIdFor(selection: ResolvedSelection) {
  const ids = [
    ...selection.xi.map((entry) => entry.player.id),
    ...selection.bench.map((entry) => entry.player.id),
  ].sort();

  const key = `${selection.formation.id}|${selection.style}|${selection.seed}|${ids.join(",")}`;

  let hash = 5381;
  for (let index = 0; index < key.length; index += 1) {
    hash = ((hash << 5) + hash + key.charCodeAt(index)) | 0;
  }
  return `${hash.toString(36)}-${ids.length}-${selection.seed}`;
}

function blankRecord(playerId: string): PlayerRecord | null {
  const squad = getSquadForPlayer(playerId);
  const player = squad?.players.find((entry) => entry.id === playerId);
  if (!squad || !player) return null;

  return {
    playerId,
    name: player.name,
    number: player.number,
    positions: player.positions,
    baseRating: player.rating,
    nation: squad.nation,
    flag: squad.flag,
    year: squad.year,
    drafts: 0,
    starts: 0,
    benchCalls: 0,
    matches: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    titles: 0,
    finals: 0,
    points: 0,
    updatedAt: new Date().toISOString(),
  };
}

function scoreTournament(result: DraftResult) {
  const wins = result.matches.filter((match) => match.outcome === "win").length;
  const draws = result.matches.filter((match) => match.outcome === "draw").length;
  const losses = result.matches.filter((match) => match.outcome === "loss").length;

  const points =
    result.matches.length * 2 + wins * 3 + draws + (finishBonus[result.finish] ?? 0);

  return { wins, draws, losses, points };
}

export function formFor(record: PlayerRecord) {
  if (record.drafts === 0) return 0;
  const average = record.points / record.drafts;
  return Math.max(-6, Math.min(6, Math.round((average - formBaseline) / 4.5)));
}

/**
 * Folds one finished campaign into every player's record. Simulating the same
 * draft twice is a no-op, so a refresh cannot inflate a player's ranking.
 */
export async function recordTournament(selection: ResolvedSelection, result: DraftResult) {
  const runId = runIdFor(selection);
  const stats = await readJsonFile<StatsFile>(statsFile, emptyStats);

  if (stats.runs.includes(runId)) return { recorded: false };

  const { wins, draws, losses, points } = scoreTournament(result);
  const isChampion = result.finish === "World Champions";
  const reachedFinal = isChampion || result.finish === "Runners-up";

  const apply = (playerId: string, share: number) => {
    const record = stats.players[playerId] ?? blankRecord(playerId);
    if (!record) return;

    record.drafts += 1;
    if (share === 1) record.starts += 1;
    else record.benchCalls += 1;

    record.matches += result.matches.length;
    record.wins += wins;
    record.draws += draws;
    record.losses += losses;
    record.goalsFor += result.goalsFor;
    record.goalsAgainst += result.goalsAgainst;
    if (isChampion) record.titles += 1;
    if (reachedFinal) record.finals += 1;
    record.points += Math.round(points * share);
    record.updatedAt = new Date().toISOString();

    stats.players[playerId] = record;
  };

  for (const entry of selection.xi) apply(entry.player.id, 1);
  for (const entry of selection.bench) apply(entry.player.id, benchShare);

  stats.runs.push(runId);
  if (stats.runs.length > 5000) stats.runs = stats.runs.slice(-5000);

  await writeJsonFile(statsFile, stats);
  return { recorded: true };
}

function rankRecords(records: PlayerRecord[]): RankedPlayer[] {
  return records
    .map((record) => {
      const form = formFor(record);
      return {
        ...record,
        rank: 0,
        averagePoints: record.drafts > 0 ? Math.round((record.points / record.drafts) * 10) / 10 : 0,
        winRate: record.matches > 0 ? Math.round((record.wins / record.matches) * 100) : 0,
        form,
        currentRating: Math.max(1, Math.min(99, record.baseRating + form)),
      };
    })
    .sort((left, right) => {
      if (right.points !== left.points) return right.points - left.points;
      if (right.averagePoints !== left.averagePoints) return right.averagePoints - left.averagePoints;
      return right.baseRating - left.baseRating;
    })
    .map((record, index) => ({ ...record, rank: index + 1 }));
}

export async function listPlayerRankings(limit = 100) {
  const stats = await readJsonFile<StatsFile>(statsFile, emptyStats);
  return rankRecords(Object.values(stats.players)).slice(0, limit);
}

export async function getPlayerFormMap() {
  const stats = await readJsonFile<StatsFile>(statsFile, emptyStats);
  const map: Record<string, number> = {};

  for (const record of Object.values(stats.players)) {
    const form = formFor(record);
    if (form !== 0) map[record.playerId] = form;
  }

  return map;
}

export async function getTournamentCount() {
  const stats = await readJsonFile<StatsFile>(statsFile, emptyStats);
  return stats.runs.length;
}
