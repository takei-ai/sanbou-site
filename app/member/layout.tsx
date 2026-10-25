import type { Metadata } from 'next'
import { MemberHeader } from '@/components/member/member-header'
import { requireMember } from '@/lib/auth'

export const metadata: Metadata = {
  title: { default: '会員サイト', template: '%s｜参謀 会員サイト' },
  robots: { index: false, follow: false },
}

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireMember()
  return (
    <div className="flex min-h-svh flex-col">
      <MemberHeader name={profile.full_name || profile.email} isAdmin={profile.role === 'admin'} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        {'本サイトのコンテンツの無断転載・録画・共有を禁止します。 © 白潟総合研究所株式会社'}
      </footer>
    </div>
  )
}
