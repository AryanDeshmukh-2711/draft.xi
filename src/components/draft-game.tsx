"use client";

import { useEffect, useMemo, useState } from "react";
import type { DraftMode, Formation, Player, Squad } from "@/lib/types";
import { isPlayerEligibleForSlot } from "@/lib/draft-utils";

type DraftState = {
  formationId: string;
  mode: DraftMode;
  seed: number;
  squad: Squad | null;
  usedSquads: string[];
  currentSlotIndex: number;
  xi: Array<Player | null>;
  rerollsLeft: number;
  result: {
    scoreline: string;
    headline: string;
    campaign: Array<{ round: string; result: string }>;
    strength: number;
  } | null;
  nickname: string;
  leaderboardMessage: string;
};

type FormationsResponse = { formations: Formation[] };
type SquadResponse = { squad: Squad };
type SimulationResponse = {
  result: {
    scoreline: string;
    headline: string;
    campaign: Array<{ round: string; result: string }>;
    strength: number;
  };
};

const sessionId = "draft-xi-session";

const pitchRowsByFormation: Record<string, number[]> = {
  "4-3-3": [4, 3, 3],
  "4-4-2": [4, 4, 2],
  "4-2-3-1": [4, 2, 3, 1],
  "4-3-2-1": [4, 3, 2, 1],
  "3-5-2": [3, 5, 2],
  "5-3-2": [5, 3, 2],
  "3-4-3": [3, 4, 3],
};

function getLivePerformanceRating(player: Player, tick: number, seed: number) {
  const swingSeed = `${player.id}-${tick}-${seed}`;
  let hash = 0;

  for (let index = 0; index < swingSeed.length; index += 1) {
    hash = (hash * 31 + swingSeed.charCodeAt(index)) % 9973;
  }

  const swing = (hash % 9) - 4;
  const momentum = Math.sin((tick + hash % 13) / 2.8) * 2;
  return Math.max(1, Math.min(99, Math.round(player.rating + swing + momentum)));
}

function getFormationRows(formationId: string, slots: Formation["slots"]) {
  const rowCounts = pitchRowsByFormation[formationId] ?? [4, 3, 3];
  const outfieldSlots = slots.slice(1);
  const rows: Array<Array<{ slot: Formation["slots"][number]; index: number }>> = [];
  let cursor = 0;

  for (const rowCount of rowCounts) {
    rows.push(
      outfieldSlots.slice(cursor, cursor + rowCount).map((slot, rowIndex) => ({
        slot,
        index: cursor + rowIndex + 1,
      })),
    );
    cursor += rowCount;
  }

  return rows;
}

function getNextOpenSlotIndex(xi: Array<Player | null>, startIndex: number) {
  for (let index = startIndex; index < xi.length; index += 1) {
    if (!xi[index]) return index;
  }

  for (let index = 0; index < startIndex; index += 1) {
    if (!xi[index]) return index;
  }

  return startIndex;
}

