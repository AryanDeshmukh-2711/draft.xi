import type { Metadata } from "next";
import { Card, CardGrid, ContentPage, Prose, Section } from "@/components/content";
import { rules } from "@/content/guide";

export const metadata: Metadata = {
  title: "Rules and scoring",
  description:
    "The full Draft XI ruleset: one draw and one pick per turn, three rerolls, position eligibility, bench scoring, styles, and how the campaign is simulated.",
  alternates: { canonical: "/rules" },
};

const scoring = [
  {
    title: "Attack",
    body: "Weighted towards the forward positions, with wingers and strikers counting most and full-backs contributing a little. A midfield that passes well lifts the number further.",
  },
  {
    title: "Defense",
    body: "The goalkeeper carries the most weight, then the centre-backs, then the full-backs and holding midfielders. Physicality feeds in as the stamina that holds the shape late.",
  },
  {
    title: "Balance",
    body: "Starts at 100 and falls with the gap between attack and defense, and with every player asked to fill a role they did not play. A lopsided side is punished even if the names are enormous.",
  },
  {
    title: "Bench strength",
    body: "Average quality of the substitutes, scaled by how many slots you filled and whether one of them is a genuine goalkeeper. It adds up to five points to the overall rating.",
  },
  {
    title: "Overall",
    body: "Attack, defense, and balance combined using the weights your chosen style sets, plus the bench bonus. This is the number the Top 100 ranks on.",
  },
];

export default function RulesPage() {
  return (
    <ContentPage
      eyebrow="Rules"
      title="Draft XI rules and scoring logic"
      intro="The rules stay simple because the best version of this game should feel like a fast football argument with a clear scoreboard. A turn is a draw, a squad, and one pick. The formation creates the open slots, the squad creates the choices, and your decision creates the story."
    >
      <Section title="The draft rules">
        <CardGrid>
          {rules.map((item) => (
            <Card key={item.title} title={item.title} body={item.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title="Position eligibility">
        <Prose>
          Every player carries the roles they actually played, listed primary first — you will see
          entries like ST, ST/LW, or RM/LM/CM. A slot accepts that player at full value if the slot is
          one of their listed roles. It also accepts a short list of neighbouring roles at a small
          discount: a right-back can cover right wing-back, a central midfielder can drop into the
          holding role, a striker can shift to a wing.
        </Prose>
        <Prose>
          Nothing stretches further than that. A centre-back will not fill your striker slot, and no
          outfield player will ever go in goal. If nobody in the drawn squad can fill anything you have
          open, that is what the rerolls are for.
        </Prose>
      </Section>

      <Section title="How a run is scored">
        <CardGrid>
          {scoring.map((item) => (
            <Card key={item.title} title={item.title} body={item.body} />
          ))}
        </CardGrid>
      </Section>

      <Section title="The campaign">
        <Prose>
          The simulation plays seven matches: three group games, then the round of 16, quarter-final,
          semi-final, and final. Opponents get stronger every round. Goals are drawn from your attack
          against their defense and their attack against your defense, so a strong side still loses
          the occasional match — tournaments work that way.
        </Prose>
        <Prose>
          Fewer than four points from the group means you go home early. A knockout tie that ends level
          goes to a shoot-out, decided largely by your goalkeeper and the balance of the side. Fatigue
          builds across the campaign, and each substitution you can make pulls some of it back.
        </Prose>
        <Prose>
          The same picks, formation, style, and seed always produce the same campaign, so a result can
          be replayed and verified. The Top 100 recomputes every submitted score on the server from the
          picks themselves, which means a score cannot be edited on the way in.
        </Prose>
      </Section>
    </ContentPage>
  );
}
