import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'member' | 'admin'
  status: 'active' | 'suspended' | 'withdrawn'
}

export async function getSessionProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, status')
    .eq('id', user.id)
    .maybeSingle<Profile>()

  return { supabase, user, profile }
}

export async function requireMember(nextPath = '/member') {
  const ctx = await getSessionProfile()
  if (!ctx.user) redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  if (!ctx.profile || ctx.profile.status !== 'active') {
    await ctx.supabase.auth.signOut()
    redirect('/login?error=inactive')
  }
  return ctx as typeof ctx & { profile: Profile }
}

export async function requireAdmin() {
  const ctx = await requireMember('/admin')
  if (ctx.profile.role !== 'admin') redirect('/member')
  return ctx
}

export function safeNextPath(next: string | null | undefined, fallback = '/member') {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) {
    return fallback
  }
  return next
}
