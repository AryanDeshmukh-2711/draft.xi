import type { Metadata } from "next";
import { ContentPage, Section } from "@/components/content";
import { faqs } from "@/content/guide";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the common questions about Draft XI: what it is, how the bench works, whether ratings are shown, and how results are shared.",
  alternates: { canonical: "/faq" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ContentPage
        eyebrow="FAQ"
        title="Common questions about Draft XI"
        intro="These answers help new players understand the game before they draft. They also clarify the difference between a World Cup draft, a general football quiz, and a full management simulator."
      >
        <Section title="Questions">
          <div className="space-y-3">
            {faqs.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <h3 className="text-base font-bold text-white">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </Section>
      </ContentPage>
    </>
  );
}
