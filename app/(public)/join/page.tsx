import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { LINKS, PRICING } from '@/lib/site'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: '入会・お問い合わせ',
  description: `参謀への入会申込とお問い合わせ。月額${PRICING.monthly}円／年額${PRICING.yearly}円（税込）。`,
}

const STEPS = [
  {
    title: '入会審査フォームの入力',
    body: '必須項目のみで結構です。企業情報登録という意味合いでご登録ください（審査はありません）。',
  },
  {
    title: '決済方法の選択',
    body: '決済サービス（favy）でお支払いください。入金を確認後、事務局で会員登録を行います。',
  },
  { title: 'ログイン案内', body: '会員サイトへの招待メールが届きます。メール内のリンクからパスワードを設定してご利用ください。' },
]

export default function JoinPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-sm text-muted-foreground">JOIN</p>
      <h1 className="mt-2 text-3xl font-black md:text-4xl">入会・お問い合わせ</h1>

      <ol className="mt-12 flex flex-col gap-10">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground font-heading font-bold">
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="leading-relaxed text-muted-foreground">{s.body}</p>
              </div>

              {i === 0 && (
                <a href={LINKS.applyForm} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-12 w-fit px-6 text-base')}>
                  入会審査フォームを入力する
                  <ArrowUpRight data-icon="inline-end" />
                </a>
              )}

              {i === 1 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <a href={LINKS.applyYearly} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-14 text-base')}>
                    {`年額 ${PRICING.yearly}円／年`}
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                  <a href={LINKS.applyMonthly} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'h-14 text-base')}>
                    {`月額 ${PRICING.monthly}円／月`}
                    <ArrowUpRight data-icon="inline-end" />
                  </a>
                  <p className="text-sm font-bold text-primary md:col-span-2">※年額プランの方がお安くなります。</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14 grid gap-6 border-t pt-10 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">まずは1回参加してみたい方</h2>
          <p className="leading-relaxed text-muted-foreground">無料チケットで勉強会に1回ご参加いただけます。</p>
          <a href={LINKS.freeTicket} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-fit px-5')}>
            無料チケットを申し込む
          </a>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">お問い合わせ</h2>
          <p className="leading-relaxed text-muted-foreground">内容を確認のうえ、担当者よりメールでご連絡します。</p>
          <a href={LINKS.contact} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }), 'h-11 w-fit px-5')}>
            お問い合わせフォーム
          </a>
        </div>
      </div>
    </section>
  )
}
