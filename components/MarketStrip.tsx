'use client'

import Link from 'next/link'
import type { TwentyMarket } from '@/lib/database.types'
import { useLang } from '@/components/LangProvider'

export default function MarketStrip({ markets }: { markets: TwentyMarket[] }) {
  const { t } = useLang()
  const clean = markets.filter(m => !m.market_name.includes('테스트'))
  if (clean.length === 0) return null

  // Duplicate for seamless loop
  const row1: TwentyMarket[] = []
  const row2: TwentyMarket[] = []
  while (row1.length < 16) row1.push(...clean)
  while (row2.length < 16) row2.push(...[...clean].reverse())

  const imgStyle: React.CSSProperties = {
    width: '200px', height: '200px',
    objectFit: 'cover', flexShrink: 0, display: 'block', borderRadius: '6px',
  }
  const track = (dir: 'left' | 'right'): React.CSSProperties => ({
    display: 'flex', gap: '8px',
    animation: `${dir === 'left' ? 'carouselLeft' : 'carouselRight'} 35s linear infinite`,
    willChange: 'transform',
  })

  return (
    <section style={{ background: 'var(--dark-brown)', paddingTop: '128px', paddingBottom: '40px', overflow: 'hidden' }}>
      {/* Label */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px', marginBottom: '24px', maxWidth: '1240px', margin: '0 auto 24px' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '20px', color: 'var(--tan)' }}>
          {t.markets.eyebrow}
        </div>
        <Link href="/markets" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'rgba(245,239,230,0.5)', textDecoration: 'none', letterSpacing: '0.04em' }}>
          {t.markets.seeAll}
        </Link>
      </div>

      {/* Row 1 — scrolls left */}
      <div style={{ overflow: 'hidden', marginBottom: '8px' }}>
        <div style={track('left')}>
          {[...row1, ...row1].map((m, i) => (
            <Link key={i} href="/markets" style={{ textDecoration: 'none', flexShrink: 0, display: 'block', borderRadius: '6px', overflow: 'hidden' }}>
              <img src={m.market_cover} alt={m.market_name} style={imgStyle} />
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div style={{ overflow: 'hidden' }}>
        <div style={track('right')}>
          {[...row2, ...row2].map((m, i) => (
            <Link key={i} href="/markets" style={{ textDecoration: 'none', flexShrink: 0, display: 'block', borderRadius: '6px', overflow: 'hidden' }}>
              <img src={m.market_cover} alt={m.market_name} style={imgStyle} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
