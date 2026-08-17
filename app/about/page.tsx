import type { Metadata } from "next";
import Image from "next/image";
import PourLine from "@/components/PourLine";
import Section from "@/components/Section";
import { ABOUT_IMAGE } from "@/lib/images";

export const metadata: Metadata = {
  title: "About — The Spider",
  description: "The story behind The Spider, a neighbourhood coffee shop in Riyadh.",
};

const TIMELINE = [
  { year: "2016", text: "Sara and Yousef meet in a coffee cupping class." },
  { year: "2019", text: "Start roasting at home, selling bags at weekend markets." },
  { year: "2021", text: "Move into the first shopfront — and inherit the plant." },
  { year: "2022", text: "The Spider opens properly." },
];

export default function AboutPage() {
  return (
    <>
      <Section>
        <p className="font-sans text-sm font-medium uppercase tracking-[0.08em] text-ink-muted">
          About us
        </p>
        <div className="mt-3 grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-h1 text-ink">
              Sara, Yousef, and a plant that wouldn&apos;t die.
            </h1>
            <div className="mt-6 flex flex-col gap-4 font-sans text-base text-ink-muted">
              <p>
                Sara Al-Otaibi and Yousef Hamdan met in 2016, in a cupping class neither of them
                expected to enjoy as much as they did — two engineers spending a Thursday night
                arguing about acidity and body instead of finishing the coursework they&apos;d
                actually signed up for. Coffee won.
              </p>
              <p>
                For three years it stayed a hobby — roasting on a modified popcorn machine in
                Yousef&apos;s kitchen, hauling bags of green beans back from trips abroad, selling
                what they could at weekend markets around Riyadh. In 2021 they finally rented a
                real space: a narrow, slightly run-down shopfront near Al Wurood that nobody else
                wanted.
              </p>
            </div>
          </div>

          <div className="relative aspect-[4/5] w-full max-w-sm rotate-2 justify-self-center overflow-hidden rounded-lg shadow-warm-lg md:justify-self-end">
            <Image
              src={ABOUT_IMAGE}
              alt=""
              fill
              sizes="(min-width: 768px) 24rem, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <PourLine />

      <Section className="bg-surface-alt">
        <div className="mx-auto max-w-2xl">
          <p className="font-sans text-base text-ink-muted">
            It came with one thing going for it — an enormous, stubborn spider plant that had
            taken over the front window and refused to die despite years of obvious neglect. Sara
            wanted to rip it out. Yousef wouldn&apos;t let her. Regulars started calling it
            &ldquo;the spider plant place&rdquo; before they&apos;d even settled on a real name,
            and eventually they just gave in. The plant&apos;s still there, by the window, bigger
            than ever.
          </p>
          <p className="mt-4 font-sans text-base text-ink-muted">
            What started as two people and a popcorn roaster is now a full kitchen, a small team,
            and a weekly rhythm the neighbourhood has folded into its own: open mic on Friday
            nights, a coffee tasting most Saturday mornings, and regulars who no longer need to
            order out loud.
          </p>
        </div>
      </Section>

      <PourLine />

      <Section>
        <h2 className="font-display text-h2 text-ink">How we got here</h2>
        <ol className="mt-8 flex flex-col gap-6 border-l border-border pl-6">
          {TIMELINE.map((item) => (
            <li key={item.year} className="flex gap-4">
              <span className="font-mono text-sm text-ink-muted">{item.year}</span>
              <span className="font-sans text-base text-ink-muted">{item.text}</span>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
