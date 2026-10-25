export const LUMA_CALENDAR_URL = 'https://luma.com/sanbou.club'
export const LUMA_CALENDAR_ID = 'cal-8u3NpQ02XNraIiN'

// 外部リンクは現行サイトの申込ルートを流用する。URLが確定したらここだけ差し替える。
export const LINKS = {
  freeTicket: 'https://ksanbou.co.jp/',
  applyForm: 'https://forms.gle/4hnUjWj9rybvQ1oZ8',
  applyMonthly: 'https://www.favy.jp/plans/3722',
  applyYearly: 'https://www.favy.jp/plans/3721',
  contact: 'https://ksanbou.co.jp/',
  lumaCalendar: LUMA_CALENDAR_URL,
  company: 'https://shirakata-ri.co.jp/',
  blog: 'https://ksanbou.co.jp/blog',
}

export const PRICING = {
  monthly: '9,800',
  yearly: '98,000',
}

export function formatDate(value: string | null) {
  if (!value) return ''
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function youtubeEmbedUrl(url: string | null) {
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null
}

export function vimeoEmbedUrl(url: string | null) {
  if (!url) return null
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/)
  if (!match) return null
  const hash = match[2] ? `?h=${match[2]}` : ''
  return `https://player.vimeo.com/video/${match[1]}${hash}`
}
