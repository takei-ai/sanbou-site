'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string>()
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(undefined)
    const base = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`
    const { error } = await createClient().auth.resetPasswordForEmail(
      String(new FormData(e.currentTarget).get('email')),
      { redirectTo: `${base}?next=/auth/update-password` },
    )
    setPending(false)
    if (error?.status === 429) {
      setError('送信回数が上限に達しました。しばらく時間をおいてお試しください。')
      return
    }
    setSent(true)
  }

  return (
    <AuthShell
      title="パスワードの再設定"
      description="登録メールアドレスを入力してください。パスワード再設定用のリンクをお送りします。"
    >
      {sent ? (
        <div className="flex flex-col gap-4">
          <p role="status" className="leading-relaxed">
            登録されているメールアドレスの場合、再設定用のメールを送信しました。メールが届かない場合は迷惑メールフォルダもご確認ください。
          </p>
          <Link href="/login" className="text-sm underline underline-offset-4">ログイン画面へ戻る</Link>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" disabled={pending} className="h-11 bg-foreground text-background hover:bg-foreground/90">
            {pending ? '送信中…' : '再設定メールを送る'}
          </Button>
          <Link href="/login" className="text-center text-sm underline underline-offset-4">ログイン画面へ戻る</Link>
        </form>
      )}
    </AuthShell>
  )
}
