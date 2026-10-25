import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { FaqList, FAQS } from '@/components/site/faq-list'
import { JoinCta } from '@/components/site/join-cta'
import { LumaEventCards } from '@/components/site/luma-event-cards'
import { getLumaUpcomingEvents } from '@/lib/luma'
import { LINKS, PRICING } from '@/lib/site'
import { cn } from '@/lib/utils'

const VALUES = [
  {
    title: '出会う',
    body: '毎週火曜19時、第一線の経営者・コンサルタントが登壇する勉強会。検索やAIでは手に入らない、現場の一次情報に出会えます。',
  },
  {
    title: '深める',
    body: '勉強会後の懇親会では、登壇者や参加者とテーマを掘り下げて議論。会員サイトのアーカイブで、何度でも学びを深められます。',
  },
  {
    title: '実践する',
    body: '知ったことをすぐに現場で試す。同じ志の経営者と、実践の結果と次の一手を共有できます。',
  },
]

export default async function HomePage() {
  const events = await getLumaUpcomingEvents(4)

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <Image
          src="/images/hero.png"
          alt="勉強会で講師の話に耳を傾ける経営者たち"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="-z-10 absolute inset-0 bg-background/80 md:bg-gradient-to-r md:from-background md:via-background/90 md:to-background/10" />
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-20 md:py-32">
          <p className="text-sm font-medium tracking-widest text-muted-foreground">
            {'経営者コミュニティ「参謀」'}
          </p>
          <h1 className="font-heading text-4xl font-black leading-tight tracking-tight md:text-6xl">
            新しい経営との出会い
            <br />
            知った日から実践する
          </h1>
          <p className="max-w-lg leading-relaxed text-foreground/80">
            毎週火曜19時の勉強会と、会員だけが見られる勉強会アーカイブ。学びを「知っている」で終わらせず、自社の実践につなげる経営者のためのコミュニティです。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/join" className={cn(buttonVariants(), 'h-12 px-6 text-base')}>
              入会のご案内
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link href="/contents" className={cn(buttonVariants({ variant: 'outline' }), 'h-12 px-6 text-base')}>
              コンテンツをのぞいてみる
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="values-heading" className="mx-auto max-w-6xl px-5 py-20">
        <h2 id="values-heading" className="mb-12 text-2xl font-bold md:text-3xl">
          参謀で得られること
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="flex flex-col gap-3 border-t-2 border-foreground pt-6">
              <h3 className="text-xl font-bold">{v.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="seminar-heading" className="bg-muted py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h2 id="seminar-heading" className="text-2xl font-bold md:text-3xl">
                今後の勉強会
              </h2>
              <p className="text-muted-foreground">詳細はクリックしてご覧下さい</p>
            </div>
            <Link href="/seminars" className="hidden shrink-0 text-sm font-medium underline underline-offset-4 sm:block">
              開催予定をもっと見る
            </Link>
          </div>
          <LumaEventCards events={events} />
        </div>
      </section>

      <section aria-labelledby="pricing-heading" className="border-t py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 id="pricing-heading" className="mb-10 text-2xl font-bold md:text-3xl">
            料金
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-lg border p-8">
              <p className="font-medium">月額プラン</p>
              <p className="font-heading text-4xl font-black">
                {PRICING.monthly}
                <span className="ml-1 text-base font-medium">円／月（税込）</span>
              </p>
              <a href={LINKS.applyMonthly} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-11')}>
                月額プランで申し込む
              </a>
            </div>
            <div className="flex flex-col gap-4 rounded-lg border-2 border-foreground p-8">
              <p className="font-medium">
                年額プラン<span className="ml-2 text-sm text-muted-foreground">2か月分お得</span>
              </p>
              <p className="font-heading text-4xl font-black">
                {PRICING.yearly}
                <span className="ml-1 text-base font-medium">円／年（税込）</span>
              </p>
              <a href={LINKS.applyYearly} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), 'h-11')}>
                年額プランで申し込む
              </a>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            どちらのプランも、勉強会への参加と会員サイトのすべてのコンテンツがご利用いただけます。
          </p>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto max-w-3xl px-5 py-20">
        <h2 id="faq-heading" className="mb-8 text-2xl font-bold md:text-3xl">
          よくある質問
        </h2>
        <FaqList items={FAQS.slice(0, 4)} />
        <Link href="/faq" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
          すべての質問を見る
        </Link>
      </section>

      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
