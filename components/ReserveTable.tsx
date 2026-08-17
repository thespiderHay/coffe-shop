"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Button from "@/components/Button";
import { getReservationTimeSlots, getRiyadhTodayIso } from "@/lib/events";

type ReserveTableVariant = "hero" | "nav" | "cta";
type FormStatus = "idle" | "submitting" | "success" | "error";

interface ReserveTableProps {
  variant?: ReserveTableVariant;
  className?: string;
}

const TRIGGER_LABEL: Record<ReserveTableVariant, string> = {
  hero: "Reserve a table",
  nav: "Reserve a table",
  cta: "Reserve a table",
};

const TRIGGER_SIZE: Record<ReserveTableVariant, "sm" | "md"> = {
  hero: "md",
  nav: "sm",
  cta: "md",
};

const FIELD_CLASSES =
  "h-12 w-full rounded-sm border border-border bg-surface px-4 text-base text-ink " +
  "focus:border-accent focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-focus-ring";

// Native <input type="time"> renders as a real dropdown picker only in
// Chrome — Safari and Firefox just show a bare text/spinner field, so a
// fixed-slot <select> is the only cross-browser way to get an actual picker.
const TIME_SLOTS = getReservationTimeSlots();

export default function ReserveTable({ variant = "hero", className = "" }: ReserveTableProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const headingId = useId();

  // Always mounted closed — never conditionally rendered — to avoid an
  // SSR/hydration mismatch. showModal()/close() are what actually grant
  // the top-layer render, real ::backdrop, focus trap, and focus-restore
  // on close; toggling the `open` attribute via React alone would not.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose() {
    setIsOpen(false);
    setStatus("idle");
    setErrors([]);
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) {
      handleClose();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      partySize: formData.get("partySize"),
      date: formData.get("date"),
      time: formData.get("time"),
    };

    setStatus("submitting");
    setErrors([]);

    try {
      const response = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 422) {
        const body = await response.json();
        setErrors(body.errors ?? ["Check the form and try again."]);
        setStatus("error");
        return;
      }

      if (!response.ok) {
        setErrors(["Something went wrong on our end. Please try again."]);
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrors(["Couldn't reach the server. Check your connection and try again."]);
      setStatus("error");
    }
  }

  return (
    <>
      <Button
        type="button"
        size={TRIGGER_SIZE[variant]}
        className={className}
        onClick={() => setIsOpen(true)}
      >
        {TRIGGER_LABEL[variant]}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={headingId}
        onClick={handleBackdropClick}
        onClose={handleClose}
        className="m-auto w-[90vw] max-w-md rounded-lg border-0 bg-surface p-10 shadow-warm-lg backdrop:bg-surface-inverse/60"
      >
        {status === "success" ? (
          <div>
            <h2 id={headingId} className="font-display text-h3 text-ink">
              We&apos;ll see you then.
            </h2>
            <p className="mt-3 font-sans text-base text-ink-muted">
              Your table is noted — we look forward to having you.
            </p>
            <Button type="button" variant="ghost" className="mt-8" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <h2 id={headingId} className="font-display text-h3 text-ink">
              Reserve a table
            </h2>

            {errors.length > 0 && (
              <div
                role="alert"
                className="rounded-sm border border-error bg-error-bg px-4 py-3 text-sm text-error"
              >
                <ul className="list-disc pl-4">
                  {errors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Name
              <input
                name="name"
                type="text"
                required
                minLength={2}
                autoFocus
                className={FIELD_CLASSES}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
              Party size
              <input
                name="partySize"
                type="number"
                min={1}
                max={12}
                defaultValue={2}
                required
                className={FIELD_CLASSES}
              />
            </label>

            <div className="flex gap-4">
              <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-ink">
                Date
                <input
                  name="date"
                  type="date"
                  min={getRiyadhTodayIso()}
                  required
                  // Chrome's native date-picker popup can fail to auto-close
                  // after a date is picked while it's nested inside a modal
                  // <dialog> — forcing blur on change reliably dismisses it.
                  onChange={(event) => event.currentTarget.blur()}
                  className={FIELD_CLASSES}
                />
              </label>

              <label className="flex flex-1 flex-col gap-1.5 text-sm font-medium text-ink">
                Time
                <select
                  name="time"
                  required
                  defaultValue=""
                  className={FIELD_CLASSES}
                >
                  <option value="" disabled>
                    Select a time
                  </option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-2 flex gap-4">
              <Button type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Reserving…" : "Confirm reservation"}
              </Button>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
