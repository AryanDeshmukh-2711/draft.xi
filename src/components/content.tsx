import Link from "next/link";
import { Reveal, StaggerItem, StaggerList } from "@/components/motion";

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
      <Reveal>
        {eyebrow ? (
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2.5 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
      </Reveal>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <Reveal>
      <p className="max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">{children}</p>
    </Reveal>
  );
}

export function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <StaggerList className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{children}</StaggerList>
  );
}

export function Card({ title, body, step }: { title: string; body: string; step?: string }) {
  return (
    <StaggerItem className="hud group h-full p-5 transition-colors hover:border-[var(--border-lit)]">
      {step ? (
        <p className="tnum text-2xl font-bold leading-none text-[var(--accent)] opacity-40 transition group-hover:opacity-100">
          {step}
        </p>
      ) : null}
      <h3 className="mt-2 text-base font-bold uppercase tracking-[0.02em] text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
    </StaggerItem>
  );
}

export function ChecklistGrid({ items }: { items: string[] }) {
  return (
    <StaggerList className="grid gap-2 sm:grid-cols-2">
      {items.map((item, index) => (
        <StaggerItem
          key={item}
          className="clip-btn flex items-start gap-3 border border-[var(--border)] bg-white/[0.03] px-4 py-3"
        >
          <span className="tnum shrink-0 text-xs font-bold text-[var(--accent)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm leading-6 text-white/85">{item}</span>
        </StaggerItem>
      ))}
    </StaggerList>
  );
}

export function PlayCta({ label = "Start a draft" }: { label?: string }) {
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Link
        href="/play"
        className="clip-btn display glow bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-[#04070d] transition hover:brightness-110"
      >
        {label}
      </Link>
      <Link
        href="/leaderboard"
        className="clip-btn border border-[var(--border)] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
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
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-10">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white sm:text-5xl">
        {title}
      </h1>
      <p className="mt-5 max-w-3xl text-[0.95rem] leading-7 text-[var(--muted)]">{intro}</p>
      <div className="mt-12 space-y-14">{children}</div>
      <div className="mt-14">
        <PlayCta />
      </div>
    </main>
  );
}
