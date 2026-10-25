import { ArrowUpRight } from 'lucide-react'
import { formatDateTime } from '@/lib/site'
import type { LumaEvent } from '@/lib/luma'

export function SeminarList({ events }: { events: LumaEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground">現在公開中の開催予定はありません。</p>
  }
  return (
    <ul className="flex flex-col divide-y border-y">
      {events.map((event) => (
        <li key={event.id} className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-8">
            <p className="shrink-0 font-heading font-bold md:w-44">{formatDateTime(event.startsAt)}</p>
            <div className="flex flex-col gap-1">
              <p className="font-medium leading-snug text-pretty">{event.title}</p>
              {event.location ? <p className="text-sm text-muted-foreground">{event.location}</p> : null}
            </div>
          </div>
          <a
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            data-track="luma-click"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium underline underline-offset-4"
          >
            Lumaで申し込む
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  )
}
