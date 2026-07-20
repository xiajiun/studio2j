'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export type { CatalogueBrand }

const SECTIONS: { id: string; max: number; type: 'artist' | 'sponsor' | 'institution' }[] = [
  { id: 'A', max: 24, type: 'artist' },
  { id: 'B', max: 40, type: 'artist' },
  { id: 'C', max: 40, type: 'artist' },
  { id: 'D', max: 40, type: 'artist' },
  { id: 'E', max: 40, type: 'artist' },
  { id: 'F', max: 40, type: 'artist' },
  { id: 'G', max: 53, type: 'artist' },
  { id: 'H', max: 54, type: 'artist' },
  { id: 'I', max: 54, type: 'artist' },
  { id: 'J', max: 54, type: 'artist' },
  { id: 'K', max: 54, type: 'artist' },
  { id: 'L', max: 54, type: 'artist' },
  { id: 'M', max: 54, type: 'artist' },
  { id: 'N', max: 54, type: 'artist' },
  { id: 'O', max: 53, type: 'artist' },
  { id: 'P', max: 54, type: 'artist' },
  { id: 'Q', max: 54, type: 'artist' },
  { id: 'R', max: 54, type: 'artist' },
  { id: 'S', max: 35, type: 'institution' },
  { id: 'T', max: 36, type: 'artist' },
  { id: 'U', max: 35, type: 'artist' },
  { id: 'V', max: 54, type: 'sponsor' },
]

const SEC_META: Record<string, typeof SECTIONS[0]> = Object.fromEntries(SECTIONS.map(s => [s.id, s]))

function secBg(type: string, hovered = false) {
  if (hovered) return '#1F3A5F'
  if (type === 'sponsor') return '#D4C4A8'
  if (type === 'institution') return '#C8B8A0'
  return 'rgba(31,58,95,0.09)'
}
function secBorder(type: string, hovered = false) {
  if (hovered) return '#1F3A5F'
  if (type === 'sponsor') return 'rgba(139,117,85,0.4)'
  if (type === 'institution') return 'rgba(122,92,69,0.3)'
  return 'rgba(31,58,95,0.18)'
}

