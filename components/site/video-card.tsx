import Image from 'next/image'
import Link from 'next/link'
import { Lock, Play } from 'lucide-react'
import { formatDate } from '@/lib/site'

export type VideoSummary = {
  id: string
  title: string
  speaker: string | null
  category: string
  kind: 'archive' | 'knowhow'
  held_on: string | null
  summary: string | null
  thumbnail_url: string | null
  youtube_url: string | null
  visibility: 'public' | 'members'
  luma_url?: string | null
}

export const VIDEO_COLUMNS =
  'id, title, speaker, category, kind, held_on, summary, thumbnail_url, youtube_url, visibility, luma_url'

export function VideoCard({ video, href, locked }: { video: VideoSummary; href: string; locked: boolean }) {
  return (
    <Link href={href} className="group flex flex-col gap-3">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        <Image
          src={video.thumbnail_url ?? '/placeholder.jpg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded bg-background/95 px-2 py-0.5 text-xs font-medium">
          {video.category}
        </span>
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-foreground/85 px-2.5 py-1 text-xs text-background">
          {locked ? <Lock className="size-3" aria-hidden /> : <Play className="size-3" aria-hidden />}
          {locked ? '会員限定' : '視聴する'}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        {video.held_on ? <p className="text-sm text-muted-foreground">{formatDate(video.held_on)}</p> : null}
        <h3 className="font-heading font-bold leading-snug text-pretty group-hover:underline">{video.title}</h3>
        {video.speaker ? <p className="text-sm text-muted-foreground">{`講師：${video.speaker}`}</p> : null}
      </div>
    </Link>
  )
}
