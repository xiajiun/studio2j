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

// ── Official booth layout from PDF ──
const BOOTH_LAYOUT: Record<string, string> = {
  // Hall 2 — A row
  A01:'DOOSUNG PAPER',   A02:'mt × rolledpaint', A03:'FABER-CASTELL',  A04:'KAKIMORI',
  A05:'BLACKHEART',       A06:'POV',               A07:'THE HANGEUL',   A08:"CARAN D'ACHE",
  A09:'SAILOR',           A10:'SHIELDCOLORS',      A11:'COPIC',          A12:'PAPER TAILOR',
  // Hall 2 — B row
  B01:'POV × HELLO KITTY', B02:'LIMPA LIMPA', B03:'FRUITFRIES', B04:'THENCE',
  B05:'MEET ME',            B06:'IWAKO',       B07:'SEOUL DESIGN FOUNDATION', B08:'PENCO®',
  // Hall 2 — C row
  C01:'LOGITECH', C02:'WEARINGEUL', C03:'HWF.RISOCLUB', C04:'GONGJANG',
  C05:'MOHS',     C06:'O-CHECK',    C07:'PaTI',           C08:'HANSOL PAPER × URBANBOOKS',
  C09:'SAMWON PAPER WORKSHOP', C10:'SAMWON PAPER', C11:'KOKUYO',
  // Hall 2 — D row
  D01:'ILOOM', D02:'ILOOM', D03:'NOBIGDEAL', D04:'KIOSK KIOSK WORKSHOP', D05:'WIP',
  // Hall 1 — E row (E03=GOOBER, E04=KOREA PILOT, E05=MICIA+LYRA)
  E01:'DOMINANT INDUSTRY', E02:'GONGYEGA',   E03:'GOOBER',    E04:'KOREA PILOT',
  E05:'MICIA / LYRA',       E06:'BUYHEARTS',
  // Hall 1 — F row
  F01:'LIFE&PIECES', F02:'MAGAZINE C', F03:'IROHA',           F04:'TIETOA',
  F05:'KITTY BUNNY PONY', F06:'ZEBRA',  F07:'FLAGG', F08:'SOME MOOD DESIGN', F09:'BOKI',
  // Hall 1 — G row
  G01:'NELNA', G02:'BE ON D', G03:'SUKIDOKI', G04:'OH, LOLLY DAY!',
  G05:'WHENIWASYOUNG', G06:'AHMUGAE_C', G07:'SANBY',
  // Hall 1 — H row (H06 = HITOTOKI / PENTEL / RAYMAY KEPT / WOODHI)
  H01:'KAWI', H02:'0.1', H03:'YOUR-MIND', H04:'onemorebag',
  H05:'MINIMONI', H06:'HITOTOKI / PENTEL / RAYMAY KEPT / WOODHI',
  H07:'PRESENT PRESENT', H08:'SAILORS', H09:'KIOSK KIOSK',
  // Hall 1 — I row
  I01:'TROLLS PAPER', I02:'YANGJISA',  I03:'SOSOMOONGOO', I04:'OIMU',
  I05:'PAPER PLATE',  I06:'MOTEMOTE', I07:'GEULWOL',      I08:'LITTLE TEMPO DESIGN', I09:'ICONIC',
  // Hall 1 — J row
  J01:'UNI',           J02:'COMPOSITION STUDIO', J03:'PRELUDE STUDIO', J04:'MOLESKINE',
  J05:'HOWkidsFUL',    J06:'FRANZ',              J07:'RHODIA / JACQUES HERBIN',
  J08:'PLUS',          J09:'NO NOT NEVER',        J10:'PULPUL',         J11:'PAPERIAN',
  // Kiosk — K row
  K01:"MARK'S", K02:'OUIE', K03:'MINDOBITTO', K04:'HWARANG',
  K05:'DONKY CONTÉ', K06:'ANTERIQUE', K07:'SUI GOUACHE', K08:'MEWMEWBEAM', K09:'NOH YONG-WON',
  // Right edge — L row (L02 shared: RIFLE PAPER CO. / THE COMPLETIST / CRAFT DESIGN TECHNOLOGY)
  L01:'GLOBE CHEMICAL', L02:'RIFLE PAPER CO. / THE COMPLETIST / CRAFT DESIGN TECHNOLOGY',
  L03:'CLIPEN',         L04:'GEEHEY',      L05:'SANRO',         L06:'SUATELIER',
  L07:'CIRCUS BOY BAND', L08:"TRAVELER'S COMPANY", L09:"TRAVELER'S COMPANY WORKSHOP",
  // Lounge / Common
  M01:'NAVER LOUNGE', M02:'REMASTERED', M03:"Layer's Together", M04:'LOUNGE',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Small Thing':      '#E8A0BF',
  'Writing & Drawing':'#7FB3D3',
  'Daily Finds':      '#82C98A',
  'Paper':            '#F5D06A',
  'Office & Desk':    '#F0886A',
  'Kiosk':            '#A8D8A8',
  'Workshop':         '#C4A8D8',
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
        <iframe src={`https://www.instagram.com/p/${shortcode}/embed/`} width="400" height="480"
          frameBorder="0" scrolling="no" allow="encrypted-media"
          style={{ borderRadius: '12px', display: 'block', width: '100%', border: 'none' }} />
        <a href={postUrl} target="_blank" rel="noreferrer"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.7)', textAlign: 'center', textDecoration: 'none' }}>
          Open on Instagram ↗
        </a>
      </div>
    </div>,
    document.body
  )
}

