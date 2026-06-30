'use client'

import { useState } from 'react'
import type { TwentyMarket } from '@/lib/database.types'
import { useLang } from '@/components/LangProvider'

function fmtRange(st: number, ed: number) {
  const s = new Date(st).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const e = new Date(ed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${s} – ${e}`
}

function MarketCard({ m }: { m: TwentyMarket }) {
  const [imgOk, setImgOk] = useState(true)
  const url    = `https://twenty.style/m/${m.seller_public_id}/${m.market_public_id}`
  const imgSrc = m.market_cover

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--cream)', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(107,163,200,0.15)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      className="twenty-market-card"
    >
      {/* Cover image */}
      <div style={{ width: '100%', aspectRatio: '1', background: 'var(--cream)', overflow: 'hidden' }}>
        {imgOk ? (
          <img
            src={imgSrc}
            alt={m.market_name}
            onError={() => setImgOk(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--tan)' }}>Twenty Style</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
          {m.market_name}
        </div>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
          {m.seller_name}
        </div>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '2px' }}>
          {fmtRange(parseInt(m.market_started_at), parseInt(m.market_ended_at))}
        </div>
        <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--dark-blue)' }}>
            Shop now ↗
          </span>
        </div>
      </div>
    </a>
  )
}

export default function TwentyMarketsSection({ markets: rawMarkets, standalone = false, maxItems }: { markets: TwentyMarket[]; standalone?: boolean; maxItems?: number }) {
  const { t } = useLang()
  const m = t.markets
  const markets = rawMarkets.filter(x => !x.market_name.includes('테스트'))

  if (markets.length === 0) return (
    <section style={{ background: 'var(--cream)', padding: standalone ? '160px 0' : '100px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>{m.empty}</p>
    </section>
  )

  return (
    <section id="twenty-markets" style={{ background: 'var(--cream)', padding: standalone ? '120px 0 100px' : '100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
            <span className="live-dot" />{m.eyebrow}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', margin: 0 }}>
              {m.title}<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{m.titleEm}</em>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {(maxItems ? markets.slice(0, maxItems) : markets).map(x => <MarketCard key={x.market_id} m={x} />)}
        </div>

        {/* See all button */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <a href="/markets" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--cream)', textDecoration: 'none', background: 'var(--dark-blue)', padding: '11px 28px', borderRadius: '99px', whiteSpace: 'nowrap', display: 'inline-block', border: 'none' }}>
            {m.seeAll}
          </a>
        </div>
      </div>

      <style jsx>{`
        .twenty-market-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(31,58,95,0.08) !important;
        }
      `}</style>
    </section>
  )
}
