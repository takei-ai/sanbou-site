import type { Metadata } from 'next'
import { JoinCta } from '@/components/site/join-cta'
import { getLumaUpcomingEvents } from '@/lib/luma'

export const metadata: Metadata = {
  title: '活用方法・会員の声',
  description: '参謀の活用方法と会員の声は、今後公開予定です。',
}

function ComingSoon({ id, title, className }: { id: string; title: string; className?: string }) {
  return (
    <section aria-labelledby={id} className={className}>
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 id={id} className="text-2xl font-bold">{title}</h2>
        <p className="mt-6 rounded-lg border border-dashed bg-background px-6 py-10 text-center text-muted-foreground">
          今後、公開予定
        </p>
      </div>
    </section>
  )
}

export default async function VoicesPage() {
  const events = await getLumaUpcomingEvents(1)
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-16">
        <p className="text-sm text-muted-foreground">HOW TO USE</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">活用方法・会員の声</h1>
      </section>
      <ComingSoon id="usage-heading" title="活用方法" />
      <ComingSoon id="voices-heading" title="会員の声" className="bg-muted" />
      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
