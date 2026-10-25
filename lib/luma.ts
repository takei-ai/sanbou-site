import { LUMA_CALENDAR_ID, LUMA_CALENDAR_URL } from '@/lib/site'

export type LumaEvent = {
  id: string
  url: string
  title: string
  image: string | null
  startsAt: string
  endsAt: string | null
  location: string | null
}

type LumaEntry = {
  api_id: string
  event: {
    name: string
    url: string
    start_at: string
    end_at: string | null
    cover_url: string | null
    social_image_url: string | null
    location_type: string | null
    visibility?: string
  }
}

const FETCH_LIMIT = 20

function locationLabel(type: string | null) {
  if (!type) return null
  if (type === 'zoom') return 'オンライン（Zoom）'
  if (type === 'online') return 'オンライン'
  return null
}

function toLumaEvent(entry: LumaEntry): LumaEvent {
  const e = entry.event
  return {
    id: entry.api_id,
    url: `https://luma.com/${e.url}`,
    title: e.name,
    image: e.cover_url ?? e.social_image_url ?? null,
    startsAt: e.start_at,
    endsAt: e.end_at,
    location: locationLabel(e.location_type),
  }
}

async function fetchFromApi(): Promise<LumaEntry[] | null> {
  const params = new URLSearchParams({
    calendar_api_id: LUMA_CALENDAR_ID,
    period: 'future',
    pagination_limit: String(FETCH_LIMIT),
  })
  try {
    const res = await fetch(`https://api.lu.ma/calendar/get-items?${params}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SanbouBot/1.0)' },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { entries?: LumaEntry[] }
    return json.entries ?? null
  } catch {
    return null
  }
}

async function fetchFromCalendarPage(): Promise<LumaEntry[] | null> {
  try {
    const res = await fetch(LUMA_CALENDAR_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SanbouBot/1.0)' },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const raw = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)?.[1]
    if (!raw) return null
    const data = JSON.parse(raw)?.props?.pageProps?.initialData?.data
    return (data?.upcoming?.entries as LumaEntry[] | undefined) ?? null
  } catch {
    return null
  }
}

// カレンダー一覧に出てこない、または同日に2件ある場合に優先して表示するイベントページ
const PREFERRED_EVENT_SLUGS = ['h80il3z9', 'zc9b22vq', '87neuiin', 'b3n1bjci']

function jstDate(iso: string) {
  return new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })
}

async function fetchEventPage(slug: string): Promise<LumaEvent | null> {
  try {
    const res = await fetch(`https://luma.com/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SanbouBot/1.0)' },
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const raw = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/)?.[1]
    if (!raw) return null
    const e = JSON.parse(raw)?.props?.pageProps?.initialData?.data?.event as LumaEntry['event'] & { api_id?: string }
    if (!e?.start_at) return null
    return toLumaEvent({ api_id: e.api_id ?? slug, event: { ...e, url: e.url ?? slug } })
  } catch {
    return null
  }
}

export async function getLumaUpcomingEvents(limit = 4): Promise<LumaEvent[]> {
  const [entries, preferred] = await Promise.all([
    fetchFromApi().then((r) => r ?? fetchFromCalendarPage()),
    Promise.all(PREFERRED_EVENT_SLUGS.map(fetchEventPage)),
  ])
  const now = Date.now()
  const isUpcoming = (event: LumaEvent) => new Date(event.endsAt ?? event.startsAt).getTime() >= now

  const preferredEvents = preferred.filter((e): e is LumaEvent => e !== null && isUpcoming(e))
  const preferredDates = new Set(preferredEvents.map((e) => jstDate(e.startsAt)))

  const calendarEvents = (entries ?? [])
    .filter((entry) => entry.event.visibility !== 'private')
    .map(toLumaEvent)
    .filter(isUpcoming)
    .filter((event) => !preferredDates.has(jstDate(event.startsAt)))

  return [...calendarEvents, ...preferredEvents]
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
    .slice(0, limit)
}
