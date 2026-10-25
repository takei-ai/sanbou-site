import type { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/site/site-header'
import { requireAdmin } from '@/lib/auth'

export const metadata: Metadata = {
  title: { default: '管理画面', template: '%s｜参謀 管理画面' },
  robots: { index: false, follow: false },
}

const NAV = [
  { href: '/admin', label: '会員管理' },
  { href: '/admin/contents', label: '動画・記事' },
  { href: '/admin/schedule', label: '勉強会・お知らせ・資料' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="flex min-h-svh flex-col bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded bg-primary px-1.5 py-0.5 text-[11px] font-bold text-primary-foreground">ADMIN</span>
          </div>
          <Link href="/member" className="text-sm text-muted-foreground hover:text-foreground">会員サイトへ</Link>
        </div>
        <nav aria-label="管理メニュー" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="shrink-0 border-b-2 border-transparent px-3 py-2.5 text-sm hover:border-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>
    </div>
  )
}
