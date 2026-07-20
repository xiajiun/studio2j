'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export type { CatalogueBrand }

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

// ── Layout constants ──────────────────────────────────────────────
const CW = 26   // main cell width
const CH = 20   // main cell height
const GAP = 2   // gap between cells
// G–R sections: 54 booths → 27 per half → ceil(27/2) = 14 rows per half
const MAX_HALF = 14
// Height of one zone (upper or lower) = 14 rows × (CH+GAP), accounting for no trailing gap
const HALF_H = MAX_HALF * (CH + GAP)  // 308px
const AISLE = 36  // central corridor height

// V section uses narrower cells so the row width ≈ G–U section width
const VCW = 15  // V cell width  (54 × 17 ≈ 916px ≈ G–U span of ~905px)

// ── Cell colours ─────────────────────────────────────────────────
function cellBg(type: SecType, hovered: boolean): string {
  if (hovered) return type === 'artist' ? '#2B5F8E' : '#8B7555'
  if (type === 'artist')      return '#C8DFF0'
  if (type === 'institution') return '#EAD5B0'
  return '#E8D0A8'  // sponsor
}
function cellBorder(type: SecType, hovered: boolean): string {
  if (hovered) return type === 'artist' ? '#1F3A5F' : '#6B5535'
  if (type === 'artist')      return '#7EB5D6'
  return '#C4A870'
}

