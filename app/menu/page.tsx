import type { Metadata } from "next";
import MenuCard from "@/components/MenuCard";
import PourLine from "@/components/PourLine";
import ReserveTable from "@/components/ReserveTable";
import Section from "@/components/Section";
import { MENU_CATEGORY_ORDER, getMenuByCategory } from "@/lib/menu";

export const metadata: Metadata = {
  title: "Menu — The Spider",
  description: "Espresso drinks, pastries, sandwiches, and cold drinks at The Spider, Riyadh.",
};

export default function MenuPage() {
  const menuByCategory = getMenuByCategory();

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

      {MENU_CATEGORY_ORDER.map((category, index) => (
        <div key={category}>
          <PourLine />
          <Section className={index % 2 === 1 ? "bg-surface-alt" : ""}>
            <h2 className="font-display text-h2 text-ink">{category}</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {menuByCategory[category].map((item) => (
                <MenuCard key={item.name} item={item} />
              ))}
            </div>
          </Section>
        </div>
      ))}

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