function BoothMap({ brands, onSelect }: { brands: CatalogueBrand[]; onSelect: (b: CatalogueBrand) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [popup, setPopup] = useState<string | null>(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const byBooth: Record<string, CatalogueBrand> = {}
  brands.forEach(b => { if (b.booth) byBooth[b.booth] = b })

  function startHover(booth: string, el: HTMLElement) {
    setHovered(booth)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const r = el.getBoundingClientRect()
      setPopup(booth)
      setPopupPos({ x: r.left + r.width / 2, y: r.top })
    }, 250)
  }
  function endHover() {
    setHovered(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    setTimeout(() => { if (!popupRef.current?.matches(':hover')) setPopup(null) }, 100)
  }

  const CW = 28, CH = 19, GAP = 2, COLS = 2

  function renderSection(sec: typeof SECTIONS[0]) {
    const { type } = sec
    const booths: string[] = []
    for (let i = 1; i <= sec.max; i++) booths.push(`${sec.id}${String(i).padStart(2, '0')}`)
    const rows = Math.ceil(booths.length / COLS)

    return (
      <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--tan)', textAlign: 'center' }}>
          {sec.id}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CW}px)`,
          gridTemplateRows: `repeat(${rows}, ${CH}px)`,
          gap: `${GAP}px`,
        }}>
          {booths.map(booth => {
            const brand = byBooth[booth]
            const isEmpty = !brand
            const isHov = hovered === booth
            return (
              <div
                key={booth}
                onMouseEnter={e => { if (!isEmpty) startHover(booth, e.currentTarget) }}
                onMouseLeave={endHover}
                onClick={() => { if (brand) onSelect(brand) }}
                style={{
                  width: CW, height: CH, borderRadius: '3px',
                  background: isEmpty ? 'transparent' : secBg(type, isHov),
                  border: isEmpty ? 'none' : `0.5px solid ${secBorder(type, isHov)}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isEmpty ? 'default' : 'pointer',
                  transform: isHov ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.1s',
                  zIndex: isHov ? 2 : 1,
                  position: 'relative',
                }}
              >
                {!isEmpty && (
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '6.5px', fontWeight: isHov ? 700 : 500, color: isHov ? 'white' : 'rgba(75,55,42,0.7)', userSelect: 'none', lineHeight: 1 }}>
                    {booth}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const popupBrand = popup ? byBooth[popup] : null

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
        Booth map — hover to preview · click to scroll to artist
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { label: 'Artist', bg: 'rgba(31,58,95,0.09)', border: 'rgba(31,58,95,0.18)' },
          { label: 'Institution', bg: '#C8B8A0', border: 'rgba(122,92,69,0.3)' },
          { label: 'Sponsor', bg: '#D4C4A8', border: 'rgba(139,117,85,0.4)' },
        ].map(({ label, bg, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: bg, border: `0.5px solid ${border}` }} />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--brown)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid rgba(122,92,69,0.1)', overflowX: 'auto' }}>
        {/* V sponsor strip */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>
            V — Sponsor / Special
          </div>
          <div style={{ display: 'flex', gap: `${GAP}px` }}>
            {Array.from({ length: 54 }, (_, i) => {
              const booth = `V${String(i + 1).padStart(2, '0')}`
              const brand = byBooth[booth]
              const isEmpty = !brand
              const isHov = hovered === booth
              return (
                <div
                  key={booth}
                  onMouseEnter={e => { if (!isEmpty) startHover(booth, e.currentTarget) }}
                  onMouseLeave={endHover}
                  onClick={() => { if (brand) onSelect(brand) }}
                  style={{
                    width: CW, height: CH, borderRadius: '3px',
                    background: isEmpty ? 'transparent' : isHov ? '#8B7555' : '#D4C4A8',
                    border: isEmpty ? 'none' : `0.5px solid ${isHov ? '#8B7555' : 'rgba(139,117,85,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isEmpty ? 'default' : 'pointer',
                    transform: isHov ? 'scale(1.15)' : 'scale(1)',
                    transition: 'all 0.1s',
                    zIndex: isHov ? 2 : 1,
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  {!isEmpty && (
                    <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '6.5px', fontWeight: isHov ? 700 : 500, color: isHov ? 'white' : 'rgba(75,55,42,0.7)', userSelect: 'none', lineHeight: 1 }}>
                      {booth}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(122,92,69,0.1)', margin: '4px 0 16px' }} />

        {/* Main sections A–U */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', minWidth: 'max-content' }}>
          {SECTIONS.filter(s => s.id !== 'V').map(sec => renderSection(sec))}
        </div>
      </div>

      {/* Hover popup */}
      {popup && popupBrand && createPortal(
        <div
          ref={popupRef}
          onMouseLeave={() => setPopup(null)}
          style={{
            position: 'fixed',
            left: Math.min(popupPos.x - 120, window.innerWidth - 260),
            top: Math.max(popupPos.y - 10, 10),
            transform: 'translateY(-100%)',
            zIndex: 8888,
            width: '240px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            border: '0.5px solid rgba(122,92,69,0.15)',
            padding: '12px 14px',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '4px', lineHeight: 1.3 }}>
            {popupBrand.name}
          </div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.07)', display: 'inline-block', padding: '1px 7px', borderRadius: '99px' }}>
            {popup}
          </div>
          {popupBrand.instagram && (
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '4px' }}>
              @{popupBrand.instagram}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

function ArtistIcon({ brand }: { brand: CatalogueBrand }) {
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

function BrandCard({ brand }: { brand: CatalogueBrand }) {
  const allPosts = brand.posts?.length ? brand.posts : brand.post ? [brand.post] : []
  const shortcodes = allPosts.map(p => p.match(/\/p\/([^/?]+)/)?.[1]).filter(Boolean) as string[]
  const hasMultiple = shortcodes.length > 1
  const sec = brand.booth ? SEC_META[brand.booth[0]] : null

  return (
    <div id={`brand-${brand.id}`} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <ArtistIcon brand={brand} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', lineHeight: 1.3 }}>{brand.name}</span>
            {brand.booth && (
              <span style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
                color: sec?.type === 'sponsor' ? '#8B7555' : sec?.type === 'institution' ? 'var(--brown)' : 'var(--dark-blue)',
                background: sec?.type === 'sponsor' ? '#D4C4A8' : sec?.type === 'institution' ? '#C8B8A0' : 'rgba(31,58,95,0.08)',
                padding: '1px 6px', borderRadius: '99px',
              }}>
                {brand.booth}
              </span>
            )}
            {hasMultiple && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', color: 'var(--tan)', background: 'rgba(122,92,69,0.08)', padding: '1px 6px', borderRadius: '99px' }}>{shortcodes.length} posts</span>}
          </div>
          {brand.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginBottom: '2px' }}>{brand.korean_name}</div>}
          {brand.instagram && (
            <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--dark-blue)', textDecoration: 'none' }}>
              @{brand.instagram}
            </a>
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

export function SIFCatalogue({ brands, totalCount }: { brands: CatalogueBrand[]; totalCount: number }) {
  const [activeSection, setActiveSection] = useState('All')
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const sections = ['All', ...SECTIONS.map(s => s.id).filter(id => brands.some(b => b.booth?.[0] === id))]

  const filtered = brands.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || (b.booth?.toLowerCase().includes(q) ?? false) || (b.instagram?.toLowerCase().includes(q) ?? false)
    const matchSection = activeSection === 'All' || b.booth?.[0] === activeSection
    return matchSearch && matchSection
  })

  function scrollToArtist(brand: CatalogueBrand) {
    setActiveSection('All')
    setTimeout(() => {
      document.getElementById(`brand-${brand.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
          <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
          <span>Seoul Illustration Fair</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
          Seoul Illustration Fair <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>V.21</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
          October 2026 · COEX, Seoul
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
          {totalCount} participating artists
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
            Order from this fair →
          </a>
          <a href="https://www.instagram.com/seoulillusfair/" target="_blank" rel="noreferrer"
            style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
            @seoulillusfair ↗︎
          </a>
        </div>
      </div>

      {/* Booth map */}
      {mounted && <BoothMap brands={brands} onSelect={scrollToArtist} />}

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists or booth…"
          style={{ padding: '10px 18px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', width: '100%', maxWidth: '360px', boxSizing: 'border-box' }}
        />
      </div>

      {/* Section filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {sections.map(sec => (
          <button key={sec} type="button" style={tabStyle(activeSection === sec)} onClick={() => setActiveSection(sec)}>
            {sec === 'All' ? 'All' : `Section ${sec}`}
          </button>
        ))}
      </div>

      {/* Count */}
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '20px' }}>
        {filtered.length} {filtered.length === 1 ? 'artist' : 'artists'}
        {activeSection !== 'All' ? ` in section ${activeSection}` : ''}
      </div>

      {/* Grid */}
      {brands.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          No artists yet — add them in the admin panel.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {filtered.map(b => <BrandCard key={b.id} brand={b} />)}
        </div>
      )}

      {filtered.length === 0 && brands.length > 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          No artists found
        </div>
      )}
    </>
  )
}
