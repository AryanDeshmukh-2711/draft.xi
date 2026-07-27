import Link from "next/link";
import { Card, CardGrid, ChecklistGrid, Prose, Section } from "@/components/content";
import { HomePitch } from "@/components/home-pitch";
import { Reveal } from "@/components/motion";
import { checklist, faqs, howToPlaySteps, modes, rules, strategy } from "@/content/guide";
import { datasetStats } from "@/lib/squads";

const onThisPage = [
  { href: "#how-to-play", label: "How to play" },
  { href: "#rules", label: "Rules" },
  { href: "#bench", label: "The bench" },
  { href: "#rankings", label: "Rankings" },
  { href: "#strategy", label: "Strategy" },
  { href: "#checklist", label: "Checklist" },
  { href: "#modes", label: "Modes" },
  { href: "#faq", label: "FAQ" },
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="mx-auto w-full max-w-[104rem] px-4 pb-16 pt-12 sm:px-6 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <p className="inline-flex items-center gap-2 border border-[var(--border)] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              World Cup draft · 1970 — 2026
            </p>

            <h1 className="mt-6 text-[2.75rem] font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-7xl">
              Build your
              <span className="block text-[var(--accent)]">dream World Cup XI</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--muted)]">
              Roll a national team and a tournament year, draft one real player at a time, name a
              seven-man bench, and find out whether your side can turn football memory into a
              seven-nil statement.
            </p>

            <div className="mt-8 flex flex-wrap gap-2.5">
              <Link
                href="/play"
                className="clip-btn display glow bg-[var(--accent)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#04070d] transition hover:brightness-110"
              >
                Play now
              </Link>
              <Link
                href="/how-to-play"
                className="clip-btn border border-[var(--border)] bg-white/[0.04] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                How it works
              </Link>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-2.5">
              {[
                ["Nations", datasetStats.nations],
                ["Squads", datasetStats.squads],
                ["Players", datasetStats.players],
              ].map(([label, value]) => (
                <div key={label} className="border-l-2 border-[var(--accent)] pl-3">
                  <dd className="tnum display text-3xl font-bold leading-none text-white">
                    {value}
                  </dd>
                  <dt className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.12} className="hud hud-lit hud-rule p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">All-time preview</p>
              <span className="clip-tag bg-[var(--accent)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#04070d]">
                4-3-3
              </span>
            </div>

            <div className="mt-4">
              <HomePitch />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {[
                ["Modes", "Classic · Almanac"],
                ["Styles", "Def · Bal · Att"],
                ["Bench", "7 subs"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="clip-btn border border-[var(--border)] bg-white/[0.03] px-2 py-2.5 text-center"
                >
                  <div className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                    {label}
                  </div>
                  <div className="mt-1 text-[0.7rem] font-bold text-white">{value}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto w-full max-w-5xl px-4 pb-20 sm:px-6 lg:px-10">
        <nav className="hud p-4">
          <p className="eyebrow">On this page</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {onThisPage.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="clip-btn border border-[var(--border)] bg-white/[0.04] px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="mt-14 space-y-16">
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

          <Section id="bench" eyebrow="The bench" title="A bench, the way a manager builds one">
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

          <Section id="rankings" eyebrow="Rankings" title="Players carry their record with them">
            <Prose>
              A campaign does not end when the last whistle goes. Every player who took part has their
              record updated: appearances, results, how far the run went, and whether they started or
              came off the bench. That record turns into ranking points and a form figure, and the form
              shows up next to their rating the next time they turn up in a draw.
            </Prose>
            <CardGrid>
              <Card
                title="Every tournament counts"
                body="Matches played, wins and draws, and the round you went out in all feed a player's points. A bench appearance is worth just under half a start."
              />
              <Card
                title="Form you can see while drafting"
                body="A player who keeps winning tournaments shows a green ▲ next to their rating; one who keeps going out in the group shows a red ▼. It is a reputation, not a cheat sheet."
              />
              <Card
                title="Ratings stay honest"
                body="Form changes what a player is worth to you, not what the simulation does with them. Campaigns stay reproducible and leaderboard scores stay verifiable."
              />
            </CardGrid>
            <Reveal>
              <Link
                href="/players"
                className="clip-btn inline-flex border border-[var(--border)] bg-white/[0.04] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                See the player rankings
              </Link>
            </Reveal>
          </Section>

          <Section id="strategy" eyebrow="Strategy" title="Build the spine before the headline">
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
            <ChecklistGrid items={checklist} />
          </Section>

          <Section id="modes" eyebrow="Modes" title="Pick the mode that matches your memory">
            <CardGrid>
              {modes.map((item) => (
                <Card key={item.title} title={item.title} body={item.body} />
              ))}
            </CardGrid>
          </Section>

          <Section id="faq" eyebrow="FAQ" title="Common questions">
            <div className="space-y-2">
              {faqs.map((item) => (
                <details key={item.question} className="hud group px-5 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-white">
                    {item.question}
                    <span className="shrink-0 text-lg leading-none text-[var(--accent)] transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </Section>

          <section className="hud hud-lit p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white sm:text-4xl">
              Draw a squad. Protect the formation.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
              One draft takes a couple of minutes. The next will feel completely different, because
              the draw, the formation, and the memory pressure all change together.
            </p>
            <Link
              href="/play"
              className="clip-btn display glow mt-7 inline-flex bg-[var(--accent)] px-8 py-3.5 text-sm font-bold uppercase tracking-[0.16em] text-[#04070d] transition hover:brightness-110"
            >
              Start drafting
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
