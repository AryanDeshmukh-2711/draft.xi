import Link from "next/link";

export default function RulesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">Rules</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Draft rules</h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <p>Each turn gives you one squad and one pick.</p>
          <p>Only eligible players can fill the current open slot.</p>
          <p>Formation is locked when the draft begins.</p>
          <p>Rerolls should be limited so the draw stays meaningful.</p>
        </div>
      </article>

      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        Back to home
      </Link>
    </main>
  );
}