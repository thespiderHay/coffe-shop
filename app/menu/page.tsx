import type { Metadata } from "next";
import MenuTabs from "@/components/MenuTabs";
import PourLine from "@/components/PourLine";
import ReserveTable from "@/components/ReserveTable";
import Section from "@/components/Section";
import { MENU_CATEGORY_ORDER, getAllMenuItems } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu — The Spider",
  description: "Espresso drinks, pastries, sandwiches, and cold drinks at The Spider, Riyadh.",
};

export default function MenuPage() {
  const items = getAllMenuItems();

  return (
    <>
      <Section>
        <p className="font-sans text-sm font-medium uppercase tracking-[0.08em] text-ink-muted">
          The Menu
        </p>
        <h1 className="mt-3 max-w-xl font-display text-h1 text-ink">
          Everything we make, all in one place.
        </h1>
      </Section>

      <PourLine />
      <Section>
        <MenuTabs items={items} categories={MENU_CATEGORY_ORDER} />
      </Section>

      <PourLine />

      <Section className="bg-surface-accent text-ink-inverse" containerClassName="text-center">
        <h2 className="font-display text-h1">Ready when you are.</h2>
        <p className="mx-auto mt-3 max-w-md font-sans text-md text-ink-inverse">
          Reserve a table and we&apos;ll have a spot waiting.
        </p>
        <div className="mt-8 flex justify-center">
          <ReserveTable variant="cta" />
        </div>
      </Section>
    </>
  );
}
