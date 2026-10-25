import type { Metadata } from 'next'
import { JoinCta } from '@/components/site/join-cta'
import { VIDEO_COLUMNS, VideoCard, type VideoSummary } from '@/components/site/video-card'
import { getLumaUpcomingEvents } from '@/lib/luma'
import { getPickupVideos } from '@/lib/queries'
import { createClient } from '@/lib/supabase/server'
import { youtubeEmbedUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'コンテンツ紹介（お試し視聴）',
  description: '参謀の勉強会アーカイブとノウハウ動画の一部をご紹介します。',
}

export default async function ContentsPage() {
  const supabase = await createClient()
  const [pickups, events, { data }] = await Promise.all([
    getPickupVideos(),
    getLumaUpcomingEvents(1),
    supabase.from('videos').select(VIDEO_COLUMNS).order('held_on', { ascending: false, nullsFirst: false }),
  ])
  const videos = (data ?? []) as VideoSummary[]
  const embeddable = pickups.filter((v) => youtubeEmbedUrl(v.youtube_url))

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-12 pt-16">
        <p className="text-sm text-muted-foreground">CONTENTS</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">コンテンツ紹介</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          会員サイトでは、過去の勉強会アーカイブをいつでも視聴できます。サムネイル・概要は誰でもご覧いただけます。本編は会員限定です。
        </p>
      </section>

      {embeddable.length > 0 ? (
        <section aria-labelledby="digest-heading" className="mx-auto max-w-6xl px-5 pb-16">
          <h2 id="digest-heading" className="mb-6 text-xl font-bold">
            ダイジェスト動画
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {embeddable.map((v) => (
              <div key={v.id} className="flex flex-col gap-3">
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <iframe
                    src={youtubeEmbedUrl(v.youtube_url)!}
                    title={v.title}
                    className="size-full"
                    allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <p className="font-heading font-bold">{v.title}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="all-heading" className="border-t bg-muted py-16">
        <div className="mx-auto max-w-6xl px-5">
          <h2 id="all-heading" className="mb-8 text-xl font-bold">
            勉強会アーカイブ（一部）
          </h2>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} href={`/contents/${v.id}`} locked={v.visibility === 'members'} />
            ))}
          </div>
        </div>
      </section>

      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
