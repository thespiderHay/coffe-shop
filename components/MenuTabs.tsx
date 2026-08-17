"use client";

import { useState } from "react";
import MenuCard from "@/components/MenuCard";
import type { MenuCategory, MenuItem } from "@/types/menu";

const ALL = "All" as const;
const FAN_FAVORITES = "Fan Favorites" as const;

type Tab = MenuCategory | typeof ALL | typeof FAN_FAVORITES;

interface MenuTabsProps {
  items: MenuItem[];
  categories: MenuCategory[];
}

// components.md §4 filter chip: surface-alt/ink/border by default,
// accent fill + inverse text when selected — the same pill used for
// roast-level filters, reused here as the menu's category tab bar.
export default function MenuTabs({ items, categories }: MenuTabsProps) {
  const [active, setActive] = useState<Tab>(ALL);
  const tabs: Tab[] = [ALL, ...categories, FAN_FAVORITES];

  const fanFavorites = items.filter((item) => item.badge !== null);
  const visibleCategories = active === ALL ? categories : active === FAN_FAVORITES ? [] : [active];

  return (
    <div>
      <div role="tablist" aria-label="Menu categories" className="flex flex-wrap gap-3">
        {tabs.map((tab) => {
          const isActive = tab === active;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(tab)}
              className={`rounded-pill px-4 py-1.5 font-sans text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-accent text-ink-inverse"
                  : "border border-border bg-surface-alt text-ink hover:border-accent-line"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {active === FAN_FAVORITES ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {fanFavorites.map((item) => (
            <MenuCard key={item.name} item={item} />
          ))}
        </div>
      ) : (
        visibleCategories.map((category) => (
          <div key={category} className="mt-10">
            {active === ALL && <h2 className="font-display text-h2 text-ink">{category}</h2>}
            <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 ${active === ALL ? "mt-8" : ""}`}>
              {items
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuCard key={item.name} item={item} />
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
