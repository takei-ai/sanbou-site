import { ActionForm, Field, inputClass, textareaClass } from '@/components/admin/action-form'
import {
  createAnnouncement,
  createDocument,
  createSeminar,
  deleteAnnouncement,
  deleteDocument,
  deleteSeminar,
} from '@/app/admin/actions'
import { requireAdmin } from '@/lib/auth'
import { formatDate, formatDateTime } from '@/lib/site'

export const metadata = { title: '勉強会・お知らせ・資料' }

function DeleteButton({ action, id }: { action: (f: FormData) => Promise<void>; id: string }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button className="rounded border px-3 py-1.5 text-sm text-destructive hover:bg-muted">削除</button>
    </form>
  )
}

export default async function AdminSchedulePage() {
  const { supabase } = await requireAdmin()
  const [{ data: seminars }, { data: news }, { data: docs }, { data: videos }] = await Promise.all([
    supabase.from('seminars').select('id, title, speaker, starts_at').order('starts_at', { ascending: false }),
    supabase.from('announcements').select('id, title, published_at').order('published_at', { ascending: false }),
    supabase.from('documents').select('id, title, created_at').order('created_at', { ascending: false }),
    supabase.from('videos').select('id, title').order('created_at', { ascending: false }),
  ])

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-2xl font-black">勉強会・お知らせ・資料</h1>

      <section aria-labelledby="seminars" className="rounded-lg border bg-background p-6">
        <h2 id="seminars" className="mb-4 font-bold">勉強会スケジュール</h2>
        <ActionForm action={createSeminar} submitLabel="追加する">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="タイトル（必須）" htmlFor="s-title"><input id="s-title" name="title" required className={inputClass} /></Field>
            <Field label="開催日時（日本時間・必須）" htmlFor="s-at"><input id="s-at" name="starts_at" type="datetime-local" required className={inputClass} /></Field>
            <Field label="講師" htmlFor="s-speaker"><input id="s-speaker" name="speaker" className={inputClass} /></Field>
            <Field label="テーマ" htmlFor="s-theme"><input id="s-theme" name="theme" className={inputClass} /></Field>
            <Field label="Luma 申込URL" htmlFor="s-luma"><input id="s-luma" name="luma_url" type="url" placeholder="https://lu.ma/..." className={inputClass} /></Field>
          </div>
        </ActionForm>
        <ul className="mt-6 divide-y border-t">
          {(seminars ?? []).map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{s.title}</p>
                <p className="text-sm text-muted-foreground">{[formatDateTime(s.starts_at), s.speaker].filter(Boolean).join(' / ')}</p>
              </div>
              <DeleteButton action={deleteSeminar} id={s.id} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="news" className="rounded-lg border bg-background p-6">
        <h2 id="news" className="mb-4 font-bold">お知らせ（会員向け）</h2>
        <ActionForm action={createAnnouncement} submitLabel="公開する">
          <Field label="タイトル（必須）" htmlFor="n-title"><input id="n-title" name="title" required className={inputClass} /></Field>
          <Field label="本文" htmlFor="n-body"><textarea id="n-body" name="body" className={textareaClass} /></Field>
        </ActionForm>
        <ul className="mt-6 divide-y border-t">
          {(news ?? []).map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm text-muted-foreground">{formatDate(n.published_at)}</p>
              </div>
              <DeleteButton action={deleteAnnouncement} id={n.id} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="docs" className="rounded-lg border bg-background p-6">
        <h2 id="docs" className="mb-4 font-bold">配布資料</h2>
        <ActionForm action={createDocument} submitLabel="登録する">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="資料名（必須）" htmlFor="d-title"><input id="d-title" name="title" required className={inputClass} /></Field>
            <Field label="ファイルURL（必須）" htmlFor="d-url"><input id="d-url" name="file_url" type="url" required placeholder="https://..." className={inputClass} /></Field>
            <Field label="関連する動画" htmlFor="d-video">
              <select id="d-video" name="video_id" className={inputClass}>
                <option value="">なし</option>
                {(videos ?? []).map((v) => <option key={v.id} value={v.id}>{v.title}</option>)}
              </select>
            </Field>
          </div>
        </ActionForm>
        <ul className="mt-6 divide-y border-t">
          {(docs ?? []).map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{d.title}</p>
                <p className="text-sm text-muted-foreground">{formatDate(d.created_at)}</p>
              </div>
              <DeleteButton action={deleteDocument} id={d.id} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
