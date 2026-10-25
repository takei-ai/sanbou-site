'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const password = String(form.get('password'))
    if (password !== String(form.get('confirm'))) {
      setError('確認用パスワードが一致しません。')
      return
    }
    setPending(true)
    setError(undefined)
    const { error } = await createClient().auth.updateUser({ password })
    setPending(false)
    if (error) {
      if (error.code === 'weak_password' || error.code === 'same_password') {
        setError(error.code === 'same_password' ? '以前と異なるパスワードを設定してください。' : 'パスワードは8文字以上で、推測されにくいものを設定してください。')
      } else if (error.code === 'session_not_found' || error.status === 401) {
        setError('リンクの有効期限が切れています。もう一度再設定メールを送信してください。')
      } else {
        setError('パスワードを更新できませんでした。時間をおいて再度お試しください。')
      }
      return
    }
    router.replace('/member')
    router.refresh()
  }

  return (
    <AuthShell title="パスワードの設定" description="新しいパスワードを入力してください（8文字以上）。">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">新しいパスワード</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm">新しいパスワード（確認）</Label>
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className="h-11" />
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" disabled={pending} className="h-11 bg-foreground text-background hover:bg-foreground/90">
          {pending ? '更新中…' : 'パスワードを設定する'}
        </Button>
      </form>
    </AuthShell>
  )
}
