'use client'

import { useLang } from '@/components/LangProvider'

const ink = '#6BA3C8'
const ICONS = [
  // quote / reply
  <svg key="q" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /><path d="M8 9h8M8 13h5" /></svg>,
  // invoice
  <svg key="i" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.4"><path d="M6 2h9l5 5v15H6z" /><path d="M14 2v6h6M9 13h7M9 17h7" /></svg>,
  // refund
  <svg key="r" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.4"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 3v6h6" /><path d="M12 8v8M9.5 10.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4" /></svg>,
  // tracked parcel
  <svg key="t" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ink} strokeWidth="1.4"><path d="M21 8l-9-5-9 5v8l9 5 9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>,
]

export default function TrustStrip() {
  const { t } = useLang()
  const s = t.trust
  const items = [
    [s.t1Title, s.t1Body], [s.t2Title, s.t2Body], [s.t3Title, s.t3Body], [s.t4Title, s.t4Body],
  ] as const

  return (
    <section className="trust-section" style={{ background: 'var(--cream)', padding: '64px 0 56px', borderBottom: '0.5px solid rgba(107,163,200,0.15)' }}>
      <div className="container">
        <div className="trust-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '28px' }}>
          {items.map(([title, body], i) => (
            <div key={title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'rgba(107,163,200,0.08)', border: '0.5px solid rgba(107,163,200,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {ICONS[i]}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em', marginBottom: '4px' }}>{title}</div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, lineHeight: 1.65, color: 'rgba(45,55,72,0.75)' }}>{body}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 20px', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '0.5px solid rgba(107,163,200,0.15)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: 'var(--tan)' }}>
          <span><span style={{ fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '10px', marginRight: '8px' }}>{s.payLabel}</span><span style={{ color: 'var(--brown)' }}>{s.payMethods}</span></span>
          <span><span style={{ fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '10px', marginRight: '8px' }}>{s.shipLabel}</span><span style={{ color: 'var(--brown)' }}>{s.shipMethods}</span></span>
          <a href="/policy" style={{ color: 'var(--dark-blue)', textDecoration: 'none', marginLeft: 'auto' }}>{s.policyLink}</a>
        </div>
      </div>
    </section>
  )
}
