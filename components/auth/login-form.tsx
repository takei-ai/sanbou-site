'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

function messageFor(code?: string, status?: number) {
  if (code === 'email_not_confirmed') return 'メールアドレスの確認が完了していません。招待メールのリンクからパスワードを設定してください。'
  if (status === 429 || code === 'over_request_rate_limit') return '試行回数が上限に達しました。しばらく時間をおいてお試しください。'
  if (code === 'invalid_credentials') return 'メールアドレスまたはパスワードが正しくありません。'
  return 'ログインできませんでした。時間をおいて再度お試しください。'
}

export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const router = useRouter()
  const [error, setError] = useState(initialError)
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    setError(undefined)
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get('email')),
      password: String(form.get('password')),
    })
    if (error) {
      setError(messageFor(error.code, error.status))
      setPending(false)
      return
    }
    router.replace(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required className="h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">パスワード</Label>
          <Link href="/auth/forgot-password" className="text-xs underline underline-offset-4">
            パスワードをお忘れの方
          </Link>
        </div>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-11" />
      </div>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11 bg-foreground text-background hover:bg-foreground/90">
        {pending ? 'ログイン中…' : 'ログイン'}
      </Button>
      <p className="text-center text-xs leading-relaxed text-muted-foreground">
        会員登録は入会手続き後に事務局が行います。
        <br />
        <Link href="/join" className="underline underline-offset-4">入会のご案内はこちら</Link>
      </p>
    </form>
  )
}
