import Image from "next/image";
import Button from "@/components/Button";
import EventCard from "@/components/EventCard";
import MenuCard from "@/components/MenuCard";
import PourLine from "@/components/PourLine";
import ReserveTable from "@/components/ReserveTable";
import Section from "@/components/Section";
import { getUpcomingEvents } from "@/lib/events";
import { HERO_IMAGE } from "@/lib/images";
import { getPopularItems } from "@/lib/menu";

// Without this, Next statically prerenders the page once at build time and
// bakes in whatever `getUpcomingEvents()` computes from `new Date()` at
// that moment — the "This week" dates would then go stale until the next
// deploy instead of tracking the real upcoming Friday/Saturday.
export const revalidate = 3600;

export default function Home() {
  const popularItems = getPopularItems();
  const upcomingEvents = getUpcomingEvents();

  return (
    <>
      <section className="relative flex min-h-[36rem] items-end overflow-hidden bg-surface-inverse text-ink-inverse md:min-h-[42rem]">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(43,27,20,0.35) 0%, rgba(43,27,20,0.88) 100%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-[var(--container-max)] px-6 pb-16 pt-32">
          <p className="font-sans text-sm font-medium uppercase tracking-[0.08em] text-ink-muted-inverse">
            The Spider — Riyadh
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] md:text-hero">
            A quiet corner for good coffee.
          </h1>
          <p className="mt-5 max-w-md font-sans text-md text-ink-muted-inverse">
            Small-batch roasts, fresh pastries, and a table that&apos;s yours for as long as you
            need it.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <ReserveTable variant="hero" />
            <Button href="/menu" variant="secondary">
              View the menu
            </Button>
          </div>
        </div>
      </section>

      <Section>
        <h2 className="font-display text-h1 text-ink">Popular right now</h2>
        <p className="mt-2 max-w-lg font-sans text-md text-ink-muted">
          The four things regulars order without looking at the menu.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularItems.map((item) => (
            <MenuCard key={item.name} item={item} />
          ))}
        </div>
      </Section>

      <PourLine />

      <Section className="bg-surface-alt">
        <h2 className="font-display text-h1 text-ink">This week</h2>
        <p className="mt-2 max-w-lg font-sans text-md text-ink-muted">
          Two standing dates, every week, rain or shine.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </Section>

      <PourLine />

      <Section className="bg-surface-accent text-ink-inverse" containerClassName="text-center">
        <h2 className="font-display text-h1">Come sit with us.</h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-md text-ink-inverse">
          Tables go quickly on weekend mornings — reserve ahead and we&apos;ll have it ready.
        </p>
        <div className="mt-8 flex justify-center">
          <ReserveTable variant="cta" />
        </div>
      </Section>
    </>
  );
}
