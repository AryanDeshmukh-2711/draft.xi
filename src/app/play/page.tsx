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

export default function PlayPage() {
  return (
    <main className="mx-auto flex w-full max-w-[104rem] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
            Draft zone
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Build your World Cup XI
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            Choose a shape, lock in a style, and start drafting. Every turn gives you one squad, one
            decision, and one chance to keep the XI balanced.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
          <span>
            <strong className="text-white">{datasetStats.nations}</strong> nations
          </span>
          <span>·</span>
          <span>
            <strong className="text-white">{datasetStats.squads}</strong> squads
          </span>
          <span>·</span>
          <span>
            <strong className="text-white">{datasetStats.players}</strong> players
          </span>
          <Link
            href="/leaderboard"
            className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
          >
            Top 100
          </Link>
        </div>
      </header>

      <DraftGame />

      <nav className="flex flex-wrap gap-2 text-sm">
        {[
          { href: "/", label: "Home" },
          { href: "/how-to-play", label: "How to play" },
          { href: "/rules", label: "Rules" },
          { href: "/strategy", label: "Strategy" },
          { href: "/faq", label: "FAQ" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-[var(--border)] bg-white/5 px-4 py-2 font-semibold text-white transition hover:bg-white/10"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
