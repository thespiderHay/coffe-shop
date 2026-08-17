import type { RecurringEvent, UpcomingEvent } from "@/types/events";

export const RIYADH_TZ = "Asia/Riyadh";

/** Riyadh is a fixed UTC+3 offset year-round — no DST to account for. */
const RIYADH_UTC_OFFSET_HOURS = 3;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const EVENTS: RecurringEvent[] = [
  {
    id: "open-mic",
    title: "Open Mic Night",
    description:
      "Bring a song, a poem, or just an ear. Sign-ups open at the counter from 6:30, first set at 7.",
    dayOfWeek: 5,
    startHour: 19,
    startMinute: 0,
  },
  {
    id: "coffee-tasting",
    title: "Coffee Tasting",
    description:
      "A guided cupping through whatever we're currently roasting — where it's from, and why it tastes the way it does.",
    dayOfWeek: 6,
    startHour: 10,
    startMinute: 0,
  },
];

interface RiyadhParts {
  year: number;
  month: number;
  day: number;
  weekdayIndex: number;
  hour: number;
  minute: number;
}

// "now" must be read as Riyadh sees it, not the server's local time — a
// Vercel/Node server runs in UTC, so hand-rolling +3h offset math on a
// plain Date would drift a day around midnight. Intl.DateTimeFormat with
// an explicit timeZone is the only reliable way to do this.
function getRiyadhParts(from: Date): RiyadhParts {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: RIYADH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(from);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: Number.parseInt(get("year"), 10),
    month: Number.parseInt(get("month"), 10),
    day: Number.parseInt(get("day"), 10),
    weekdayIndex: WEEKDAYS.indexOf(get("weekday")),
    hour: Number.parseInt(get("hour"), 10),
    minute: Number.parseInt(get("minute"), 10),
  };
}

export function getNextOccurrence(event: RecurringEvent, from: Date = new Date()): Date {
  const now = getRiyadhParts(from);
  const diffDays = (event.dayOfWeek - now.weekdayIndex + 7) % 7;

  const candidate = new Date(
    Date.UTC(
      now.year,
      now.month - 1,
      now.day + diffDays,
      event.startHour - RIYADH_UTC_OFFSET_HOURS,
      event.startMinute,
    ),
  );

  // If today is the event's day but its start time has already passed,
  // the "next" occurrence is a week out, not today.
  if (diffDays === 0 && candidate.getTime() <= from.getTime()) {
    candidate.setUTCDate(candidate.getUTCDate() + 7);
  }

  return candidate;
}

export function formatRiyadhDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: RIYADH_TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getUpcomingEvents(from: Date = new Date()): UpcomingEvent[] {
  return EVENTS.map((event) => {
    const nextDate = getNextOccurrence(event, from);
    return { ...event, nextDate, displayDate: formatRiyadhDate(nextDate) };
  }).sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime());
}

/** Today's date in Riyadh as YYYY-MM-DD — the reservation form's date `min` and its validation floor. */
export function getRiyadhTodayIso(from: Date = new Date()): string {
  const { year, month, day } = getRiyadhParts(from);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export interface ReservationTimeSlot {
  /** 24h "HH:MM", matches lib/validation.ts's TIME_PATTERN. */
  value: string;
  /** 12h display label, e.g. "7:30 PM". */
  label: string;
}

// Matches the "Daily · 7:00 AM – 10:00 PM" hours shown in the footer, with
// the last bookable slot half an hour before close.
const RESERVATION_OPEN_MINUTES = 7 * 60;
const RESERVATION_LAST_SLOT_MINUTES = 21 * 60 + 30;
const RESERVATION_SLOT_STEP_MINUTES = 30;

export function getReservationTimeSlots(): ReservationTimeSlot[] {
  const slots: ReservationTimeSlot[] = [];
  for (
    let minutes = RESERVATION_OPEN_MINUTES;
    minutes <= RESERVATION_LAST_SLOT_MINUTES;
    minutes += RESERVATION_SLOT_STEP_MINUTES
  ) {
    const hour24 = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour24 < 12 ? "AM" : "PM";
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
    slots.push({
      value: `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
      label: `${hour12}:${String(minute).padStart(2, "0")} ${period}`,
    });
  }
  return slots;
}
