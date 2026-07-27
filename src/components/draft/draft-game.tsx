"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { isPlayerEligibleForBench, isPlayerEligibleForSlot } from "@/lib/draft-utils";
import { rateSquad } from "@/lib/simulation";
import type {
  BenchSlot,
  DraftMode,
  DraftResult,
  DraftStyle,
  Formation,
  Player,
  Squad,
} from "@/lib/types";
import { BenchStrip } from "./bench-strip";
import { Pitch } from "./pitch";
import { ResultPanel } from "./result-panel";
import { Scorecard } from "./scorecard";
import { SquadBoard } from "./squad-board";
import type { PickMap, SlotTarget, SquadMeta } from "./draft-types";
import { surnameOf } from "./draft-types";

type SetupResponse = {
  formations: Formation[];
  benchSlots: BenchSlot[];
  stats: { nations: number; squads: number; players: number };
};

const styles: Array<{ id: DraftStyle; label: string; hint: string }> = [
  { id: "defensive", label: "Defensive", hint: "Fewer goals at both ends. The spine carries the run." },
  { id: "balanced", label: "Balanced", hint: "Attack and defense weighted evenly." },
  { id: "attacking", label: "Attacking", hint: "More goals scored, more conceded. High variance." },
];

const modes: Array<{ id: DraftMode; label: string; hint: string }> = [
  { id: "classic", label: "Classic", hint: "Player strength is visible, so every pick has clear information." },
  { id: "almanac", label: "Almanac", hint: "Ratings are hidden. Draft from memory, era, and instinct." },
];

const totalRerolls = 3;
const storageKey = "draft-xi:session";

function newSeed() {
  return Math.floor(Math.random() * 2_000_000_000);
}

function toMeta(squad: Squad): SquadMeta {
  return { id: squad.id, nation: squad.nation, code: squad.code, flag: squad.flag, year: squad.year };
}

