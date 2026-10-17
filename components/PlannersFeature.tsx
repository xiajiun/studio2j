'use client'

import { useState } from 'react'
import { useLang } from '@/components/LangProvider'
import type { Planner2027 } from '@/lib/planners-2027/types'

export type PlannerTeaser = Pick<Planner2027, 'id' | 'brand' | 'name' | 'country' | 'image' | 'url' | 'price' | 'dated'>

function Photo({ p }: { p: PlannerTeaser }) {
  const [ok, setOk] = useState(true)
  return ok ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.image} alt={`${p.brand} ${p.name}`} loading="lazy" referrerPolicy="no-referrer" onError={() => setOk(false)} className="p27-img"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
  ) : (
    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '40px', color: 'var(--tan)' }}>{p.brand.charAt(0)}</span>
  )
}

// Homepage teaser for /catalogue/planners-2027 — picks passed in from the server page
export default function PlannersFeature({ picks }: { picks: PlannerTeaser[] }) {
  const { lang, t } = useLang()
  const s = t.plannerFeature
  const p27 = t.planners

  // Japanese copy is Korea-only (CLAUDE.md rule 10)
  const shown = picks.filter(p => lang !== 'ja' || p.country === 'KR').slice(0, 4)
  if (shown.length === 0) return null

  return (
    <section className="pfeature-section" style={{ background: 'var(--cream)', padding: '104px 0 40px' }}>
      <div className="container">
        <div className="pfeature-head" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'end', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
              {s.eyebrow}
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontStyle: 'normal', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#F3E3A1', color: '#7A6010', padding: '3px 9px', borderRadius: '99px' }}>{s.badge}</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(38px, 4.2vw, 58px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              {s.title1} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.titleEm}</em>
            </h2>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(45,55,72,0.75)', maxWidth: '560px' }}>
              {s.body}
            </p>
          </div>
          <a href="/catalogue/planners-2027" className="btn-primary-hero" style={{ whiteSpace: 'nowrap' }}>{s.cta}</a>
        </div>

        <div className="pfeature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {shown.map(p => (
            <a key={p.id} href="/catalogue/planners-2027" className="p27-card" style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(107,163,200,0.2)', textDecoration: 'none', display: 'block' }}>
              <div style={{ position: 'relative', aspectRatio: '4 / 5', background: 'var(--beige)', overflow: 'hidden' }}>
                <Photo p={p} />
              </div>
              <div style={{ padding: '14px 16px 16px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>
                  {p.country === 'JP' ? '🇯🇵' : '🇰🇷'} {p.brand}
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 400, lineHeight: 1.25, color: 'var(--dark-brown)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                {p.price && (
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-blue)', marginTop: '8px' }}>
                    {p27.priceFrom.replace('{p}', `${p.price.currency === 'JPY' ? '¥' : '₩'}${p.price.amount.toLocaleString('en-US')}`)}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}
