import Link from 'next/link'
import { LINKS } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 md:flex-row md:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex items-baseline gap-2">
            <p className="text-xs text-muted-foreground">経営者コミュニティ</p>
            <p className="font-heading text-2xl font-black tracking-wider">「参謀」</p>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            新しい経営との出会い
            <br />
            知った日から実践する
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
          <Link href="/contents" className="hover:underline">コンテンツ紹介</Link>
          <Link href="/seminars" className="hover:underline">勉強会・セミナー</Link>
          <Link href="/voices" className="hover:underline">活用方法・会員の声</Link>
          <Link href="/faq" className="hover:underline">よくある質問</Link>
          <Link href="/join" className="hover:underline">入会・お問い合わせ</Link>
          <Link href="/company" className="hover:underline">運営会社</Link>
          <Link href="/company#privacy" className="hover:underline">プライバシーポリシー</Link>
          <Link href="/company#tokushoho" className="hover:underline">特定商取引法に基づく表記</Link>
          <a href={LINKS.blog} className="hover:underline" target="_blank" rel="noopener noreferrer">ブログ</a>
          <Link href="/login" className="hover:underline">会員ログイン</Link>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted-foreground">
          {'運営：白潟総合研究所株式会社 © 2026'}
        </p>
      </div>
    </footer>
  )
}
