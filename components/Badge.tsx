import type { MenuBadge } from "@/types/menu";

// components.md §4. "Popular" gets the solid accent fill (it's the set
// that appears on the homepage). "House Favorite" is a distinct claim —
// a gold outline keeps it visually separate rather than competing for
// the same solid treatment.
const STYLES: Record<NonNullable<MenuBadge>, string> = {
  Popular: "bg-accent text-ink-inverse",
  "House Favorite": "border border-accent-line text-ink",
};

interface BadgeProps {
  label: NonNullable<MenuBadge>;
  className?: string;
}

export default function Badge({ label, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-4 py-1.5 text-sm font-medium font-sans ${STYLES[label]} ${className}`}
    >
      {label}
    </span>
  );
}
