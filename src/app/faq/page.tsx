import Link from "next/link";

export default function FaqPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 sm:px-8 lg:px-12">
      <article className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-xl shadow-black/20 backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">FAQ</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">Common questions</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-[var(--muted)]">
          <div>
            <h2 className="font-semibold text-white">Is the project playable yet?</h2>
            <p>Not yet. This scaffold sets up the routes, styling, and layout for the full game build.</p>
          </div>
          <div>
            <h2 className="font-semibold text-white">What comes next?</h2>
            <p>Data seeding, the random squad API, the formation model, and the draft loop.</p>
          </div>
        </div>
      </article>

      <Link href="/" className="mt-6 inline-flex rounded-full border border-[var(--border)] bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
        Back to home
      </Link>
    </main>
  );
}