import Link from "next/link";

export default function StrategyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Strategy</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Drafting ideas</h1>
        <ul className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <li>Prioritize spine roles early: GK, CB, and CM usually carry the simulation.</li>
          <li>Balance ratings with position fit rather than chasing only the highest number.</li>
          <li>Use Almanac mode when you want a memory test instead of a pure rating readout.</li>
          <li>Keep rerolls for dead squads, not for fishing every turn.</li>
        </ul>
      </article>

      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        Back to home
      </Link>
    </main>
  );
}