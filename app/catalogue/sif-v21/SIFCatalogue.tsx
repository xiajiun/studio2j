'use client'

import { useState, useEffect } from 'react'
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

function BoothMap({ boothMap, onSectionFilter }: {
  boothMap: Record<string, string>
  onSectionFilter: (section: string | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  function handleSectionClick(sec: string) {
    const next = activeSection === sec ? null : sec
    setActiveSection(next)
    onSectionFilter(next)
  }

  const COLS = 2
  const CW = 30, CH = 20, GAP = 2

  function renderSection(sec: typeof SECTIONS[0]) {
    const booths: string[] = []
    for (let i = 1; i <= sec.max; i++) {
      booths.push(`${sec.id}${String(i).padStart(2, '0')}`)
    }
    const rows = Math.ceil(booths.length / COLS)
    const isActive = activeSection === sec.id
    const bgBase = sec.type === 'sponsor' ? '#D4C4A8' : sec.type === 'institution' ? '#C8B8A0' : 'rgba(31,58,95,0.10)'
    const borderBase = sec.type === 'sponsor' ? 'rgba(139,117,85,0.4)' : sec.type === 'institution' ? 'rgba(122,92,69,0.3)' : 'rgba(31,58,95,0.2)'

    return (
      <div key={sec.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
        <div
          onClick={() => handleSectionClick(sec.id)}
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.06em',
            color: isActive ? '#1F3A5F' : 'var(--tan)',
            background: isActive ? 'rgba(31,58,95,0.1)' : 'transparent',
            padding: '2px 4px', borderRadius: '3px',
            cursor: 'pointer', userSelect: 'none', textAlign: 'center',
          }}
        >
          {sec.id}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CW}px)`,
          gridTemplateRows: `repeat(${rows}, ${CH}px)`,
          gap: `${GAP}px`,
          outline: isActive ? '2px solid #1F3A5F' : '2px solid transparent',
          outlineOffset: '2px', borderRadius: '4px',
        }}>
          {booths.map(booth => {
            const name = boothMap[booth]
            const isEmpty = !name
            const isHov = hovered === booth
            return (
              <div
                key={booth}
                title={name ?? ''}
                onMouseEnter={() => { if (!isEmpty) setHovered(booth) }}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: CW, height: CH, borderRadius: '3px',
                  background: isEmpty ? 'transparent' : isHov ? '#1F3A5F' : bgBase,
                  border: isEmpty ? 'none' : `0.5px solid ${isHov ? '#1F3A5F' : borderBase}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: isEmpty ? 'default' : 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                {!isEmpty && (
                  <span style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '7px', fontWeight: isHov ? 700 : 500,
                    color: isHov ? 'white' : 'var(--dark-brown)',
                    userSelect: 'none', lineHeight: 1,
                  }}>
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

  const vSec = SEC_META['V']
  const mainSections = SECTIONS.filter(s => s.id !== 'V')

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px' }}>
        Booth map — click section to filter
      </div>
      <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '0.5px solid rgba(122,92,69,0.1)', overflowX: 'auto' }}>
        {/* V sponsor strip at top */}
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '9px', fontWeight: 600, color: 'var(--tan)', letterSpacing: '0.1em' }}>
            V — SPONSOR / SPECIAL
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${vSec.max}, ${CW}px)`,
            gap: `${GAP}px`,
            outline: activeSection === 'V' ? '2px solid #1F3A5F' : '2px solid transparent',
            outlineOffset: '2px', borderRadius: '4px',
          }}>
            {Array.from({ length: vSec.max }, (_, i) => {
              const booth = `V${String(i + 1).padStart(2, '0')}`
              const name = boothMap[booth]
              const isEmpty = !name
              const isHov = hovered === booth
              return (
                <div
                  key={booth}
                  title={name ?? ''}
                  onMouseEnter={() => { if (!isEmpty) setHovered(booth) }}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSectionClick('V')}
                  style={{
                    width: CW, height: CH, borderRadius: '3px',
                    background: isEmpty ? 'transparent' : isHov ? '#8B7555' : '#D4C4A8',
                    border: isEmpty ? 'none' : `0.5px solid ${isHov ? '#8B7555' : 'rgba(139,117,85,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: isEmpty ? 'default' : 'pointer',
                    transition: 'background 0.1s',
                  }}
                >
                  {!isEmpty && (
                    <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '7px', fontWeight: isHov ? 700 : 500, color: isHov ? 'white' : 'var(--dark-brown)', userSelect: 'none', lineHeight: 1 }}>
                      {booth}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: '0.5px', background: 'rgba(122,92,69,0.1)', margin: '8px 0 16px' }} />

        {/* Main sections A-U */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', minWidth: 'max-content' }}>
          {mainSections.map(sec => renderSection(sec))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
        {[
          { label: 'Artist', bg: 'rgba(31,58,95,0.10)', border: 'rgba(31,58,95,0.2)' },
          { label: 'Institution / Special', bg: '#C8B8A0', border: 'rgba(122,92,69,0.3)' },
          { label: 'Sponsor', bg: '#D4C4A8', border: 'rgba(139,117,85,0.4)' },
        ].map(({ label, bg, border }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: bg, border: `0.5px solid ${border}` }} />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--brown)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BrandCard({ brand }: { brand: CatalogueBrand }) {
  const sec = brand.booth ? SEC_META[brand.booth[0]] : null
  const bgColor = sec?.type === 'sponsor' ? '#D4C4A8' : sec?.type === 'institution' ? '#C8B8A0' : 'rgba(31,58,95,0.10)'
  const borderColor = sec?.type === 'sponsor' ? '#8B7555' : sec?.type === 'institution' ? 'rgba(122,92,69,0.3)' : 'rgba(31,58,95,0.2)'

  return (
    <div style={{ background: 'white', borderRadius: '12px', padding: '14px 16px', border: '0.5px solid rgba(122,92,69,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)', lineHeight: 1.4, wordBreak: 'break-word' }}>
          {brand.name}
        </div>
        {brand.instagram && (
          <a href={`https://www.instagram.com/${brand.instagram}/`} target="_blank" rel="noreferrer"
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', marginTop: '2px', display: 'block' }}>
            @{brand.instagram}
          </a>
        )}
      </div>
      {brand.booth && (
        <span style={{
          flexShrink: 0,
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '10px', fontWeight: 600, color: 'var(--dark-blue)',
          background: bgColor, border: `0.5px solid ${borderColor}`,
          padding: '2px 7px', borderRadius: '4px',
        }}>
          {brand.booth}
        </span>
      )}
    </div>
  )
}

export function SIFCatalogue({ brands, totalCount }: { brands: CatalogueBrand[]; totalCount: number }) {
  const [search, setSearch] = useState('')
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Build booth→name map for the booth map component
  const boothMap: Record<string, string> = {}
  brands.forEach(b => { if (b.booth) boothMap[b.booth] = b.name })

  const filtered = brands.filter(b => {
    const q = search.toLowerCase()
    const matchSearch = !q || b.name.toLowerCase().includes(q) || (b.booth?.toLowerCase().includes(q) ?? false) || (b.instagram?.toLowerCase().includes(q) ?? false)
    const matchSection = !activeSection || (b.booth?.[0] === activeSection)
    return matchSearch && matchSection
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>
          Seoul Illustration Fair
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: '0 0 8px' }}>
          V.21 Brand Catalogue
        </h1>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          {totalCount} brands · October 2026 · Seoul COEX
        </div>
      </div>

      {/* Booth map */}
      {mounted && <BoothMap boothMap={boothMap} onSectionFilter={setActiveSection} />}

      {/* Search + section filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search artists or booth…"
          style={{ padding: '10px 16px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', minWidth: '220px' }}
        />
        {activeSection ? (
          <button onClick={() => { setActiveSection(null) }}
            style={{ padding: '8px 16px', borderRadius: '99px', border: 'none', background: 'var(--dark-brown)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, cursor: 'pointer' }}>
            Section {activeSection} ×
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {SECTIONS.map(sec => (
              <button key={sec.id} onClick={() => setActiveSection(sec.id)}
                style={{ padding: '6px 12px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.15)', background: 'white', color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, cursor: 'pointer' }}>
                {sec.id}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '20px' }}>
        {filtered.length} {filtered.length === 1 ? 'artist' : 'artists'}{activeSection ? ` in section ${activeSection}` : ''}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
        {filtered.map(b => <BrandCard key={b.id} brand={b} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
          No artists found
        </div>
      )}
    </div>
  )
}