export function DraftGame() {
  const [setup, setSetup] = useState<SetupResponse | null>(null);

  const [formationId, setFormationId] = useState("4-3-3");
  const [style, setStyle] = useState<DraftStyle>("balanced");
  const [mode, setMode] = useState<DraftMode>("classic");

  const [squad, setSquad] = useState<Squad | null>(null);
  const [rerollsLeft, setRerollsLeft] = useState(totalRerolls);
  const [rolling, setRolling] = useState(false);

  const [xi, setXi] = useState<PickMap>({});
  const [bench, setBench] = useState<PickMap>({});
  const [target, setTarget] = useState<SlotTarget | null>(null);

  const [result, setResult] = useState<DraftResult | null>(null);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Neither of these is rendered, so they stay out of React state and away
  // from the browser-only APIs that would break the server render.
  const sessionIdRef = useRef<string | null>(null);
  const seedRef = useRef(0);

  const getSessionId = useCallback(() => {
    if (sessionIdRef.current) return sessionIdRef.current;

    let stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      stored = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      window.localStorage.setItem(storageKey, stored);
    }
    sessionIdRef.current = stored;
    return stored;
  }, []);

  const getSeed = useCallback(() => {
    if (!seedRef.current) seedRef.current = newSeed();
    return seedRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const response = await fetch("/api/formations");
      if (!response.ok) return;
      const data = (await response.json()) as SetupResponse;
      if (cancelled) return;
      setSetup(data);
      setTarget({ kind: "xi", slotId: data.formations[0].slots[0].id });
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const formation = useMemo(
    () => setup?.formations.find((item) => item.id === formationId) ?? setup?.formations[0] ?? null,
    [setup, formationId],
  );
  const benchSlots = useMemo(() => setup?.benchSlots ?? [], [setup]);

  const pickedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const pick of Object.values(xi)) ids.add(pick.player.id);
    for (const pick of Object.values(bench)) ids.add(pick.player.id);
    return ids;
  }, [xi, bench]);

  const xiComplete = Boolean(formation) && formation!.slots.every((slot) => xi[slot.id]);

  const ratings = useMemo(() => {
    if (!formation) return { attack: 0, defense: 0, balance: 0, overall: 0 };
    const entries = formation.slots
      .filter((slot) => xi[slot.id])
      .map((slot) => ({ slotId: slot.id, player: xi[slot.id].player }));
    if (entries.length === 0) return { attack: 0, defense: 0, balance: 0, overall: 0 };
    return rateSquad(entries, formation, style);
  }, [formation, xi, style]);

  /** Slots the drawn squad could still fill, used to highlight the pitch. */
  const openXiSlots = useMemo(
    () => (formation ? formation.slots.filter((slot) => !xi[slot.id]) : []),
    [formation, xi],
  );
  const openBenchSlots = useMemo(
    () => benchSlots.filter((slot) => !bench[slot.id]),
    [benchSlots, bench],
  );

  const findDestination = useCallback(
    (player: Player): SlotTarget | null => {
      if (target) {
        if (target.kind === "xi") {
          const slot = openXiSlots.find((item) => item.id === target.slotId);
          if (slot && isPlayerEligibleForSlot(player, slot.position)) return target;
        } else {
          const slot = openBenchSlots.find((item) => item.id === target.slotId);
          if (slot && isPlayerEligibleForBench(player, slot.role)) return target;
        }
      }

      const natural = openXiSlots.find((slot) => player.positions.includes(slot.position));
      if (natural) return { kind: "xi", slotId: natural.id };

      const covered = openXiSlots.find((slot) => isPlayerEligibleForSlot(player, slot.position));
      if (covered) return { kind: "xi", slotId: covered.id };

      const benchSlot = openBenchSlots.find((slot) => isPlayerEligibleForBench(player, slot.role));
      if (benchSlot) return { kind: "bench", slotId: benchSlot.id };

      return null;
    },
    [target, openXiSlots, openBenchSlots],
  );

  const isPlayerAvailable = useCallback(
    (player: Player) => !pickedIds.has(player.id) && findDestination(player) !== null,
    [pickedIds, findDestination],
  );

  async function draw(kind: "new" | "nation" | "year") {
    if (rolling) return;
    setRolling(true);
    setMessage("");

    try {
      const params = new URLSearchParams({
        sessionId: getSessionId(),
        seed: `${newSeed()}`,
        kind,
      });
      if (squad) params.set("currentSquadId", squad.id);

      const response = await fetch(`/api/squads/random?${params.toString()}`);
      if (!response.ok) {
        setMessage("Could not draw a squad. Try again.");
        return;
      }
      const data = (await response.json()) as { squad: Squad };
      setSquad(data.squad);
      if (kind !== "new") setRerollsLeft((current) => Math.max(0, current - 1));
    } finally {
      setRolling(false);
    }
  }

  function pickPlayer(player: Player) {
    if (!formation || pickedIds.has(player.id) || !squad) return;

    const destination = findDestination(player);
    if (!destination) {
      setMessage(`${surnameOf(player.name)} has no open slot in this shape.`);
      return;
    }

    const pick = { player, squad: toMeta(squad) };
    if (destination.kind === "xi") {
      setXi((current) => ({ ...current, [destination.slotId]: pick }));
    } else {
      setBench((current) => ({ ...current, [destination.slotId]: pick }));
    }

    // One draw, one squad, one player: the market closes after a pick.
    setSquad(null);
    setMessage("");

    const nextOpen = formation.slots.find((slot) => !xi[slot.id] && slot.id !== destination.slotId);
    if (nextOpen) setTarget({ kind: "xi", slotId: nextOpen.id });
    else {
      const nextBench = benchSlots.find((slot) => !bench[slot.id] && slot.id !== destination.slotId);
      setTarget(nextBench ? { kind: "bench", slotId: nextBench.id } : null);
    }
  }

  function clearBenchSlot(slotId: string) {
    setBench((current) => {
      const next = { ...current };
      delete next[slotId];
      return next;
    });
  }

  function resetDraft(nextFormationId = formationId) {
    setFormationId(nextFormationId);
    setXi({});
    setBench({});
    setSquad(null);
    setResult(null);
    setRerollsLeft(totalRerolls);
    seedRef.current = newSeed();
    setMessage("");
    const next = setup?.formations.find((item) => item.id === nextFormationId);
    setTarget(next ? { kind: "xi", slotId: next.slots[0].id } : null);
  }

  function buildPayload() {
    if (!formation) return null;
    return {
      formationId: formation.id,
      style,
      seed: getSeed(),
      xi: formation.slots
        .filter((slot) => xi[slot.id])
        .map((slot) => ({ slotId: slot.id, playerId: xi[slot.id].player.id })),
      bench: benchSlots
        .filter((slot) => bench[slot.id])
        .map((slot) => ({ slotId: slot.id, playerId: bench[slot.id].player.id })),
    };
  }

  async function simulate() {
    const payload = buildPayload();
    if (!payload || !xiComplete || busy) return;

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { result?: DraftResult; error?: string };
      if (!response.ok || !data.result) {
        setMessage(data.error ?? "The simulation failed.");
        return;
      }
      setResult(data.result);
    } finally {
      setBusy(false);
    }
  }

  async function submitToLeaderboard() {
    const payload = buildPayload();
    if (!payload || !result || busy) return;

    setBusy(true);
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, nickname }),
      });
      const data = (await response.json()) as { error?: string };
      setMessage(response.ok ? "Submitted to the Top 100." : data.error ?? "Submission failed.");
    } finally {
      setBusy(false);
    }
  }

  async function copyResult() {
    if (!result || !formation) return;

    const lines = [
      `Draft XI — ${result.headline}`,
      `${formation.name} · ${style} · ${result.finish}`,
      `Overall ${result.overall} · ATT ${result.attack} · DEF ${result.defense} · Bench ${result.benchStrength}`,
      formation.slots.map((slot) => (xi[slot.id] ? surnameOf(xi[slot.id].player.name) : "—")).join(", "),
      ...result.matches.map((match) => `${match.round}: ${match.scoreFor}-${match.scoreAgainst} v ${match.opponent}`),
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setMessage("Result card copied to the clipboard.");
    } catch {
      setMessage("Clipboard is blocked in this browser.");
    }
  }

  if (!setup || !formation) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--border)] bg-black/20 p-10 text-center text-sm text-[var(--muted)]">
        Loading the draft zone…
      </div>
    );
  }

  const activeMode = modes.find((item) => item.id === mode)!;
  const activeStyle = styles.find((item) => item.id === style)!;
  const showRatings = mode === "classic";

  const eligibleXiSlots = new Set<string>();
  const eligibleBenchSlots = new Set<string>();
  if (squad) {
    for (const slot of openXiSlots) {
      if (squad.players.some((player) => !pickedIds.has(player.id) && isPlayerEligibleForSlot(player, slot.position))) {
        eligibleXiSlots.add(slot.id);
      }
    }
    for (const slot of openBenchSlots) {
      if (squad.players.some((player) => !pickedIds.has(player.id) && isPlayerEligibleForBench(player, slot.role))) {
        eligibleBenchSlots.add(slot.id);
      }
    }
  }

  return (
    <div className="space-y-4">
      <section className="grid gap-3 rounded-[1.25rem] border border-[var(--border)] bg-black/25 p-4 sm:grid-cols-3">
        <ControlGroup label="Formation">
          <div className="flex flex-wrap gap-1.5">
            {setup.formations.map((item) => (
              <Chip
                key={item.id}
                active={item.id === formationId}
                onClick={() => resetDraft(item.id)}
                label={item.name}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{formation.description}</p>
        </ControlGroup>

        <ControlGroup label="Style">
          <div className="flex flex-wrap gap-1.5">
            {styles.map((item) => (
              <Chip
                key={item.id}
                active={item.id === style}
                onClick={() => setStyle(item.id)}
                label={item.label}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{activeStyle.hint}</p>
        </ControlGroup>

        <ControlGroup label="Mode · difficulty">
          <div className="flex flex-wrap gap-1.5">
            {modes.map((item) => (
              <Chip
                key={item.id}
                active={item.id === mode}
                onClick={() => setMode(item.id)}
                label={item.label}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">{activeMode.hint}</p>
        </ControlGroup>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_20rem]">
        <div className="space-y-4">
          <SquadBoard
            squad={squad}
            rerollsLeft={rerollsLeft}
            rolling={rolling}
            showRatings={showRatings}
            hasRolled={Boolean(squad)}
            isPlayerAvailable={isPlayerAvailable}
            onRoll={() => draw("new")}
            onReroll={(kind) => draw(kind)}
            onPick={pickPlayer}
          />

          {xiComplete && !result ? (
            <div className="space-y-2 rounded-[1.25rem] border border-[var(--accent)] bg-[rgba(255,107,53,0.12)] p-4">
              <p className="text-sm text-white">
                The XI is complete. Keep rolling to fill the bench, or send them out now.
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={simulate}
                  disabled={busy}
                  className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)] disabled:opacity-60"
                >
                  {busy ? "Simulating…" : "Simulate the campaign"}
                </button>
                {!squad ? (
                  <button
                    type="button"
                    onClick={() => draw("new")}
                    disabled={rolling}
                    className="rounded-full border border-[var(--border)] bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Roll for the bench 🎲
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {message && !result ? <p className="text-sm text-[var(--accent-strong)]">{message}</p> : null}
        </div>

        <div className="space-y-3">
          <Pitch
            formation={formation}
            picks={xi}
            target={target}
            eligibleSlotIds={eligibleXiSlots}
            showRatings={showRatings}
            onSelectSlot={(slotId) => setTarget({ kind: "xi", slotId })}
          />
          <BenchStrip
            slots={benchSlots}
            picks={bench}
            target={target}
            eligibleSlotIds={eligibleBenchSlots}
            showRatings={showRatings}
            onSelectSlot={(slotId) => setTarget({ kind: "bench", slotId })}
            onClearSlot={clearBenchSlot}
          />
        </div>

        <Scorecard
          formation={formation}
          benchSlots={benchSlots}
          xi={xi}
          bench={bench}
          attack={ratings.attack}
          defense={ratings.defense}
          balance={ratings.balance}
          overall={ratings.overall}
          showRatings={showRatings}
        />
      </div>

      {result ? (
        <ResultPanel
          result={result}
          formation={formation}
          xi={xi}
          nickname={nickname}
          message={message}
          submitting={busy}
          onNicknameChange={setNickname}
          onSubmit={submitToLeaderboard}
          onCopy={copyResult}
          onPlayAgain={() => resetDraft()}
        />
      ) : null}
    </div>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">{label}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
        active
          ? "bg-[var(--accent)] text-white"
          : "border border-[var(--border)] bg-white/5 text-white hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}
