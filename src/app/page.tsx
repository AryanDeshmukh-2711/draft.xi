import Link from "next/link";

const phases = [
  {
    title: "Roll a squad",
    description: "Draw a nation and tournament year from a seeded historical dataset.",
  },
  {
    title: "Pick one player",
    description: "Choose a real player to fill the next open formation slot.",
  },
  {
    title: "Complete the XI",
    description: "Repeat until the pitch is full and the squad is locked in.",
  },
  {
    title: "Simulate the campaign",
    description: "Run a deterministic result model with spine-weighted balance.",
  },
  {
    title: "Share the result",
    description: "Generate a card, a link, and a social-ready summary of the run.",
  },
];

const contentPages = [
  { href: "/play", label: "Play area" },
  { href: "/how-to-play", label: "How to play" },
  { href: "/rules", label: "Rules" },
  { href: "/strategy", label: "Strategy" },
  { href: "/faq", label: "FAQ" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(255,107,53,0.18),transparent_45%),radial-gradient(circle_at_70%_20%,rgba(31,58,95,0.5),transparent_38%)]" />
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-8 sm:px-8 lg:px-12 lg:py-10">
        <header className="flex items-center justify-between rounded-full border border-[var(--border)] bg-[rgba(9,17,28,0.72)] px-4 py-3 backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Draft XI</p>
            <p className="text-sm text-[var(--foreground)]/85">World Cup squad-draft game scaffold</p>
          </div>
          <Link
            href="/play"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          >
            Play now
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full border border-[rgba(255,255,255,0.12)] bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Phase 0 scaffold
            </span>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              Draft an all-time XI from real squads, then see if it can survive the campaign.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              The project is set up to follow the PRD: roll a squad, choose one player per turn,
              complete a formation, simulate the result, then share the card.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/play"
                className="rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-strong)]"
              >
                Start the draft shell
              </Link>
              <Link
                href="/how-to-play"
                className="rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Read the rules
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[linear-gradient(180deg,rgba(16,52,31,0.9),rgba(9,31,19,0.95))] p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
                <span>Formation preview</span>
                <span>4-3-3</span>
              </div>
              <div className="mt-5 grid grid-rows-4 gap-3 rounded-[1.5rem] border border-[rgba(255,255,255,0.08)] bg-[var(--pitch)] p-4 text-center">
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">GK</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">LB</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">CB</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">CB</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">RB</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">CM</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">CM</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">CM</div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">LW</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">ST</div>
                  <div className="flex h-14 items-center justify-center rounded-2xl border border-[var(--pitch-grid)] bg-white/6 text-sm font-semibold text-white/90">RW</div>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-3">
                  <div className="text-[var(--muted)]">Mode</div>
                  <div className="mt-1 font-semibold text-white">Classic / Almanac</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-3">
                  <div className="text-[var(--muted)]">Loop</div>
                  <div className="mt-1 font-semibold text-white">Roll, pick, repeat</div>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-black/20 p-3">
                  <div className="text-[var(--muted)]">Share</div>
                  <div className="mt-1 font-semibold text-white">Card + link</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {phases.map((phase, index) => (
            <article
              key={phase.title}
              className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-lg shadow-black/20 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">0{index + 1}</p>
              <h2 className="mt-3 text-lg font-semibold text-white">{phase.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{phase.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Why this exists</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">A short, replayable football game with a shareable result.</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              The PRD calls for a mobile-first browser game with a strong loop, a deterministic simulation,
              and SEO content that explains the rules without getting in the way of play.
            </p>
          </article>

          <article className="rounded-[2rem] border border-[var(--border)] bg-[rgba(16,32,51,0.78)] p-6 shadow-xl shadow-black/20 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">Content routes</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {contentPages.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-[var(--border)] bg-black/20 px-4 py-4 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