// 2D grid arrays — null = empty cell, string = booth code
// Hall 2: C/D section on top, A/B section on bottom
const HALL2_GRID: (string|null)[][] = [
  ['C10','C09','C08','C07','C06','C05', null, 'D05', null,'D04','D03', null],
  ['C11', null, 'C02', null, null,'C04', null,  null, null,'D02', null, null],
  ['C01', null,  null, null, null,'C03','D01',  null, null, null, null, null],
  [ null, null,  null, null, null, null, null,  null, null, null, null, null],
  ['A12','A11','A10','A09','A08','A07', null, 'B08','B07','B06', null, null],
  ['A01','A02','A03','A04','A05','A06', null, 'B01','B02','B03','B04','B05'],
]

// Hall 1: E-F top, G-H middle, I-J lower, I07-J11 strip
// col: K-left(1) | main-left(2-6) | gap(7) | main-right(8-12) | K-right(13-14) | L(15)
const HALL1_GRID: (string|null)[][] = [
  [ null,  null,  null,  null,  null,  null,  null,  null,  null, 'K05','K06','K07',  null,'L09','M04'],
  [ null,  null, 'E02', 'E03', 'E04',  null,  null, 'F02', 'F03', 'F04','F05',  null,'K08','K09',  null],
  ['E01',  null,  null, 'E06', 'E05',  null, 'F01',  null,  null,  null,  null,'F06',  null, null,'L08'],
  [ null,  null,  null,  null,  null,  null,  null, 'F09', 'F08', 'F07',  null,  null,  null, null,'L07'],
  ['K04', 'G01', 'G02', 'G03', 'G04',  null,  null, 'H02', 'H03', 'H04','H05',  null,  null, null,'L06'],
  ['K03',  null, 'G07', 'G06', 'G05',  null, 'H01',  null,  null,  null,  null,'H06',  null, null,'L05'],
  ['K02',  null,  null,  null,  null,  null,  null, 'H09', 'H08', 'H07',  null,  null,  null, null,'L04'],
  ['K01', 'I01', 'I02', 'I03', 'I04',  null,  null, 'J02', 'J03', 'J04',  null,  null,  null, null,'L03'],
  [ null,  null, 'I06', 'I05',  null,  null, 'J01',  null,  null,  null,  null, 'J05',  null, null,'L02'],
  [ null,  null,  null,  null,  null,  null,  null, 'J08', 'J07', 'J06',  null,  null,  null, null,'L01'],
  [ null, 'I07', 'I08',  null, 'I09',  null,  null, 'J09', 'J10',  null, 'J11',  null,  null, null, null],
]

