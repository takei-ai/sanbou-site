import Link from 'next/link'
import { PasswordForm } from '@/components/member/password-form'
import { requireMember } from '@/lib/auth'
import { LINKS } from '@/lib/site'

export const metadata = { title: '設定' }

export default async function SettingsPage() {
  const { profile } = await requireMember('/member/settings')
  return (
    <div className="flex max-w-xl flex-col gap-12">
      <h1 className="text-2xl font-black md:text-3xl">設定</h1>
      <section aria-labelledby="account" className="flex flex-col gap-4">
        <h2 id="account" className="text-lg font-bold">アカウント情報</h2>
        <dl className="divide-y border-y">
          <div className="grid grid-cols-[8rem_1fr] py-3"><dt className="text-muted-foreground">氏名</dt><dd>{profile.full_name || '未設定'}</dd></div>
          <div className="grid grid-cols-[8rem_1fr] py-3"><dt className="text-muted-foreground">メール</dt><dd className="break-all">{profile.email}</dd></div>
        </dl>
        <p className="text-sm text-muted-foreground">
          {'登録情報の変更・休会・退会は'}
          <a href={LINKS.contact} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">お問い合わせフォーム</a>
          {'からご連絡ください。'}
        </p>
      </section>
      <section aria-labelledby="password" className="flex flex-col gap-4">
        <h2 id="password" className="text-lg font-bold">パスワード変更</h2>
        <PasswordForm />
      </section>
      <Link href="/company#privacy" className="text-sm underline underline-offset-4">プライバシーポリシー</Link>
    </div>
  )
}
