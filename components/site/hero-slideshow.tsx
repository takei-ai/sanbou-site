'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { HeroSlide } from '@/lib/hero-slides'
import { cn } from '@/lib/utils'

type HeroSlideshowProps = {
  slides: HeroSlide[]
  intervalMs: number
}

export function HeroSlideshow({ slides, intervalMs }: HeroSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [slides.length, intervalMs])

  return (
    <div className="-z-10 absolute inset-0">
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={slide.alt}
          fill
          priority={index === 0}
          sizes="100vw"
          className={cn(
            'object-cover object-[50%_30%] transition-opacity duration-1000 ease-in-out',
            index === activeIndex ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}
    </div>
  )
}
