'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export type { CatalogueBrand }

// Each section: id, total booths, type
const SECTIONS = [
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
] as const

type SecType = 'artist' | 'sponsor' | 'institution'
const SEC_META: Record<string, { max: number; type: SecType }> = Object.fromEntries(
  SECTIONS.map(s => [s.id, { max: s.max, type: s.type as SecType }])
)

function cellBg(type: SecType, hovered: boolean) {
  if (hovered) return type === 'sponsor' ? '#8B7555' : '#1F3A5F'
  if (type === 'sponsor') return '#D4C4A8'
  if (type === 'institution') return '#C8B8A0'
  return 'rgba(31,58,95,0.09)'
}
function cellBorder(type: SecType, hovered: boolean) {
  if (hovered) return type === 'sponsor' ? '#8B7555' : '#1F3A5F'
  if (type === 'sponsor') return 'rgba(139,117,85,0.4)'
  if (type === 'institution') return 'rgba(122,92,69,0.3)'
  return 'rgba(31,58,95,0.18)'
}

// Cell size
const CW = 22, CH = 15, GAP = 2
// The largest sections (G–R) have ceil(54/2)=27 booths per half → ceil(27/2)=14 rows per half
const MAX_HALF_ROWS = 14
const HALF_ZONE = MAX_HALF_ROWS * (CH + GAP) // height of each zone in px

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

  function renderCell(booth: string, type: SecType) {
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
          width: CW, height: CH, borderRadius: '2px',
          background: isEmpty ? 'rgba(0,0,0,0.025)' : cellBg(type, isHov),
          border: isEmpty ? '0.5px solid rgba(0,0,0,0.05)' : `0.5px solid ${cellBorder(type, isHov)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isEmpty ? 'default' : 'pointer',
          transform: isHov ? 'scale(1.25)' : 'scale(1)',
          transition: 'background 0.1s, transform 0.1s',
          position: 'relative', zIndex: isHov ? 3 : 1, flexShrink: 0,
        }}
      >
        {!isEmpty && (
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '5.5px', fontWeight: isHov ? 700 : 500, color: isHov ? 'white' : 'rgba(75,55,42,0.75)', userSelect: 'none', lineHeight: 1 }}>
            {booth}
          </span>
        )}
      </div>
    )
  }

  // Render a 2-col grid of booth cells
  function renderGrid(booths: string[], type: SecType) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${CW}px)`, gap: GAP }}>
        {booths.map(b => renderCell(b, type))}
      </div>
    )
  }

  // Build booth list for a section
  function boothsOf(secId: string, max: number) {
    return Array.from({ length: max }, (_, i) => `${secId}${String(i + 1).padStart(2, '0')}`)
  }

  // Render one section column (label + upper half bottom-aligned + aisle gap + lower half top-aligned)
  function SectionCol({ id, max, type, labelColor }: { id: string; max: number; type: SecType; labelColor?: string }) {
    const all = boothsOf(id, max)
    const mid = Math.ceil(all.length / 2)
    const upper = all.slice(0, mid)
    const lower = all.slice(mid)

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 700, color: labelColor ?? 'var(--tan)', marginBottom: 4, textAlign: 'center', letterSpacing: '0.04em' }}>
          {id}
        </div>
        {/* Upper half — bottom-aligned so all aisles line up */}
        <div style={{ height: HALF_ZONE, display: 'flex', alignItems: 'flex-end' }}>
          {renderGrid(upper, type)}
        </div>
        {/* Aisle */}
        <div style={{ height: 18 }} />
        {/* Lower half — top-aligned */}
        <div style={{ height: HALF_ZONE, display: 'flex', alignItems: 'flex-start' }}>
          {renderGrid(lower, type)}
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
      <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {([
          { label: 'Artist', bg: 'rgba(31,58,95,0.09)', border: 'rgba(31,58,95,0.18)' },
          { label: 'Institution', bg: '#C8B8A0', border: 'rgba(122,92,69,0.3)' },
          { label: 'Sponsor', bg: '#D4C4A8', border: 'rgba(139,117,85,0.4)' },
        ] as const).map(({ label, bg, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: bg, border: `0.5px solid ${border}` }} />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--brown)' }}>{label}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid rgba(122,92,69,0.1)', overflowX: 'auto' }}>
        <div style={{ minWidth: 'max-content', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* ── TOP ROW: CAFE label + V sponsor strip ── */}
          <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, marginBottom: 8 }}>
            {/* CAFE block */}
            <div style={{
              width: 2 * (CW + GAP) + 10,
              background: '#F0E8DC', border: '0.5px solid rgba(139,117,85,0.2)', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '7px', fontWeight: 600,
              color: '#8B7555', letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0,
            }}>
              CAFE
            </div>
            {/* V section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '7.5px', fontWeight: 600, color: '#8B7555', letterSpacing: '0.08em' }}>
                V — Sponsor / Special
              </div>
              <div style={{ display: 'flex', gap: GAP }}>
                {boothsOf('V', 54).map(b => renderCell(b, 'sponsor'))}
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(122,92,69,0.08)', marginBottom: 8 }} />

          {/* ── MAIN FLOOR ── */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>

            {/* A — narrow left column */}
            <SectionCol id="A" max={24} type="artist" />

            <div style={{ width: 10, flexShrink: 0 }} />

            {/* B–F: 40-booth sections */}
            {(['B','C','D','E','F'] as const).map(id => (
              <SectionCol key={id} id={id} max={40} type="artist" />
            ))}

            <div style={{ width: 6, flexShrink: 0 }} />

            {/* G–R: 53–54-booth sections (main floor) */}
            {(['G','H','I','J','K','L','M','N','O','P','Q','R'] as const).map(id => (
              <SectionCol key={id} id={id} max={SEC_META[id].max} type="artist" />
            ))}

            <div style={{ width: 10, flexShrink: 0 }} />

            {/* S — institutions */}
            <SectionCol id="S" max={35} type="institution" labelColor="var(--brown)" />

            <div style={{ width: 6, flexShrink: 0 }} />

            {/* T, U — right side */}
            <SectionCol id="T" max={36} type="artist" />
            <SectionCol id="U" max={35} type="artist" />
          </div>

          {/* ── GATE LABELS ── */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10, paddingTop: 8, borderTop: '0.5px solid rgba(122,92,69,0.08)' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.12em' }}>
              출입구 GATE
            </span>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.12em' }}>
              출입구 GATE
            </span>
          </div>

        </div>
      </div>

      {/* ── HOVER POPUP ── */}
      {popup && popupBrand && createPortal(
        <div
          ref={popupRef}
          onMouseLeave={() => setPopup(null)}
          style={{
            position: 'fixed',
            left: Math.min(popupPos.x - 120, window.innerWidth - 260),
            top: Math.max(popupPos.y - 10, 10),
            transform: 'translateY(-100%)',
            zIndex: 8888, width: '240px',
            background: 'white', borderRadius: '10px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
            border: '0.5px solid rgba(122,92,69,0.15)',
            padding: '12px 14px', pointerEvents: 'none',
          }}
        >
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: 4, lineHeight: 1.3 }}>
            {popupBrand.name}
          </div>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.07)', display: 'inline-block', padding: '1px 7px', borderRadius: '99px' }}>
            {popup}
          </span>
          {popupBrand.instagram && (
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: 4 }}>
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
    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--beige)', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {src && ok
        ? <img src={src} alt={brand.name} onError={() => setOk(false)} style={{ width: 26, height: 26, objectFit: 'contain' }} />
        : <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: 16, fontWeight: 300, color: 'var(--tan)' }}>{brand.name.charAt(0)}</span>}
    </div>
  )
}

