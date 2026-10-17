'use client'

import { useLang } from '@/components/LangProvider'
import type { TwentyMarket } from '@/lib/database.types'
import type { ShopSlide } from '@/lib/furukawashiko'

const inter = 'var(--font-inter), sans-serif'

export default function Hero({ fairCount, marketCount, markets = [], shopSlides = [] }: {
  fairCount?: number
  marketCount?: number
  markets?: TwentyMarket[]
  shopSlides?: ShopSlide[]   // Furukawashiko new arrivals
}) {
  const { lang, t } = useLang()

  // Live Twenty market covers as a 3-row mosaic (proof that markets are open right now)
  const clean = markets.filter(m => !m.market_name.includes('테스트') && m.market_cover)
  const rows: TwentyMarket[][] = clean.length === 0 ? [] : [0, 1].map(r => {
    const start = Math.floor((clean.length * r) / 2)
    const base = r === 1 ? [...clean].reverse() : [...clean.slice(start), ...clean.slice(0, start)]
    const row: TwentyMarket[] = []
    while (row.length < 12) row.push(...base)
    return row.slice(0, 12)
  })

  // Furukawashiko new arrivals row — a Japanese brand, so hidden in Japanese mode (CLAUDE.md rule 10)
  const shopRow: ShopSlide[] = []
  if (lang !== 'ja' && shopSlides.length > 0) while (shopRow.length < 12) shopRow.push(...shopSlides)

  return (
    <section id="top" className="hero-section" style={{ minHeight: '100vh', paddingTop: '90px', overflow: 'hidden', background: 'var(--cream)' }}>
      <div className="hero-grid">

        {/* Headline: desktop col-1 row-1 | mobile order-2 */}
        <div className="hg-headline">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontFamily: inter, fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: '36px', animation: 'fadeUp 0.8s ease both' }}>
            <span style={{ width: '32px', height: '1px', background: 'var(--brown)', display: 'inline-block' }} />
            {t.hero.eyebrow}
          </div>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(54px, 6.5vw, 92px)', lineHeight: '0.98', letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: 0, animation: 'fadeUp 0.8s ease 0.1s both' }}>
            {t.hero.line1}<br />{t.hero.line2}<br />
            <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{t.hero.lineEm}</em>
          </h1>
        </div>

        {/* Market mosaic: desktop right column | mobile order-1 */}
        <div className="hg-right">
          {(rows.length > 0 || shopRow.length > 0) && (
            <div className="hg-carousel" style={{ animation: 'fadeIn 1.2s ease 0.2s both' }}>
              {rows.map((row, r) => (
                <div key={r} className={`hg-row hg-row-${r}`}>
                  <div style={{ display: 'flex', gap: '10px', animation: `${r === 1 ? 'carouselRight' : 'carouselLeft'} ${46 + r * 8}s linear infinite`, willChange: 'transform' }}>
                    {[...row, ...row].map((m, i) => (
                      <a key={i} href="/markets" tabIndex={-1} aria-hidden className="hg-tile">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={m.market_cover} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
              {rows.length > 0 && (
                <a href="/markets" className="hg-caption" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: inter, fontSize: '12.5px', fontWeight: 400, color: 'var(--muted-blue)', textDecoration: 'none' }}>
                  <span className="live-dot" style={{ marginRight: 0 }} />
                  {t.hero.liveCaption}
                </a>
              )}

              {shopRow.length > 0 && (
                <>
                  <div className="hg-row hg-row-shop" style={{ marginTop: '18px' }}>
                    <div style={{ display: 'flex', gap: '10px', animation: 'carouselRight 58s linear infinite', willChange: 'transform' }}>
                      {[...shopRow, ...shopRow].map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noreferrer" tabIndex={-1} aria-hidden className="hg-tile" title={s.title}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt="" loading="lazy" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </a>
                      ))}
                    </div>
                  </div>
                  <a href="/order/new?url=https%3A%2F%2Fwww.furukawashiko-online.shop%2F" className="hg-caption" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: inter, fontSize: '12.5px', fontWeight: 400, color: 'var(--muted-blue)', textDecoration: 'none' }}>
                    <span className="live-dot" style={{ marginRight: 0 }} />
                    {t.hero.furuCaption}
                  </a>
                </>
              )}
            </div>
          )}
        </div>

        {/* Body / CTAs / stats: desktop col-1 row-2 | mobile order-3 */}
        <div className="hg-content">
          <p style={{ fontFamily: inter, fontSize: '16px', fontWeight: 300, lineHeight: '1.75', color: 'rgba(45,55,72,0.75)', maxWidth: '460px', marginBottom: '36px', animation: 'fadeUp 0.8s ease 0.2s both' }}>
            {t.hero.body}
          </p>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.3s both' }}>
            <a href="/order/new" className="btn-primary-hero">{t.hero.cta1}</a>
            <a href="/catalogue/planners-2027" className="btn-secondary-hero">{t.hero.cta2}</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontFamily: inter, fontSize: '12.5px', fontWeight: 400, color: 'var(--muted-blue)', animation: 'fadeUp 0.8s ease 0.35s both' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#BFDCCF', display: 'inline-block', flexShrink: 0 }} />
            {t.hero.reassure}
          </div>
          <div style={{ display: 'flex', gap: '48px', marginTop: '56px', animation: 'fadeUp 0.8s ease 0.4s both' }}>
            {[
              { num: <>{fairCount ?? 14}<em style={{ fontStyle: 'italic' }}>+</em></>, label: t.hero.trustFairs },
              { num: <><span className="live-dot" style={{ display: 'inline-block', marginRight: '4px' }} />{marketCount ?? 0}</>, label: t.hero.trustMarkets },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 400, color: 'var(--dark-blue)', lineHeight: '1', letterSpacing: '-0.02em' }}>{num}</div>
                <div style={{ fontFamily: inter, fontSize: '11px', color: 'var(--tan)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
