'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { createClient } from '@/lib/supabase/client'

// Admin invites use the implicit flow, so tokens arrive in the URL hash rather than as a ?code=.
export default function AuthConfirmPage() {
  const router = useRouter()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1))
    const query = new URLSearchParams(window.location.search)
    const next = query.get('next')
    const target = next && next.startsWith('/') && !next.startsWith('//') ? next : '/auth/update-password'
    const access_token = hash.get('access_token')
    const refresh_token = hash.get('refresh_token')
    if (!access_token || !refresh_token) {
      setFailed(true)
      return
    }
    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }: { error: unknown }) => {
        if (error) setFailed(true)
        else router.replace(target)
      })
  }, [router])

  return (
    <AuthShell title={failed ? 'リンクが無効です' : '確認しています…'}>
      {failed ? (
        <div className="flex flex-col gap-4">
          <p className="leading-relaxed">リンクの有効期限が切れているか、すでに使用されています。パスワード再設定から改めてお手続きください。</p>
          <Link href="/auth/forgot-password" className="text-sm underline underline-offset-4">パスワードを再設定する</Link>
        </div>
      ) : (
        <p role="status" className="text-muted-foreground">しばらくお待ちください。</p>
      )}
    </AuthShell>
  )
}
