"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import { PhaseBar, type Phase } from "./phase-bar";
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
  { id: "attacking", label: "Attacking", hint: "More scored, more conceded. High variance." },
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
  const [formMap, setFormMap] = useState<Record<string, number>>({});

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
  const [lastPick, setLastPick] = useState<{ name: string; slot: string; id: number } | null>(null);

  // Not rendered, so they stay out of state and off the server render path.
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

  const loadForm = useCallback(async () => {
    const response = await fetch("/api/players?view=form");
    if (!response.ok) return;
    const data = (await response.json()) as { form: Record<string, number> };
    setFormMap(data.form ?? {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [setupResponse, formResponse] = await Promise.all([
        fetch("/api/formations"),
        fetch("/api/players?view=form"),
      ]);
      if (cancelled || !setupResponse.ok) return;

      const data = (await setupResponse.json()) as SetupResponse;
      if (cancelled) return;
      setSetup(data);
      setTarget({ kind: "xi", slotId: data.formations[0].slots[0].id });

      if (formResponse.ok) {
        const form = (await formResponse.json()) as { form: Record<string, number> };
        if (!cancelled) setFormMap(form.form ?? {});
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!lastPick) return;
    const timer = window.setTimeout(() => setLastPick(null), 2200);
    return () => window.clearTimeout(timer);
  }, [lastPick]);

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

  const xiFilled = formation ? formation.slots.filter((slot) => xi[slot.id]).length : 0;
  const benchFilled = benchSlots.filter((slot) => bench[slot.id]).length;
  const xiComplete = Boolean(formation) && xiFilled === formation!.slots.length;

  const ratings = useMemo(() => {
    const empty = { attack: 0, defense: 0, balance: 0, overall: 0 };
    if (!formation) return empty;

    const entries = formation.slots
      .filter((slot) => xi[slot.id])
      .map((slot) => ({ slotId: slot.id, player: xi[slot.id].player }));

    return entries.length > 0 ? rateSquad(entries, formation, style) : empty;
  }, [formation, xi, style]);

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
      const params = new URLSearchParams({ sessionId: getSessionId(), seed: `${newSeed()}`, kind });
      if (squad) params.set("currentSquadId", squad.id);

      const response = await fetch(`/api/squads/random?${params}`);
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
    if (!formation || !squad || pickedIds.has(player.id)) return;

    const destination = findDestination(player);
    if (!destination) {
      setMessage(`${surnameOf(player.name)} has no open slot in this shape.`);
      return;
    }

    const label =
      destination.kind === "xi"
        ? formation.slots.find((slot) => slot.id === destination.slotId)!.position
        : (benchSlots.find((slot) => slot.id === destination.slotId)?.role ?? "BENCH");

    const pick = { player, squad: toMeta(squad) };
    if (destination.kind === "xi") {
      setXi((current) => ({ ...current, [destination.slotId]: pick }));
    } else {
      setBench((current) => ({ ...current, [destination.slotId]: pick }));
    }

    // One draw, one squad, one player: the market closes after a pick.
    setSquad(null);
    setMessage("");
    setLastPick({ name: player.name, slot: label, id: Date.now() });

    const nextOpen = formation.slots.find((slot) => !xi[slot.id] && slot.id !== destination.slotId);
    if (nextOpen) {
      setTarget({ kind: "xi", slotId: nextOpen.id });
      return;
    }

    const nextBench = benchSlots.find((slot) => !bench[slot.id] && slot.id !== destination.slotId);
    setTarget(nextBench ? { kind: "bench", slotId: nextBench.id } : null);
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
      // The campaign just went into every player's record — refresh their form.
      loadForm();
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
      ...result.matches.map((m) => `${m.round}: ${m.scoreFor}-${m.scoreAgainst} v ${m.opponent}`),
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
      <div className="hud sweep relative overflow-hidden p-16 text-center">
        <p className="eyebrow">Loading the draft zone</p>
      </div>
    );
  }

  const showRatings = mode === "classic";
  const activeStyle = styles.find((item) => item.id === style)!;
  const activeMode = modes.find((item) => item.id === mode)!;

  const phase: Phase = result
    ? "result"
    : xiComplete
      ? "kickoff"
      : xiFilled > 0 || squad
        ? "drafting"
        : "setup";

  const targetSlot =
    target?.kind === "xi"
      ? formation.slots.find((slot) => slot.id === target.slotId)?.position
      : benchSlots.find((slot) => slot.id === target?.slotId)?.label;

  const prompt = result
    ? "Campaign complete. Submit it to the Top 100, or draft again."
    : xiComplete
      ? squad
        ? "Take a substitute from this squad, or kick off with the bench you have."
        : "The XI is complete. Roll again to fill the bench, or kick off now."
      : squad
        ? `Take one player from ${squad.nation} ${squad.year}${targetSlot ? ` — ${targetSlot} is next` : ""}.`
        : xiFilled > 0
          ? `Roll again for your next pick${targetSlot ? ` — ${targetSlot} is still open` : ""}.`
          : "Choose a shape, a style and a mode, then roll your first squad.";

  const eligibleXiSlots = new Set<string>();
  const eligibleBenchSlots = new Set<string>();

  if (squad) {
    const free = squad.players.filter((player) => !pickedIds.has(player.id));
    for (const slot of openXiSlots) {
      if (free.some((player) => isPlayerEligibleForSlot(player, slot.position))) {
        eligibleXiSlots.add(slot.id);
      }
    }
    for (const slot of openBenchSlots) {
      if (free.some((player) => isPlayerEligibleForBench(player, slot.role))) {
        eligibleBenchSlots.add(slot.id);
      }
    }
  }

  return (
    <div className="space-y-4">
      <section className="hud hud-rule grid gap-5 p-4 sm:grid-cols-3">
        <Control label="Formation" hint={formation.description}>
          {setup.formations.map((item) => (
            <Chip
              key={item.id}
              active={item.id === formationId}
              onClick={() => resetDraft(item.id)}
              label={item.name}
            />
          ))}
        </Control>

        <Control label="Style" hint={activeStyle.hint}>
          {styles.map((item) => (
            <Chip
              key={item.id}
              active={item.id === style}
              onClick={() => setStyle(item.id)}
              label={item.label}
            />
          ))}
        </Control>

        <Control label="Mode · difficulty" hint={activeMode.hint}>
          {modes.map((item) => (
            <Chip
              key={item.id}
              active={item.id === mode}
              onClick={() => setMode(item.id)}
              label={item.label}
            />
          ))}
        </Control>
      </section>

      <PhaseBar
        phase={phase}
        xiFilled={xiFilled}
        xiTotal={formation.slots.length}
        benchFilled={benchFilled}
        benchTotal={benchSlots.length}
        rerollsLeft={rerollsLeft}
        prompt={prompt}
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_20rem]">
        <div className="space-y-4">
          <SquadBoard
            squad={squad}
            rerollsLeft={rerollsLeft}
            rolling={rolling}
            showRatings={showRatings}
            formMap={formMap}
            isPlayerAvailable={isPlayerAvailable}
            onRoll={() => draw("new")}
            onReroll={draw}
            onPick={pickPlayer}
          />

          <AnimatePresence>
            {xiComplete && !result ? (
              <motion.div
                className="hud hud-lit space-y-3 p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-sm leading-6 text-white">
                  Eleven named. Every extra roll from here goes to the bench.
                </p>
                <div className="flex flex-wrap gap-2">
                  <motion.button
                    type="button"
                    onClick={simulate}
                    disabled={busy}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="clip-btn display glow bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] disabled:opacity-50"
                  >
                    {busy ? "Simulating…" : "Kick off the campaign"}
                  </motion.button>
                  {!squad ? (
                    <motion.button
                      type="button"
                      onClick={() => draw("new")}
                      disabled={rolling}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="clip-btn border border-[var(--border)] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                    >
                      Roll for the bench 🎲
                    </motion.button>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {message && !result ? (
            <p className="text-sm text-[var(--amber)]">{message}</p>
          ) : null}
        </div>

        <div className="space-y-4">
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

      <PickToast pick={lastPick} />
    </div>
  );
}

function PickToast({ pick }: { pick: { name: string; slot: string; id: number } | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
      <AnimatePresence>
        {pick ? (
          <motion.div
            key={pick.id}
            className="clip-btn flex items-center gap-3 border border-[var(--accent)] bg-[rgba(4,7,13,0.94)] px-5 py-3 shadow-[0_0_40px_-10px_var(--accent)] backdrop-blur"
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 26 }}
          >
            <span className="text-sm font-bold text-white">{pick.name}</span>
            <span className="text-[var(--accent)]">→</span>
            <span className="clip-tag bg-[var(--accent)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#04070d]">
              {pick.slot}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Control({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>
      <p className="mt-2.5 text-xs leading-5 text-[var(--muted)]">{hint}</p>
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`clip-btn px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors ${
        active
          ? "bg-[var(--accent)] text-[#04070d]"
          : "border border-[var(--border)] bg-white/[0.04] text-white hover:border-[var(--accent)] hover:text-[var(--accent)]"
      }`}
    >
      {label}
    </motion.button>
  );
}
