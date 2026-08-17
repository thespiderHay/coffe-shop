export interface ReservationInput {
  name: string;
  partySize: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}

export interface Reservation extends ReservationInput {
  id: string;
  createdAt: string;
}
