'use client'

import { useState } from 'react'
import { useLang } from '@/components/LangProvider'

export default function FAQ() {
  const { t } = useLang()
  const f = t.faq
  const [open, setOpen] = useState<Record<string, boolean>>({})

  const CATEGORIES = [
    { title: f.cat1, items: [
      { q: f.q1, a: <>{f.a1} <a href="/order/new" style={{ color: 'var(--dark-blue)' }}>order form</a>.</> },
      { q: f.q2, a: f.a2 },
      { q: f.q3, a: f.a3 },
      { q: f.q4, a: f.a4 },
    ]},
    { title: f.cat2, items: [
      { q: f.q5, a: f.a5 },
      { q: f.q6, a: f.a6 },
      { q: f.q7, a: f.a7 },
      { q: f.q8, a: f.a8 },
    ]},
    { title: f.cat3, items: [
      { q: f.q9,  a: f.a9  },
      { q: f.q10, a: f.a10 },
      { q: f.q11, a: f.a11 },
    ]},
    { title: f.cat4, items: [
      { q: f.q12, a: f.a12 },
      { q: f.q13, a: f.a13 },
    ]},
  ]

  function toggle(key: string) { setOpen(prev => ({ ...prev, [key]: !prev[key] })) }

  return (
    <section id="faq" className="faq-section" style={{ padding: '140px 0', background: 'var(--cream)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginLeft: 'auto' }} />{f.eyebrow}
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginRight: 'auto' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(42px, 4.5vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)' }}>
            {f.title1}<br />{f.title2}<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{f.titleEm}</em>
          </h2>
        </div>

        <div id="order-form-modal" style={{ maxWidth: '820px', margin: '0 auto' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.title} style={{ marginBottom: '56px' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 400, fontSize: '20px', color: 'var(--dark-blue)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '0.5px solid rgba(122,92,69,0.15)' }}>{cat.title}</div>
              {cat.items.map((item, idx) => {
                const key = `${cat.title}-${idx}`
                const isOpen = !!open[key]
                return (
                  <div key={key} className={`faq-item${isOpen ? ' open' : ''}`} onClick={() => toggle(key)} style={{ borderBottom: '0.5px solid rgba(122,92,69,0.12)', padding: '22px 0', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                      <span style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 400, fontSize: '17px', color: 'var(--dark-brown)', letterSpacing: '-0.01em', flex: 1 }}>{item.q}</span>
                      <span className="faq-icon" style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 300, color: 'var(--brown)', flexShrink: 0 }}>+</span>
                    </div>
                    <div className="faq-a">
                      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)' }}>{item.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
