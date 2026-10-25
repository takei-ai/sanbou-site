import type { Metadata } from 'next'
import { JoinCta } from '@/components/site/join-cta'
import { SeminarList } from '@/components/site/seminar-list'
import { getLumaUpcomingEvents } from '@/lib/luma'
import { LINKS } from '@/lib/site'

export const metadata: Metadata = {
  title: '勉強会のご案内',
  description: '毎週火曜19時開催。参謀勉強会の開催予定（日時・講師・テーマ）です。',
}

export default async function SeminarsPage() {
  const events = await getLumaUpcomingEvents(20)
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="text-sm text-muted-foreground">SEMINAR</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">勉強会のご案内</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
          参謀の勉強会は毎週火曜19時から開催しています。（オンラインでの参加も可能です）お申し込みは各回のLumaページから。会員でない方は無料チケットで1回ご参加いただけます。
        </p>
        <div className="mt-10">
          <SeminarList events={events} />
        </div>
        <a
          href={LINKS.lumaCalendar}
          target="_blank"
          rel="noopener noreferrer"
          data-track="luma-click"
          className="mt-6 inline-block text-sm font-medium underline underline-offset-4"
        >
          Lumaカレンダーで全日程を見る
        </a>

        <section className="mt-20 border-t border-border pt-10" aria-labelledby="venue-heading">
          <p className="text-sm text-muted-foreground">VENUE</p>
          <h2 id="venue-heading" className="mt-2 text-2xl font-black md:text-3xl">
            会場情報
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="space-y-6 text-sm leading-relaxed">
              <div>
                <h3 className="font-bold">住所</h3>
                <p className="mt-2 text-muted-foreground">
                  〒160-0022<br />
                  東京都新宿区新宿3-15-11<br />
                  アドホック新宿ビル5F（reDine 新宿 内）
                </p>
              </div>
              <div>
                <h3 className="font-bold">アクセス</h3>
                <p className="mt-2 text-muted-foreground">新宿三丁目駅 徒歩すぐ／新宿駅 徒歩3分</p>
              </div>
              <div>
                <h3 className="font-bold">入り方</h3>
                <p className="mt-2 text-muted-foreground">
                  アドホック新宿ビルの5F、フードホール「reDine 新宿」の中にあります。
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border bg-muted">
              <iframe
                title="会場のGoogleマップ"
                src="https://www.google.com/maps?q=東京都新宿区新宿3-15-11+アドホック新宿ビル5F&output=embed"
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </section>
      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
