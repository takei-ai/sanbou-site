import Link from 'next/link'
import { Menu } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/contents', label: 'コンテンツ紹介' },
  { href: '/seminars', label: '勉強会' },
  { href: '/voices', label: '活用方法・会員の声' },
  { href: '/faq', label: 'よくある質問' },
]

export function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-2" aria-label="経営者コミュニティ「参謀」トップへ">
      <span className="hidden text-xs text-muted-foreground sm:inline">経営者コミュニティ</span>
      <span className="font-heading text-2xl font-black tracking-wider">「参謀」</span>
    </Link>
  )
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Logo />
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className={cn(buttonVariants({ variant: 'outline' }), 'h-9 px-3')}>
            会員ログイン
          </Link>
          <Link href="/join" className={cn(buttonVariants(), 'hidden h-9 px-4 sm:inline-flex')}>
            入会のご案内
          </Link>
          <details className="relative lg:hidden">
            <summary
              className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-9 list-none [&::-webkit-details-marker]:hidden')}
              aria-label="メニューを開く"
            >
              <Menu className="size-5" />
            </summary>
            <nav
              aria-label="モバイルナビゲーション"
              className="absolute right-0 top-11 flex w-56 flex-col rounded-lg border bg-background p-2 shadow-lg"
            >
              {NAV.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                  {item.label}
                </Link>
              ))}
              <Link href="/join" className="rounded-md px-3 py-2.5 text-sm font-bold text-primary hover:bg-muted">
                入会のご案内
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
