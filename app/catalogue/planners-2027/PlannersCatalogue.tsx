'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangProvider'
import { PLANNERS_2027, type BinderSize, type Planner2027, type PlannerFormat, type PlannerVariant, type SizeGroup } from '@/lib/planners-2027'

// Layout tiles — weekly-memo is grouped with weekly-horizontal
type LayoutKey = 'daily' | 'weekly-vertical' | 'weekly-horizontal' | 'monthly' | 'multi-year' | 'calendar' | 'cover'
const LAYOUTS: LayoutKey[] = ['daily', 'weekly-vertical', 'weekly-horizontal', 'monthly', 'multi-year', 'calendar', 'cover']
const layoutOf = (f: PlannerFormat): LayoutKey => (f === 'weekly-memo' ? 'weekly-horizontal' : f)

const SIZES: SizeGroup[] = ['large', 'medium', 'pocket']
const COLLAGE_IDS = ['kr-analoguekeeper-space-diary', 'jp-hobonichi-original', 'jp-binder-ashford-grace-monthly-calendar']
const RING_SIZES: BinderSize[] = ['micro5', 'mini5', 'mini6', 'bible', 'narrow', 'a7', 'a6', 'b6', 'a5']

const inter = 'var(--font-inter), sans-serif'
const fraunces = 'var(--font-fraunces), serif'
const hairline = '0.5px solid rgba(107,163,200,0.2)'

const tabStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: inter, fontSize: '12px', fontWeight: active ? 500 : 300,
  padding: '8px 16px', borderRadius: '99px', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
  background: active ? 'var(--dark-brown)' : 'transparent',
  color: active ? 'var(--cream)' : 'var(--brown)',
  border: `0.5px solid ${active ? 'var(--dark-brown)' : 'rgba(107,163,200,0.25)'}`,
})

const selectStyle = (active: boolean): React.CSSProperties => ({
  ...tabStyle(active),
  appearance: 'none', WebkitAppearance: 'none', paddingRight: '30px',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' fill='none' stroke='%236BA3C8' stroke-width='1.2'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center',
  backgroundColor: active ? 'var(--beige)' : 'transparent',
  color: active ? 'var(--dark-brown)' : 'var(--brown)',
  border: `0.5px solid ${active ? 'var(--brown)' : 'rgba(107,163,200,0.25)'}`,
})

function fill(tpl: string, vars: Record<string, string>) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '')
}

function formatPrice(p: NonNullable<Planner2027['price']>) {
  return `${p.currency === 'JPY' ? '¥' : '₩'}${p.amount.toLocaleString('en-US')}`
}

function orderHref(p: Planner2027, v?: PlannerVariant) {
  const item = `${p.brand} ${p.name}${v ? ` — ${v.size}` : ''}${p.dated && !/2027/.test(p.name) ? ' (2027)' : ''}`
  return `/order/new?item=${encodeURIComponent(item)}&url=${encodeURIComponent(v?.url ?? p.url)}`
}

