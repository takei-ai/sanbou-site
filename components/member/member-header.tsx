import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/site/site-header'

const NAV = [
  { href: '/member', label: 'マイページ' },
  { href: '/member/archive', label: 'アーカイブ' },
  { href: '/member/settings', label: '設定' },
]

export function MemberHeader({ name, isAdmin }: { name: string; isAdmin: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="rounded bg-foreground px-1.5 py-0.5 text-[11px] font-bold text-background">MEMBER</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted-foreground md:inline">{`${name} 様`}</span>
          <form action="/auth/logout" method="post">
            <button type="submit" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              <LogOut className="size-4" aria-hidden />
              ログアウト
            </button>
          </form>
        </div>
      </div>
      <nav aria-label="会員メニュー" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href} className="shrink-0 border-b-2 border-transparent px-3 py-2.5 text-sm hover:border-foreground">
            {item.label}
          </Link>
        ))}
        {isAdmin ? (
          <Link href="/admin" className="shrink-0 border-b-2 border-transparent px-3 py-2.5 text-sm font-bold hover:border-foreground">
            管理画面
          </Link>
        ) : null}
      </nav>
    </header>
  )
}
