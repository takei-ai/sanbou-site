'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchLumaEvent, isLumaUrl } from '@/lib/luma-event-meta'

export type ActionState = { ok: boolean; message: string } | undefined

const EMAIL = /^[^\s@,]+@[^\s@,]+\.[^\s@,]+$/
const str = (f: FormData, k: string, max = 2000) => String(f.get(k) ?? '').trim().slice(0, max)
const optional = (f: FormData, k: string, max = 2000) => str(f, k, max) || null

function httpUrl(value: string | null) {
  if (!value) return null
  if (value.startsWith('/')) return value
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null
  } catch {
    return null
  }
}

async function redirectBase() {
  if (process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL) return process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? 'https'
  return `${proto}://${host}/auth/callback`
}

async function inviteOne(email: string, fullName: string | null) {
  const admin = createAdminClient()
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${await redirectBase()}?next=/auth/update-password`,
  })
  if (!error) return 'invited' as const
  if (error.code === 'email_exists' || /already/i.test(error.message)) return 'exists' as const
  console.error('[admin] invite failed', email, error.code, error.message)
  return 'failed' as const
}

export async function inviteMember(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin()
  const email = str(form, 'email', 254).toLowerCase()
  if (!EMAIL.test(email)) return { ok: false, message: 'メールアドレスの形式が正しくありません。' }
  const result = await inviteOne(email, optional(form, 'full_name', 100))
  revalidatePath('/admin')
  if (result === 'invited') return { ok: true, message: `${email} に招待メールを送信しました。` }
  if (result === 'exists') return { ok: false, message: 'このメールアドレスはすでに登録されています。' }
  return { ok: false, message: '招待メールを送信できませんでした。送信上限に達している可能性があります。' }
}

export async function importMembersCsv(_: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin()
  const file = form.get('file')
  const text = file instanceof File && file.size > 0 ? await file.text() : str(form, 'csv', 200_000)
  const rows = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.split(',').map((c) => c.trim().replace(/^"|"$/g, '')))
    .filter((cols) => cols[0] && EMAIL.test(cols[0]))
  if (rows.length === 0) return { ok: false, message: '有効な行がありません。「メールアドレス,氏名」の形式で入力してください。' }
  if (rows.length > 200) return { ok: false, message: '一度に登録できるのは200件までです。' }

  const counts = { invited: 0, exists: 0, failed: 0 }
  const seen = new Set<string>()
  for (const [rawEmail, name] of rows) {
    const email = rawEmail.toLowerCase()
    if (seen.has(email)) continue
    seen.add(email)
    counts[await inviteOne(email, name?.slice(0, 100) || null)]++
  }
  revalidatePath('/admin')
  return {
    ok: counts.failed === 0,
    message: `招待 ${counts.invited}件 / 登録済み ${counts.exists}件 / 失敗 ${counts.failed}件`,
  }
}

export async function setMemberStatus(form: FormData) {
  const { profile: me } = await requireAdmin()
  const id = str(form, 'id', 36)
  const status = str(form, 'status')
  if (!['active', 'suspended', 'withdrawn'].includes(status) || id === me.id) return
  const admin = createAdminClient()
  await admin.from('profiles').update({ status, updated_at: new Date().toISOString() }).eq('id', id)
  await admin.auth.admin.updateUserById(id, { ban_duration: status === 'active' ? 'none' : '876000h' })
  revalidatePath('/admin')
}

export async function setMemberRole(form: FormData) {
  const { profile: me } = await requireAdmin()
  const id = str(form, 'id', 36)
  const role = str(form, 'role')
  if (!['member', 'admin'].includes(role) || id === me.id) return
  await createAdminClient().from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/admin')
}

export async function createVideo(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const lumaInput = optional(form, 'luma_url', 500)
  if (lumaInput && !isLumaUrl(lumaInput)) {
    return { ok: false, message: '勉強会URLには luma.com（または lu.ma）のイベントURLを入力してください。' }
  }
  const lumaUrl = lumaInput ? new URL(lumaInput).toString() : null
  let thumbnailUrl = httpUrl(optional(form, 'thumbnail_url', 500))
  let title = str(form, 'title', 200)
  if (lumaUrl && (!thumbnailUrl || !title)) {
    const event = await fetchLumaEvent(lumaUrl)
    thumbnailUrl ??= event.image
    if (!title && event.title) title = event.title.slice(0, 200)
  }
  if (!title) return { ok: false, message: '勉強会の名称を入力してください（LumaのURLから取得できませんでした）。' }
  const kind = str(form, 'kind') === 'knowhow' ? 'knowhow' : 'archive'
  const heldOn = str(form, 'held_on')
  const { data, error } = await supabase
    .from('videos')
    .insert({
      title,
      speaker: optional(form, 'speaker', 100),
      category: str(form, 'category', 50) || 'その他',
      kind,
      held_on: /^\d{4}-\d{2}-\d{2}$/.test(heldOn) ? heldOn : null,
      summary: optional(form, 'summary', 2000),
      thumbnail_url: thumbnailUrl,
      luma_url: lumaUrl,
      youtube_url: httpUrl(optional(form, 'youtube_url', 500)),
      visibility: str(form, 'visibility') === 'public' ? 'public' : 'members',
      is_pickup: form.get('is_pickup') === 'on',
      pickup_order: Math.max(0, Math.min(99, Number.parseInt(str(form, 'pickup_order'), 10) || 0)),
    })
    .select('id')
    .single()
  if (error || !data) return { ok: false, message: '登録できませんでした。' }

  const vimeo = httpUrl(optional(form, 'vimeo_url', 500))
  const article = optional(form, 'article_body', 20000)
  const contentUrl = httpUrl(optional(form, 'content_url', 500))
  if (vimeo || article || contentUrl) {
    await supabase
      .from('video_private')
      .insert({ video_id: data.id, vimeo_url: vimeo, article_body: article, content_url: contentUrl })
  }
  revalidatePath('/', 'layout')
  return { ok: true, message: `「${title}」を登録しました。` }
}

export async function deleteVideo(form: FormData) {
  const { supabase } = await requireAdmin()
  await supabase.from('videos').delete().eq('id', str(form, 'id', 36))
  revalidatePath('/', 'layout')
}

export async function togglePickup(form: FormData) {
  const { supabase } = await requireAdmin()
  await supabase.from('videos').update({ is_pickup: form.get('value') === 'true' }).eq('id', str(form, 'id', 36))
  revalidatePath('/', 'layout')
}

export async function createSeminar(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const title = str(form, 'title', 200)
  const startsAt = str(form, 'starts_at')
  if (!title || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(startsAt)) return { ok: false, message: 'タイトルと開催日時は必須です。' }
  const { error } = await supabase.from('seminars').insert({
    title,
    speaker: optional(form, 'speaker', 100),
    theme: optional(form, 'theme', 100),
    starts_at: `${startsAt}:00+09:00`,
    luma_url: httpUrl(optional(form, 'luma_url', 500)),
  })
  if (error) return { ok: false, message: '登録できませんでした。' }
  revalidatePath('/', 'layout')
  return { ok: true, message: `「${title}」を登録しました。` }
}

export async function deleteSeminar(form: FormData) {
  const { supabase } = await requireAdmin()
  await supabase.from('seminars').delete().eq('id', str(form, 'id', 36))
  revalidatePath('/', 'layout')
}

export async function createAnnouncement(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const title = str(form, 'title', 200)
  if (!title) return { ok: false, message: 'タイトルは必須です。' }
  const { error } = await supabase.from('announcements').insert({ title, body: optional(form, 'body', 5000) })
  if (error) return { ok: false, message: '登録できませんでした。' }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'お知らせを公開しました。' }
}

export async function deleteAnnouncement(form: FormData) {
  const { supabase } = await requireAdmin()
  await supabase.from('announcements').delete().eq('id', str(form, 'id', 36))
  revalidatePath('/', 'layout')
}

export async function createDocument(_: ActionState, form: FormData): Promise<ActionState> {
  const { supabase } = await requireAdmin()
  const title = str(form, 'title', 200)
  const fileUrl = httpUrl(optional(form, 'file_url', 500))
  if (!title || !fileUrl) return { ok: false, message: 'タイトルと有効なファイルURLは必須です。' }
  const videoId = str(form, 'video_id', 36)
  const { error } = await supabase.from('documents').insert({ title, file_url: fileUrl, video_id: videoId || null })
  if (error) return { ok: false, message: '登録できませんでした。' }
  revalidatePath('/', 'layout')
  return { ok: true, message: '資料を登録しました。' }
}

export async function deleteDocument(form: FormData) {
  const { supabase } = await requireAdmin()
  await supabase.from('documents').delete().eq('id', str(form, 'id', 36))
  revalidatePath('/', 'layout')
}
