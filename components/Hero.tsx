'use client'

import { useLang } from '@/components/LangProvider'
import type { FairRow, TwentyMarket } from '@/lib/database.types'

function fairCatalogueUrl(fair: FairRow): string | undefined {
  if (fair.catalogue_url) return fair.catalogue_url
  const n = fair.name.toLowerCase()
  if (n.includes('inventario')) return '/catalogue/inventario-2026'
  if (n.includes('seoul illustration fair')) return '/catalogue/sif-v21'
  if (n.includes('dotdot')) return '/catalogue/dotdotexpress'
  return undefined
}

export default function Hero({ fairCount, marketCount, nextFair, markets = [] }: {
  fairCount?: number
  marketCount?: number
  nextFair?: FairRow | null
  markets?: TwentyMarket[]
}) {
  const { t } = useLang()

  return (
    <section id="top" className="hero-section" style={{ minHeight: '100vh', paddingTop: '90px', overflow: 'hidden', background: '#FEFAF0' }}>
      <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', maxWidth: '1400px', margin: '0 auto', minHeight: 'calc(100vh - 90px)' }}>
      {/* Left */}
      <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 24px 80px 60px', position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', color: 'var(--brown)', textTransform: 'uppercase', marginBottom: '36px', animation: 'fadeUp 0.8s ease both' }}>
          <span style={{ width: '32px', height: '1px', background: 'var(--brown)', display: 'inline-block' }} />
          {t.hero.eyebrow}
        </div>

        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(54px, 6.5vw, 92px)', lineHeight: '0.98', letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '32px', animation: 'fadeUp 0.8s ease 0.1s both' }}>
          {t.hero.line1}<br />{t.hero.line2}<br />
          <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{t.hero.lineEm}</em>
        </h1>

        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: '1.8', color: 'var(--brown)', maxWidth: '440px', marginBottom: '44px', animation: 'fadeUp 0.8s ease 0.2s both' }}>
          {t.hero.body}
        </p>

        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', animation: 'fadeUp 0.8s ease 0.3s both' }}>
          <a href="/markets" className="btn-primary-hero">{t.hero.cta1}</a>
          <a href="/#tracker" className="btn-secondary-hero">{t.hero.cta2}</a>
        </div>

        <div style={{ display: 'flex', gap: '48px', marginTop: '72px', animation: 'fadeUp 0.8s ease 0.4s both' }}>
          {[
            { num: <>{fairCount ?? 14}<em style={{ fontStyle: 'italic' }}>+</em></>, label: t.hero.trustFairs },
            { num: <><span className="live-dot" style={{ display: 'inline-block', marginRight: '4px' }} />{marketCount ?? 0}</>, label: t.hero.trustMarkets },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 400, color: 'var(--dark-blue)', lineHeight: '1', letterSpacing: '-0.02em' }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="hero-right" style={{ background: 'transparent', position: 'relative', overflow: 'hidden', animation: 'fadeIn 1.2s ease 0.2s both', display: 'flex', flexDirection: 'column' }}>

        {/* Market image carousel — 2 rows scrolling opposite directions */}
        {markets.length > 0 && (() => {
          const clean = markets.filter(m => !m.market_name.includes('테스트'))
          const row1: TwentyMarket[] = []
          const row2: TwentyMarket[] = []
          while (row1.length < 16) row1.push(...clean)
          while (row2.length < 16) row2.push(...[...clean].reverse())

          const img: React.CSSProperties = { width: '90px', height: '90px', objectFit: 'cover', flexShrink: 0, display: 'block' }

          return (
            <div style={{ width: '100%', flexShrink: 0, overflow: 'hidden' }}>
              {/* Row 1 — scrolls left */}
              <div style={{ overflow: 'hidden', marginBottom: '3px' }}>
                <div style={{ display: 'flex', gap: '3px', animation: 'carouselLeft 25s linear infinite', willChange: 'transform' }}>
                  {[...row1, ...row1].map((m, i) => (
                    <a key={i} href="/markets" style={{ flexShrink: 0, display: 'block' }}>
                      <img src={m.market_cover} alt="" style={img} />
                    </a>
                  ))}
                </div>
              </div>
              {/* Row 2 — scrolls right */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '3px', animation: 'carouselRight 25s linear infinite', willChange: 'transform' }}>
                  {[...row2, ...row2].map((m, i) => (
                    <a key={i} href="/markets" style={{ flexShrink: 0, display: 'block' }}>
                      <img src={m.market_cover} alt="" style={img} />
                    </a>
                  ))}
                </div>
              </div>
              <div style={{ height: '48px', background: 'linear-gradient(to bottom, transparent, #FEFAF0)', marginTop: '-48px', position: 'relative', pointerEvents: 'none' }} />
            </div>
          )
        })()}

        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(243,227,161,0.2), transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 40px 48px 24px', width: '100%', alignSelf: 'center' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '14px', color: 'var(--brown)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '24px', height: '1px', background: 'rgba(107,163,200,0.4)', display: 'inline-block' }} />
            {t.hero.stackLabel}
          </div>

          <CardWithSideImage imageUrl="https://play-lh.googleusercontent.com/b7e9gZ6r_9B2m2BEVWDf3aGzCztI5i-Ye13Sd_xoQ78yiH2nGY6nHUpcHfd7JJhLD-C9WEpjYa8TlJ3wj_uZJw=w240-h480-rw" imageFit="cover" imageBg="white">
            <HeroCard name={t.hero.card1Name} loc={t.hero.card1Loc} tags={['illustration', 'artist popup']} chipVariant="open" chipLabel={t.hero.chipActive} delay="0s" shopUrl="/markets" shopLabel="View market" noMargin />
          </CardWithSideImage>
          {nextFair ? (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', marginBottom: '10px' }}>
              {nextFair.image_url && (
                <div style={{ width: '130px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden' }}>
                  <img src={nextFair.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <HeroCard name={nextFair.name} loc={`${nextFair.kind === 'popup' ? 'Popup' : 'Fair'} haul · ${nextFair.city}`} tags={nextFair.types.slice(0, 2)} chipVariant="urgent" chipLabel={t.hero.chipGoing} delay="0.15s" shopUrl={fairCatalogueUrl(nextFair)} shopLabel={fairCatalogueUrl(nextFair) ? 'See catalogue' : undefined} noMargin />
              </div>
            </div>
          ) : (
            <HeroCard name="Next fair haul" loc="Fair haul · Upcoming" tags={['illustration', 'in person']} chipVariant="open" chipLabel={t.hero.chipWatching} delay="0.15s" />
          )}
          <CardWithSideImage imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/The_loft_corp_logo.svg/1280px-The_loft_corp_logo.svg.png" imageFit="contain" imageBg="white">
            <HeroCard name={t.hero.card2Name} loc={t.hero.card2Loc} tags={['stationery', 'stickers']} chipVariant="open" delay="0.3s" noMargin />
          </CardWithSideImage>
        </div>
      </div>
      </div>
    </section>
  )
}

function CardWithSideImage({ imageUrl, imageFit = 'cover', imageBg = 'var(--cream)', children }: {
  imageUrl: string; imageFit?: 'cover' | 'contain'; imageBg?: string; children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'stretch', marginBottom: '10px' }}>
      <div style={{ width: '130px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', background: imageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: imageFit === 'contain' ? '10px' : '0' }}>
        <img src={imageUrl} alt="" style={{ width: '100%', objectFit: imageFit, display: 'block' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

function HeroCard({ name, loc, tags, chipVariant, chipLabel, delay, shopUrl, shopExternal = false, shopLabel, noMargin }: {
  name: string; loc: string; tags: string[]; chipVariant: 'urgent' | 'open'
  chipLabel?: string; delay: string; shopUrl?: string; shopExternal?: boolean; shopLabel?: string; noMargin?: boolean
}) {
  const chipStyle = chipVariant === 'urgent'
    ? { background: '#FCE8EA', color: '#8B3A42', border: '0.5px solid rgba(239,183,190,0.5)' }
    : { background: 'rgba(107,163,200,0.12)', color: 'var(--dark-blue)', border: '0.5px solid rgba(107,163,200,0.3)' }

  return (
    <div
      className="hero-fc-card"
      style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(107,163,200,0.15)', borderRadius: '14px', padding: '20px 22px', marginBottom: noMargin ? 0 : '10px', transition: 'all 0.3s ease', animation: `slideRight 0.6s ease ${delay} both` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '5px', letterSpacing: '-0.01em' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'rgba(45,55,72,0.45)', letterSpacing: '0.02em' }}>{loc}</div>
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
            {tags.map(t => <span key={t} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.02em', background: 'rgba(107,163,200,0.1)', color: 'var(--brown)' }}>{t}</span>)}
          </div>
          {shopUrl && (
            <a
              href={shopUrl}
              {...(shopExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
              style={{ display: 'inline-block', marginTop: '12px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--dark-blue)', textDecoration: 'none', border: '0.5px solid rgba(74,138,181,0.25)', padding: '5px 12px', borderRadius: '99px', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
            >
              {shopLabel
                ? `${shopLabel} ↗︎`
                : shopExternal
                  ? shopUrl.includes('instagram') ? 'Instagram ↗︎' : 'Website ↗︎'
                  : 'Shop now ↗︎'}
            </a>
          )}
        </div>
        {chipLabel && (
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, padding: '5px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '4px', ...chipStyle }}>
            {chipVariant === 'open' && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BFDCCF', animation: 'livePulse 2s ease-in-out infinite', flexShrink: 0, display: 'inline-block' }} />}
            {chipLabel}
          </span>
        )}
      </div>
    </div>
  )
}
