import Link from "next/link";

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      {eyebrow ? (
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent-strong)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <p className="max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">{children}</p>;
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

export function Card({ title, body, step }: { title: string; body: string; step?: string }) {
  return (
    <article className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5">
      {step ? (
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--accent-strong)]">
          {step}
        </p>
      ) : null}
      <h3 className="mt-1.5 text-base font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </article>
  );
}

export function PlayCta({ label = "Start a draft" }: { label?: string }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Link
        href="/play"
        className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--accent-strong)]"
      >
        {label}
      </Link>
      <Link
        href="/leaderboard"
        className="rounded-full border border-[var(--border)] bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        See the Top 100
      </Link>
    </div>
  );
}

export function ContentPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-10">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent-strong)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">{intro}</p>
      <div className="mt-10 space-y-12">{children}</div>
      <div className="mt-12">
        <PlayCta />
      </div>
    </main>
  );
}
