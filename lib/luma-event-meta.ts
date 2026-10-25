const LUMA_HOSTS = new Set(['luma.com', 'www.luma.com', 'lu.ma', 'www.lu.ma'])

export function isLumaUrl(value: string) {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' && LUMA_HOSTS.has(u.hostname)
  } catch {
    return false
  }
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function metaContent(html: string, property: string) {
  const tag = html.match(new RegExp(`<meta[^>]+property="${property}"[^>]*>`, 'i'))?.[0]
  const content = tag?.match(/content="([^"]*)"/i)?.[1]
  return content ? decodeEntities(content).trim() : null
}

export async function fetchLumaEvent(url: string): Promise<{ image: string | null; title: string | null }> {
  if (!isLumaUrl(url)) return { image: null, title: null }
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; SanboBot/1.0)' },
      signal: AbortSignal.timeout(8000),
      cache: 'no-store',
    })
    if (!res.ok || !isLumaUrl(res.url)) return { image: null, title: null }
    const html = (await res.text()).slice(0, 500_000)
    const image = metaContent(html, 'og:image')
    const title = metaContent(html, 'og:title')?.replace(/\s*·\s*Luma$/, '') ?? null
    return {
      image: image?.startsWith('https://') ? image : null,
      title: title && title !== 'Discover Events' ? title : null,
    }
  } catch (error) {
    console.error('[luma] fetch failed', url, error)
    return { image: null, title: null }
  }
}
