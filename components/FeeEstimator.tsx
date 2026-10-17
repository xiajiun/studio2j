'use client'

import { useState } from 'react'
import { useLang } from '@/components/LangProvider'
import { formatMoney, serviceFee, type FeeCurrency } from '@/lib/fee'

const inter = 'var(--font-inter), sans-serif'
const fraunces = 'var(--font-fraunces), serif'

export default function FeeEstimator() {
  const { lang, t } = useLang()
  const s = t.estimator
  // Japanese copy is Korea-only (CLAUDE.md rule 10) — KRW only
  const [cur, setCur] = useState<FeeCurrency>('KRW')
  const currency: FeeCurrency = lang === 'ja' ? 'KRW' : cur
  const [raw, setRaw] = useState('')

  const goods = Number(raw.replace(/[^\d]/g, '')) || 0
  const { fee, minApplied } = serviceFee(goods, currency)
  const examples = currency === 'KRW' ? [30000, 100000, 300000] : [3000, 10000, 30000]

  const row = (label: string, value: string, strong = false, note?: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px', padding: '12px 0', borderBottom: '0.5px solid rgba(248,248,246,0.1)' }}>
      <span style={{ fontFamily: inter, fontSize: '13px', fontWeight: 300, color: 'rgba(248,248,246,0.7)' }}>
        {label}{note && <span style={{ display: 'block', fontSize: '11px', color: 'rgba(248,248,246,0.4)', marginTop: '2px' }}>{note}</span>}
      </span>
      <span style={{ fontFamily: strong ? fraunces : inter, fontSize: strong ? '26px' : '14px', fontWeight: strong ? 400 : 500, color: strong ? '#F3E3A1' : 'var(--cream)', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )

  return (
    <section id="fees" className="estimator-section" style={{ background: 'var(--cream)', padding: '0 0 40px' }}>
      <div className="container">
        <div className="estimator-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'center', background: 'white', border: '0.5px solid rgba(107,163,200,0.2)', borderRadius: '24px', padding: 'clamp(28px, 4vw, 48px)' }}>
          <div>
            <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />{s.eyebrow}
            </div>
            <h2 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(32px, 3.4vw, 46px)', lineHeight: 1.08, letterSpacing: '-0.02em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              {s.title1} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.titleEm}</em>
            </h2>
            <p style={{ fontFamily: inter, fontSize: '14.5px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(45,55,72,0.75)', marginBottom: '24px' }}>{s.body}</p>

            {lang !== 'ja' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                {(['KRW', 'JPY'] as const).map(c => (
                  <button key={c} type="button" onClick={() => { setCur(c); setRaw('') }}
                    style={{ fontFamily: inter, fontSize: '12px', fontWeight: cur === c ? 500 : 300, padding: '7px 16px', borderRadius: '99px', cursor: 'pointer', background: cur === c ? 'var(--dark-brown)' : 'transparent', color: cur === c ? 'var(--cream)' : 'var(--brown)', border: `0.5px solid ${cur === c ? 'var(--dark-brown)' : 'rgba(107,163,200,0.25)'}` }}>
                    {c === 'KRW' ? s.currencyKRW : s.currencyJPY}
                  </button>
                ))}
              </div>
            )}

            <label style={{ display: 'block', fontFamily: inter, fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }} htmlFor="fee-goods">
              {s.goodsLabel}
            </label>
            <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid rgba(107,163,200,0.3)', borderRadius: '12px', background: 'var(--cream)', padding: '0 16px' }}>
              <span style={{ fontFamily: fraunces, fontSize: '22px', color: 'var(--tan)' }}>{currency === 'JPY' ? '¥' : '₩'}</span>
              <input id="fee-goods" inputMode="numeric" value={raw ? Number(raw.replace(/[^\d]/g, '') || 0).toLocaleString('en-US') : ''}
                onChange={e => setRaw(e.target.value.replace(/[^\d]/g, '').slice(0, 9))}
                placeholder={currency === 'JPY' ? '10,000' : '100,000'}
                style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: fraunces, fontSize: '22px', color: 'var(--dark-brown)', padding: '12px 10px' }} />
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
              {examples.map(v => (
                <button key={v} type="button" onClick={() => setRaw(String(v))}
                  style={{ fontFamily: inter, fontSize: '11.5px', fontWeight: 400, padding: '4px 11px', borderRadius: '99px', cursor: 'pointer', background: 'var(--beige)', color: 'var(--muted-blue)', border: 'none' }}>
                  {formatMoney(v, currency)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--dark-brown)', borderRadius: '20px', padding: '28px 30px' }}>
            {row(s.goodsRow, goods ? formatMoney(goods, currency) : '—')}
            {row(s.feeLabel, formatMoney(fee, currency), false, goods ? (minApplied ? s.minNote : s.pctNote) : s.minNote)}
            {row(s.shippingLabel, s.shippingValue)}
            {row(s.subtotalLabel, goods ? formatMoney(goods + fee, currency) : '—', true)}
            <p style={{ fontFamily: inter, fontSize: '12px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(248,248,246,0.55)', margin: '16px 0 20px' }}>{s.footnote} {s.runnerNote}</p>
            <a href="/order/new" className="btn-gold-order" style={{ display: 'block', textAlign: 'center' }}>{s.cta}</a>
          </div>
        </div>
      </div>
    </section>
  )
}
