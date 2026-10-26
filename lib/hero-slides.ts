export type HeroSlide = {
  src: string
  alt: string
}

// 背景写真を増やすときは、public/images/hero/ に画像を置いて、ここに1行ずつ追加します。
// 2枚以上あると、自動でゆっくり切り替わります。
export const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/images/hero/hero-01.jpg',
    alt: '参謀BARと参謀勉強会の看板を持つ、会員のみなさんの集合写真',
  },
  {
    src: '/images/hero/hero-02.jpg',
    alt: '大型モニターの前で参謀勉強会の看板を持つ、参加者の集合写真',
  },
  {
    src: '/images/hero/hero-03.jpg',
    alt: '赤いカーテンを背に参謀BARの看板を囲む、大人数の集合写真',
  },
  {
    src: '/images/hero/hero-04.jpg',
    alt: '赤いカーペットの個室で、ポーズを決める7人の集合写真',
  },
  {
    src: '/images/hero/hero-05.jpg',
    alt: '個室で参謀勉強会の看板を掲げる、参加者の集合写真',
  },
]

export const HERO_SLIDE_INTERVAL_MS = 6000