// ── BoothMap ──────────────────────────────────────────────────────
function BoothMap({ brands, onSelect }: { brands: CatalogueBrand[]; onSelect: (b: CatalogueBrand) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [popup,   setPopup]   = useState<string | null>(null)
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

  function renderCell(booth: string, type: SecType, vCell = false) {
    const brand = byBooth[booth]
    const isEmpty = !brand
    const isHov = hovered === booth
    const w = vCell ? VCW : CW
    return (
      <div
        key={booth}
        onMouseEnter={e => { if (!isEmpty) startHover(booth, e.currentTarget) }}
        onMouseLeave={endHover}
        onClick={() => { if (brand) onSelect(brand) }}
        title={brand ? `${booth} — ${brand.name}` : booth}
        style={{
          width: w, height: CH,
          background: isEmpty ? 'rgba(0,0,0,0.04)' : cellBg(type, isHov),
          border: `1px solid ${isEmpty ? 'rgba(0,0,0,0.08)' : cellBorder(type, isHov)}`,
          borderRadius: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isEmpty ? 'default' : 'pointer',
          transform: isHov ? 'scale(1.35)' : 'scale(1)',
          transition: 'background 0.1s, transform 0.1s',
          position: 'relative', zIndex: isHov ? 3 : 1, flexShrink: 0,
        }}
      >
        {!isEmpty && (
          <span style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: vCell ? '5px' : '6px',
            fontWeight: isHov ? 700 : 500,
            color: isHov ? 'white' : type === 'artist' ? '#1F4E79' : '#6B4A2A',
            userSelect: 'none', lineHeight: 1, whiteSpace: 'nowrap',
          }}>
            {booth}
          </span>
        )}
      </div>
    )
  }

  // Render a 2-column booth grid
  function renderGrid(booths: string[], type: SecType) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(2, ${CW}px)`, gap: GAP }}>
        {booths.map(b => renderCell(b, type))}
      </div>
    )
  }

  // Generate booth codes for a section in order: A01, A02, …
  function boothsOf(secId: string, max: number): string[] {
    return Array.from({ length: max }, (_, i) => `${secId}${String(i + 1).padStart(2, '0')}`)
  }

  // Render one section column:
  //   • upper half = higher-numbered booths, descending (high at top → aisle)
  //   • lower half = lower-numbered booths, descending (high at top → bottom)
  //   • padding pushes every section's grid to align at the aisle line
  function renderSection(id: string, max: number, type: SecType) {
    const all = boothsOf(id, max)
    const mid = Math.floor(all.length / 2)

    // Upper zone: second half of all booths (higher numbers), reversed so highest is first
    const upperBooths = [...all.slice(mid)].reverse()
    // Lower zone: first half (lower numbers), reversed so highest in that half is first
    const lowerBooths = [...all.slice(0, mid)].reverse()

    const upperRows = Math.ceil(upperBooths.length / 2)
    const lowerRows = Math.ceil(lowerBooths.length / 2)

    // Padding to push the upper grid to the bottom of its zone (aisle-aligned),
    // and pad the bottom of the lower zone so all columns share the same total height.
    // Grid height for n rows = n*(CH+GAP) - GAP (no trailing gap)
    // Zone height = HALF_H = MAX_HALF*(CH+GAP)
    // Pad = HALF_H - gridHeight = (MAX_HALF - n)*(CH+GAP) + GAP
    const upperPadTop    = Math.max(0, (MAX_HALF - upperRows) * (CH + GAP) + GAP)
    const lowerPadBottom = Math.max(0, (MAX_HALF - lowerRows) * (CH + GAP) + GAP)

    const labelColor = type === 'artist' ? '#2B5F8E' : '#8B7555'

    return (
      <div
        key={id}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}
      >
        {/* Section letter */}
        <div style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '7px', fontWeight: 700,
          color: labelColor, marginBottom: 3, letterSpacing: '0.04em',
        }}>
          {id}
        </div>

        {/* Upper half — padded at top so its bottom aligns with the aisle */}
        <div style={{ paddingTop: upperPadTop }}>
          {renderGrid(upperBooths, type)}
        </div>

        {/* Central aisle / corridor */}
        <div style={{ height: AISLE }} />

        {/* Lower half — grid at top, padded at bottom for uniform column height */}
        <div style={{ paddingBottom: lowerPadBottom }}>
          {renderGrid(lowerBooths, type)}
        </div>
      </div>
    )
  }

  // V section — single row, smaller cells
  const vAll = boothsOf('V', 54)

  // CAFE block width: spans roughly A + gap + B-C sections
  // Align so V section starts approximately above G
  // A(54) + flex5 + spacer10 + flex5 + B-F(5*54+4*5=290) + flex5 + spacer8 + flex5 = 382
  // CAFE = 382 - 6 (gap-before-V) = 376
  const SEC_W = 2 * CW + GAP  // 54px per section column
  const CAFE_W = SEC_W + 5 + 10 + 5 + 5 * SEC_W + 4 * 5 + 5 + 8 - 6  // = 376px

  const popupBrand = popup ? byBooth[popup] : null

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{
        fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '14px',
      }}>
        Booth map — hover to preview · click to jump to artist
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {([
          { label: 'Artist',      bg: '#C8DFF0', border: '#7EB5D6' },
          { label: 'Institution', bg: '#EAD5B0', border: '#C4A870' },
          { label: 'Sponsor',     bg: '#E8D0A8', border: '#C4A870' },
        ] as const).map(({ label, bg, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: 1, background: bg, border: `1px solid ${border}` }} />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--brown)' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Floor plan card */}
      <div style={{
        background: 'white', borderRadius: '12px', padding: '18px 20px',
        border: '1px solid rgba(122,92,69,0.12)', overflowX: 'auto',
      }}>
        <div style={{ minWidth: 'max-content' }}>

          {/* ── TOP ROW: CAFE block + V sponsor strip ── */}
          <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: 8 }}>

            {/* CAFE block */}
            <div style={{
              width: CAFE_W, flexShrink: 0,
              background: '#F5EDDF', border: '1px solid #D8C9A8', borderRadius: 3,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-inter), sans-serif', color: '#8B7555', padding: '6px 0',
            }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em' }}>카페</div>
              <div style={{ fontSize: '7px', marginTop: 1, letterSpacing: '0.06em' }}>CAFE</div>
            </div>

            <div style={{ width: 6, flexShrink: 0 }} />

            {/* V section — single row of 54 narrower cells */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '7px', fontWeight: 600,
                color: '#8B7555', letterSpacing: '0.06em', marginBottom: 4,
              }}>
                V — Sponsor / Special
              </div>
              <div style={{ display: 'flex', gap: GAP }}>
                {/* Higher-numbered V booths first (left), then lower on right – or just sequential */}
                {vAll.map(b => renderCell(b, 'sponsor', true))}
              </div>
            </div>

          </div>

          {/* thin rule */}
          <div style={{ height: 1, background: 'rgba(122,92,69,0.1)', marginBottom: 6 }} />

          {/* ── MAIN FLOOR ── */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'flex-start' }}>

            {/* A */}
            {renderSection('A', 24, 'artist')}

            {/* Group separator */}
            <div style={{ width: 10, flexShrink: 0 }} />

            {/* B – F (40-booth sections) */}
            {(['B','C','D','E','F'] as const).map(id => renderSection(id, 40, 'artist'))}

            {/* Group separator */}
            <div style={{ width: 8, flexShrink: 0 }} />

            {/* G – R (main floor, 53–54 booths) */}
            {(['G','H','I','J','K','L','M','N','O','P','Q','R'] as const).map(id =>
              renderSection(id, SEC_META[id].max, 'artist')
            )}

            {/* Group separator */}
            <div style={{ width: 10, flexShrink: 0 }} />

            {/* S — institutional booths */}
            {renderSection('S', 35, 'institution')}

            {/* Group separator */}
            <div style={{ width: 5, flexShrink: 0 }} />

            {/* T, U */}
            {renderSection('T', 36, 'artist')}
            {renderSection('U', 35, 'artist')}

          </div>

          {/* ── GATE labels ── */}
          <div style={{
            display: 'flex', justifyContent: 'space-around',
            marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(122,92,69,0.08)',
          }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.12em' }}>
              출입구 GATE
            </span>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '8px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.12em' }}>
              출입구 GATE
            </span>
          </div>

        </div>
      </div>

      {/* ── Hover popup ── */}
      {popup && popupBrand && typeof window !== 'undefined' && createPortal(
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
          {popupBrand.korean_name && (
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginBottom: 4 }}>
              {popupBrand.korean_name}
            </div>
          )}
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

// ── Artist icon (favicon with letter fallback) ────────────────────
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

// ── Brand card ────────────────────────────────────────────────────
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
                background: sec?.type === 'sponsor' ? '#E8D0A8' : sec?.type === 'institution' ? '#EAD5B0' : '#C8DFF0',
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

// ── Tab style helper ──────────────────────────────────────────────
const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-inter), sans-serif', fontSize: 12, fontWeight: active ? 500 : 300,
  padding: '8px 18px', borderRadius: 99, cursor: 'pointer',
  background: active ? 'var(--dark-brown)' : 'transparent',
  color: active ? 'var(--cream)' : 'var(--brown)',
  border: `0.5px solid ${active ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
})

// ── Main export ───────────────────────────────────────────────────
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

      {/* Booth map (client-only) */}
      {mounted && <BoothMap brands={brands} onSelect={scrollToArtist} />}

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists or booth…"
          style={{ padding: '10px 18px', borderRadius: 99, border: '0.5px solid rgba(122,92,69,0.2)', background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: 13, fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', width: '100%', maxWidth: 360, boxSizing: 'border-box' as const }}
        />
      </div>

      {/* Section filter tabs */}
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
