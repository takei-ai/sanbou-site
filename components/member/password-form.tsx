'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function PasswordForm() {
  const [message, setMessage] = useState<{ ok: boolean; text: string }>()
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    const form = new FormData(formEl)
    const password = String(form.get('password'))
    if (password !== String(form.get('confirm'))) {
      setMessage({ ok: false, text: '確認用パスワードが一致しません。' })
      return
    }
    setPending(true)
    const { error } = await createClient().auth.updateUser({ password })
    setPending(false)
    if (error) {
      setMessage({
        ok: false,
        text:
          error.code === 'same_password'
            ? '現在と異なるパスワードを設定してください。'
            : error.code === 'weak_password'
              ? 'パスワードは8文字以上で、推測されにくいものを設定してください。'
              : 'パスワードを変更できませんでした。時間をおいて再度お試しください。',
      })
      return
    }
    formEl.reset()
    setMessage({ ok: true, text: 'パスワードを変更しました。' })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">新しいパスワード</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required className="h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">新しいパスワード（確認）</Label>
        <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required className="h-11" />
      </div>
      {message ? (
        <p role={message.ok ? 'status' : 'alert'} className={message.ok ? 'text-sm' : 'text-sm text-destructive'}>{message.text}</p>
      ) : null}
      <Button type="submit" disabled={pending} className="h-11 w-fit bg-foreground px-6 text-background hover:bg-foreground/90">
        {pending ? '変更中…' : 'パスワードを変更'}
      </Button>
    </form>
  )
}
