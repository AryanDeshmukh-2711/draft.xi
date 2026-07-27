import Link from "next/link";
import { Card, CardGrid, Prose, Section } from "@/components/content";
import { checklist, faqs, howToPlaySteps, modes, rules, strategy } from "@/content/guide";
import { datasetStats } from "@/lib/squads";

const onThisPage = [
  { href: "#how-to-play", label: "How to play" },
  { href: "#rules", label: "Rules" },
  { href: "#bench", label: "The bench" },
  { href: "#strategy", label: "Strategy" },
  { href: "#checklist", label: "Draft checklist" },
  { href: "#modes", label: "Modes" },
  { href: "#faq", label: "FAQ" },
];

const previewXi = [
  ["1", "Neuer"],
  ["4", "C. Alberto"],
  ["5", "Beckenbauer"],
  ["6", "Moore"],
  ["6", "R. Carlos"],
  ["8", "Gérson"],
  ["10", "Pelé"],
  ["10", "Maradona"],
  ["10", "Messi"],
  ["9", "Ronaldo"],
  ["7", "Cruyff"],
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function Home() {
  return (
    <main className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_20%_0%,rgba(255,107,53,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(31,58,95,0.5),transparent_40%)]" />

      <section className="relative mx-auto w-full max-w-[104rem] px-4 pb-12 pt-10 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-[var(--muted)]">
              World Cup draft · 1970 — 2026
            </p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
              Draft XI: build your
              <span className="block text-[var(--accent)]">dream World Cup XI</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Roll a national team and a tournament year, draft one real player at a time, name a
              seven-man bench, and find out whether your side can turn football memory into a
              seven-nil statement.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/play"
                className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--accent-strong)]"
              >
                Play now
              </Link>
              <Link
                href="/how-to-play"
                className="rounded-full border border-[var(--border)] bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                How it works
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--muted)]">
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
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              <span>All-time preview</span>
              <span>4-3-3</span>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {previewXi.map(([number, name]) => (
                <li
                  key={`${number}-${name}`}
                  className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-black/25 px-3 py-2.5"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/40 text-xs font-bold text-white">
                    {number}
                  </span>
                  <span className="truncate text-sm font-semibold text-white">{name}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Modes", "Classic · Almanac"],
                ["Styles", "Def · Bal · Att"],
                ["Bench", "7 substitutes"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[var(--border)] bg-black/25 px-2 py-2.5">
                  <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-[var(--muted)]">
                    {label}
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6 lg:px-10">
        <nav className="rounded-[1.25rem] border border-[var(--border)] bg-black/25 p-4">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[var(--muted)]">
            On this page
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {onThisPage.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full border border-[var(--border)] bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-12 space-y-14">
          <Section eyebrow="Game guide" title="What is Draft XI?">
            <Prose>
              Draft XI is a free World Cup draft challenge for fans who remember national teams as more
              than names on a spreadsheet. Each turn draws one country and one tournament year. That
              squad becomes your market, and you choose one footballer who fits an open role in your
              side. The game keeps asking the same sharp question: do you take the most famous player,
              or the one your formation actually needs?
            </Prose>
            <Prose>
              A good run feels quick, but it is never empty. You roll, read the squad, compare the open
              positions, and decide whether the XI needs a goalkeeper, a centre-back, a full-back, a
              midfielder, a winger, or a striker. Once the lineup is complete and the bench is named,
              the campaign simulates seven matches and turns your draft into a story: a clean run, a
              narrow escape, a collapse, or the seven-nil.
            </Prose>
          </Section>

          <Section id="how-to-play" eyebrow="How to play" title="Four steps, one minute to learn">
            <CardGrid>
              {howToPlaySteps.map((item) => (
                <Card key={item.step} step={item.step} title={item.title} body={item.body} />
              ))}
            </CardGrid>
          </Section>

          <Section id="rules" eyebrow="Rules" title="Rules and scoring logic">
            <Prose>
              The rules stay simple because the best version of this game should feel like a fast
              football argument with a clear scoreboard. A turn is a draw, a squad, and one pick. The
              formation creates the open slots, the squad creates the choices, and your decision
              creates the story.
            </Prose>
            <CardGrid>
              {rules.map((item) => (
                <Card key={item.title} title={item.title} body={item.body} />
              ))}
            </CardGrid>
          </Section>

          <Section id="bench" eyebrow="New" title="The bench, the way a manager builds one">
            <Prose>
              Most draft games stop at eleven. Draft XI does not. Under the pitch sit seven substitute
              slots taken straight from a professional manager&apos;s matchday sheet: a reserve
              goalkeeper, two defensive covers, two in midfield, one attacker, and a free impact slot
              that anyone can fill.
            </Prose>
            <CardGrid>
              <Card
                title="Cover the roles, not the names"
                body="Each bench slot only accepts a player who can genuinely do that job. A striker cannot fill the reserve keeper slot, and the game will not let you pretend otherwise."
              />
              <Card
                title="Substitutions happen mid-campaign"
                body="As the tournament wears on, legs go. If the bench has someone to bring on, the campaign shows the substitution and the drop-off is cushioned. If it does not, you watch the XI fade."
              />
              <Card
                title="Bench strength is scored"
                body="Depth, quality, and whether you named a reserve keeper all feed a bench rating that lifts your overall score. Seven spare strikers is not depth."
              />
            </CardGrid>
          </Section>

          <Section id="strategy" eyebrow="Strategy" title="Build the spine before chasing the headline">
            <Prose>
              The easiest mistake is collecting attackers. Forwards live in highlight reels and wingers
              are fun, but the simulation rewards the spine first. A strong goalkeeper saves bad
              simulations, centre-backs keep the campaign alive, full-backs protect width, and central
              midfielders connect the side. Once the structure is safe, the icons have somewhere to
              play.
            </Prose>
            <CardGrid>
              {strategy.map((item) => (
                <Card key={item.title} title={item.title} body={item.body} />
              ))}
            </CardGrid>
          </Section>

          <Section id="checklist" eyebrow="Draft checklist" title="A quick checklist before you roll">
            <ul className="grid gap-2 sm:grid-cols-2">
              {checklist.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-white/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="modes" eyebrow="Modes" title="Pick the mode that matches your memory">
            <CardGrid>
              {modes.map((item) => (
                <Card key={item.title} title={item.title} body={item.body} />
              ))}
            </CardGrid>
          </Section>

          <Section id="faq" eyebrow="FAQ" title="Common questions">
            <div className="space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-white">
                    {item.question}
                    <span className="float-right text-[var(--muted)] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </Section>

          <section className="rounded-[1.5rem] border border-[var(--accent)] bg-[rgba(255,107,53,0.1)] p-6 text-center">
            <h2 className="text-2xl font-bold text-white">Draw a squad, protect the formation.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
              One draft takes a couple of minutes. The next one will feel completely different, because
              the draw, the formation, and the memory pressure all change together.
            </p>
            <Link
              href="/play"
              className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--accent-strong)]"
            >
              Start drafting
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
