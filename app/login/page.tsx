import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'
import { getSessionProfile, safeNextPath } from '@/lib/auth'

export const metadata: Metadata = { title: '会員ログイン', robots: { index: false } }

const ERRORS: Record<string, string> = {
  inactive: 'このアカウントは現在ご利用いただけません。事務局までお問い合わせください。',
  link: 'リンクの有効期限が切れているか、すでに使用されています。もう一度お試しください。',
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams
  const target = safeNextPath(next)
  const { profile } = await getSessionProfile()
  if (profile?.status === 'active') redirect(target)

  return (
    <AuthShell title="会員ログイン" description="登録済みのメールアドレスとパスワードでログインしてください。">
      <LoginForm next={target} initialError={error ? ERRORS[error] : undefined} />
    </AuthShell>
  )
}
