import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, Zen_Kaku_Gothic_New } from 'next/font/google'
import './globals.css'

const notoSans = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans',
  display: 'swap',
})

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['500', '700', '900'],
  variable: '--font-zen-kaku',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://member.ksanbou.co.jp'),
  title: {
    default: '経営者コミュニティ「参謀」｜新しい経営との出会い 知った日から実践する',
    template: '%s｜経営者コミュニティ「参謀」',
  },
  description:
    '毎週火曜19時の勉強会と、会員限定の勉強会アーカイブ・ノウハウ動画で、学んだ経営を実践につなげる経営者コミュニティ「参謀」。運営：白潟総合研究所株式会社',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    siteName: '経営者コミュニティ「参謀」',
    images: [{ url: '/images/hero.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSans.variable} ${zenKaku.variable} bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
