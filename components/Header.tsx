"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ReserveTable from "@/components/ReserveTable";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/menu", label: "Menu" },
];

// components.md §2. Active-link underline and the mobile menu both need
// client state, so the whole header is a client component.
export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-surface-inverse text-ink-inverse">
      <div className="mx-auto flex h-16 max-w-[var(--container-max)] items-center justify-between px-6 md:h-20">
        <Link
          href="/"
          className="rounded-sm font-display text-h3 font-semibold text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          onClick={() => setIsMenuOpen(false)}
        >
          The Spider
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm border-b-[1.5px] pb-1 font-sans text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${
                  isActive
                    ? "border-accent-line text-ink-inverse"
                    : "border-transparent text-ink-muted-inverse hover:text-ink-inverse"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <ReserveTable variant="nav" />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring md:hidden"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {isMenuOpen ? (
              <path
                d="M6 6L18 18M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="bg-surface-inverse px-6 pb-6 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex min-h-11 items-center rounded-sm font-sans text-base text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4">
            <ReserveTable variant="nav" />
          </div>
        </div>
      )}
    </header>
  );
}
