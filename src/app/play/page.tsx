import Link from "next/link";
import { DraftGame } from "@/components/draft-game";

export default function PlayPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:px-12">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Play area</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Draft XI game shell</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">
          This is the route where the roll, draft, formation, simulation, and share flow will live.
          The next build step is to wire the real data layer and the draft interaction model.
        </p>
      </div>

      <DraftGame />

      <Link
        href="/"
        className="w-fit rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Back to home
      </Link>
    </main>
  );
}