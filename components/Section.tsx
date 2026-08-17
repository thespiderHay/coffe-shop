import type { ElementType, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  as?: ElementType;
}

// components.md §9: vertical rhythm (padding-block) belongs to the outer
// element, horizontal max-width belongs to the inner one. Kept as one
// component, rather than two ad hoc classes per page, so nothing ever
// lets a child's own margin fight this element's padding.
export default function Section({
  children,
  className = "",
  containerClassName = "",
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag
      className={`py-[var(--section-y-mobile)] md:py-[var(--section-y)] px-[var(--container-padding)] ${className}`}
    >
      <div className={`mx-auto w-full max-w-[var(--container-max)] ${containerClassName}`}>
        {children}
      </div>
    </Tag>
  );
}
