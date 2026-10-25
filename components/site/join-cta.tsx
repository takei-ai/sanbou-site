import Link from 'next/link'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { LumaEvent } from '@/lib/luma'
import { LINKS, PRICING, formatDateTime } from '@/lib/site'
import { cn } from '@/lib/utils'

export function JoinCta({ nextSeminar }: { nextSeminar?: LumaEvent | null }) {
  return (
    <section aria-labelledby="join-cta-heading" className="border-y bg-muted">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2 md:items-center">
        <div className="flex flex-col gap-3">
          <h2 id="join-cta-heading" className="text-2xl font-bold text-balance md:text-3xl">
            知ったことを今すぐ実践へ
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {`月額${PRICING.monthly}円／年額${PRICING.yearly}円（税込）。すべての勉強会アーカイブとノウハウ動画が見放題です。`}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/join" className={cn(buttonVariants(), 'h-11 px-6 text-base')}>
              入会のご案内
              <ArrowRight data-icon="inline-end" />
            </Link>
            <a
              href={LINKS.freeTicket}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline' }), 'h-11 px-5 text-base')}
            >
              無料チケットで参加する
            </a>
          </div>
        </div>
        {nextSeminar ? (
          <div className="flex flex-col gap-3 rounded-lg border bg-background p-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="size-4" aria-hidden />
              今後の勉強会
            </p>
            <p className="line-clamp-3 font-heading text-lg font-bold leading-snug text-pretty">{nextSeminar.title}</p>
            <p className="text-sm">{formatDateTime(nextSeminar.startsAt)}</p>
            <a
              href={nextSeminar.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="luma-click"
              className="text-sm font-medium underline underline-offset-4"
            >
              Lumaで申し込む
            </a>
          </div>
        ) : null}
      </div>
    </section>
  )
}
