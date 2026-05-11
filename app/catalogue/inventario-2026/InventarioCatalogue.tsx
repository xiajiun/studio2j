'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'

export type CatalogueBrand = {
  id: number
  name: string
  korean_name: string | null
  instagram: string | null
  post: string | null
  category: string | null
  country: string | null
  booth: string | null
  url: string | null
  sort_order: number
}

function PostModal({ postUrl, name, onClose }: { postUrl: string; name: string; onClose: () => void }) {
  const shortcode = postUrl.match(/\/p\/([^/?]+)/)?.[1]
  if (!shortcode) return null
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 500, color: 'white' }}>{name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>×</button>
        </div>
        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/`}
          width="400" height="480" frameBorder="0" scrolling="no"
          style={{ borderRadius: '12px', display: 'block', width: '100%', border: 'none' }}
        />
        <a href={postUrl} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', textDecoration: 'none' }}>
          Open on Instagram ↗
        </a>
      </div>
    </div>,
    document.body
  )
}

function BrandIcon({ brand }: { brand: CatalogueBrand }) {
  const [ok, setOk] = useState(true)
  const src = brand.url ? `https://www.google.com/s2/favicons?domain=${brand.url}&sz=128` : null
  return (
    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--beige)', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {src && ok
        ? <img src={src} alt={brand.name} onError={() => setOk(false)} style={{ width: '26px', height: '26px', objectFit: 'contain' }} />
        : <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 300, color: 'var(--tan)' }}>{brand.name.charAt(0)}</span>}
    </div>
  )
}

function BrandCard({ brand, onView }: { brand: CatalogueBrand; onView: (b: CatalogueBrand) => void }) {
  const shortcode = brand.post?.match(/\/p\/([^/?]+)/)?.[1]
  const flag = brand.country === 'JP' ? '🇯🇵' : brand.country === 'INTL' ? '🌍' : '🇰🇷'

  return (
    <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <BrandIcon brand={brand} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', lineHeight: 1.3 }}>{brand.name}</span>
            <span style={{ fontSize: '11px' }}>{flag}</span>
            {brand.booth && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 6px', borderRadius: '99px' }}>{brand.booth}</span>}
          </div>
          {brand.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginBottom: '2px' }}>{brand.korean_name}</div>}
          {brand.instagram && (
            <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--dark-blue)', textDecoration: 'none' }}>
              @{brand.instagram}
            </a>
          )}
        </div>
        {brand.post && (
          <button type="button" onClick={() => onView(brand)}
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.07)', border: 'none', borderRadius: '99px', padding: '4px 12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            View ↗
          </button>
        )}
      </div>
      {/* Inline embed */}
      {shortcode && (
        <iframe
          src={`https://www.instagram.com/p/${shortcode}/embed/`}
          loading="lazy"
          frameBorder="0" scrolling="no"
          style={{ display: 'block', width: '100%', height: '480px', border: 'none' }}
          allow="encrypted-media"
        />
      )}
    </div>
  )
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: active ? 500 : 300,
  padding: '8px 18px', borderRadius: '99px', cursor: 'pointer',
  background: active ? 'var(--dark-brown)' : 'transparent',
  color: active ? 'var(--cream)' : 'var(--brown)',
  border: `0.5px solid ${active ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
})

export function InventarioCatalogue({ brands, totalCount }: { brands: CatalogueBrand[]; totalCount: number }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [modal, setModal] = useState<CatalogueBrand | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const categories = ['All', ...Array.from(new Set(brands.map(b => b.category).filter(Boolean) as string[]))]
  const filtered = activeCategory === 'All' ? brands : brands.filter(b => b.category === activeCategory)

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
          <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
          <span>INVENTARIO</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
          INVENTARIO <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2026</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
          June 10–14, 2026 · COEX THE PLATZ HALL, Seoul
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
          {totalCount} participating brands
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
            Order from this fair →
          </a>
          <a href="https://inventario.kr" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
            Official site ↗
          </a>
          <a href="https://www.instagram.com/inventario.seoul/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
            @inventario.seoul ↗
          </a>
        </div>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map(cat => (
          <button key={cat} type="button" style={tabStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      {/* Brand grid */}
      {brands.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          No brands yet — add them in the admin panel.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {filtered.map(brand => (
            <BrandCard key={brand.id} brand={brand} onView={setModal} />
          ))}
        </div>
      )}

      {/* Post modal */}
      {mounted && modal?.post && (
        <PostModal postUrl={modal.post} name={modal.name} onClose={() => setModal(null)} />
      )}
    </>
  )
}
