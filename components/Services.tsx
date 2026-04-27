'use client'

import { useLang } from '@/components/LangProvider'

export default function Services() {
  const { t } = useLang()
  const s = t.services

  return (
    <section id="services" className="services-section" style={{ padding: '140px 0', background: 'var(--beige)' }}>
      <div className="container">
        <div className="service-head" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'end', marginBottom: '80px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />{s.eyebrow}
            </div>
            <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(42px, 4.5vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)' }}>
              {s.title1}<br />{s.title2}<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{s.titleEm}</em>
            </h2>
          </div>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)' }}>{s.intro}</p>
        </div>

        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          <ServiceCard num="01" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>}
            title={<>{s.s1Title} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.s1Em}</em></>}
            body={s.s1Body} detailLabel={s.s1Best} detailVal={s.s1Val} />
          <ServiceCard num="02" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.4"><path d="M3 9l9-6 9 6v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z"/><polyline points="3 9 12 15 21 9"/></svg>}
            title={<>{s.s2Title} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.s2Em}</em></>}
            body={s.s2Body} detailLabel={s.s2Best} detailVal={s.s2Val} />
          <ServiceCard num="03" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.4"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            title={<>{s.s3Title} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.s3Em}</em></>}
            body={s.s3Body} detailLabel={s.s3Best} detailVal={s.s3Val} />
        </div>

        <div className="fee-note" style={{ background: 'var(--dark-brown)', color: 'var(--cream)', padding: '40px 48px', borderRadius: '20px', marginTop: '56px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '20px', color: 'var(--tan)' }}>{s.feeLabel}</div>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(245,239,230,0.8)' }}>{s.feeText}</p>
        </div>
      </div>
    </section>
  )
}

function ServiceCard({ num, icon, title, body, detailLabel, detailVal }: { num: string; icon: React.ReactNode; title: React.ReactNode; body: string; detailLabel: string; detailVal: string }) {
  return (
    <div className="svc-card" style={{ background: 'var(--cream)', borderRadius: '20px', padding: '48px 36px', position: 'relative', transition: 'all 0.3s ease', border: '0.5px solid transparent' }}>
      <div style={{ position: 'absolute', top: '36px', right: '36px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '44px', color: 'var(--beige)', lineHeight: 1 }}>{num}</div>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--beige)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '28px', border: '0.5px solid rgba(122,92,69,0.1)' }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 400, fontSize: '26px', color: 'var(--dark-brown)', marginBottom: '14px', letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)', marginBottom: '24px' }}>{body}</p>
      <div style={{ paddingTop: '20px', borderTop: '0.5px solid rgba(122,92,69,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{detailLabel}</span>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 400, fontSize: '15px', color: 'var(--dark-blue)' }}>{detailVal}</span>
      </div>
    </div>
  )
}
