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
  posts: string[] | null
  category: string | null
  country: string | null
  booth: string | null
  url: string | null
  sort_order: number
  saves?: number
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
  D02:'ILOOM', D03:'NOBIGDEAL', D04:'KIOSK KIOSK WORKSHOP', D05:'WIP',
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
          Open on Instagram ↗︎
        </a>
      </div>
    </div>,
    document.body
  )
}

// Explicit grid placement — col/row are 1-indexed CSS grid lines
type BoothCell = { code: string; col: number; row: number; cs?: number; rs?: number }

// Hall 2
// Columns: M03(38px) | gap(12px) | C/A ×6(38px) | gap(16px) | D/B ×5(38px)
// Total 14 named cols, col widths vary
// Rows: C/D (1-3) | gap(4) | A-top(5) | A-bot(6)  — NO gap between A rows
const HALL2_BOOTHS: BoothCell[] = [
  // M03 — standalone tall block, separated by gap col from A section
  { code:'M03', col:1, row:5, rs:2 },
  // C section (cols 3-8)
  { code:'C10', col:3,row:1 }, { code:'C09', col:4,row:1 }, { code:'C08', col:5,row:1 },
  { code:'C07', col:6,row:1 }, { code:'C06', col:7,row:1 }, { code:'C05', col:8,row:1 },
  { code:'C11', col:3,row:2 },
  { code:'C02', col:4,row:2, cs:3, rs:2 },  // wide + 2-row tall
  { code:'C04', col:8,row:2 },
  { code:'C01', col:3,row:3 },
  { code:'C03', col:8,row:3 },              // aligned directly below C04
  // D section — cols 10-14, col 9 = gap
  { code:'D05', col:10,row:1 },
  { code:'D04', col:11,row:1, cs:3 },       // 3 wide
  { code:'D03', col:14,row:1 },
  { code:'D02', col:10,row:2, cs:4, rs:2 }, // merged D01+D02 = ILOOM
  // A section — cols 3-8, adjacent rows (no gap)
  { code:'A12', col:3,row:5 }, { code:'A11', col:4,row:5 }, { code:'A10', col:5,row:5 },
  { code:'A09', col:6,row:5 }, { code:'A08', col:7,row:5 }, { code:'A07', col:8,row:5 },
  { code:'A01', col:3,row:6 }, { code:'A02', col:4,row:6 }, { code:'A03', col:5,row:6 },
  { code:'A04', col:6,row:6 }, { code:'A05', col:7,row:6 }, { code:'A06', col:8,row:6 },
  // B section — cols 10-14
  { code:'B08', col:10,row:5 }, { code:'B07', col:11,row:5 }, { code:'B06', col:12,row:5, cs:2 }, // B06 = 2 wide
  { code:'B01', col:10,row:6 }, { code:'B02', col:11,row:6 }, { code:'B03', col:12,row:6 },
  { code:'B04', col:13,row:6 }, { code:'B05', col:14,row:6 },
]
// col widths: M03 | thin-gap | C/A×6 | gap | D/B×5
const HALL2_COL_WIDTHS = '38px 12px 38px 38px 38px 38px 38px 38px 16px 38px 38px 38px 38px 38px'
const HALL2_ROW_HEIGHTS = '26px 26px 26px 16px 26px 26px'

