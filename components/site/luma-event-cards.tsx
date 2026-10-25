import { ArrowUpRight, CalendarDays, MapPin } from 'lucide-react'
import { formatDateTime } from '@/lib/site'
import type { LumaEvent } from '@/lib/luma'

function dayParts(iso: string) {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return { month: get('month'), day: get('day'), weekday: get('weekday') }
}

export function LumaEventCards({ events }: { events: LumaEvent[] }) {
  if (events.length === 0) {
    return <p className="text-muted-foreground">現在公開中の開催予定はありません。Lumaカレンダーをご確認ください。</p>
  }

  return (
    <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {events.map((event) => {
        const { month, day, weekday } = dayParts(event.startsAt)

        return (
          <li key={event.id}>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="luma-click"
              className="group flex h-full flex-col gap-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-card">
                {event.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.image}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex size-full flex-col justify-between p-5">
                    <p className="text-xs font-medium tracking-widest text-muted-foreground">参謀 勉強会</p>
                    <p className="font-heading font-black leading-none">
                      <span className="text-5xl">{month}</span>
                      <span className="mx-1 text-2xl text-muted-foreground">/</span>
                      <span className="text-5xl">{day}</span>
                      <span className="ml-2 text-lg text-muted-foreground">{`(${weekday})`}</span>
                    </p>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-xs text-background">
                  Lumaで申し込む
                  <ArrowUpRight className="size-3" aria-hidden />
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="line-clamp-4 font-heading font-bold leading-snug text-pretty group-hover:underline">
                  {event.title}
                </h3>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 shrink-0" aria-hidden />
                  {formatDateTime(event.startsAt)}
                </p>
                {event.location ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" aria-hidden />
                    {event.location}
                  </p>
                ) : null}
              </div>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
