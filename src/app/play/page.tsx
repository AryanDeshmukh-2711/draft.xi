import type { Metadata } from "next";
import Link from "next/link";
import { DraftGame } from "@/components/draft/draft-game";
import { datasetStats } from "@/lib/squads";

export const metadata: Metadata = {
  title: "Play the draft",
  description:
    "Roll a World Cup squad, pick one player per turn, name a bench, and simulate the campaign with your XI.",
  alternates: { canonical: "/play" },
};

const guideLinks = [
  { href: "/how-to-play", label: "How to play" },
  { href: "/rules", label: "Rules" },
  { href: "/strategy", label: "Strategy" },
  { href: "/faq", label: "FAQ" },
];

export default function PlayPage() {
  return (
    <main className="mx-auto flex w-full max-w-[104rem] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Draft zone</p>
          <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
            Build your World Cup XI
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Choose a shape, lock in a style, and start drafting. Every turn gives you one squad, one
            decision, and one chance to keep the XI balanced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          {[
            ["Nations", datasetStats.nations],
            ["Squads", datasetStats.squads],
            ["Players", datasetStats.players],
          ].map(([label, value]) => (
            <div key={label} className="border-l-2 border-[var(--accent)] pl-2.5">
              <div className="tnum display text-xl font-bold leading-none text-white">{value}</div>
              <div className="mt-0.5 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                {label}
              </div>
            </div>
          ))}
          <Link
            href="/leaderboard"
            className="clip-btn border border-[var(--border)] bg-white/[0.04] px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            Top 100
          </Link>
        </div>
      </header>

      <DraftGame />

      <nav className="flex flex-wrap gap-2">
        {guideLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="clip-btn border border-[var(--border)] bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
