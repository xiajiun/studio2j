'use client'

export const runtime = 'edge'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const BRANDS: { name: string; korean?: string; instagram?: string; image?: string; url?: string; country?: string; category: string }[] = [
  // TODO: populate with brands from dotdotexpress
]

const CATEGORIES = [...new Set(BRANDS.map(b => b.category))]

function BrandIcon({ brand }: { brand: typeof BRANDS[0] }) {
  const [ok, setOk] = useState(true)
  const src = brand.image ?? (brand.url ? `https://www.google.com/s2/favicons?domain=${brand.url}&sz=128` : null)
  return (
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--beige)', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {src && ok ? (
        <img src={src} alt={brand.name} onError={() => setOk(false)} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', fontWeight: 300, color: 'var(--tan)' }}>
          {brand.name.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default function DotDotExpressCataloguePage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
              <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
              <span>Seoul Illustration Market</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              dot.dot.<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>express</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
              Seoul · Illustration &amp; stationery market
            </p>
            {BRANDS.length > 0 && (
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
                {BRANDS.length} participating brands
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Order from this fair →
              </a>
              <a href="https://www.instagram.com/dot.dot.dot.express/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
                @dot.dot.dot.express ↗
              </a>
            </div>
          </div>

          {/* Brands */}
          {BRANDS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
                Brand list coming soon.
              </p>
            </div>
          ) : (
            CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom: '56px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                  {cat}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                  {BRANDS.filter(b => b.category === cat).map(b => (
                    <div key={b.name} style={{ background: 'white', borderRadius: '14px', padding: '14px 16px', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <BrandIcon brand={b} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)', lineHeight: 1.3 }}>
                          {b.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                          {b.url && (
                            <a href={`https://${b.url}`} target="_blank" rel="noreferrer"
                              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>
                              {b.url} ↗
                            </a>
                          )}
                          {!b.url && b.instagram && (
                            <a href={`https://www.instagram.com/${b.instagram}/`} target="_blank" rel="noreferrer"
                              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>
                              Instagram ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>
                        {b.country === 'JP' ? '🇯🇵' : b.country === 'INTL' ? '🌍' : '🇰🇷'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
