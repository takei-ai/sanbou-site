import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Lock } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { JoinCta } from '@/components/site/join-cta'
import { VIDEO_COLUMNS, type VideoSummary } from '@/components/site/video-card'
import { getLumaUpcomingEvents } from '@/lib/luma'
import { createClient } from '@/lib/supabase/server'
import { formatDate, youtubeEmbedUrl } from '@/lib/site'
import { cn } from '@/lib/utils'

const UUID = /^[0-9a-f-]{36}$/i

async function getVideo(id: string) {
  if (!UUID.test(id)) return null
  const supabase = await createClient()
  const { data } = await supabase.from('videos').select(VIDEO_COLUMNS).eq('id', id).maybeSingle()
  return data as VideoSummary | null
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const video = await getVideo((await params).id)
  if (!video) return {}
  return {
    title: video.title,
    description: video.summary?.slice(0, 100),
    openGraph: { images: video.thumbnail_url ? [video.thumbnail_url] : undefined },
  }
}

export default async function ContentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [video, events] = await Promise.all([getVideo(id), getLumaUpcomingEvents(1)])
  if (!video) notFound()

  const youtube = youtubeEmbedUrl(video.youtube_url)
  const locked = video.visibility === 'members'

  return (
    <>
      <article className="mx-auto max-w-4xl px-5 py-12">
        <Link href="/contents" className="text-sm text-muted-foreground hover:underline">
          ← コンテンツ紹介へ戻る
        </Link>
        <p className="mt-6 text-sm font-medium text-muted-foreground">{video.category}</p>
        <h1 className="mt-2 text-2xl font-black leading-snug text-balance md:text-3xl">{video.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {[video.speaker && `講師：${video.speaker}`, video.held_on && `開催日：${formatDate(video.held_on)}`]
            .filter(Boolean)
            .join('　')}
        </p>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-lg bg-muted">
          {youtube && !locked ? (
            <iframe src={youtube} title={video.title} className="size-full" allowFullScreen />
          ) : (
            <>
              <Image src={video.thumbnail_url ?? '/placeholder.jpg'} alt="" fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-foreground/60 p-6 text-center text-background">
                <Lock className="size-8" aria-hidden />
                <p className="font-heading text-lg font-bold">本編は会員限定です</p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href={`/login?next=${encodeURIComponent(`/member/watch/${video.id}`)}`} className={cn(buttonVariants({ variant: 'outline' }), 'h-10 px-4 text-foreground')}>
                    ログインして視聴
                  </Link>
                  <Link href="/join" className={cn(buttonVariants(), 'h-10 px-4')}>
                    入会のご案内
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {youtube && locked ? (
          <section aria-labelledby="digest" className="mt-10">
            <h2 id="digest" className="mb-4 text-lg font-bold">ダイジェスト</h2>
            <div className="aspect-video overflow-hidden rounded-lg bg-muted">
              <iframe src={youtube} title={`${video.title} ダイジェスト`} className="size-full" allowFullScreen loading="lazy" />
            </div>
          </section>
        ) : null}

        <section aria-labelledby="summary" className="mt-10">
          <h2 id="summary" className="mb-3 text-lg font-bold">概要</h2>
          <p className="leading-relaxed">{video.summary}</p>
          {locked ? (
            <div className="relative mt-6 rounded-lg border p-6">
              <p className="leading-relaxed text-muted-foreground blur-[2px] select-none" aria-hidden>
                勉強会のまとめ記事では、講師が実際の現場で使っているフレームワークを順を追って解説しています。現状の棚卸しから優先順位づけ、実行計画までを1枚にまとめる方法を…
              </p>
              <p className="mt-4 flex items-center gap-2 text-sm font-medium">
                <Lock className="size-4" aria-hidden />
                まとめ記事の続きと配布資料は会員限定です
              </p>
            </div>
          ) : null}
        </section>
      </article>
      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
