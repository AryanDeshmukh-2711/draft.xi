import Link from "next/link";

const rows = [
  { rank: 1, name: "Guest 14", score: "7-0" },
  { rank: 2, name: "Pulse", score: "6-1" },
  { rank: 3, name: "Almanac", score: "5-2" },
];

export default function LeaderboardPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Leaderboard</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Top results shell</h1>
        <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[var(--muted)]">
              <tr>
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Nickname</th>
                <th className="px-4 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.rank} className="border-t border-[var(--border)] bg-black/10 text-white">
                  <td className="px-4 py-3">{row.rank}</td>
                  <td className="px-4 py-3">{row.name}</td>
                  <td className="px-4 py-3">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        Back to home
      </Link>
    </main>
  );
}