// Persistence caveat: this appends to a local JSON file via `fs`, which
// only works on a long-lived Node process (local dev, `next start` on a
// traditional/self-hosted Node server). On Vercel's default serverless
// functions the filesystem outside /tmp is read-only and /tmp itself is
// not durable across invocations — this log will NOT actually persist
// there. That's a deliberate "backend comes later" placeholder, not a
// bug to rediscover during a future deploy.
import fs from "node:fs/promises";
import path from "node:path";
import { validateReservation } from "@/lib/validation";
import type { Reservation } from "@/types/reservation";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "reservations.json");

async function readReservations(): Promise<Reservation[]> {
  try {
    const content = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(content) as Reservation[];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ errors: ["Invalid request body."] }, { status: 400 });
  }

  const result = validateReservation(body as Record<string, unknown>);
  if (!result.valid) {
    return Response.json({ errors: result.errors }, { status: 422 });
  }

  const reservation: Reservation = {
    ...result.data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const reservations = await readReservations();
    reservations.push(reservation);
    await fs.writeFile(DATA_FILE, JSON.stringify(reservations, null, 2));
  } catch {
    return Response.json(
      { errors: ["Couldn't save the reservation. Please try again."] },
      { status: 500 },
    );
  }

  return Response.json({ id: reservation.id }, { status: 201 });
}
