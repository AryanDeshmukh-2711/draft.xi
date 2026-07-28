import type { Metadata } from "next";
import Link from "next/link";
import { StorageNotice } from "@/components/storage-notice";
import { listLeaderboardEntries } from "@/lib/leaderboard-store";

export const metadata: Metadata = {
  title: "Top 100",
  description: "The best Draft XI campaigns, ranked by overall rating and how far the run went.",
  alternates: { canonical: "/leaderboard" },
};

// Submissions land in a file store, so this page must not be cached.
export const dynamic = "force-dynamic";

const medal = ["var(--amber)", "#c9d6e2", "#c08457"];

export default async function LeaderboardPage() {
  const entries = await listLeaderboardEntries();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
        Leaderboard
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl">
        Top 100 drafts
      </h1>
      <p className="mt-5 max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">
        Ranked by overall rating, with the campaign finish as the tie-break. Every score here was
        recomputed on the server from the picks themselves, so the board reflects real drafts.
      </p>

      <StorageNotice />

      {entries.length === 0 ? (
        <div className="hud mt-10 p-12 text-center">
          <p className="text-sm text-[var(--muted)]">Nobody has submitted a run yet. Be the first.</p>
          <Link
            href="/play"
            className="clip-btn display glow mt-5 inline-flex bg-[var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] transition hover:brightness-110"
          >
            Start a draft
          </Link>
        </div>
      ) : (
        <div className="hud mt-10 overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">Manager</th>
                <th className="px-4 py-3 font-bold">Shape</th>
                <th className="px-4 py-3 font-bold">Finish</th>
                <th className="px-4 py-3 text-right font-bold">Att</th>
                <th className="px-4 py-3 text-right font-bold">Def</th>
                <th className="px-4 py-3 text-right font-bold">Bench</th>
                <th className="px-4 py-3 text-right font-bold">Overall</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className="border-b border-[var(--border)] text-white transition last:border-0 hover:bg-white/[0.04]"
                >
                  <td
                    className="tnum px-4 py-3 text-base font-bold"
                    style={{ color: medal[index] ?? "var(--muted)" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-semibold">{entry.nickname}</span>
                    <span className="block max-w-[22rem] truncate text-xs text-[var(--muted)]">
                      {entry.xi.slice(0, 4).join(", ")}…
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">
                    {entry.formationId} · {entry.style}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">{entry.finish}</td>
                  <td className="tnum px-4 py-3 text-right text-[var(--magenta)]">{entry.attack}</td>
                  <td className="tnum px-4 py-3 text-right text-[var(--cyan)]">{entry.defense}</td>
                  <td className="tnum px-4 py-3 text-right text-[var(--amber)]">
                    {entry.benchStrength}
                  </td>
                  <td className="tnum display px-4 py-3 text-right text-xl font-bold text-[var(--accent)]">
                    {entry.overall}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/play"
          className="clip-btn display glow bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] transition hover:brightness-110"
        >
          Draft your XI
        </Link>
        <Link
          href="/strategy"
          className="clip-btn border border-[var(--border)] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Read the strategy guide
        </Link>
      </div>
    </main>
  );
}
