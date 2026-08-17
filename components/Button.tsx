import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  href?: string;
}

// components.md §1. "secondary" is styled for use on the dark hero only
// (the only place this build uses it) — border-inverse/ink-inverse
// rather than a context-toggling prop, since a second usage site hasn't
// come up yet. Secondary/Ghost hover is a text underline using the Pour
// Line stroke color (--color-accent-line), not a border/color swap.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-ink-inverse hover:bg-accent-hover",
  secondary:
    "bg-transparent border border-border-inverse text-ink-inverse hover:underline hover:decoration-accent-line",
  ghost: "bg-transparent text-accent hover:underline hover:decoration-accent-line",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-base",
  sm: "px-[1.125rem] py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  href,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 min-h-11",
    "rounded-sm font-sans font-semibold tracking-[0.01em] underline-offset-4",
    "transition-colors duration-150 active:translate-y-px",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
