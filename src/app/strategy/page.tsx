import type { Metadata } from "next";
import { Card, CardGrid, ChecklistGrid, ContentPage, Prose, Section } from "@/components/content";
import { checklist, strategy } from "@/content/guide";

export const metadata: Metadata = {
  title: "Strategy",
  description:
    "How to win a Draft XI run: build the spine first, respect scarce roles, spend rerolls with a reason, and use the bench properly.",
  alternates: { canonical: "/strategy" },
};

export default function StrategyPage() {
  return (
    <ContentPage
      eyebrow="Strategy"
      title="Build the spine before chasing the headline player"
      intro="The easiest mistake is collecting attackers. That temptation makes sense: forwards live in highlight reels, wingers are fun, and attacking midfielders make a draft feel glamorous. But the simulation rewards the spine first."
    >
      <Section title="Core principles">
        <CardGrid>
          {strategy.map((item) => (
            <Card key={item.title} title={item.title} body={item.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Scarcity is the real game">
        <Prose>
          You may not see another elite goalkeeper for several turns. You will get plenty of attackers
          and very few natural full-backs. When the draw hands you a rare role, taking it is usually
          stronger than a marginal upgrade further forward — even when the marginal upgrade has the
          bigger name.
        </Prose>
        <Prose>
          The same logic applies to formations. A 5-3-2 or 3-5-2 sounds solid until you realise how few
          squads hand you three centre-backs worth starting. Pick the shape that matches how patient
          you are willing to be.
        </Prose>
      </Section>

      <Section title="Using the bench well">
        <Prose>
          Once the XI is full, every further draw is a bench decision. The order that tends to work:
          reserve goalkeeper first, then a defender who covers more than one position, then a
          midfielder who can hold. The free impact slot is where a genuine match-winner belongs, not a
          third striker who will never come on for anyone.
        </Prose>
        <Prose>
          If the draft has gone badly and the XI is patched together, a strong bench is the cheapest
          way to claw back overall rating. If the XI is excellent, the bench mostly protects you
          through the knockout rounds when fatigue starts biting.
        </Prose>
      </Section>

      <Section title="Almanac mode changes the mood">
        <Prose>
          With ratings hidden, your own football memory matters more. Was that player a starter? Did
          that team defend high? Was the tournament form as good as the club reputation? Those
          questions make each run personal, because every pick reveals what you remember and what you
          only think you remember. If a draft feels too easy, switch formation or turn on Almanac and
          the choices get much sharper.
        </Prose>
      </Section>

      <Section title="The checklist">
        <ChecklistGrid items={checklist} />
      </Section>
    </ContentPage>
  );
}