// ── Layout mini-spreads (our own drawings) ──────────────────────────────────
function LayoutIcon({ kind, active }: { kind: LayoutKey | 'binder'; active: boolean }) {
  const ink = active ? 'var(--dark-blue)' : 'var(--tan)'
  const page = { fill: 'white', stroke: ink, strokeWidth: 0.8 }
  const line = { stroke: ink, strokeWidth: 0.6 }
  const L = 4, R = 34, W = 26, T = 4, H = 32 // left page x, right page x, page width, top, height
  const pages = <><rect x={L} y={T} width={W} height={H} rx={1.5} {...page} /><rect x={R} y={T} width={W} height={H} rx={1.5} {...page} /></>
  let marks: React.ReactNode = null
  if (kind === 'daily') {
    marks = [L, R].flatMap(x => [
      <line key={`h${x}`} x1={x + 3} y1={T + 5} x2={x + 12} y2={T + 5} stroke={ink} strokeWidth={1.4} />,
      ...[11, 15, 19, 23, 27, 31].map(y => <line key={`${x}-${y}`} x1={x + 3} y1={T + y - 2} x2={x + W - 3} y2={T + y - 2} {...line} />),
    ])
  } else if (kind === 'weekly-vertical') {
    marks = [L, R].flatMap(x => [0, 1, 2, 3].map(i => (
      <line key={`${x}-${i}`} x1={x + 3 + i * 6.5} y1={T + 3} x2={x + 3 + i * 6.5} y2={T + H - 3} {...line} />
    ))).concat([10, 16, 22].map(y => <line key={`hr${y}`} x1={L + 2} y1={T + y} x2={R + W - 2} y2={T + y} stroke={ink} strokeWidth={0.3} strokeDasharray="1 1.5" />))
  } else if (kind === 'weekly-horizontal') {
    marks = [L, R].flatMap(x => [1, 2, 3].map(i => (
      <line key={`${x}-${i}`} x1={x + 2} y1={T + i * (H / 4)} x2={x + W - 2} y2={T + i * (H / 4)} {...line} />
    )))
  } else if (kind === 'monthly') {
    marks = [L, R].flatMap(x => [
      ...[1, 2, 3, 4].map(i => <line key={`${x}-h${i}`} x1={x + 2} y1={T + 3 + i * 5.8} x2={x + W - 2} y2={T + 3 + i * 5.8} {...line} />),
      ...[1, 2, 3].map(i => <line key={`${x}-v${i}`} x1={x + 2 + i * 5.5} y1={T + 3} x2={x + 2 + i * 5.5} y2={T + H - 3} {...line} />),
    ])
  } else if (kind === 'multi-year') {
    marks = [L, R].flatMap(x => [1, 2, 3, 4].map(i => (
      <rect key={`${x}-${i}`} x={x + 3} y={T + 3 + (i - 1) * 7} width={W - 6} height={5} rx={0.8} fill="none" {...line} />
    )))
  }
  if (kind === 'binder') {
    return (
      <svg width="52" height="33" viewBox="0 0 64 40" aria-hidden style={{ flexShrink: 0 }}>
        {pages}
        {[1, 2, 3, 4].map(i => <line key={`l${i}`} x1={R + 5} y1={T + 3 + i * 6} x2={R + W - 3} y2={T + 3 + i * 6} {...line} />)}
        {[8, 14, 20, 26, 32].map(y => <ellipse key={`r${y}`} cx={32} cy={y} rx={4.5} ry={1.8} fill="white" stroke={ink} strokeWidth={0.9} />)}
      </svg>
    )
  }
  if (kind === 'cover') {
    // closed planner in a cover: spine, pen loop and a strap
    return (
      <svg width="52" height="33" viewBox="0 0 64 40" aria-hidden style={{ flexShrink: 0 }}>
        <rect x={18} y={4} width={26} height={32} rx={3} fill="white" stroke={ink} strokeWidth={0.9} />
        <line x1={22} y1={4} x2={22} y2={36} stroke={ink} strokeWidth={0.6} />
        <rect x={44} y={14} width={4} height={10} rx={1.5} fill="none" stroke={ink} strokeWidth={0.8} />
        <line x1={46} y1={10} x2={46} y2={30} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={27} y1={11} x2={38} y2={11} stroke={ink} strokeWidth={1.2} />
        <line x1={27} y1={15} x2={35} y2={15} {...line} />
      </svg>
    )
  }
  if (kind === 'calendar') {
    return (
      <svg width="52" height="33" viewBox="0 0 64 40" aria-hidden style={{ flexShrink: 0 }}>
        <path d="M14 36 L22 6 L42 6 L50 36" fill="none" stroke={ink} strokeWidth={0.8} />
        <rect x={18} y={6} width={28} height={24} rx={1.5} {...page} />
        {[1, 2, 3].map(i => <line key={`h${i}`} x1={20} y1={10 + i * 5} x2={44} y2={10 + i * 5} {...line} />)}
        {[1, 2, 3, 4].map(i => <line key={`v${i}`} x1={20 + i * 4.8} y1={12} x2={20 + i * 4.8} y2={28} {...line} />)}
        <line x1={20} y1={9} x2={30} y2={9} stroke={ink} strokeWidth={1.4} />
      </svg>
    )
  }
  return (
    <svg width="52" height="33" viewBox="0 0 64 40" aria-hidden style={{ flexShrink: 0 }}>
      {pages}
      {marks}
    </svg>
  )
}

