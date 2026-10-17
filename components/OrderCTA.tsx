'use client'

import { useLang } from '@/components/LangProvider'

// Closing call-to-action: a dark navy card on the page background (no full-width dark band)
export default function OrderCTA() {
  const { t } = useLang()
  const o = t.order

  return (
    <section id="order" className="order-section" style={{ background: 'var(--cream)', padding: '40px 0 112px' }}>
      <div className="container">
        <div className="order-card" style={{
          // dark slate with a soft sky glow from the top → reads as navy, stays within the palette
          background: 'radial-gradient(120% 140% at 50% 0%, rgba(74,138,181,0.32) 0%, rgba(74,138,181,0) 60%), var(--dark-brown)',
          borderRadius: '28px',
          padding: 'clamp(44px, 6vw, 76px) clamp(24px, 5vw, 64px)',
          textAlign: 'center',
          boxShadow: '0 24px 60px rgba(45,55,72,0.18)',
        }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--tan)', marginBottom: '18px', display: 'inline-flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ width: '32px', height: '0.5px', background: 'rgba(168,203,224,0.6)', display: 'inline-block' }} />
            {o.eyebrow}
            <span style={{ width: '32px', height: '0.5px', background: 'rgba(168,203,224,0.6)', display: 'inline-block' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 4.8vw, 66px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--cream)', marginBottom: '18px' }}>
            {o.title1} <em style={{ fontStyle: 'italic', color: 'var(--tan)' }}>{o.titleEm}</em>
          </h2>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(248,248,246,0.68)', maxWidth: '520px', margin: '0 auto 32px' }}>{o.body}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/order/new" className="btn-gold-order">{o.cta1}</a>
            <a href="https://www.instagram.com/studio2j25/" target="_blank" rel="noreferrer" className="btn-ghost-order">{o.cta2}</a>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '22px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12.5px', color: 'rgba(248,248,246,0.6)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#BFDCCF', display: 'inline-block', flexShrink: 0 }} />
            {t.hero.reassure}
          </div>
        </div>
      </div>
    </section>
  )
}