// Hall 1 — 15 cols × 13 rows
const HALL1_BOOTHS: BoothCell[] = [
  // Row 1: M04 wide; L09 above L08 (col 8)
  { code:'M04', col:9,row:1, cs:4 },
  { code:'L09', col:8,row:1 },
  // Row 2: M02 · K06 · K07 · L08 above F01 · L07 · L06 · K08 · K09 · L05 (tall, rs=2)
  { code:'M02', col:2,row:2, cs:2 }, { code:'K06', col:4,row:2 }, { code:'K07', col:5,row:2 },
  { code:'L08', col:8,row:2 },
  { code:'L07', col:11,row:2 }, { code:'L06', col:12,row:2 }, { code:'K08', col:13,row:2 }, { code:'K09', col:14,row:2 },
  { code:'L05', col:15,row:2, rs:2 },
  // K left edge
  { code:'K05', col:1,row:3 }, { code:'K04', col:1,row:4 },
  { code:'K03', col:1,row:6 },
  { code:'K02', col:1,row:9 }, { code:'K01', col:1,row:10 },
  // E/F cluster (rows 3-4)
  { code:'E01', col:2,row:3, rs:2 },
  { code:'E02', col:3,row:3, cs:2 }, { code:'E03', col:5,row:3 }, { code:'E04', col:6,row:3, rs:2 },
  { code:'E06', col:3,row:4 }, { code:'E05', col:4,row:4, cs:2 },
  { code:'F01', col:8,row:3, rs:2 },
  { code:'F02', col:9,row:3 }, { code:'F03', col:10,row:3 }, { code:'F04', col:11,row:3 }, { code:'F05', col:12,row:3 },
  { code:'F06', col:13,row:3, rs:2 },
  { code:'F09', col:9,row:4, cs:2 }, { code:'F08', col:11,row:4 }, { code:'F07', col:12,row:4 },
  { code:'L04', col:15,row:4, rs:3 },
  // G/H cluster (rows 6-7)
  { code:'G01', col:2,row:6, rs:2 },
  { code:'G02', col:3,row:6, cs:2 }, { code:'G03', col:5,row:6 }, { code:'G04', col:6,row:6, rs:2 },
  { code:'G07', col:3,row:7 }, { code:'G06', col:4,row:7 }, { code:'G05', col:5,row:7 },
  { code:'H01', col:8,row:6, rs:2 },
  { code:'H02', col:9,row:6 }, { code:'H03', col:10,row:6 }, { code:'H04', col:11,row:6 }, { code:'H05', col:12,row:6 },
  { code:'H06', col:13,row:6, rs:2 },
  { code:'H09', col:9,row:7 }, { code:'H08', col:10,row:7, cs:2 }, { code:'H07', col:12,row:7 },
  { code:'L03', col:15,row:7 },
  // I/J cluster (rows 9-10)
  { code:'I01', col:2,row:9, rs:2 },
  { code:'I02', col:3,row:9, cs:2 }, { code:'I03', col:5,row:9 }, { code:'I04', col:6,row:9, rs:2 },
  { code:'I06', col:3,row:10, cs:2 }, { code:'I05', col:5,row:10 },
  { code:'J01', col:8,row:9, rs:2 },
  { code:'J02', col:9,row:9 },
  { code:'J03', col:10,row:9, cs:2 }, { code:'J04', col:12,row:9 },
  { code:'J05', col:13,row:9, rs:2 },
  { code:'J08', col:9,row:10 }, { code:'J07', col:10,row:10, cs:2 }, { code:'J06', col:12,row:10 },
  { code:'L02', col:15,row:9, rs:3 },
  // Bottom strip (row 12)
  { code:'I07', col:2,row:12 }, { code:'I08', col:3,row:12 }, { code:'I09', col:5,row:12, cs:2 },
  { code:'J09', col:8,row:12 }, { code:'J10', col:9,row:12, cs:2 }, { code:'J11', col:11,row:12, cs:2 },
  { code:'L01', col:15,row:12, rs:2 },
]
const HALL1_COLS = 15
const HALL1_ROW_HEIGHTS = '28px 26px 26px 26px 14px 26px 26px 14px 26px 26px 14px 26px 26px'