export function DraftGame() {
  const [formulations, setFormulations] = useState<Formation[]>([]);
  const [performanceTick, setPerformanceTick] = useState(0);
  const [state, setState] = useState<DraftState>({
    formationId: "4-3-3",
    mode: "classic",
    seed: 1,
    squad: null,
    usedSquads: [],
    currentSlotIndex: 0,
    xi: [],
    rerollsLeft: 2,
    result: null,
    nickname: "",
    leaderboardMessage: "",
  });

  const formation = useMemo(
    () => formulations.find((item) => item.id === state.formationId) ?? formulations[0],
    [formulations, state.formationId],
  );

  useEffect(() => {
    async function loadFormations() {
      const response = await fetch("/api/formations");
      const data = (await response.json()) as FormationsResponse;
      setFormulations(data.formations);
    }

    loadFormations();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setPerformanceTick((current) => current + 1);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  const activeFormation = formation;
  const formationRows = activeFormation ? getFormationRows(activeFormation.id, activeFormation.slots) : [];

  async function rollSquad() {
    const response = await fetch(`/api/squads/random?sessionId=${sessionId}&seed=${state.seed}`);
    const data = (await response.json()) as SquadResponse;
    setState((current) => ({
      ...current,
      squad: data.squad,
      result: null,
      leaderboardMessage: "",
      rerollsLeft: current.squad ? Math.max(0, current.rerollsLeft - 1) : current.rerollsLeft,
      usedSquads: current.usedSquads.includes(data.squad.id)
        ? current.usedSquads
        : [...current.usedSquads, data.squad.id],
    }));
  }

  function selectFormation(formationId: string) {
    const nextFormation = formulations.find((item) => item.id === formationId);
    if (!nextFormation) return;

    setState((current) => ({
      ...current,
      formationId,
      squad: null,
      result: null,
      currentSlotIndex: 0,
      xi: Array(nextFormation.slots.length).fill(null),
      rerollsLeft: 3,
      seed: current.seed + 1,
      leaderboardMessage: "",
    }));
  }

  async function pickPlayer(player: Player) {
    if (!activeFormation) return;
    const slot = activeFormation.slots[state.currentSlotIndex];
    if (!isPlayerEligibleForSlot(player, slot)) return;

    const nextXi = state.xi.map((currentPlayer) => (currentPlayer?.id === player.id ? null : currentPlayer));
    nextXi[state.currentSlotIndex] = player;
    const nextSlotIndex = getNextOpenSlotIndex(nextXi, state.currentSlotIndex + 1);

    setState((current) => ({
      ...current,
      xi: nextXi,
      currentSlotIndex: nextSlotIndex,
      seed: current.seed + 1,
    }));

    if (activeFormation && nextSlotIndex === activeFormation.slots.length) {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          xi: nextXi,
          formationId: activeFormation.id,
          seed: state.seed,
          performanceTick,
        }),
      });
      const data = (await response.json()) as SimulationResponse;
      setState((current) => ({ ...current, result: data.result }));
    }
  }

  async function submitLeaderboard() {
    if (!state.result || !activeFormation) return;

    const response = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: state.nickname,
        xi: state.xi.filter((player): player is Player => Boolean(player)),
        formationId: activeFormation.id,
        seed: state.seed,
        scoreline: state.result.scoreline,
        performanceTick,
      }),
    });

    const payload = (await response.json()) as { error?: string };
    setState((current) => ({
      ...current,
      leaderboardMessage: response.ok ? "Result submitted to the leaderboard." : payload.error ?? "Submission failed.",
    }));
  }

  async function copyResultSummary() {
    if (!state.result || !activeFormation) return;

    const summary = [
      `Draft XI ${activeFormation.name}`,
      `Scoreline: ${state.result.scoreline}`,
      `Headline: ${state.result.headline}`,
      `Strength: ${state.result.strength}`,
    ].join(" | ");

    await navigator.clipboard.writeText(summary);
    setState((current) => ({ ...current, leaderboardMessage: "Result summary copied." }));
  }

  const activeSlot = formation?.slots[state.currentSlotIndex] ?? null;
  const eligiblePlayers = state.squad?.players.filter((player) => activeSlot && isPlayerEligibleForSlot(player, activeSlot)) ?? [];
  const currentPitchPlayers = state.xi.map((player, index) => {
    if (!player) return null;

    return {
      player,
      liveRating: getLivePerformanceRating(player, performanceTick, state.seed + index),
    };
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Formation</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Draft XI core loop</h1>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-black/20 px-4 py-2 text-sm text-white">
            Rerolls left: {state.rerollsLeft}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {formulations.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectFormation(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                item.id === state.formationId
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-black/15 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={rollSquad}
              disabled={state.squad !== null && state.rerollsLeft === 0}
              className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {state.squad ? "Change team" : "Roll squad"}
            </button>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            The team changes randomly, and you can switch teams only three times per draft.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(180deg,#2f8a4e_0%,#257443_50%,#20663b_100%)] p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
          <div className="relative min-h-[640px] overflow-hidden rounded-[1.6rem] border border-[rgba(255,255,255,0.16)] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_28%,transparent_72%,rgba(255,255,255,0.04))] px-4 py-6">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[rgba(255,255,255,0.28)]" />
              <div className="absolute left-0 right-0 top-1/4 h-px bg-[rgba(255,255,255,0.14)]" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-[rgba(255,255,255,0.18)]" />
              <div className="absolute left-0 right-0 top-3/4 h-px bg-[rgba(255,255,255,0.14)]" />
              <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.26)]" />
              <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,255,255,0.35)]" />
              <div className="absolute left-[15%] top-0 h-[18%] w-[70%] rounded-b-[2rem] border-x border-b border-[rgba(255,255,255,0.24)]" />
              <div className="absolute left-[25%] top-0 h-[10%] w-[50%] rounded-b-[1.6rem] border-x border-b border-[rgba(255,255,255,0.24)]" />
              <div className="absolute left-[15%] bottom-0 h-[18%] w-[70%] rounded-t-[2rem] border-x border-t border-[rgba(255,255,255,0.24)]" />
              <div className="absolute left-[25%] bottom-0 h-[10%] w-[50%] rounded-t-[1.6rem] border-x border-t border-[rgba(255,255,255,0.24)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col justify-between gap-5">
              <div className="flex justify-center">
                {(() => {
                  const goalkeeper = currentPitchPlayers[0];
                  return (
                    <SlotPill
                      slotLabel={activeFormation?.slots[0] ?? "GK"}
                      player={goalkeeper?.player ?? null}
                      liveRating={goalkeeper?.liveRating ?? null}
                      isActive={state.currentSlotIndex === 0}
                      onClick={() => setState((current) => ({ ...current, currentSlotIndex: 0 }))}
                    />
                  );
                })()}
              </div>

              <div className="space-y-10">
                {formationRows.map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex items-center justify-center gap-4 sm:gap-6">
                    {row.map(({ slot, index }) => {
                      const pitchItem = currentPitchPlayers[index];
                      return (
                        <SlotPill
                          key={`${slot}-${index}`}
                          slotLabel={slot}
                          player={pitchItem?.player ?? null}
                          liveRating={pitchItem?.liveRating ?? null}
                          isActive={state.currentSlotIndex === index}
                          onClick={() => setState((current) => ({ ...current, currentSlotIndex: index }))}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <div className="rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(0,0,0,0.12)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/85">
                  {activeFormation?.name ?? "Formation"} pitch view
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={rollSquad}
            disabled={state.squad !== null && state.rerollsLeft === 0}
            className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            {state.squad ? "Change team" : "Roll squad"}
          </button>
          <div className="rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white">
            Team changes left: {state.rerollsLeft}
          </div>
        </div>

        {state.result ? (
          <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-black/20 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Simulation result</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">{state.result.headline}</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">Final scoreline: {state.result.scoreline}</p>
            <div className="mt-4 space-y-2 text-sm text-white/90">
              {state.result.campaign.map((item) => (
                <div key={item.round} className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3">
                  <span>{item.round}</span>
                  <span>{item.result}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyResultSummary}
                className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Copy summary
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <aside className="space-y-6">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Current squad</p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                {state.squad ? `${state.squad.nation} ${state.squad.year}` : "No squad rolled"}
              </h2>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-black/20 px-3 py-1 text-xs text-white">
              {state.mode === "classic" ? "Classic" : "Almanac"}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setState((current) => ({ ...current, mode: current.mode === "classic" ? "almanac" : "classic" }))}
              className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Toggle mode
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {state.squad?.players.map((player) => {
              const eligible = activeSlot ? isPlayerEligibleForSlot(player, activeSlot) : false;
              const liveRating = getLivePerformanceRating(player, performanceTick, state.seed);
              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => pickPlayer(player)}
                  disabled={!eligible}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    eligible
                      ? "border-[rgba(255,107,53,0.35)] bg-[rgba(255,107,53,0.12)] text-white hover:bg-[rgba(255,107,53,0.18)]"
                      : "border-[var(--border)] bg-white/5 text-[var(--muted)] opacity-60"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{player.name}</span>
                    <span className="block text-xs uppercase tracking-[0.22em]">{player.position}</span>
                    <span className="mt-1 block text-xs text-[var(--muted)]">
                      Base {player.rating} · Live {liveRating}
                    </span>
                  </span>
                  <span className="text-sm font-semibold">{state.mode === "classic" ? `${liveRating}` : "Hidden"}</span>
                </button>
              );
            })}
            {!state.squad ? <p className="text-sm text-[var(--muted)]">Roll a squad to see players.</p> : null}
          </div>

          {state.squad && eligiblePlayers.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted)]">No eligible player for the current slot.</p>
          ) : null}
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Draft summary</p>
          <div className="mt-4 space-y-3 text-sm text-white">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3">
              <span>Picked slots</span>
              <span>{state.xi.filter(Boolean).length}/{formation?.slots.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3">
              <span>Active slot</span>
              <span>{activeSlot ?? "None"}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3">
              <span>Used squads</span>
              <span>{state.usedSquads.length}</span>
            </div>
          </div>
          {state.result ? (
            <div className="mt-5 space-y-3 rounded-2xl border border-[var(--border)] bg-black/20 p-4">
              <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
                Leaderboard nickname
              </label>
              <input
                value={state.nickname}
                onChange={(event) => setState((current) => ({ ...current, nickname: event.target.value }))}
                placeholder="Anonymous"
                className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-[var(--muted)] focus:border-[rgba(255,107,53,0.5)]"
              />
              <button
                type="button"
                onClick={submitLeaderboard}
                className="w-full rounded-full bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Submit to leaderboard
              </button>
              {state.leaderboardMessage ? <p className="text-sm text-[var(--muted)]">{state.leaderboardMessage}</p> : null}
            </div>
          ) : null}
        </section>
      </aside>
    </div>
  );
}

function SlotPill({
  slotLabel,
  player,
  liveRating,
  isActive,
  onClick,
}: {
  slotLabel: string;
  player: Player | null;
  liveRating: number | null;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[84px] min-w-[84px] flex-col items-center justify-center rounded-full border-2 px-3 py-2 text-center shadow-lg backdrop-blur-sm transition ${
        isActive
          ? "border-[rgba(255,255,255,0.95)] bg-[rgba(255,255,255,0.18)] scale-105"
          : "border-[rgba(255,255,255,0.5)] bg-[rgba(0,0,0,0.18)]"
      }`}
    >
      <div className="text-[0.55rem] font-semibold uppercase tracking-[0.26em] text-white/75">{slotLabel}</div>
      <div className="mt-1 max-w-[92px] text-sm font-semibold leading-tight text-white drop-shadow-sm">
        {player ? player.name : "Open"}
      </div>
      <div className="mt-1 text-xs font-semibold text-white/90">
        {player ? `Form ${liveRating ?? player.rating}` : ""}
      </div>
    </button>
  );
}
