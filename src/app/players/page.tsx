import type { Metadata } from "next";
import Link from "next/link";
import { StorageNotice } from "@/components/storage-notice";
import { getTournamentCount, listPlayerRankings } from "@/lib/player-stats";
import { squads } from "@/lib/squads";

export const metadata: Metadata = {
  title: "Player rankings",
  description:
    "Every player ranked by what they have actually done in Draft XI campaigns — appearances, wins, titles and form.",
  alternates: { canonical: "/players" },
};

export const dynamic = "force-dynamic";

const medal = ["var(--amber)", "#c9d6e2", "#c08457"];

export default async function PlayersPage() {
  const [ranked, tournaments] = await Promise.all([
    listPlayerRankings(200),
    getTournamentCount(),
  ]);

  const poolSize = squads.reduce((total, squad) => total + squad.players.length, 0);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-10">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
        Player rankings
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl">
        Who has actually delivered
      </h1>
      <p className="mt-5 max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">
        Every campaign updates the players who took part. Ranking points come from matches played,
        results, and how far the run went, halved for a player who only made the bench. Form is the
        rating adjustment that record has earned — it shows up next to a player&apos;s number while
        you draft.
      </p>

      <StorageNotice />

      <div className="mt-8 flex flex-wrap gap-3">
        {[
          ["Tournaments played", tournaments],
          ["Players ranked", ranked.length],
          ["Players in the pool", poolSize],
        ].map(([label, value]) => (
          <div key={label} className="hud px-5 py-3">
            <div className="tnum display text-2xl font-bold leading-none text-white">{value}</div>
            <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {label}
            </div>
          </div>
        ))}
      </div>

      {ranked.length === 0 ? (
        <div className="hud mt-10 p-12 text-center">
          <p className="text-sm text-[var(--muted)]">
            No campaigns have been run yet, so nobody has a record. Draft an XI and kick off — every
            player you picked will appear here afterwards.
          </p>
          <Link
            href="/play"
            className="clip-btn display glow mt-5 inline-flex bg-[var(--accent)] px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] transition hover:brightness-110"
          >
            Run the first campaign
          </Link>
        </div>
      ) : (
        <div className="hud mt-8 overflow-x-auto">
          <table className="w-full min-w-[58rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] text-[0.62rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">Player</th>
                <th className="px-4 py-3 font-bold">Squad</th>
                <th className="px-4 py-3 text-right font-bold">Drafts</th>
                <th className="px-4 py-3 text-right font-bold">Win %</th>
                <th className="px-4 py-3 text-right font-bold">Titles</th>
                <th className="px-4 py-3 text-right font-bold">Base</th>
                <th className="px-4 py-3 text-right font-bold">Form</th>
                <th className="px-4 py-3 text-right font-bold">Rating</th>
                <th className="px-4 py-3 text-right font-bold">Points</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((player) => (
                <tr
                  key={player.playerId}
                  className="border-b border-[var(--border)] text-white transition last:border-0 hover:bg-white/[0.04]"
                >
                  <td
                    className="tnum px-4 py-3 text-base font-bold"
                    style={{ color: medal[player.rank - 1] ?? "var(--muted)" }}
                  >
                    {String(player.rank).padStart(2, "0")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block font-semibold">{player.name}</span>
                    <span className="block text-[0.62rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                      {player.positions.join("/")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    <span className="mr-1.5">{player.flag}</span>
                    {player.nation} {player.year}
                  </td>
                  <td className="tnum px-4 py-3 text-right">
                    {player.drafts}
                    {player.benchCalls > 0 ? (
                      <span className="ml-1 text-[0.65rem] text-[var(--muted)]">
                        ({player.benchCalls} sub)
                      </span>
                    ) : null}
                  </td>
                  <td className="tnum px-4 py-3 text-right text-[var(--cyan)]">{player.winRate}%</td>
                  <td className="tnum px-4 py-3 text-right text-[var(--amber)]">
                    {player.titles || "—"}
                  </td>
                  <td className="tnum px-4 py-3 text-right text-[var(--muted)]">
                    {player.baseRating}
                  </td>
                  <td
                    className="tnum px-4 py-3 text-right font-bold"
                    style={{
                      color:
                        player.form > 0
                          ? "var(--accent)"
                          : player.form < 0
                            ? "var(--magenta)"
                            : "var(--muted)",
                    }}
                  >
                    {player.form > 0 ? `▲${player.form}` : player.form < 0 ? `▼${Math.abs(player.form)}` : "—"}
                  </td>
                  <td className="tnum px-4 py-3 text-right text-base font-bold">
                    {player.currentRating}
                  </td>
                  <td className="tnum display px-4 py-3 text-right text-xl font-bold text-[var(--accent)]">
                    {player.points}
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
          href="/leaderboard"
          className="clip-btn border border-[var(--border)] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          Manager Top 100
        </Link>
      </div>
    </main>
  );
}
