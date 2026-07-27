import type { Metadata } from "next";
import Link from "next/link";
import { listLeaderboardEntries } from "@/lib/leaderboard-store";

export const metadata: Metadata = {
  title: "Top 100",
  description: "The best Draft XI campaigns, ranked by overall rating and how far the run went.",
  alternates: { canonical: "/leaderboard" },
};

// Submissions land in a file store, so this page must not be cached.
export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const entries = await listLeaderboardEntries();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent-strong)]">
        Leaderboard
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Top 100 drafts</h1>
      <p className="mt-4 max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">
        Ranked by overall rating, with the campaign finish as the tie-break. Every score here was
        recomputed on the server from the picks themselves, so the board reflects real drafts.
      </p>

      {entries.length === 0 ? (
        <div className="mt-8 rounded-[1.25rem] border border-dashed border-[var(--border)] bg-black/20 p-10 text-center">
          <p className="text-sm text-[var(--muted)]">Nobody has submitted a run yet. Be the first.</p>
          <Link
            href="/play"
            className="mt-4 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Start a draft
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[1.25rem] border border-[var(--border)]">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">Manager</th>
                <th className="px-4 py-3 font-bold">Shape</th>
                <th className="px-4 py-3 font-bold">Finish</th>
                <th className="px-4 py-3 text-right font-bold">ATT</th>
                <th className="px-4 py-3 text-right font-bold">DEF</th>
                <th className="px-4 py-3 text-right font-bold">Bench</th>
                <th className="px-4 py-3 text-right font-bold">Overall</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id} className="border-t border-[var(--border)] bg-black/15 text-white">
                  <td className="px-4 py-3 font-bold text-[var(--muted)]">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="block font-semibold">{entry.nickname}</span>
                    <span className="block truncate text-xs text-[var(--muted)]">
                      {entry.xi.slice(0, 4).join(", ")}…
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {entry.formationId} · {entry.style}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">{entry.finish}</td>
                  <td className="px-4 py-3 text-right">{entry.attack}</td>
                  <td className="px-4 py-3 text-right">{entry.defense}</td>
                  <td className="px-4 py-3 text-right">{entry.benchStrength}</td>
                  <td className="px-4 py-3 text-right text-base font-bold">{entry.overall}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/play"
          className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
        >
          Draft your XI
        </Link>
        <Link
          href="/strategy"
          className="rounded-full border border-[var(--border)] bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Read the strategy guide
        </Link>
      </div>
    </main>
  );
}
