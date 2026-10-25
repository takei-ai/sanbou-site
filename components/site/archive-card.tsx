import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, ExternalLink, FileText, Play } from 'lucide-react'
import { formatDate } from '@/lib/site'
import type { VideoSummary } from '@/components/site/video-card'

type Props = {
  video: VideoSummary
  videoUrl: string | null
  contentUrl: string | null
}

const linkClass =
  'inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted'

function UrlLink({ href, label }: { href: string | null | undefined; label: string }) {
  if (!href) return <span className="text-muted-foreground">未登録</span>
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:no-underline"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden />
      <span className="sr-only">（新しいタブで開きます）</span>
    </a>
  )
}

export function ArchiveCard({ video, videoUrl, contentUrl }: Props) {
  const watchHref = `/member/watch/${video.id}`

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border bg-background">
      <Link href={watchHref} className="group relative block aspect-video overflow-hidden bg-muted">
        <Image
          src={video.thumbnail_url ?? '/placeholder.jpg'}
          alt={`${video.title}の勉強会画像`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded bg-background/95 px-2 py-0.5 text-xs font-medium text-foreground">
          {video.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden />
            <span className="sr-only">実施日</span>
            {video.held_on ? formatDate(video.held_on) : '日付未設定'}
          </p>
          <h2 className="font-heading text-base font-bold leading-snug text-pretty">
            <Link href={watchHref} className="hover:underline">
              {video.title}
            </Link>
          </h2>
        </div>

        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t pt-4 text-sm">
          <dt className="text-muted-foreground">講師名</dt>
          <dd>{video.speaker ?? '未登録'}</dd>
          <dt className="text-muted-foreground">カテゴリー</dt>
          <dd>{video.category}</dd>
          <dt className="text-muted-foreground">勉強会URL</dt>
          <dd><UrlLink href={video.luma_url} label="Lumaで開く" /></dd>
          <dt className="text-muted-foreground">動画URL</dt>
          <dd><UrlLink href={videoUrl} label="動画を開く" /></dd>
          <dt className="text-muted-foreground">コンテンツURL</dt>
          <dd><UrlLink href={contentUrl} label="資料を開く" /></dd>
        </dl>

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <Link href={watchHref} className={`${linkClass} border-foreground bg-foreground text-background hover:bg-foreground/90`}>
            <Play className="size-4" aria-hidden />
            視聴する
          </Link>
          {contentUrl ? (
            <a href={contentUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <FileText className="size-4" aria-hidden />
              コンテンツ
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
