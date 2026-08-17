export type MenuCategory =
  | "Espresso Drinks"
  | "Pastries"
  | "Sandwiches"
  | "Cold Drinks";

export type MenuBadge = "Popular" | "House Favorite" | null;

export interface MenuItem {
  category: MenuCategory;
  name: string;
  description: string;
  price: number;
  badge: MenuBadge;
}
