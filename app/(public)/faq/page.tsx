import type { Metadata } from 'next'
import { FaqList } from '@/components/site/faq-list'
import { JoinCta } from '@/components/site/join-cta'
import { getLumaUpcomingEvents } from '@/lib/luma'

export const metadata: Metadata = {
  title: 'よくある質問',
  description: '参加条件、料金、休会・退会、ログインについてのよくある質問です。',
}

export default async function FaqPage() {
  const events = await getLumaUpcomingEvents(1)
  return (
    <>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <p className="text-sm text-muted-foreground">FAQ</p>
        <h1 className="mb-10 mt-2 text-3xl font-black md:text-4xl">よくある質問</h1>
        <FaqList />
      </section>
      <JoinCta nextSeminar={events[0] ?? null} />
    </>
  )
}