function BrandCard({ brand }: { brand: CatalogueBrand }) {
  const allPosts = brand.posts?.length ? brand.posts : brand.post ? [brand.post] : []
  const shortcodes = allPosts.map(p => p.match(/\/p\/([^/?]+)/)?.[1]).filter(Boolean) as string[]
  const hasMultiple = shortcodes.length > 1
  const sec = brand.booth ? SEC_META[brand.booth[0]] : null

  return (
    <div id={`brand-${brand.id}`} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <ArtistIcon brand={brand} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 500, color: 'var(--dark-brown)', lineHeight: 1.3 }}>{brand.name}</span>
            {brand.booth && (
              <span style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: 10, fontWeight: 500,
                color: sec?.type === 'sponsor' ? '#8B7555' : sec?.type === 'institution' ? 'var(--brown)' : 'var(--dark-blue)',
                background: sec?.type === 'sponsor' ? '#D4C4A8' : sec?.type === 'institution' ? '#C8B8A0' : 'rgba(31,58,95,0.08)',
                padding: '1px 6px', borderRadius: 99,
              }}>
                {brand.booth}
              </span>
            )}
            {hasMultiple && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 10, color: 'var(--tan)', background: 'rgba(122,92,69,0.08)', padding: '1px 6px', borderRadius: 99 }}>{shortcodes.length} posts</span>}
          </div>
          {brand.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 11, fontWeight: 300, color: 'var(--tan)', marginBottom: 2 }}>{brand.korean_name}</div>}
          {brand.instagram && (
            <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 11, fontWeight: 300, color: 'var(--dark-blue)', textDecoration: 'none' }}>
              @{brand.instagram}
            </a>
          )}
        </div>
      </div>
      {shortcodes.length > 0 && (
        <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' as any, scrollbarWidth: 'none' as any }}>
          {shortcodes.map((sc, i) => (
            <iframe key={i} src={`https://www.instagram.com/p/${sc}/embed/`} loading="lazy"
              frameBorder="0" scrolling="no" allow="encrypted-media"
              style={{ display: 'block', flexShrink: 0, width: hasMultiple ? 'calc(100% - 20px)' : '100%', minWidth: hasMultiple ? 'calc(100% - 20px)' : '100%', height: 480, border: 'none', scrollSnapAlign: 'start' }} />
          ))}
        </div>
      )}
    </div>
  )
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-inter), sans-serif', fontSize: 12, fontWeight: active ? 500 : 300,
  padding: '8px 18px', borderRadius: 99, cursor: 'pointer',
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
      <div style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 11, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
          <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
          <span>Seoul Illustration Fair</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: 16 }}>
          Seoul Illustration Fair <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>V.21</em>
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 15, fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: 560, marginBottom: 8 }}>
          October 2026 · COEX, Seoul
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 300, color: 'var(--tan)', marginBottom: 32 }}>
          {totalCount} participating artists
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 500, padding: '12px 24px', borderRadius: 99, textDecoration: 'none' }}>
            Order from this fair →
          </a>
          <a href="https://www.instagram.com/seoulillusfair/" target="_blank" rel="noreferrer"
            style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 400, padding: '12px 24px', borderRadius: 99, textDecoration: 'none' }}>
            @seoulillusfair ↗︎
          </a>
        </div>
      </div>

      {/* Booth map */}
      {mounted && <BoothMap brands={brands} onSelect={scrollToArtist} />}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists or booth…"
          style={{ padding: '10px 18px', borderRadius: 99, border: '0.5px solid rgba(122,92,69,0.2)', background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', width: '100%', maxWidth: 360, boxSizing: 'border-box' as const }}
        />
      </div>

      {/* Section filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
        {sections.map(sec => (
          <button key={sec} type="button" style={tabStyle(activeSection === sec)} onClick={() => setActiveSection(sec)}>
            {sec === 'All' ? 'All' : `Section ${sec}`}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: 12, fontWeight: 300, color: 'var(--tan)', marginBottom: 20 }}>
        {filtered.length} {filtered.length === 1 ? 'artist' : 'artists'}{activeSection !== 'All' ? ` in section ${activeSection}` : ''}
      </div>

      {brands.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: 16, color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          No artists yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map(b => <BrandCard key={b.id} brand={b} />)}
        </div>
      )}

      {filtered.length === 0 && brands.length > 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-inter), sans-serif', fontSize: 14, fontWeight: 300, color: 'var(--tan)' }}>
          No artists found
        </div>
      )}
    </>
  )
}
