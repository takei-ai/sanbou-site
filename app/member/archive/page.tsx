import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { VIDEO_COLUMNS, type VideoSummary } from '@/components/site/video-card'
import { ArchiveCard } from '@/components/site/archive-card'
import { requireMember } from '@/lib/auth'

export const metadata = { title: 'アーカイブ' }

type Params = { q?: string; category?: string; kind?: string }

const selectClass =
  'h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

export default async function ArchivePage({ searchParams }: { searchParams: Promise<Params> }) {
  const { q = '', category = '', kind = '' } = await searchParams
  const { supabase } = await requireMember('/member/archive')

  const { data: facets } = await supabase.from('videos').select('category')
  const categories = [...new Set((facets ?? []).map((f) => f.category))].sort()

  let query = supabase.from('videos').select(VIDEO_COLUMNS)
  const keyword = q.replace(/[%_,()*\\]/g, ' ').trim().slice(0, 50)
  if (keyword) query = query.or(`title.ilike.%${keyword}%,summary.ilike.%${keyword}%`)
  if (category) query = query.eq('category', category)
  if (kind === 'archive' || kind === 'knowhow') query = query.eq('kind', kind)
  const { data } = await query.order('held_on', { ascending: false, nullsFirst: false }).order('created_at', { ascending: false })
  const videos = (data ?? []) as VideoSummary[]
  const { data: privates } = videos.length
    ? await supabase.from('video_private').select('video_id, vimeo_url, content_url').in('video_id', videos.map((v) => v.id))
    : { data: [] }
  const privateById = new Map((privates ?? []).map((p) => [p.video_id as string, p]))
  const filtered = Boolean(keyword || category || kind)

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-black md:text-3xl">アーカイブ</h1>

      <form role="search" className="flex flex-col gap-4 rounded-lg bg-muted p-5 md:flex-row md:flex-wrap md:items-end">
        <div className="flex flex-1 flex-col gap-1.5 md:min-w-64">
          <Label htmlFor="q">キーワード</Label>
          <Input id="q" name="q" defaultValue={q} placeholder="タイトル・概要から検索" className="h-10 bg-background" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="category">カテゴリ</Label>
          <select id="category" name="category" defaultValue={category} className={selectClass}>
            <option value="">すべて</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="kind">種類</Label>
          <select id="kind" name="kind" defaultValue={kind} className={selectClass}>
            <option value="">すべて</option>
            <option value="archive">勉強会アーカイブ</option>
            <option value="knowhow">ノウハウ動画</option>
          </select>
        </div>
        <Button type="submit" className="h-10 bg-foreground px-5 text-background hover:bg-foreground/90">
          <Search data-icon="inline-start" />
          検索
        </Button>
      </form>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p aria-live="polite">{`${videos.length}件`}</p>
        {filtered ? <Link href="/member/archive" className="underline underline-offset-4">条件をクリア</Link> : null}
      </div>

      {videos.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => {
            const p = privateById.get(v.id)
            return (
              <ArchiveCard
                key={v.id}
                video={v}
                videoUrl={p?.vimeo_url ?? v.youtube_url ?? null}
                contentUrl={p?.content_url ?? null}
              />
            )
          })}
        </div>
      ) : (
        <p className="py-16 text-center text-muted-foreground">条件に一致するコンテンツがありません。</p>
      )}
    </div>
  )
}
