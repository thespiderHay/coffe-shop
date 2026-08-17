// Server-only: reads docs/menu-item.csv from disk via `fs`. Only import
// this from Server Components (never from a "use client" file) — pulling
// `fs` into a client bundle will break the build.
import fs from "node:fs";
import path from "node:path";
import { parseCsv } from "@/lib/csv";
import type { MenuBadge, MenuCategory, MenuItem } from "@/types/menu";

export const MENU_CATEGORY_ORDER: MenuCategory[] = [
  "Espresso Drinks",
  "Pastries",
  "Sandwiches",
  "Cold Drinks",
];

function parseBadge(raw: string): MenuBadge {
  return raw === "Popular" || raw === "House Favorite" ? raw : null;
}

let cachedItems: MenuItem[] | null = null;

export function getAllMenuItems(): MenuItem[] {
  if (cachedItems) return cachedItems;

  const csvPath = path.join(process.cwd(), "docs/menu-item.csv");
  const content = fs.readFileSync(csvPath, "utf-8");
  const rows = parseCsv(content);

  cachedItems = rows.map((row) => ({
    category: row.category as MenuCategory,
    name: row.name,
    description: row.description,
    price: Number.parseFloat(row.price),
    badge: parseBadge(row.badge),
  }));

  return cachedItems;
}

export function getPopularItems(): MenuItem[] {
  return getAllMenuItems().filter((item) => item.badge === "Popular");
}
