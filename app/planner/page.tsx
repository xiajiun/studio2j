export const runtime = 'edge'

import Link from 'next/link'
import { STAFF_PICKS, BY_CATEGORY } from '@/lib/planner'

export const metadata = { title: 'Finding Your 2026 Planner — Studio2J' }

export default function PlannerPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Nav */}
      <div style={{ padding: '20px 48px', borderBottom: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          </span>
        </Link>
        <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '10px 22px', borderRadius: '99px', textDecoration: 'none' }}>
          Place an order
        </Link>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '80px 48px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '100px' }} className="planner-hero">
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
              2026 planner guide
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 4.5vw, 58px)', color: 'var(--dark-brown)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '24px' }}>
              Finding your<br />perfect <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2026</em> system.
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '32px', maxWidth: '440px' }}>
              Your planner is your second brain. Whether you need the structured logic of Laconic or the creative freedom of Hobonichi, we&apos;ve broken down the best options from Korea and Japan.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '13px 28px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Order any planner →
              </Link>
              <Link href="/brands" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '13px 28px', borderRadius: '99px', textDecoration: 'none' }}>
                Browse all brands
              </Link>
            </div>
          </div>

          {/* Hero photo — replace with your own */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--beige)' }}>
            <img
              src={`https://hclclmdfcswdrdpqtyyl.supabase.co/storage/v1/object/public/photo/hobonichi-hero.jpg`}
              alt="Hobonichi Techo open to handwritten journal pages"
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.08) contrast(1.05)' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        </div>
      </div>

      {/* Staff picks */}
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 48px 100px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '56px' }}>
          Staff picks — by Jo
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {STAFF_PICKS.map((pick, i) => (
            <div
              key={pick.name}
              style={{
                display: 'grid',
                gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
                gap: '80px',
                alignItems: 'center',
                padding: '72px 0',
                borderBottom: '0.5px solid rgba(122,92,69,0.1)',
              }}
              className="planner-row"
            >
              {/* Photo */}
              <div style={{ order: i % 2 === 0 ? 0 : 1, borderRadius: '18px', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--beige)', boxShadow: '0 8px 40px rgba(31,58,95,0.08)' }}>
                <img
                  src={pick.photo}
                  alt={pick.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.1) contrast(1.04)' }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement
                    el.parentElement!.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--font-fraunces),serif;font-style:italic;font-size:16px;color:var(--tan);">Photo coming soon</div>`
                  }}
                />
              </div>

              {/* Text */}
              <div style={{ order: i % 2 === 0 ? 1 : 0 }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px' }}>
                  {pick.region} · curated by {pick.curatedBy}
                </div>
                <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 400, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {pick.name}
                </h2>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '20px' }}>
                  {pick.subtitle}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '12px' }}>
                  Best for: {pick.bestFor}
                </div>
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '28px', maxWidth: '440px' }}>
                  {pick.description}
                </p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
                  {pick.tags.map(t => (
                    <span key={t} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, padding: '4px 12px', borderRadius: '99px', background: 'var(--beige)', color: 'var(--brown)', letterSpacing: '0.03em' }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                    Order this planner →
                  </Link>
                  <a href={pick.url} target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.2)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, padding: '11px 22px', borderRadius: '99px', textDecoration: 'none' }}>
                    Browse on site ↗︎
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Full selection by category */}
        <div style={{ marginTop: '100px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '48px' }}>
            The full selection
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }} className="planner-selection">
            {/* Japan */}
            <div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '24px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🇯🇵</span> Japan
              </div>
              {Object.entries(BY_CATEGORY.japan).map(([cat, brands]) => (
                <div key={cat} style={{ marginBottom: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {brands.map(b => (
                      <Link key={b} href="/order/new" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', textDecoration: 'none', padding: '6px 0', borderBottom: '0.5px solid rgba(122,92,69,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {b}
                        <span style={{ fontSize: '12px', color: 'var(--tan)' }}>Order →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Korea */}
            <div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '24px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🇰🇷</span> Korea
              </div>
              {Object.entries(BY_CATEGORY.korea).map(([cat, brands]) => (
                <div key={cat} style={{ marginBottom: '24px' }}>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {brands.map(b => (
                      <Link key={b} href="/order/new" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', textDecoration: 'none', padding: '6px 0', borderBottom: '0.5px solid rgba(122,92,69,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {b}
                        <span style={{ fontSize: '12px', color: 'var(--tan)' }}>Order →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: '80px', background: 'var(--dark-blue)', borderRadius: '20px', padding: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '28px', color: 'var(--cream)', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Ready to order? <em style={{ fontStyle: 'italic', color: 'var(--tan)' }}>Send us the link.</em>
            </div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'rgba(245,239,230,0.6)', lineHeight: 1.7 }}>
              We&apos;ll handle everything — purchase, packing, and worldwide shipping.
            </p>
          </div>
          <Link href="/order/new" style={{ background: 'var(--tan)', color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '15px 32px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
            Place an order →
          </Link>
        </div>
      </div>

    </main>
  )
}
