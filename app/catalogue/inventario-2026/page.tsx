export const runtime = 'edge'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Brand list — add brands here once confirmed
// Format: { name: string; instagram?: string; category?: string }
const BRANDS: { name: string; instagram?: string; category?: string }[] = [
  // TODO: populate with brands from https://inventario.kr/#brand-list
]

export default function InventarioCataloguePage() {
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
              <span>Seoul Illustration Fair</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              INVENTARIO <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2026</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '32px' }}>
              April 23–26, 2026 · COEX, Seoul · Illustration &amp; stationery fair
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Place an order →
              </a>
              <a href="https://inventario.kr" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
                Official site ↗
              </a>
            </div>
          </div>

          {/* Brand grid */}
          {BRANDS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
                Brand list coming soon.
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '24px', paddingBottom: '12px', borderTop: '0.5px solid rgba(122,92,69,0.1)', paddingTop: '24px' }}>
                {BRANDS.length} participating brands
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {BRANDS.map(b => (
                  <div key={b.name} style={{ background: 'white', borderRadius: '14px', padding: '20px', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em' }}>
                      {b.name}
                    </div>
                    {b.category && (
                      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--tan)', letterSpacing: '0.04em' }}>
                        {b.category}
                      </span>
                    )}
                    {b.instagram && (
                      <a href={`https://www.instagram.com/${b.instagram.replace('@', '')}/`} target="_blank" rel="noreferrer"
                        style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(31,58,95,0.06)', padding: '4px 10px', borderRadius: '99px', alignSelf: 'flex-start' }}>
                        @{b.instagram.replace('@', '')} ↗
                      </a>
                    )}
                    <a href="/order/new" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--brown)', textDecoration: 'none', marginTop: 'auto' }}>
                      Order from this brand →
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
