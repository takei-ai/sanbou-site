import type { Metadata } from 'next'
import { LINKS, PRICING } from '@/lib/site'

export const metadata: Metadata = {
  title: '運営会社・プライバシーポリシー・特定商取引法に基づく表記',
}

const JOINT_COMPANY = [
  ['社名', '株式会社経営参謀'],
  ['所在地', '東京都新宿区新宿3-15-11'],
  ['代表者', '代表取締役 新谷 健司'],
  ['設立', '2015年11月'],
  ['事業内容', '経営コンサルティング\n経営者コミュニティー「参謀」\n参謀BAR'],
]

const COMPANY = [
  ['会社名', '白潟総合研究所株式会社'],
  ['所在地', '〒103-0001 東京都中央区日本橋小伝馬町4-11 サンコービル7F'],
  ['代表者', '代表取締役社長 石川哲也'],
  ['設立', '2014年10月2日'],
  ['事業内容', '総合経営コンサルティング、採用コンサルティング、人財育成・研修、M&Aコンサルティング等'],
]

const TOKUSHOHO = [
  ['販売事業者', '白潟総合研究所株式会社'],
  ['運営責任者', '石川哲也'],
  ['所在地', '〒103-0001 東京都中央区日本橋小伝馬町4-11 サンコービル7F'],
  ['販売価格', `月額${PRICING.monthly}円／年額${PRICING.yearly}円（税込）`],
  ['商品代金以外の必要料金', 'インターネット接続にかかる通信料はお客様のご負担となります。'],
  ['支払方法・時期', '決済サービス（favy）にて、お申し込み時にお支払いください。'],
  ['サービスの提供時期', '入金確認後、会員サイトの招待メールをお送りした時点から'],
  ['解約・返金', 'デジタルコンテンツの性質上、お支払い後の返金はいたしかねます。退会のご連絡をいただいた月の末日で解約となります。'],
  ['お問い合わせ', 'お問い合わせフォームよりご連絡ください。'],
]

function Table({ rows }: { rows: string[][] }) {
  return (
    <dl className="divide-y border-y">
      {rows.map(([k, v]) => (
        <div key={k} className="grid gap-1 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
          <dt className="font-medium">{k}</dt>
          <dd className="whitespace-pre-line leading-relaxed text-muted-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function CompanyPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-16 px-5 py-16">
      <section aria-labelledby="company">
        <h1 id="company" className="mb-8 text-3xl font-black">運営会社</h1>
        <Table rows={COMPANY} />
        <a href={LINKS.company} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm underline underline-offset-4">
          白潟総合研究所 公式サイト
        </a>
        <div className="mt-12">
          <h2 className="mb-6 text-xl font-bold">共同運営会社</h2>
          <Table rows={JOINT_COMPANY} />
        </div>
      </section>

      <section id="privacy" aria-labelledby="privacy-heading" className="scroll-mt-20">
        <h2 id="privacy-heading" className="mb-6 text-2xl font-bold">プライバシーポリシー</h2>
        <div className="flex flex-col gap-4 leading-relaxed text-muted-foreground">
          <p>白潟総合研究所株式会社（以下「当社」）は、経営者コミュニティ「参謀」の運営にあたり、以下のとおり個人情報を取り扱います。</p>
          <p><strong className="text-foreground">1. 取得する情報</strong>　会員サイトでは、氏名およびメールアドレスのみを保存します。パスワードは認証サービス上で暗号化して管理し、当社が閲覧することはありません。</p>
          <p><strong className="text-foreground">2. 利用目的</strong>　会員認証、会員サイトの提供、勉強会・お知らせのご案内、お問い合わせへの対応に利用します。</p>
          <p><strong className="text-foreground">3. 第三者提供</strong>　法令に基づく場合を除き、ご本人の同意なく第三者に提供しません。</p>
          <p><strong className="text-foreground">4. アクセス解析</strong>　サイト改善のため、Googleアナリティクス等の解析ツールを利用することがあります。</p>
          <p><strong className="text-foreground">5. 開示・訂正・削除</strong>　ご本人からの請求に応じ、遅滞なく対応します。お問い合わせフォームよりご連絡ください。</p>
        </div>
      </section>

      <section id="tokushoho" aria-labelledby="tokushoho-heading" className="scroll-mt-20">
        <h2 id="tokushoho-heading" className="mb-6 text-2xl font-bold">特定商取引法に基づく表記</h2>
        <Table rows={TOKUSHOHO} />
      </section>
    </div>
  )
}
