import { getRiyadhTodayIso } from "@/lib/events";
import type { ReservationInput } from "@/types/reservation";

export type ValidationResult =
  | { valid: true; data: ReservationInput }
  | { valid: false; errors: string[] };

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

// Shared by the client form and the API route, so the two never drift.
export function validateReservation(
  input: Partial<Record<keyof ReservationInput, unknown>>,
): ValidationResult {
  const errors: string[] = [];

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (name.length < 2) {
    errors.push("Enter your name.");
  }

  const partySize = Number(input.partySize);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > 12) {
    errors.push("Party size must be between 1 and 12.");
  }

  const date = typeof input.date === "string" ? input.date : "";
  if (!DATE_PATTERN.test(date) || date < getRiyadhTodayIso()) {
    errors.push("Choose a date from today onward.");
  }

  const time = typeof input.time === "string" ? input.time : "";
  if (!TIME_PATTERN.test(time)) {
    errors.push("Choose a time.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: { name, partySize, date, time } };
}
