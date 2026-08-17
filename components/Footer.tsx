import Link from "next/link";
import PourLine from "@/components/PourLine";

const CONTACT = {
  address: "Al Wurood District, Riyadh",
  phone: "+966 11 555 0148",
  hours: "Daily · 7:00 AM – 10:00 PM",
};

export default function Footer() {
  return (
    <footer className="bg-surface-inverse text-ink-inverse">
      <PourLine />

      <div className="mx-auto grid max-w-[var(--container-max)] gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-h3 font-semibold">The Spider</p>
          <p className="mt-3 max-w-xs font-sans text-sm text-ink-muted-inverse">
            A cosy neighbourhood coffee shop in Riyadh — specialty coffee, fresh pastries, and
            light lunches.
          </p>
        </div>

        <div className="font-sans text-sm text-ink-muted-inverse">
          <p className="mb-2 font-medium text-ink-inverse">Visit</p>
          <p className="font-mono">{CONTACT.address}</p>
          <p className="mt-1 font-mono">{CONTACT.phone}</p>
          <p className="mt-1 font-mono">{CONTACT.hours}</p>
        </div>

        <div className="font-sans text-sm">
          <p className="mb-2 font-medium text-ink-inverse">Explore</p>
          <nav className="flex flex-col gap-2 text-ink-muted-inverse">
            <Link
              href="/"
              className="rounded-sm hover:text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="rounded-sm hover:text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              About
            </Link>
            <Link
              href="/menu"
              className="rounded-sm hover:text-ink-inverse focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
            >
              Menu
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-border-inverse px-6 py-6 text-center font-sans text-xs text-ink-muted-inverse">
        © {new Date().getFullYear()} The Spider. All rights reserved.
      </div>
    </footer>
  );
}
