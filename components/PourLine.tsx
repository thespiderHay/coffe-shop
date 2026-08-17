"use client";

import { useEffect, useRef } from "react";

interface PourLineProps {
  className?: string;
}

// components.md §5 — the signature element. A hand-drawn gold line that
// draws itself in once a section boundary scrolls into view, standing in
// for a hard divider rule. Use once per section boundary, never as
// mid-section decoration.
export default function PourLine({ className = "" }: PourLineProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.setProperty("--path-length", `${length}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          path.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(path);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`pour-divider h-[60px] w-full ${className}`} aria-hidden="true">
      <svg viewBox="0 0 1280 60" preserveAspectRatio="none" className="h-full w-full">
        <path
          ref={pathRef}
          d="M0,30 C 320,10 640,50 960,25 S 1280,30 1280,30"
          className="pour-line"
        />
      </svg>
    </div>
  );
}