function BoothMap({ brands, onSelect }: { brands: CatalogueBrand[]; onSelect: (b: CatalogueBrand) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [popup, setPopup] = useState<string | null>(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  // Build lookup: first brand whose name matches wins (handles shared booths)
  const brandByBooth: Record<string, CatalogueBrand> = {}
  const brandById: Record<number, CatalogueBrand> = {}
  brands.forEach(b => {
    brandById[b.id] = b
    if (b.booth && !brandByBooth[b.booth]) brandByBooth[b.booth] = b
  })

  function startHover(booth: string, el: HTMLElement) {
    setHovered(booth)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const r = el.getBoundingClientRect()
      setPopup(booth)
      setPopupPos({ x: r.left + r.width / 2, y: r.top })
    }, 300)
  }
  function endHover() {
    setHovered(null)
    if (timerRef.current) clearTimeout(timerRef.current)
    setTimeout(() => { if (!popupRef.current?.matches(':hover')) setPopup(null) }, 100)
  }

  const popupBrand = popup ? brandByBooth[popup] : null
  const popupShortcode = popupBrand?.post?.match(/\/p\/([^/?]+)/)?.[1]

  function cellBg(booth: string) {
    const brand = brandByBooth[booth]
    const cat = brand?.category ?? ''
    return CATEGORY_COLORS[cat] ? CATEGORY_COLORS[cat] + '66' : 'rgba(122,92,69,0.08)'
  }
  function cellBorder(booth: string) {
    if (hovered === booth) return '#1F3A5F'
    const brand = brandByBooth[booth]
    const cat = brand?.category ?? ''
    return CATEGORY_COLORS[cat] ?? 'rgba(122,92,69,0.2)'
  }

  const W = 38, H = 26, GAP = 3

  function renderGrid(grid: (string|null)[][], cols: number) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${W}px)`,
        gridAutoRows: `${H}px`,
        gap: `${GAP}px`,
      }}>
        {grid.flat().map((code, idx) => {
          if (!code) return <div key={idx} />
          const brand = brandByBooth[code]
          const isHovered = hovered === code
          return (
            <div key={code}
              onMouseEnter={e => startHover(code, e.currentTarget)}
              onMouseLeave={endHover}
              onClick={() => { if (brand) onSelect(brand) }}
              style={{
                borderRadius: '3px',
                background: cellBg(code),
                border: `1.5px solid ${cellBorder(code)}`,
                cursor: brand ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.12s',
                zIndex: isHovered ? 2 : 1,
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '7.5px', fontWeight: isHovered ? 700 : 500, color: isHovered ? '#1F3A5F' : 'rgba(75,55,42,0.65)', lineHeight: 1, userSelect: 'none' }}>
                {code}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '48px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
        Booth map — hover to preview · click to scroll to brand
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: color + '88', border: `1.5px solid ${color}` }} />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--brown)' }}>{cat}</span>
          </div>
        ))}
      </div>

      {/* Map */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px 20px', border: '0.5px solid rgba(122,92,69,0.1)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', minWidth: 'max-content' }}>

          {/* Hall 2 */}
          <div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1F3A5F', marginBottom: '10px', textAlign: 'center' }}>
              Platz Hall 2
            </div>
            {renderGrid(HALL2_GRID, HALL2_GRID[0].length)}
          </div>

          {/* Lounge label */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', fontFamily: 'var(--font-fraunces), serif', fontSize: '13px', fontStyle: 'italic', color: 'var(--tan)', textAlign: 'center', minWidth: '60px' }}>
            Lounge
          </div>

          {/* Hall 1 */}
          <div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1F3A5F', marginBottom: '10px', textAlign: 'center' }}>
              Platz Hall 1
            </div>
            {renderGrid(HALL1_GRID, HALL1_GRID[0].length)}
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && popupBrand && createPortal(
        <div ref={popupRef} onMouseLeave={() => setPopup(null)}
          style={{
            position: 'fixed',
            left: Math.min(popupPos.x - 190, window.innerWidth - 400),
            top: Math.max(popupPos.y - 10, 10),
            transform: 'translateY(-100%)',
            zIndex: 8888, width: '380px',
            background: 'white', borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            border: '0.5px solid rgba(122,92,69,0.15)', overflow: 'hidden',
          }}>
          <div style={{ padding: '14px 16px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '2px' }}>
                  {popupBrand.name}
                  {' '}
                  <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 6px', borderRadius: '99px' }}>{popup}</span>
                </div>
                {popupBrand.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>{popupBrand.korean_name}</div>}
                {popupBrand.instagram && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--dark-blue)', marginTop: '2px' }}>@{popupBrand.instagram}</div>}
              </div>
              {popupBrand.category && (
                <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--brown)', background: (CATEGORY_COLORS[popupBrand.category] ?? 'rgba(122,92,69,0.15)') + '55', padding: '2px 8px', borderRadius: '99px', flexShrink: 0, marginLeft: '8px' }}>
                  {popupBrand.category}
                </span>
              )}
            </div>
          </div>
          {popupShortcode
            ? <iframe src={`https://www.instagram.com/p/${popupShortcode}/embed/`} width="380" height="400" frameBorder="0" scrolling="no" allow="encrypted-media" style={{ display: 'block', width: '100%', border: 'none' }} />
            : <div style={{ padding: '16px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--tan)', textAlign: 'center' }}>No post added yet</div>
          }
        </div>,
        document.body
      )}
    </div>
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
    <div id={`brand-${brand.id}`} style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <BrandIcon brand={brand} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px', flexWrap: 'wrap' }}>
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
      {shortcode && (
        <iframe src={`https://www.instagram.com/p/${shortcode}/embed/`} loading="lazy"
          frameBorder="0" scrolling="no" allow="encrypted-media"
          style={{ display: 'block', width: '100%', height: '480px', border: 'none' }} />
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

  function scrollToBrand(brand: CatalogueBrand) {
    setActiveCategory(brand.category ?? 'All')
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
          <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>Order from this fair →</a>
          <a href="https://inventario.kr" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>Official site ↗</a>
          <a href="https://www.instagram.com/inventario.seoul/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>@inventario.seoul ↗</a>
        </div>
      </div>

      {/* Booth map */}
      {mounted && <BoothMap brands={brands} onSelect={scrollToBrand} />}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {categories.map(cat => (
          <button key={cat} type="button" style={tabStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>{cat}</button>
        ))}
      </div>

      {/* Brand grid */}
      {brands.length === 0 ? (
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          No brands yet — add them in the admin panel.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {filtered.map(brand => <BrandCard key={brand.id} brand={brand} onView={setModal} />)}
        </div>
      )}

      {mounted && modal?.post && <PostModal postUrl={modal.post} name={modal.name} onClose={() => setModal(null)} />}
    </>
  )
}
