export interface RecurringEvent {
  id: string;
  title: string;
  description: string;
  /** 0 = Sunday .. 6 = Saturday (JS Date convention) */
  dayOfWeek: number;
  /** 24-hour, Riyadh local time */
  startHour: number;
  startMinute: number;
}

export interface UpcomingEvent extends RecurringEvent {
  nextDate: Date;
  /** e.g. "Friday, March 6 · 7:00 PM" */
  displayDate: string;
}
