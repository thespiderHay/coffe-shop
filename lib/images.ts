import type { MenuCategory } from "@/types/menu";

// One distinct photo per menu item, keyed by the item's `name` from
// docs/menu-item.csv (see lib/menu.ts).
export const MENU_ITEM_IMAGES: Record<string, string> = {
  Espresso: "/images/menu-espresso.webp",
  Americano: "/images/menu-americano.webp",
  Cappuccino: "/images/menu-cappuccino.webp",
  Cortado: "/images/menu-cortado.webp",
  "Caramel Macchiato": "/images/menu-caramel-macchiato.webp",
  "Butter Croissant": "/images/menu-butter-croissant.webp",
  "Almond Croissant": "/images/menu-almond-croissant.webp",
  "Cinnamon Roll": "/images/menu-cinnamon-roll.webp",
  "Blueberry Muffin": "/images/menu-blueberry-muffin.webp",
  "Chocolate Chip Cookie": "/images/menu-chocolate-chip-cookie.webp",
  "Turkey & Swiss": "/images/menu-turkey-swiss.webp",
  "Avocado Toast": "/images/menu-avocado-toast.webp",
  "Ham & Gruyère Croissant": "/images/menu-ham-gruyere-croissant.webp",
  "Caprese Panini": "/images/menu-caprese-panini.webp",
  "Egg & Cheddar Breakfast Sandwich": "/images/menu-egg-cheddar-breakfast-sandwich.webp",
  "Iced Latte": "/images/menu-iced-latte.webp",
  "Cold Brew": "/images/menu-cold-brew.webp",
  "Iced Matcha Latte": "/images/menu-iced-matcha-latte.webp",
  "Vanilla Sweet Cream Cold Brew": "/images/menu-vanilla-sweet-cream-cold-brew.webp",
  "Iced Chai Latte": "/images/menu-iced-chai-latte.webp",
};

export const EVENT_IMAGES: Record<string, string> = {
  "open-mic": "/images/event-open-mic.webp",
  "coffee-tasting": "/images/event-coffee-tasting.webp",
};

export const HERO_IMAGE = "/images/hero.webp";
export const ABOUT_IMAGE = "/images/about-interior.webp";

// components.md §3 specs a "roast dot" for Light/Medium/Dark roast — a
// concept that only literally applies to coffee. Since our menu spans
// food categories too, we repurpose the same Roast Scale palette as a
// category-identity dot instead: still one color per category, still
// drawn only from the documented palette, just standing for "which
// section of the menu" rather than strictly "how dark was this roasted."
export const CATEGORY_DOT_CLASS: Record<MenuCategory, string> = {
  "Espresso Drinks": "bg-medium-roast",
  "Cold Drinks": "bg-light-roast",
  Pastries: "bg-crema-gold",
  Sandwiches: "bg-fresh",
};
