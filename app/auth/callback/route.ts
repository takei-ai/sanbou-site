import { NextResponse, type NextRequest } from 'next/server'
import { safeNextPath } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNextPath(searchParams.get('next'), '/auth/update-password')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
    return NextResponse.redirect(`${origin}/login?error=link`)
  }
  // No code: implicit-flow links (admin invites) carry tokens in the hash, which the browser keeps across this redirect.
  return NextResponse.redirect(`${origin}/auth/confirm?next=${encodeURIComponent(next)}`)
}
