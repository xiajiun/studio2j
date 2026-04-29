'use client'

import { useState } from 'react'
import type { TwentyMarket } from '@/lib/database.types'

function fmtRange(st: number, ed: number) {
  const s = new Date(st).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const e = new Date(ed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  return `${s} – ${e}`
}

function MarketCard({ m }: { m: TwentyMarket }) {
  const [imgOk, setImgOk] = useState(true)
  const url    = `https://twenty.style/m/${m.sellerPublicId}/${m.marketPublicId}`
  const imgSrc = `https://cdn.twenty.style/${m.marketCover}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'var(--cream)', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.1)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      className="twenty-market-card"
    >
      {/* Cover image */}
      <div style={{ width: '100%', aspectRatio: '1', background: 'var(--beige)', overflow: 'hidden' }}>
        {imgOk ? (
          <img
            src={imgSrc}
            alt={m.marketTitle}
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
          {m.marketTitle}
        </div>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
          {m.sellerInfoName}
        </div>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '2px' }}>
          {fmtRange(m.marketST, m.marketED)}
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

export default function TwentyMarketsSection({ markets, standalone = false }: { markets: TwentyMarket[]; standalone?: boolean }) {
  if (markets.length === 0) return (
    <section style={{ background: 'var(--beige)', padding: standalone ? '160px 0' : '100px 0', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>No markets open right now — check back soon.</p>
    </section>
  )

  return (
    <section id="twenty-markets" style={{ background: 'var(--beige)', padding: standalone ? '120px 0 100px' : '100px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
            Korean illustrator markets
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', margin: 0 }}>
              Open now on <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>Twenty</em>
            </h2>
            <a
              href="https://twenty.style/list/openMarket"
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--brown)', textDecoration: 'none', border: '0.5px solid rgba(122,92,69,0.25)', padding: '10px 20px', borderRadius: '99px', whiteSpace: 'nowrap' }}
            >
              See all on Twenty ↗
            </a>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
          {markets.map(m => <MarketCard key={m.marketUID} m={m} />)}
        </div>

        {/* Footer note */}
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginTop: '32px', textAlign: 'center' }}>
          Want something from these markets? <a href="/order/new" style={{ color: 'var(--dark-blue)', textDecoration: 'none', fontWeight: 400 }}>Send us the link →</a>
        </p>
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
