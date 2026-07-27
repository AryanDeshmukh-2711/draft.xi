import type { Metadata } from "next";
import { Card, CardGrid, ContentPage, Prose, Section } from "@/components/content";
import { howToPlaySteps, modes } from "@/content/guide";

export const metadata: Metadata = {
  title: "How to play",
  description:
    "Learn the Draft XI loop in a minute: roll a World Cup squad, take one player per turn, name a bench, and simulate the campaign.",
  alternates: { canonical: "/how-to-play" },
};

export default function HowToPlayPage() {
  return (
    <ContentPage
      eyebrow="How to play"
      title="How to play Draft XI"
      intro="Draft XI is designed to be understood in one minute and replayed for hours. The loop is simple so your first click is easy, but the later decisions reward real football knowledge. There are no contracts, transfers, or chemistry cards — just one idea: build the best possible World Cup XI from the squads the draw hands you."
    >
      <Section title="The loop">
        <CardGrid>
          {howToPlaySteps.map((item) => (
            <Card key={item.step} step={item.step} title={item.title} body={item.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Setting up a draft">
        <Prose>
          Before the first roll you make three choices. The formation decides which eleven slots you
          are trying to fill, and it changes the whole draft — a 4-2-4 needs four forwards and forgives
          nothing at the back, while a 5-3-2 asks for five defenders you may struggle to find. The
          style sets how the campaign is scored. The mode decides whether you can see player ratings at
          all.
        </Prose>
        <CardGrid>
          {modes.map((item) => (
            <Card key={item.title} title={item.title} body={item.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Filling the bench">
        <Prose>
          Once the starting eleven is complete you can keep rolling and put players on the bench
          instead. Seven slots are available: a reserve goalkeeper, two defensive covers, two midfield
          covers, one attacker, and a free impact slot. Each slot only accepts a player who can
          actually do that job.
        </Prose>
        <Prose>
          The bench is optional. Sending out a bare eleven is a legitimate gamble — it just means that
          when fatigue arrives in the knockout rounds, there is nobody to bring on. A full bench with a
          real reserve keeper both raises your overall rating and cushions the drop-off across the
          seven-match campaign.
        </Prose>
      </Section>

      <Section title="Reading the scorecard">
        <Prose>
          The panel beside the pitch updates with every pick. Attack blends the finishing and creation
          in the forward positions with how well your midfield moves the ball. Defense weights the
          goalkeeper and back line most heavily, with the holding midfielders behind them. Balance
          penalises two things: a large gap between attack and defense, and players asked to play out
          of position.
        </Prose>
        <Prose>
          In Almanac mode all three read as dashes until the campaign is simulated. That is the point —
          you are drafting on memory, not on numbers.
        </Prose>
      </Section>
    </ContentPage>
  );
}
