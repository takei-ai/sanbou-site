import { createClient } from '@/lib/supabase/server'
import { VIDEO_COLUMNS, type VideoSummary } from '@/components/site/video-card'

export type Seminar = {
  id: string
  title: string
  speaker: string | null
  theme: string | null
  starts_at: string
  luma_url: string | null
}

export async function getPickupVideos() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('videos')
    .select(VIDEO_COLUMNS)
    .eq('is_pickup', true)
    .order('pickup_order', { ascending: true })
    .limit(6)
  return (data ?? []) as VideoSummary[]
}

export async function getUpcomingSeminars(limit = 6) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('seminars')
    .select('id, title, speaker, theme, starts_at, luma_url')
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)
  return (data ?? []) as Seminar[]
}
