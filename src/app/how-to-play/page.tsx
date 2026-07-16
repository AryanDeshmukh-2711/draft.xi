import Link from "next/link";

export default function HowToPlayPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">How to play</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">The core loop</h1>
        <ol className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
          <li><strong className="text-white">1.</strong> Pick a formation before the draft starts.</li>
          <li><strong className="text-white">2.</strong> Roll a squad from the historical pool.</li>
          <li><strong className="text-white">3.</strong> Draft one player into one open slot.</li>
          <li><strong className="text-white">4.</strong> Repeat until the XI is complete.</li>
          <li><strong className="text-white">5.</strong> Simulate the campaign and share the result.</li>
        </ol>
      </article>

      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        Back to home
      </Link>
    </main>
  );
}