'use client'

export const runtime = 'edge'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import { useLang } from '@/components/LangProvider'
import { BRANDS, CATEGORY_LABELS, type BrandRegion, type BrandCategory } from '@/lib/brands'

const REGIONS: { value: BrandRegion | 'all'; label: string }[] = [
  { value: 'all',    label: 'All brands' },
  { value: 'Korea',  label: '🇰🇷 Korea' },
  { value: 'Japan',  label: '🇯🇵 Japan' },
]

const TAG_COLORS: Record<BrandCategory, { bg: string; color: string }> = {
  stationery:    { bg: 'var(--beige)',  color: 'var(--brown)' },
  illustration:  { bg: '#EEF3F8',      color: '#1F3A5F' },
  planner:       { bg: '#F0EBE3',      color: '#7A5C45' },
  lifestyle:     { bg: '#F5F0E8',      color: '#4B372A' },
  'art supplies':{ bg: '#ECF0EA',      color: '#3A5C2A' },
}

export default function BrandsPage() {
  const [region, setRegion]     = useState<BrandRegion | 'all'>('all')
  const [search, setSearch]     = useState('')
  const { lang, t } = useLang()
  const b = t.brands

  const regions: { value: BrandRegion | 'all'; label: string }[] = [
    { value: 'all',   label: b.filterAll },
    { value: 'Korea', label: b.filterKorea },
    ...(lang !== 'ja' ? [{ value: 'Japan' as BrandRegion, label: b.filterJapan }] : []),
  ]

  const q = search.toLowerCase()
  const filtered = BRANDS.filter(br => {
    if (lang === 'ja' && br.region === 'Japan') return false
    if (region !== 'all' && br.region !== region) return false
    if (q && !br.name.toLowerCase().includes(q) && !br.description.toLowerCase().includes(q)) return false
    return true
  })

  const featured = filtered.filter(br => br.featured)
  const rest     = filtered.filter(br => !br.featured)

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <Nav />

      {/* Header */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '120px 48px 56px' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          {b.eyebrow}
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--dark-brown)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '20px' }}>
          {b.title1}<br /><em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{b.titleEm}</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '48px' }}>
          {b.subtitle}
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {regions.map(r => (
            <button key={r.value} onClick={() => setRegion(r.value)} style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px',
              fontWeight: region === r.value ? 500 : 300,
              padding: '9px 20px', borderRadius: '99px', cursor: 'pointer',
              background: region === r.value ? 'var(--dark-brown)' : 'transparent',
              color: region === r.value ? 'var(--cream)' : 'var(--brown)',
              border: `0.5px solid ${region === r.value ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
              transition: 'all 0.15s',
            }}>{r.label}</button>
          ))}
          <input
            type="text"
            placeholder={b.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '9px 18px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)',
              background: 'white', color: 'var(--dark-brown)',
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
              outline: 'none', minWidth: '180px',
            }}
          />
        </div>
      </div>

      {/* Brand grid */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 48px 100px' }}>

        {/* Featured */}
        {featured.length > 0 && (
          <div style={{ marginBottom: '56px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px' }}>
              {b.staffPicks}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {featured.map(b => <BrandCard key={b.name} brand={b} featured />)}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            {featured.length > 0 && (
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px' }}>
                All brands
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {rest.map(b => <BrandCard key={b.name} brand={b} />)}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
            No brands match your search.
          </div>
        )}

        {/* Bottom CTA */}
        <div style={{ marginTop: '72px', background: 'var(--dark-blue)', borderRadius: '20px', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '28px', color: 'var(--cream)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {b.ctaTitle} <em style={{ fontStyle: 'italic', color: 'var(--tan)' }}>{b.ctaEm}</em>
            </div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'rgba(245,239,230,0.6)', lineHeight: 1.7 }}>
              {b.ctaBody}
            </p>
          </div>
          <Link href="/order/new" style={{ background: 'var(--tan)', color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '15px 32px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
            {b.ctaBtn}
          </Link>
        </div>
      </div>
    </main>
  )
}

function BrandLogo({ brand: b }: { brand: typeof BRANDS[0] }) {
  const [ok, setOk] = useState(true)
  const src = b.image ?? `https://www.google.com/s2/favicons?domain=${b.url}&sz=128`
  const initial = b.name.charAt(0).toUpperCase()

  return (
    <div style={{ width: '56px', height: '56px', borderRadius: '12px', overflow: 'hidden', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '0.5px solid rgba(122,92,69,0.1)' }}>
      {ok ? (
        <img src={src} alt={b.name} onError={() => setOk(false)} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 400, color: 'var(--brown)' }}>{initial}</span>
      )}
    </div>
  )
}

function BrandCard({ brand: b, featured }: { brand: typeof BRANDS[0]; featured?: boolean }) {
  const flag = b.region === 'Korea' ? '🇰🇷' : '🇯🇵'

  return (
    <div style={{
      background: 'white',
      borderRadius: '18px',
      padding: '28px',
      border: featured ? '0.5px solid rgba(31,58,95,0.18)' : '0.5px solid rgba(122,92,69,0.12)',
      boxShadow: featured ? '0 4px 20px rgba(31,58,95,0.06)' : 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <BrandLogo brand={b} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em', marginBottom: '2px' }}>
            {b.name}
          </div>
          <a href={`https://${b.url}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', letterSpacing: '0.02em' }}>
            {b.url} ↗
          </a>
        </div>
        <span style={{ fontSize: '20px', flexShrink: 0 }}>{flag}</span>
      </div>

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7, flex: 1 }}>
        {b.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {b.categories.map(cat => {
          const c = TAG_COLORS[cat]
          return (
            <span key={cat} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, padding: '3px 10px', borderRadius: '99px', background: c.bg, color: c.color, letterSpacing: '0.03em' }}>
              {CATEGORY_LABELS[cat]}
            </span>
          )
        })}
      </div>

    </div>
  )
}
