'use client'

import { useLang } from '@/components/LangProvider'

const inter = 'var(--font-inter), sans-serif'
const fraunces = 'var(--font-fraunces), serif'
const BODY = 'rgba(45,55,72,0.75)'

const icon = (stroke: string, path: React.ReactNode) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">{path}</svg>
)

export default function Services() {
  const { t } = useLang()
  const s = t.services

  const cards = [
    {
      num: '01', featured: true, href: '/order/new', external: false,
      title: s.s1Title, em: s.s1Em, body: s.s1Body, best: s.s1Best, val: s.s1Val, cta: s.s1Cta,
      path: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    },
    {
      num: '02', featured: false, href: '/#tracker', external: false,
      title: s.s2Title, em: s.s2Em, body: s.s2Body, best: s.s2Best, val: s.s2Val, cta: s.s2Cta,
      path: <><path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" /><polyline points="3 9 12 15 21 9" /></>,
    },
    {
      num: '03', featured: false, href: 'https://www.instagram.com/studio2j25/', external: true,
      title: s.s3Title, em: s.s3Em, body: s.s3Body, best: s.s3Best, val: s.s3Val, cta: s.s3Cta,
      path: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />,
    },
  ]

  return (
    <section id="services" className="services-section" style={{ padding: '120px 0 64px', background: 'var(--cream)' }}>
      <div className="container">
        <div className="service-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'end', marginBottom: '48px' }}>
          <div>
            <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />{s.eyebrow}
            </div>
            <h2 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(38px, 4.2vw, 58px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--dark-brown)' }}>
              {s.title1}<br /><em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{s.titleEm}</em>
            </h2>
          </div>
          <p style={{ fontFamily: inter, fontSize: '16px', fontWeight: 300, lineHeight: 1.75, color: BODY, maxWidth: '480px' }}>{s.intro}</p>
        </div>

        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {cards.map(c => {
            const dark = c.featured
            return (
              <a key={c.num} href={c.href} target={c.external ? '_blank' : undefined} rel={c.external ? 'noreferrer' : undefined}
                className="service-card"
                style={{
                  position: 'relative', display: 'flex', flexDirection: 'column', textDecoration: 'none',
                  background: dark ? 'var(--dark-brown)' : 'white',
                  border: `0.5px solid ${dark ? 'var(--dark-brown)' : 'rgba(107,163,200,0.2)'}`,
                  borderRadius: '22px', padding: '32px 30px 28px',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: dark ? 'rgba(248,248,246,0.08)' : 'rgba(107,163,200,0.1)' }}>
                    {icon(dark ? '#A8CBE0' : '#4A8AB5', c.path)}
                  </div>
                  {dark ? (
                    <span style={{ fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', background: '#F3E3A1', color: 'var(--dark-brown)', padding: '5px 11px', borderRadius: '99px' }}>{s.popular}</span>
                  ) : (
                    <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: '30px', color: 'rgba(107,163,200,0.35)', lineHeight: 1 }}>{c.num}</span>
                  )}
                </div>
                <h3 style={{ fontFamily: fraunces, fontWeight: 400, fontSize: '28px', lineHeight: 1.15, letterSpacing: '-0.02em', color: dark ? 'var(--cream)' : 'var(--dark-brown)', marginBottom: '12px' }}>
                  {c.title} <em style={{ fontStyle: 'italic', color: dark ? 'var(--tan)' : 'var(--dark-blue)' }}>{c.em}</em>
                </h3>
                <p style={{ fontFamily: inter, fontSize: '14.5px', fontWeight: 300, lineHeight: 1.7, color: dark ? 'rgba(248,248,246,0.72)' : BODY, flex: 1 }}>{c.body}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', borderTop: `0.5px solid ${dark ? 'rgba(248,248,246,0.14)' : 'rgba(107,163,200,0.2)'}`, marginTop: '24px', paddingTop: '16px' }}>
                  <span style={{ fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: dark ? 'rgba(248,248,246,0.45)' : 'var(--tan)' }}>{c.best}</span>
                  <span style={{ fontFamily: fraunces, fontStyle: 'italic', fontSize: '15px', color: dark ? 'var(--tan)' : 'var(--dark-blue)', textAlign: 'right' }}>{c.val}</span>
                </div>
                <span style={{ marginTop: '18px', fontFamily: inter, fontSize: '13px', fontWeight: 500, color: dark ? '#F3E3A1' : 'var(--dark-blue)' }}>{c.cta}</span>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
