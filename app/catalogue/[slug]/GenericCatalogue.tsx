'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

const CATEGORY_COLORS: Record<string, string> = {
  'Illustration':  '#E8A0BF',
  'Print & Zine':  '#7FB3D3',
  'Art Goods':     '#82C98A',
  'Stationery':    '#F5D06A',
  'Textile':       '#F0886A',
  'Craft':         '#A8D8A8',
  'Other':         '#C4A8D8',
}

const FALLBACK_COLORS = [
  '#E8A0BF', '#7FB3D3', '#82C98A', '#F5D06A',
  '#F0886A', '#A8D8A8', '#C4A8D8', '#C8A98D',
]

function catColor(category: string | null, allCats: string[]) {
  if (!category) return '#C8A98D'
  if (CATEGORY_COLORS[category]) return CATEGORY_COLORS[category]
  const idx = allCats.indexOf(category)
  return FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
}

function extractShortcode(url: string) {
  return url.match(/\/p\/([^/?#]+)/)?.[1] ?? null
}

function allPostsOf(b: CatalogueBrand): string[] {
  if (b.posts?.length) return b.posts
  if (b.post) return [b.post]
  return []
}

function PostModal({ postUrl, name, onClose }: { postUrl: string; name: string; onClose: () => void }) {
  const shortcode = extractShortcode(postUrl)
  if (!shortcode) return null
  return createPortal(
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '400px', maxWidth: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 500, color: 'white' }}>{name}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer', padding: '4px' }}>×</button>
        </div>
        <iframe src={`https://www.instagram.com/p/${shortcode}/embed/`} width="400" height="480"
          frameBorder="0" scrolling="no" allow="encrypted-media"
          style={{ borderRadius: '12px', display: 'block', width: '100%', border: 'none' }} />
        <a href={postUrl} target="_blank" rel="noreferrer"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', textDecoration: 'none' }}>
          Open on Instagram ↗︎
        </a>
      </div>
    </div>,
    document.body
  )
}

function BrandCard({ brand, allCats }: { brand: CatalogueBrand; allCats: string[] }) {
  const [modalUrl, setModalUrl] = useState<string | null>(null)
  const posts = allPostsOf(brand)
  const color = catColor(brand.category, allCats)

  const flagMap: Record<string, string> = { KR: '🇰🇷', JP: '🇯🇵', INTL: '🌍' }
  const flag = brand.country ? (flagMap[brand.country] ?? '') : ''

  const faviconSrc = brand.instagram
    ? `https://www.google.com/s2/favicons?domain=instagram.com&sz=32`
    : brand.url
      ? `https://www.google.com/s2/favicons?domain=${new URL(brand.url).hostname}&sz=32`
      : null

  return (
    <>
      {modalUrl && <PostModal postUrl={modalUrl} name={brand.name} onClose={() => setModalUrl(null)} />}
      <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.08)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '4px', background: color }} />
        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {faviconSrc && (
              <img src={faviconSrc} alt="" width={20} height={20} style={{ borderRadius: '4px', flexShrink: 0, marginTop: '2px' }} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', lineHeight: 1.3 }}>
                {flag} {brand.name}
              </div>
              {brand.korean_name && (
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '2px' }}>
                  {brand.korean_name}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
              {brand.booth && (
                <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, color: 'var(--tan)', background: 'rgba(122,92,69,0.08)', padding: '2px 6px', borderRadius: '4px' }}>
                  {brand.booth}
                </span>
              )}
              {brand.category && (
                <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'white', background: color, padding: '2px 8px', borderRadius: '99px' }}>
                  {brand.category}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {brand.instagram && (
              <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(31,58,95,0.06)', padding: '3px 10px', borderRadius: '99px' }}>
                Instagram ↗︎
              </a>
            )}
            {brand.url && (
              <a href={brand.url} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(31,58,95,0.06)', padding: '3px 10px', borderRadius: '99px' }}>
                Website ↗︎
              </a>
            )}
          </div>

          {posts.length > 0 && (
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '10px', flex: 1 }}>
              {posts.length > 1 && (
                <span style={{ position: 'absolute', top: '6px', right: '6px', zIndex: 2, background: 'rgba(0,0,0,0.55)', color: 'white', fontSize: '10px', fontFamily: 'var(--font-inter), sans-serif', fontWeight: 500, padding: '2px 7px', borderRadius: '99px', pointerEvents: 'none' }}>
                  {posts.length} posts
                </span>
              )}
              <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', gap: '8px', paddingBottom: '4px', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
                {posts.map((url, i) => {
                  const sc = extractShortcode(url)
                  if (!sc) return null
                  return (
                    <div key={i} onClick={() => setModalUrl(url)} style={{ flexShrink: 0, width: posts.length > 1 ? 'calc(100% - 20px)' : '100%', scrollSnapAlign: 'start', cursor: 'pointer', borderRadius: '8px', overflow: 'hidden' }}>
                      <iframe
                        src={`https://www.instagram.com/p/${sc}/embed/`}
                        width="100%" height="360"
                        frameBorder="0" scrolling="no" allow="encrypted-media"
                        loading="lazy"
                        style={{ display: 'block', border: 'none', pointerEvents: 'none' }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export function GenericCatalogue({
  brands,
  totalCount,
  fairName,
  subtitle,
}: {
  brands: CatalogueBrand[]
  totalCount: number
  fairName: string
  subtitle?: string
}) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const allCats = Array.from(new Set(brands.map(b => b.category).filter(Boolean))) as string[]

  const filtered = brands.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || (b.korean_name?.toLowerCase().includes(q) ?? false)
    const matchCat = !activeCategory || b.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        {subtitle && (
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>
            {subtitle}
          </div>
        )}
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '48px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          {fairName}
        </h1>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          {totalCount} brands
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search brands…"
          style={{ padding: '10px 16px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', minWidth: '200px' }}
        />
        {allCats.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            style={{ padding: '8px 16px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.15)', background: activeCategory === cat ? 'var(--dark-brown)' : 'white', color: activeCategory === cat ? 'var(--cream)' : 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, cursor: 'pointer' }}>
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filtered.map(b => <BrandCard key={b.id} brand={b} allCats={allCats} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          No brands found
        </div>
      )}
    </div>
  )
}
