import Image from "next/image";
import Badge from "@/components/Badge";
import { CATEGORY_DOT_CLASS, MENU_ITEM_IMAGES } from "@/lib/images";
import type { MenuItem } from "@/types/menu";

interface MenuCardProps {
  item: MenuItem;
}

// components.md §3. Deliberately omits the spec's "Order" button — this
// build has no ordering/cart system to send it to. One "Reserve a table"
// CTA covers the menu page instead (see app/menu/page.tsx).
export default function MenuCard({ item }: MenuCardProps) {
  return (
    <article className="group overflow-hidden rounded-md bg-surface shadow-warm-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-warm-md">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={MENU_ITEM_IMAGES[item.name]}
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
        {item.badge && (
          <div className="absolute right-3 top-3">
            <Badge label={item.badge} />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 font-sans text-sm text-ink-muted">
          <span className={`h-2 w-2 rounded-full ${CATEGORY_DOT_CLASS[item.category]}`} />
          {item.category}
        </div>

        <h3 className="mt-2 font-display text-h3 text-ink underline-offset-4 decoration-accent-line group-hover:underline">
          {item.name}
        </h3>

        <p className="mt-1 font-sans text-sm text-ink-muted">{item.description}</p>

        <p className="mt-3 font-mono text-md text-ink">${item.price.toFixed(2)}</p>
      </div>
    </article>
  );
}
