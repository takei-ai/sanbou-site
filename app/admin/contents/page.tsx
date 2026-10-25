import Link from 'next/link'
import { ActionForm, Field, inputClass, textareaClass } from '@/components/admin/action-form'
import { createVideo, deleteVideo, togglePickup } from '@/app/admin/actions'
import { requireAdmin } from '@/lib/auth'
import { formatDate } from '@/lib/site'

export const metadata = { title: '動画・記事' }

export default async function AdminContentsPage() {
  const { supabase } = await requireAdmin()
  const { data: videos } = await supabase
    .from('videos')
    .select('id, title, speaker, category, kind, held_on, visibility, is_pickup')
    .order('created_at', { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-black">動画・記事</h1>

      <section aria-labelledby="new-video" className="rounded-lg border bg-background p-6">
        <h2 id="new-video" className="mb-4 font-bold">動画を登録</h2>
        <ActionForm action={createVideo} submitLabel="登録する">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Field label="勉強会URL（Luma）" htmlFor="v-luma">
                <input id="v-luma" name="luma_url" type="url" placeholder="https://luma.com/..." className={inputClass} />
              </Field>
              <p className="text-xs text-muted-foreground">入力すると、勉強会画像と名称（空欄の場合）をLumaから自動で取得します。</p>
            </div>
            <Field label="勉強会の名称" htmlFor="v-title"><input id="v-title" name="title" placeholder="空欄ならLumaから取得" className={inputClass} /></Field>
            <Field label="講師" htmlFor="v-speaker"><input id="v-speaker" name="speaker" className={inputClass} /></Field>
            <Field label="カテゴリ" htmlFor="v-category"><input id="v-category" name="category" placeholder="例：採用・組織" className={inputClass} /></Field>
            <Field label="開催日" htmlFor="v-held"><input id="v-held" name="held_on" type="date" className={inputClass} /></Field>
            <Field label="種類" htmlFor="v-kind">
              <select id="v-kind" name="kind" className={inputClass}>
                <option value="archive">勉強会アーカイブ</option>
                <option value="knowhow">ノウハウ動画</option>
              </select>
            </Field>
            <Field label="公開範囲" htmlFor="v-visibility">
              <select id="v-visibility" name="visibility" className={inputClass}>
                <option value="members">会員限定</option>
                <option value="public">一般公開（YouTube）</option>
              </select>
            </Field>
            <Field label="Vimeo URL（会員限定動画）" htmlFor="v-vimeo"><input id="v-vimeo" name="vimeo_url" type="url" placeholder="https://vimeo.com/..." className={inputClass} /></Field>
            <Field label="YouTube URL（一般公開動画）" htmlFor="v-youtube"><input id="v-youtube" name="youtube_url" type="url" className={inputClass} /></Field>
            <Field label="コンテンツURL（資料・記事など）" htmlFor="v-content"><input id="v-content" name="content_url" type="url" placeholder="https://..." className={inputClass} /></Field>
            <Field label="勉強会画像URL（空欄ならLumaから取得）" htmlFor="v-thumb"><input id="v-thumb" name="thumbnail_url" placeholder="https://..." className={inputClass} /></Field>
            <div className="flex items-end gap-4">
              <label className="flex h-10 items-center gap-2 text-sm">
                <input type="checkbox" name="is_pickup" className="size-4" />
                トップのピックアップに表示
              </label>
              <Field label="表示順" htmlFor="v-order"><input id="v-order" name="pickup_order" type="number" min={0} max={99} defaultValue={0} className={`${inputClass} w-20`} /></Field>
            </div>
          </div>
          <Field label="概要（一般にも表示されます）" htmlFor="v-summary"><textarea id="v-summary" name="summary" className={textareaClass} /></Field>
          <Field label="まとめ記事（会員限定）" htmlFor="v-article"><textarea id="v-article" name="article_body" className={`${textareaClass} min-h-40`} /></Field>
        </ActionForm>
      </section>

      <section aria-labelledby="video-list" className="overflow-hidden rounded-lg border bg-background">
        <h2 id="video-list" className="sr-only">登録済み動画</h2>
        <ul className="divide-y">
          {(videos ?? []).map((v) => (
            <li key={v.id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-1">
                <Link href={`/member/watch/${v.id}`} className="font-medium hover:underline">{v.title}</Link>
                <p className="text-sm text-muted-foreground">
                  {[v.category, v.kind === 'knowhow' ? 'ノウハウ' : 'アーカイブ', v.speaker, formatDate(v.held_on), v.visibility === 'public' ? '一般公開' : '会員限定'].filter(Boolean).join(' / ')}
                </p>
              </div>
              <div className="flex shrink-0 gap-2 text-sm">
                <form action={togglePickup}>
                  <input type="hidden" name="id" value={v.id} />
                  <input type="hidden" name="value" value={String(!v.is_pickup)} />
                  <button className={v.is_pickup ? 'rounded border border-foreground px-3 py-1.5 font-medium' : 'rounded border px-3 py-1.5 hover:bg-muted'}>
                    {v.is_pickup ? 'ピックアップ中' : 'ピックアップに追加'}
                  </button>
                </form>
                <form action={deleteVideo}>
                  <input type="hidden" name="id" value={v.id} />
                  <button className="rounded border px-3 py-1.5 text-destructive hover:bg-muted">削除</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
