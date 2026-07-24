'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

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

function BrandCard({ brand, onView, saved, onToggleSave }: {
  brand: CatalogueBrand
  onView: (b: CatalogueBrand) => void
  saved: boolean
  onToggleSave: (b: CatalogueBrand) => void
}) {
  const allPosts = brand.posts?.length ? brand.posts : brand.post ? [brand.post] : []
  const shortcodes = allPosts.map(p => p.match(/\/p\/([^/?]+)/)?.[1]).filter(Boolean) as string[]
  const hasMultiple = shortcodes.length > 1
  const flag = brand.country === 'JP' ? '🇯🇵' : brand.country === 'INTL' ? '🌍' : '🇰🇷'

  return (
    <div id={`brand-${brand.id}`} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <BrandIcon brand={brand} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', lineHeight: 1.3 }}>{brand.name}</span>
            <span style={{ fontSize: '11px' }}>{flag}</span>
            {brand.booth && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 6px', borderRadius: '99px' }}>{brand.booth}</span>}
            {hasMultiple && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--tan)', background: 'rgba(122,92,69,0.08)', padding: '1px 6px', borderRadius: '99px' }}>{shortcodes.length} posts</span>}
          </div>
          {brand.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginBottom: '2px' }}>{brand.korean_name}</div>}
          {brand.instagram && (
            <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--dark-blue)', textDecoration: 'none' }}>
              @{brand.instagram}
            </a>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => onToggleSave(brand)}
            title={saved ? '찜 취소' : '찜하기'}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '2px', color: saved ? '#E85C6A' : 'rgba(122,92,69,0.25)', transition: 'color 0.15s, transform 0.15s', transform: saved ? 'scale(1.15)' : 'scale(1)' }}
          >
            {saved ? '♥' : '♡'}
          </button>
          {shortcodes.length > 0 && (
            <button type="button" onClick={() => onView(brand)}
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.07)', border: 'none', borderRadius: '99px', padding: '4px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              View ↗︎
            </button>
          )}
        </div>
      </div>
      {shortcodes.length > 0 && (
        <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' as any, scrollbarWidth: 'none' as any }}>
          {shortcodes.map((sc, i) => (
            <iframe key={i}
              src={`https://www.instagram.com/p/${sc}/embed/`} loading="lazy"
              frameBorder="0" scrolling="no" allow="encrypted-media"
              style={{ display: 'block', flexShrink: 0, width: hasMultiple ? 'calc(100% - 20px)' : '100%', minWidth: hasMultiple ? 'calc(100% - 20px)' : '100%', height: '480px', border: 'none', scrollSnapAlign: 'start' }} />
          ))}
        </div>
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

const heartTabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: active ? 500 : 300,
  padding: '8px 18px', borderRadius: '99px', cursor: 'pointer',
  background: active ? '#E85C6A' : 'transparent',
  color: active ? 'white' : '#E85C6A',
  border: `0.5px solid ${active ? '#E85C6A' : 'rgba(232,92,106,0.35)'}`,
})

function useSaved(catalogueId: string) {
  const key = `s2j-saved-${catalogueId}`
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) setSavedIds(new Set(JSON.parse(raw)))
    } catch {}
  }, [key])

  function toggle(brand: CatalogueBrand) {
    setSavedIds(prev => {
      const next = new Set(prev)
      if (next.has(brand.id)) {
        next.delete(brand.id)
      } else {
        next.add(brand.id)
        // fire-and-forget increment
        fetch('/api/save-brand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ brand_id: brand.id }),
        }).catch(() => {})
      }
      try { localStorage.setItem(key, JSON.stringify([...next])) } catch {}
      return next
    })
  }

  return { savedIds, toggle }
}

export function GenericCatalogue({
  brands,
  totalCount,
  fairName,
  subtitle,
  catalogueId,
}: {
  brands: CatalogueBrand[]
  totalCount: number
  fairName: string
  subtitle?: string
  catalogueId: string
}) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [showSaved, setShowSaved] = useState(false)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<CatalogueBrand | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { savedIds, toggle } = useSaved(catalogueId)

  const categories = ['All', ...Array.from(new Set(brands.map(b => b.category).filter(Boolean) as string[]))]

  const filtered = brands.filter(b => {
    if (showSaved && !savedIds.has(b.id)) return false
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || (b.korean_name?.toLowerCase().includes(q) ?? false) || (b.booth?.toLowerCase().includes(q) ?? false)
    const matchCat = activeCategory === 'All' || b.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
          {fairName}
        </h1>
        {subtitle && (
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
            {subtitle}
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
          {totalCount} participating brands
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>Order from this fair →</a>
        </div>
      </div>

      {/* Search + filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search brands…"
          style={{ padding: '8px 18px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'transparent', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', minWidth: '180px' }}
        />
        {categories.length > 1 && categories.map(cat => (
          <button key={cat} type="button" style={tabStyle(activeCategory === cat && !showSaved)} onClick={() => { setActiveCategory(cat); setShowSaved(false) }}>{cat}</button>
        ))}
        {mounted && savedIds.size > 0 && (
          <button type="button" style={heartTabStyle(showSaved)} onClick={() => setShowSaved(v => !v)}>
            ♥ 찜 {savedIds.size}
          </button>
        )}
      </div>

      {/* Brand grid */}
      {brands.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          No brands yet — add them in the admin panel.
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          {showSaved ? 'No saved brands yet — tap ♡ on any brand.' : 'No brands found'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {filtered.map(brand => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onView={setModal}
              saved={mounted && savedIds.has(brand.id)}
              onToggleSave={toggle}
            />
          ))}
        </div>
      )}

      {mounted && modal && (modal.posts?.[0] ?? modal.post) && (
        <PostModal postUrl={(modal.posts?.[0] ?? modal.post)!} name={modal.name} onClose={() => setModal(null)} />
      )}
    </>
  )
}
