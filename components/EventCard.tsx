import Image from "next/image";
import { EVENT_IMAGES } from "@/lib/images";
import type { UpcomingEvent } from "@/types/events";

interface EventCardProps {
  event: UpcomingEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="overflow-hidden rounded-md bg-surface shadow-warm-sm transition-[transform,box-shadow] duration-150 hover:-translate-y-1 hover:shadow-warm-md">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={EVENT_IMAGES[event.id]}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="p-5">
        <p className="font-mono text-sm text-ink-muted">{event.displayDate}</p>
        <h3 className="mt-1 font-display text-h3 text-ink">{event.title}</h3>
        <p className="mt-1 font-sans text-sm text-ink-muted">{event.description}</p>
      </div>
    </article>
  );
}