function BoothMap({ brands, onSelect }: { brands: CatalogueBrand[]; onSelect: (b: CatalogueBrand) => void }) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [popup, setPopup] = useState<string | null>(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  const brandsByBooth: Record<string, CatalogueBrand[]> = {}
  const brandById: Record<number, CatalogueBrand> = {}
  brands.forEach(b => {
    brandById[b.id] = b
    if (b.booth) {
      if (!brandsByBooth[b.booth]) brandsByBooth[b.booth] = []
      brandsByBooth[b.booth].push(b)
    }
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

  const popupBrands = popup ? (brandsByBooth[popup] ?? []) : []
  const popupShortcodes = popupBrands.flatMap(b =>
    (b.posts?.length ? b.posts : b.post ? [b.post] : [])
      .map(p => p.match(/\/p\/([^/?]+)/)?.[1])
      .filter(Boolean) as string[]
  )

  function cellBg(booth: string) {
    const brand = brandsByBooth[booth]?.[0]
    const cat = brand?.category ?? ''
    return CATEGORY_COLORS[cat] ? CATEGORY_COLORS[cat] + '66' : 'rgba(122,92,69,0.08)'
  }
  function cellBorder(booth: string) {
    if (hovered === booth) return '#1F3A5F'
    const brand = brandsByBooth[booth]?.[0]
    const cat = brand?.category ?? ''
    return CATEGORY_COLORS[cat] ?? 'rgba(122,92,69,0.2)'
  }

  const W = 38, H = 26, GAP = 3

  function renderGrid(booths: BoothCell[], colWidths: string, rowHeights: string) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: colWidths,
        gridTemplateRows: rowHeights,
        gap: `${GAP}px`,
        position: 'relative',
      }}>
        {booths.map(({ code, col, row, cs = 1, rs = 1 }) => {
          const boothBrands = brandsByBooth[code] ?? []
          const isHovered = hovered === code
          return (
            <div key={code}
              onMouseEnter={e => startHover(code, e.currentTarget)}
              onMouseLeave={endHover}
              onClick={() => { if (boothBrands[0]) onSelect(boothBrands[0]) }}
              style={{
                gridColumn: `${col} / span ${cs}`,
                gridRow: `${row} / span ${rs}`,
                borderRadius: '4px',
                background: cellBg(code),
                border: `1.5px solid ${cellBorder(code)}`,
                cursor: boothBrands.length ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.12s',
                zIndex: isHovered ? 2 : 1,
                position: 'relative',
              }}
            >
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '7.5px', fontWeight: isHovered ? 700 : 500, color: isHovered ? '#1F3A5F' : 'rgba(75,55,42,0.7)', lineHeight: 1, userSelect: 'none', textAlign: 'center', padding: '0 2px' }}>
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
            {renderGrid(HALL2_BOOTHS, HALL2_COL_WIDTHS, HALL2_ROW_HEIGHTS)}
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
            {renderGrid(HALL1_BOOTHS, `repeat(${HALL1_COLS}, ${W}px)`, HALL1_ROW_HEIGHTS)}
          </div>
        </div>
      </div>

      {/* Popup */}
      {popup && popupBrands.length > 0 && createPortal(
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
          {popupBrands.map((b, i) => (
            <div key={b.id} style={{ padding: '10px 16px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '2px' }}>
                    {b.name}
                    {i === 0 && <span style={{ fontSize: '10px', fontWeight: 500, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 6px', borderRadius: '99px', marginLeft: '6px' }}>{popup}</span>}
                  </div>
                  {b.korean_name && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>{b.korean_name}</div>}
                  {b.instagram && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--dark-blue)', marginTop: '2px' }}>@{b.instagram}</div>}
                </div>
                {b.category && (
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--brown)', background: (CATEGORY_COLORS[b.category] ?? 'rgba(122,92,69,0.15)') + '55', padding: '2px 8px', borderRadius: '99px', flexShrink: 0, marginLeft: '8px' }}>
                    {b.category}
                  </span>
                )}
              </div>
            </div>
          ))}
          {popupShortcodes.length > 0
            ? <div style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' as any, scrollbarWidth: 'none' as any }}>
                {popupShortcodes.map((sc, i) => (
                  <iframe key={i}
                    src={`https://www.instagram.com/p/${sc}/embed/`}
                    frameBorder="0" scrolling="no" allow="encrypted-media"
                    style={{ display: 'block', flexShrink: 0, width: popupShortcodes.length > 1 ? 'calc(100% - 20px)' : '100%', minWidth: popupShortcodes.length > 1 ? 'calc(100% - 20px)' : '100%', height: '400px', border: 'none', scrollSnapAlign: 'start' }} />
                ))}
              </div>
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
        {shortcodes.length > 0 && (
          <button type="button" onClick={() => onView(brand)}
            style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.07)', border: 'none', borderRadius: '99px', padding: '4px 12px', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
            View ↗︎
          </button>
        )}
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
          <a href="https://inventario.kr" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>Official site ↗︎</a>
          <a href="https://www.instagram.com/inventario.seoul/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>@inventario.seoul ↗︎</a>
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

      {mounted && modal && (modal.posts?.[0] ?? modal.post) && <PostModal postUrl={(modal.posts?.[0] ?? modal.post)!} name={modal.name} onClose={() => setModal(null)} />}
    </>
  )
}
