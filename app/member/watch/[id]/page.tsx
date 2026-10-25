import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, FileText, Video } from 'lucide-react'
import { VIDEO_COLUMNS, type VideoSummary } from '@/components/site/video-card'
import { requireMember } from '@/lib/auth'
import { formatDate, vimeoEmbedUrl, youtubeEmbedUrl } from '@/lib/site'

const UUID = /^[0-9a-f-]{36}$/i

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID.test(id)) notFound()
  const { supabase } = await requireMember(`/member/watch/${id}`)

  const [{ data: video }, { data: priv }, { data: docs }] = await Promise.all([
    supabase.from('videos').select(VIDEO_COLUMNS).eq('id', id).maybeSingle<VideoSummary>(),
    supabase.from('video_private').select('vimeo_url, article_body, content_url').eq('video_id', id).maybeSingle(),
    supabase.from('documents').select('id, title, file_url').eq('video_id', id),
  ])
  if (!video) notFound()

  const player = vimeoEmbedUrl(priv?.vimeo_url ?? null) ?? youtubeEmbedUrl(video.youtube_url)
  const videoUrl = priv?.vimeo_url ?? video.youtube_url

  return (
    <article className="mx-auto flex max-w-4xl flex-col gap-8">
      <div>
        <Link href="/member/archive" className="text-sm text-muted-foreground hover:underline">← アーカイブへ戻る</Link>
        <p className="mt-6 text-sm font-medium text-muted-foreground">{video.category}</p>
        <h1 className="mt-2 text-2xl font-black leading-snug text-balance md:text-3xl">{video.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {[video.speaker && `講師：${video.speaker}`, video.held_on && `開催日：${formatDate(video.held_on)}`].filter(Boolean).join('　')}
        </p>
      </div>

      <div className="aspect-video overflow-hidden rounded-lg bg-foreground">
        {player ? (
          <iframe
            src={player}
            title={video.title}
            className="size-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-background">動画は準備中です</div>
        )}
      </div>

      {videoUrl || priv?.content_url ? (
        <section aria-labelledby="links-heading">
          <h2 id="links-heading" className="mb-3 text-lg font-bold">関連リンク</h2>
          <ul className="flex flex-col gap-2">
            {videoUrl ? (
              <li>
                <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border px-4 py-3 hover:bg-muted">
                  <Video className="size-4 shrink-0" aria-hidden />
                  動画URL
                </a>
              </li>
            ) : null}
            {priv?.content_url ? (
              <li>
                <a href={priv.content_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border px-4 py-3 hover:bg-muted">
                  <ExternalLink className="size-4 shrink-0" aria-hidden />
                  コンテンツURL
                </a>
              </li>
            ) : null}
          </ul>
        </section>
      ) : null}

      {docs && docs.length > 0 ? (
        <section aria-labelledby="docs-heading">
          <h2 id="docs-heading" className="mb-3 text-lg font-bold">配布資料</h2>
          <ul className="flex flex-col gap-2">
            {docs.map((d) => (
              <li key={d.id}>
                <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md border px-4 py-3 hover:bg-muted">
                  <FileText className="size-4 shrink-0" aria-hidden />
                  {d.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="summary-heading">
        <h2 id="summary-heading" className="mb-3 text-lg font-bold">概要</h2>
        <p className="leading-relaxed">{video.summary}</p>
      </section>

      {priv?.article_body ? (
        <section aria-labelledby="article-heading" className="border-t pt-8">
          <h2 id="article-heading" className="mb-3 text-lg font-bold">まとめ記事</h2>
          <div className="whitespace-pre-line leading-relaxed">{priv.article_body}</div>
        </section>
      ) : null}
    </article>
  )
}
