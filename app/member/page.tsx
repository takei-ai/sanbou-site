import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SeminarList } from '@/components/site/seminar-list'
import { VIDEO_COLUMNS, VideoCard, type VideoSummary } from '@/components/site/video-card'
import { requireMember } from '@/lib/auth'
import { getLumaUpcomingEvents } from '@/lib/luma'
import { formatDate } from '@/lib/site'

export const metadata = { title: 'マイページ' }

export default async function MemberHomePage() {
  const { supabase, profile } = await requireMember()
  const [events, { data: latest }, { data: news }] = await Promise.all([
    getLumaUpcomingEvents(4),
    supabase.from('videos').select(VIDEO_COLUMNS).order('created_at', { ascending: false }).limit(6),
    supabase.from('announcements').select('id, title, body, published_at').order('published_at', { ascending: false }).limit(5),
  ])

  return (
    <div className="flex flex-col gap-14">
      <section>
        <p className="text-sm text-muted-foreground">MY PAGE</p>
        <h1 className="mt-1 text-2xl font-black md:text-3xl">{`ようこそ、${profile.full_name || '会員'} 様`}</h1>
      </section>

      <section aria-labelledby="news-heading">
        <h2 id="news-heading" className="mb-4 text-lg font-bold">お知らせ</h2>
        {news && news.length > 0 ? (
          <ul className="divide-y border-y">
            {news.map((n) => (
              <li key={n.id} className="flex flex-col gap-1 py-4 md:flex-row md:gap-6">
                <time dateTime={n.published_at} className="shrink-0 text-sm text-muted-foreground md:w-32">
                  {formatDate(n.published_at)}
                </time>
                <div className="flex flex-col gap-1">
                  <p className="font-medium">{n.title}</p>
                  {n.body ? <p className="text-sm leading-relaxed text-muted-foreground">{n.body}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">現在お知らせはありません。</p>
        )}
      </section>

      <section aria-labelledby="seminar-heading">
        <h2 id="seminar-heading" className="mb-4 text-lg font-bold">今後の勉強会</h2>
        <SeminarList events={events} />
      </section>

      <section aria-labelledby="latest-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 id="latest-heading" className="text-lg font-bold">新着コンテンツ</h2>
          <Link href="/member/archive" className="flex items-center gap-1 text-sm font-medium hover:underline">
            すべて見る
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {((latest ?? []) as VideoSummary[]).map((v) => (
            <VideoCard key={v.id} video={v} href={`/member/watch/${v.id}`} locked={false} />
          ))}
        </div>
      </section>
    </div>
  )
}
