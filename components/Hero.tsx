'use client'

import { useLang } from '@/components/LangProvider'
import type { FairRow, TwentyMarket } from '@/lib/database.types'

export default function Hero({ fairCount, countryCount, nextFair, markets = [] }: {
  fairCount?: number
  countryCount?: number
  nextFair?: FairRow | null
  markets?: TwentyMarket[]
}) {
  const { t } = useLang()

  return (
    <section id="top" className="hero-section" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.1fr 1fr', paddingTop: '90px', overflow: 'hidden' }}>
      {/* Left */}
      <div className="hero-left" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px 80px 80px', position: 'relative' }}>
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
          <a href="/order/new" className="btn-primary-hero">{t.hero.cta1}</a>
          <a href="#tracker" className="btn-secondary-hero">{t.hero.cta2}</a>
        </div>

        <div style={{ display: 'flex', gap: '48px', marginTop: '72px', animation: 'fadeUp 0.8s ease 0.4s both' }}>
          {[
            { num: <>{fairCount ?? 14}<em style={{ fontStyle: 'italic' }}>+</em></>, label: t.hero.trustFairs },
            { num: String(countryCount ?? 10), label: t.hero.trustCountries },
            { num: '2', label: t.hero.trustFounders },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 400, color: 'var(--dark-blue)', lineHeight: '1', letterSpacing: '-0.02em' }}>{num}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '6px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="hero-right" style={{ background: 'var(--dark-blue)', position: 'relative', overflow: 'hidden', animation: 'fadeIn 1.2s ease 0.2s both', display: 'flex', flexDirection: 'column' }}>

        {/* Market image strip — 2 rows */}
        {markets.length > 0 && (() => {
          const clean = markets.filter(m => !m.marketTitle.includes('테스트'))
          // Repeat to fill 2 rows of 6 = 12 cells minimum
          const imgs: TwentyMarket[] = []
          while (imgs.length < 12) imgs.push(...clean)
          return (
            <div style={{ width: '100%', flexShrink: 0 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px' }}>
                {imgs.slice(0, 12).map((m, i) => (
                  <img
                    key={i}
                    src={`https://cdn.twenty.style/${m.marketCover}`}
                    alt={m.marketTitle}
                    style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }}
                  />
                ))}
              </div>
              {/* Fade to dark blue */}
              <div style={{ height: '40px', background: 'linear-gradient(to bottom, transparent, var(--dark-blue))', marginTop: '-40px', position: 'relative' }} />
            </div>
          )
        })()}

        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 40%, rgba(200,169,141,0.08), transparent 50%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, padding: '32px 48px 48px', width: '100%', maxWidth: '440px', alignSelf: 'center' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '14px', color: 'var(--tan)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '24px', height: '1px', background: 'var(--tan)', display: 'inline-block' }} />
            {t.hero.stackLabel}
          </div>

          <HeroCard name={t.hero.card1Name} loc={t.hero.card1Loc} tags={['illustration', 'artist popup']} chipVariant="open" chipLabel={t.hero.chipActive} delay="0s" shopUrl="/markets" />
          <HeroCard name={t.hero.card2Name} loc={t.hero.card2Loc} tags={['stationery', 'stickers']} chipVariant="open" chipLabel={t.hero.chipActive} delay="0.15s" />
          {nextFair ? (
            <HeroCard name={nextFair.name} loc={`Fair haul · ${nextFair.city}`} tags={nextFair.types.slice(0, 2)} chipVariant="urgent" chipLabel={t.hero.chipGoing} delay="0.3s" shopUrl={nextFair.url ?? undefined} shopExternal />
          ) : (
            <HeroCard name="Next fair haul" loc="Fair haul · Upcoming" tags={['illustration', 'in person']} chipVariant="open" chipLabel={t.hero.chipWatching} delay="0.3s" />
          )}
        </div>
      </div>
    </section>
  )
}

function HeroCard({ name, loc, tags, chipVariant, chipLabel, delay, shopUrl, shopExternal = false }: {
  name: string; loc: string; tags: string[]; chipVariant: 'urgent' | 'open'
  chipLabel: string; delay: string; shopUrl?: string; shopExternal?: boolean
}) {
  const chipStyle = chipVariant === 'urgent'
    ? { background: 'rgba(200,169,141,0.18)', color: '#E6C9AE', border: '0.5px solid rgba(200,169,141,0.3)' }
    : { background: 'rgba(74,106,138,0.18)', color: '#9FB7D4', border: '0.5px solid rgba(74,106,138,0.3)' }

  return (
    <div
      className="hero-fc-card"
      style={{ background: 'rgba(245,239,230,0.04)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(245,239,230,0.12)', borderRadius: '14px', padding: '20px 22px', marginBottom: '10px', transition: 'all 0.3s ease', animation: `slideRight 0.6s ease ${delay} both` }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 400, color: 'var(--cream)', marginBottom: '5px', letterSpacing: '-0.01em' }}>{name}</div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'rgba(245,239,230,0.5)', letterSpacing: '0.02em' }}>{loc}</div>
          <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
            {tags.map(t => <span key={t} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, padding: '3px 9px', borderRadius: '99px', letterSpacing: '0.02em', background: 'rgba(245,239,230,0.08)', color: 'rgba(245,239,230,0.7)' }}>{t}</span>)}
          </div>
          {shopUrl && (
            <a
              href={shopUrl}
              {...(shopExternal ? { target: '_blank', rel: 'noreferrer' } : {})}
              style={{ display: 'inline-block', marginTop: '12px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: '#C8A98D', textDecoration: 'none', border: '0.5px solid rgba(200,169,141,0.35)', padding: '5px 12px', borderRadius: '99px', letterSpacing: '0.02em' }}
            >
              {shopExternal
                ? shopUrl.includes('instagram') ? 'Instagram ↗' : 'Website ↗'
                : 'Shop now ↗'}
            </a>
          )}
        </div>
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, padding: '5px 10px', borderRadius: '6px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '12px', letterSpacing: '0.02em', ...chipStyle }}>{chipLabel}</span>
      </div>
    </div>
  )
}
