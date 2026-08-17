import type { MenuBadge } from "@/types/menu";

// components.md §4. "Popular" gets the solid accent fill (it's the set
// that appears on the homepage). "House Favorite" is a distinct claim —
// a gold outline keeps it visually separate rather than competing for
// the same solid treatment. Both badges sit on top of arbitrary product
// photos, so they carry their own translucent dark scrim + backdrop blur
// rather than relying on ink/border colors alone — a transparent outline
// on a dark photo (or dark ink on a dark photo) disappears otherwise.
const STYLES: Record<NonNullable<MenuBadge>, string> = {
  Popular: "bg-accent/90 text-ink-inverse backdrop-blur-sm",
  "House Favorite":
    "border border-accent-line bg-surface-inverse/75 text-accent-line backdrop-blur-sm",
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