// ── Product card ────────────────────────────────────────────────────────────
function PlannerImage({ p, src }: { p: Planner2027; src?: string }) {
  const [ok, setOk] = useState(true)
  if (!ok) {
    return (
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: '40px', fontWeight: 300, color: 'var(--tan)', lineHeight: 1 }}>{p.brand.charAt(0)}</span>
        <span style={{ fontFamily: inter, fontSize: '11px', color: 'var(--tan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.brand}</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="p27-img"
      src={src ?? p.image}
      alt={`${p.brand} ${p.name}`}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setOk(false)}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
}

function PlannerCard({ p, ring }: { p: Planner2027; ring: BinderSize | 'all' }) {
  const { t } = useLang()
  const s = t.planners
  const flag = p.country === 'JP' ? '🇯🇵' : '🇰🇷'
  const variants = p.variants ?? []
  const [picked, setPicked] = useState(() => Math.max(0, variants.findIndex(v => v.binderSize === ring)))
  const v: PlannerVariant | undefined = variants[picked]
  const url = v?.url ?? p.url
  const price = v?.price ?? p.price
  const image = v?.image ?? p.image
  const starts = p.dated && p.starts ? (() => {
    const [y, m] = p.starts!.split('-')
    return fill(s.startsLabel, { d: fill(s.monthYear, { y, m: s.months[Number(m) - 1] ?? m }) })
  })() : null

  return (
    <article className="p27-card" style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', border: hairline, display: 'flex', flexDirection: 'column' }}>
      <a href={url} target="_blank" rel="noreferrer" aria-label={`${p.brand} ${p.name} — ${s.brandSite}`}
        style={{ position: 'relative', display: 'block', aspectRatio: '4 / 5', background: 'var(--beige)', overflow: 'hidden' }}>
        <PlannerImage key={image} p={p} src={image} />
        {p.pick && (
          <span style={{ position: 'absolute', top: '10px', left: '10px', fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', background: '#F3E3A1', color: '#7A6010', padding: '4px 10px', borderRadius: '99px' }}>
            ★ {s.pick}
          </span>
        )}
      </a>

      <div className="p27-card-body" style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {flag} {p.brand}
        </div>
        <h3 style={{ fontFamily: fraunces, fontSize: '17px', fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.01em', color: 'var(--dark-brown)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {p.name}
        </h3>
        {p.localName && (
          <div style={{ fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {p.localName}
          </div>
        )}

        <div style={{ fontFamily: inter, fontSize: '11.5px', fontWeight: 400, color: 'var(--brown)', marginTop: '10px', lineHeight: 1.5 }}>
          {[s.formats[p.formats[0]], p.binder ? s.binderTag : null, variants.length ? null : p.sizes.join(' / '), p.formats.includes('cover') ? null : p.dated ? s.dated : s.undated].filter(Boolean).join(' · ')}
        </div>

        {variants.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '5px' }}>
              {fill(p.variantKind === 'option' ? s.optionsCount : s.sizesCount, { n: String(variants.length) })}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {variants.map((x, i) => {
                const on = i === picked
                return (
                  <button key={`${x.size}-${i}`} type="button" onClick={() => setPicked(i)} aria-pressed={on}
                    style={{ fontFamily: inter, fontSize: '11px', fontWeight: on ? 500 : 400, cursor: 'pointer', padding: '3px 9px', borderRadius: '99px', background: on ? 'var(--dark-brown)' : 'white', color: on ? 'var(--cream)' : 'var(--brown)', border: `0.5px solid ${on ? 'var(--dark-brown)' : 'rgba(107,163,200,0.3)'}` }}>
                    {x.size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {p.features.length > 0 && (
          <div className="p27-features" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
            {p.features.slice(0, 3).map(f => (
              <span key={f} style={{ fontFamily: inter, fontSize: '10.5px', fontWeight: 400, color: 'var(--muted-blue)', background: 'var(--beige)', padding: '2px 8px', borderRadius: '99px' }}>
                {s.features[f]}
              </span>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {price && (
              <span style={{ fontFamily: inter, fontSize: '14px', fontWeight: 500, color: 'var(--dark-brown)' }}>
                {v ? formatPrice(price) : fill(s.priceFrom, { p: formatPrice(price) })}
              </span>
            )}
            {starts && <span style={{ fontFamily: inter, fontSize: '10.5px', fontWeight: 300, color: 'var(--tan)' }}>{starts}</span>}
          </div>
          <a href={orderHref(p, v)} className="p27-order"
            style={{ display: 'block', textAlign: 'center', background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: inter, fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em', padding: '10px 12px', borderRadius: '99px', textDecoration: 'none', transition: 'background 0.2s' }}>
            <span className="p27-only-desktop">{s.orderBtn}</span>
            <span className="p27-only-mobile">{s.orderBtnShort}</span>
          </a>
          <a href={url} target="_blank" rel="noreferrer"
            style={{ display: 'block', textAlign: 'center', fontFamily: inter, fontSize: '11.5px', fontWeight: 300, color: 'var(--brown)', textDecoration: 'none', padding: '8px 0 0' }}>
            {v ? fill(s.brandSiteSize, { size: v.size }) : s.brandSite}
          </a>
        </div>
      </div>
    </article>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export function PlannersCatalogue() {
  const { lang, t } = useLang()
  const s = t.planners

  const [layout,  setLayout]  = useState<LayoutKey | 'all'>('all')
  const [country, setCountry] = useState<'all' | 'KR' | 'JP'>('all')
  const [size,    setSize]    = useState<SizeGroup | 'all'>('all')
  const [dated,   setDated]   = useState<'all' | 'dated' | 'undated'>('all')
  const [brand,   setBrand]   = useState('all')
  const [query,   setQuery]   = useState('')
  const [kind,    setKind]    = useState<'all' | 'bound' | 'binder'>('all')
  const [ring,    setRing]    = useState<BinderSize | 'all'>('all')

  // Japanese copy is Korea-only (CLAUDE.md rule 10)
  const items = useMemo(() => PLANNERS_2027.filter(p => lang !== 'ja' || p.country === 'KR'), [lang])
  const effectiveCountry = lang === 'ja' ? 'all' : country

  const brands = useMemo(() => {
    const pool = effectiveCountry === 'all' ? items : items.filter(p => p.country === effectiveCountry)
    return Array.from(new Set(pool.map(p => p.brand))).sort((a, b) => a.localeCompare(b))
  }, [items, effectiveCountry])

  const layoutsAvailable = LAYOUTS.filter(k => items.some(p => p.formats.some(f => layoutOf(f) === k)))
  const hasBinders = items.some(p => p.binder)
  const ringsAvailable = RING_SIZES.filter(r => items.some(p => p.binder && p.variants?.some(v => v.binderSize === r)))
  const binderMode = kind === 'binder'
  function chooseKind(k: 'all' | 'bound' | 'binder') { setKind(k); setRing('all'); if (k === 'binder') setSize('all') }

  const q = query.trim().toLowerCase()
  const filtered = items.filter(p => {
    if (layout !== 'all' && !p.formats.some(f => layoutOf(f) === layout)) return false
    if (effectiveCountry !== 'all' && p.country !== effectiveCountry) return false
    if (kind === 'binder' && !p.binder) return false
    if (kind === 'bound' && (p.binder || p.formats.includes('cover'))) return false
    if (binderMode && ring !== 'all' && !p.variants?.some(v => v.binderSize === ring)) return false
    if (!binderMode && size !== 'all' && p.sizeGroup !== size) return false
    if (dated !== 'all' && p.dated !== (dated === 'dated')) return false
    if (brand !== 'all' && p.brand !== brand) return false
    if (q && !`${p.brand} ${p.name} ${p.localName ?? ''} ${p.sizes.join(' ')}`.toLowerCase().includes(q)) return false
    return true
  })

  const anyFilter = layout !== 'all' || effectiveCountry !== 'all' || size !== 'all' || dated !== 'all' || brand !== 'all' || q !== '' || kind !== 'all' || ring !== 'all'
  function clearAll() { setLayout('all'); setCountry('all'); setSize('all'); setDated('all'); setBrand('all'); setQuery(''); setKind('all'); setRing('all') }

  // Header photos: a Korean pick, a Japanese pick and an Ashford binder refill (front).
  // In JA mode the Japanese ones are filtered out of `items`, so Korean picks fill the gaps.
  const collage = useMemo(() => {
    const chosen = COLLAGE_IDS.map(id => items.find(p => p.id === id)).filter(Boolean) as Planner2027[]
    const fill = items.filter(p => p.pick && !p.binder && p.country === 'KR' && !chosen.includes(p))
    return [...chosen, ...fill].slice(0, 3)
  }, [items])

  return (
    <>
      {/* Header — what · why us · what to do */}
      <div className="p27-head" style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '56px', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <div style={{ fontFamily: inter, fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/brands" style={{ color: 'var(--tan)', textDecoration: 'none' }}>{s.back}</Link>
            <span style={{ color: 'rgba(168,203,224,0.5)' }}>·</span>
            <span>{s.eyebrow}</span>
          </div>
          <h1 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '18px' }}>
            {s.title1} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.titleEm}</em>
          </h1>
          <p style={{ fontFamily: inter, fontSize: '16px', fontWeight: 300, color: 'rgba(45,55,72,0.75)', lineHeight: 1.7, maxWidth: '520px', marginBottom: '24px' }}>
            {s.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '22px' }}>
            <a href="/order/new" className="p27-order" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: inter, fontSize: '13px', fontWeight: 500, padding: '13px 26px', borderRadius: '99px', textDecoration: 'none', transition: 'background 0.2s' }}>
              {s.ctaPrimary}
            </a>
            <a href="#p27-how" style={{ border: '0.5px solid rgba(107,163,200,0.3)', color: 'var(--brown)', fontFamily: inter, fontSize: '13px', fontWeight: 400, padding: '13px 24px', borderRadius: '99px', textDecoration: 'none' }}>
              {s.ctaSecondary}
            </a>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[s.trust1, s.trust2, s.trust3].map(x => (
              <span key={x} style={{ fontFamily: inter, fontSize: '12px', fontWeight: 400, color: 'var(--muted-blue)', background: 'var(--beige)', padding: '6px 12px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#BFDCCF', display: 'inline-block' }} />
                {x}
              </span>
            ))}
          </div>
        </div>

        {/* Photo collage — product photos visible in the first viewport */}
        {collage.length > 0 && (
          <div className="p27-collage" style={{ position: 'relative', height: '380px' }}>
            {collage.map((p, i) => (
              <a key={p.id} href={p.url} target="_blank" rel="noreferrer" className="p27-collage-item"
                style={{
                  position: 'absolute', width: '46%', aspectRatio: '4 / 5', borderRadius: '16px', overflow: 'hidden',
                  background: 'var(--beige)', border: '4px solid white', boxShadow: '0 12px 40px rgba(45,55,72,0.12)',
                  left: ['2%', '52%', '27%'][i], top: ['2%', '0%', '28%'][i], transform: `rotate(${[-5, 4, -1][i]}deg)`, zIndex: [1, 2, 3][i],
                }}>
                <PlannerImage p={p} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Which layout are you? */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          {s.layoutTitle}
        </div>
        <div className="p27-tiles" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
          {layoutsAvailable.map(k => {
            const active = layout === k
            return (
              <button key={k} type="button" className="p27-tile" onClick={() => setLayout(active ? 'all' : k)}
                style={{ minWidth: 0, textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: '14px', background: active ? 'var(--beige)' : 'white', border: `0.5px solid ${active ? 'var(--dark-blue)' : 'rgba(107,163,200,0.2)'}`, display: 'flex', alignItems: 'center', gap: '10px', transition: 'border-color 0.15s' }}>
                <LayoutIcon kind={k} active={active} />
                <span>
                  <span style={{ display: 'block', fontFamily: inter, fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)' }}>{s.formats[k]}</span>
                  <span style={{ display: 'block', fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'rgba(45,55,72,0.6)', marginTop: '2px' }}>{s.formatHints[k]}</span>
                </span>
              </button>
            )
          })}
          {hasBinders && (
            <button type="button" className="p27-tile" onClick={() => chooseKind(binderMode ? 'all' : 'binder')}
              style={{ minWidth: 0, textAlign: 'left', cursor: 'pointer', padding: '12px', borderRadius: '14px', background: binderMode ? 'var(--beige)' : 'white', border: `0.5px solid ${binderMode ? 'var(--dark-blue)' : 'rgba(107,163,200,0.2)'}`, display: 'flex', alignItems: 'center', gap: '10px', transition: 'border-color 0.15s' }}>
              <LayoutIcon kind="binder" active={binderMode} />
              <span>
                <span style={{ display: 'block', fontFamily: inter, fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)' }}>{s.binderTile}</span>
                <span style={{ display: 'block', fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'rgba(45,55,72,0.6)', marginTop: '2px' }}>{s.binderHint}</span>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Sticky filter bar */}
      <div className="p27-filterbar" style={{ position: 'sticky', top: '62px', zIndex: 50, background: 'rgba(248,248,246,0.94)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', padding: '12px 0', marginBottom: '20px', borderBottom: '0.5px solid rgba(107,163,200,0.2)' }}>
        <div className="p27-filters" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {lang !== 'ja' && ([
            ['all', s.countryAll], ['KR', s.countryKR], ['JP', s.countryJP],
          ] as const).map(([v, label]) => (
            <button key={v} type="button" style={tabStyle(country === v)} onClick={() => { setCountry(v); setBrand('all') }}>{label}</button>
          ))}

          <select aria-label={s.layoutTitle} value={layout} onChange={e => setLayout(e.target.value as LayoutKey | 'all')} style={selectStyle(layout !== 'all')}>
            <option value="all">{s.layoutAll}</option>
            {layoutsAvailable.map(k => <option key={k} value={k}>{s.formats[k]}</option>)}
          </select>
          {hasBinders && (
            <select aria-label={s.typeAll} value={kind} onChange={e => chooseKind(e.target.value as 'all' | 'bound' | 'binder')} style={selectStyle(kind !== 'all')}>
              <option value="all">{s.typeAll}</option>
              <option value="bound">{s.typeBound}</option>
              <option value="binder">{s.typeBinder}</option>
            </select>
          )}
          {binderMode ? (
            <select aria-label={s.ringAll} value={ring} onChange={e => setRing(e.target.value as BinderSize | 'all')} style={selectStyle(ring !== 'all')}>
              <option value="all">{s.ringAll}</option>
              {ringsAvailable.map(r => <option key={r} value={r}>{s.ringSizes[r]}</option>)}
            </select>
          ) : (
            <select aria-label={s.sizeAll} value={size} onChange={e => setSize(e.target.value as SizeGroup | 'all')} style={selectStyle(size !== 'all')}>
              <option value="all">{s.sizeAll}</option>
              {SIZES.map(k => <option key={k} value={k}>{s.sizes[k]}</option>)}
            </select>
          )}
          <select aria-label={s.datedAll} value={dated} onChange={e => setDated(e.target.value as 'all' | 'dated' | 'undated')} style={selectStyle(dated !== 'all')}>
            <option value="all">{s.datedAll}</option>
            <option value="dated">{s.dated}</option>
            <option value="undated">{s.undated}</option>
          </select>
          <select aria-label={s.brandAll} value={brand} onChange={e => setBrand(e.target.value)} style={selectStyle(brand !== 'all')}>
            <option value="all">{s.brandAll}</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder={s.searchPlaceholder}
            style={{ fontFamily: inter, fontSize: '12px', fontWeight: 300, padding: '8px 16px', borderRadius: '99px', border: '0.5px solid rgba(107,163,200,0.25)', background: 'white', color: 'var(--dark-brown)', outline: 'none', minWidth: '160px', flex: '0 1 200px' }} />

          <span style={{ fontFamily: inter, fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginLeft: 'auto', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {filtered.length} {s.countSuffix}
            {anyFilter && (
              <button type="button" onClick={clearAll} style={{ marginLeft: '10px', fontFamily: inter, fontSize: '12px', fontWeight: 400, color: 'var(--dark-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                {s.clear}
              </button>
            )}
          </span>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: '17px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
          {s.empty}
        </div>
      ) : (
        <div className="p27-grid">
          {filtered.map(p => <PlannerCard key={`${p.id}-${ring}`} p={p} ring={ring} />)}
        </div>
      )}

      <p style={{ fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'var(--tan)', lineHeight: 1.7, marginTop: '28px', maxWidth: '720px' }}>
        {s.credit}
      </p>

      {/* How it works / CTA */}
      <section id="p27-how" style={{ marginTop: '72px', background: 'var(--dark-brown)', borderRadius: '24px', padding: 'clamp(32px, 5vw, 56px)', scrollMarginTop: '90px' }}>
        <div style={{ fontFamily: inter, fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,248,246,0.45)', marginBottom: '14px' }}>
          {s.howEyebrow}
        </div>
        <h2 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(30px, 3.6vw, 46px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--cream)', marginBottom: '32px' }}>
          {s.howTitle} <em style={{ fontStyle: 'italic', color: '#F3E3A1' }}>{s.howTitleEm}</em>
        </h2>
        <div className="p27-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
          {([[s.step1Title, s.step1Body], [s.step2Title, s.step2Body], [s.step3Title, s.step3Body]] as const).map(([title, body], i) => (
            <div key={title} className="ostep-card" style={{ background: 'rgba(248,248,246,0.04)', border: '0.5px solid rgba(248,248,246,0.1)', borderRadius: '16px', padding: '20px 22px', transition: 'background 0.2s' }}>
              <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: '22px', fontWeight: 300, color: '#F3E3A1', marginBottom: '8px' }}>0{i + 1}</div>
              <div style={{ fontFamily: inter, fontSize: '14px', fontWeight: 500, color: 'var(--cream)', marginBottom: '6px' }}>{title}</div>
              <div style={{ fontFamily: inter, fontSize: '13px', fontWeight: 300, color: 'rgba(248,248,246,0.6)', lineHeight: 1.7 }}>{body}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="/order/new" className="btn-gold-order">{s.howCta}</a>
          <a href="/brands" className="btn-ghost-order">{s.howCta2}</a>
        </div>
      </section>
    </>
  )
}
