import { ChevronDown } from 'lucide-react'
import { PRICING } from '@/lib/site'

export const FAQS = [
  {
    q: '誰でも参加できますか？',
    a: '経営者・役員の方であれば、業種や会社規模を問わずご参加いただけます。入会審査はありません。',
  },
  {
    q: '料金はいくらですか？',
    a: `月額${PRICING.monthly}円、または年額${PRICING.yearly}円（いずれも税込）です。年額プランは2か月分お得になります。`,
  },
  {
    q: '勉強会に参加できない週はどうなりますか？',
    a: 'オンライン配信にもご参加いただけます。参加できない場合は、開催後に会員サイトの「勉強会アーカイブ」で録画を視聴できます。'
  },
  {
    q: '入会前に体験できますか？',
    a: '無料チケットで勉強会に1回ご参加いただけます。',
  },
  {
    q: '休会・退会はできますか？',
    a: '事務局へご連絡いただければ、休会・退会の手続きをいたします。手続き後は会員サイトへのログインが停止されます。',
  },
  {
    q: 'パスワードを忘れました。',
    a: 'ログイン画面の「パスワードをお忘れの方」から、登録メールアドレス宛に再設定メールをお送りします。',
  },
  {
    q: 'ログインIDを家族や社員と共有できますか？',
    a: 'アカウントは会員ご本人のみご利用いただけます。共有が確認された場合はご利用を停止することがあります。',
  },
]

export function FaqList({ items = FAQS }: { items?: typeof FAQS }) {
  return (
    <div className="flex flex-col divide-y border-y">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
            <span className="flex gap-3">
              <span className="font-heading font-black text-primary" aria-hidden>
                Q
              </span>
              {item.q}
            </span>
            <ChevronDown className="mt-1 size-4 shrink-0 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="pl-7 pt-3 leading-relaxed text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  )
}
