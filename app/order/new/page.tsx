'use client'

export const runtime = 'edge'

import { useState } from 'react'
import Link from 'next/link'

const input: React.CSSProperties = {
  width: '100%', padding: '12px 16px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '14px', fontWeight: 300, outline: 'none',
}

type ItemRow = { name: string; url: string; qty: string }

export default function CustomerOrderForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', instagram: '',
    address: '', city: '', country: '', postal_code: '',
    payment_method: 'wise', notes: '',
  })
  const [items,   setItems]   = useState<ItemRow[]>([{ name: '', url: '', qty: '1' }])
  const [agreed,  setAgreed]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState<string | null>(null)
  const [error,   setError]   = useState('')

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }
  function setItem(i: number, k: keyof ItemRow, v: string) {
    setItems(prev => prev.map((row, idx) => idx === i ? { ...row, [k]: v } : row))
  }
  function addItem()          { setItems(p => [...p, { name: '', url: '', qty: '1' }]) }
  function remItem(i: number) { setItems(p => p.filter((_, idx) => idx !== i)) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!agreed) { setError('Please agree to the terms before submitting.'); return }
    setLoading(true)
    setError('')

    const parsedItems = items
      .filter(i => i.name.trim())
      .map(i => ({ name: i.name.trim(), url: i.url.trim() || undefined, qty: parseInt(i.qty) || 1, price: 0 }))

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, items: parsedItems }),
    })
    const data = await res.json()
    if (!res.ok) { setError('Something went wrong — please try again or DM us on Instagram.'); setLoading(false); return }
    setDone(data.order_number)
    setLoading(false)
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
              Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
            </div>
          </Link>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 300, color: 'var(--dark-brown)', marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Order received <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>✓</em>
          </div>

          {/* Order link + save prompt */}
          <div style={{ background: 'var(--beige)', borderRadius: '14px', padding: '20px 24px', marginBottom: '24px', border: '0.5px solid rgba(122,92,69,0.15)' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>Your order number</div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '14px' }}>{done}</div>
            <a href={`/order/${done}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
              textDecoration: 'none',
              background: 'var(--dark-blue)', color: 'var(--cream)',
              padding: '10px 20px', borderRadius: '99px', marginBottom: '12px',
            }}>
              Track order {done} →
            </a>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--brown)', background: 'rgba(122,92,69,0.06)', borderRadius: '8px', padding: '10px 14px' }}>
              💾 <strong style={{ fontWeight: 500 }}>Bookmark this page</strong> — it&apos;s the only way to check your order status. No login required.
            </div>
          </div>

          {/* What happens next */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '14px' }}>What happens next</div>
            {[
              { step: '1', text: 'We review your order and confirm item availability within 24 hours.' },
              { step: '2', text: 'We send Invoice 1 — items cost only. You pay this so we can purchase.' },
              { step: '3', text: 'We source your items (at the fair or online).' },
              { step: '4', text: 'We send Invoice 2 — service fee + international shipping. You pay the balance.' },
              { step: '5', text: 'We pack carefully and ship to your door with tracking.' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: '14px', marginBottom: '12px' }}>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', color: 'var(--tan)', width: '20px', flexShrink: 0 }}>{step}</div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>{text}</div>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '24px' }}>
            Questions? DM us <a href="https://www.instagram.com/studio2j25/" target="_blank" rel="noreferrer" style={{ color: 'var(--dark-blue)' }}>@studio2j25</a>
          </p>
          <Link href="/" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--brown)', textDecoration: 'none', border: '0.5px solid rgba(122,92,69,0.2)', padding: '12px 24px', borderRadius: '99px' }}>
            Back to homepage
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingBottom: '80px' }}>
      <div style={{ padding: '20px 40px', borderBottom: '0.5px solid rgba(122,92,69,0.1)', marginBottom: '48px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          </span>
        </Link>
      </div>

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '32px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          Place an order
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--dark-brown)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '16px' }}>
          Tell us what<br />you <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>love</em>.
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, marginBottom: '20px', maxWidth: '520px' }}>
          Fill in your details and the items you want. We&apos;ll review and send a quotation within 24 hours. <strong style={{ fontWeight: 500 }}>Nothing is purchased until you approve and pay.</strong>
        </p>

        {/* Payment flow note */}
        <div style={{ background: 'var(--beige)', borderRadius: '12px', padding: '16px 20px', marginBottom: '40px', border: '0.5px solid rgba(122,92,69,0.12)' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>How payment works</div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8 }}>
            <strong style={{ fontWeight: 500, color: 'var(--dark-brown)' }}>Invoice 1</strong> — We send you the item costs first. You pay upfront so we can purchase.<br />
            <strong style={{ fontWeight: 500, color: 'var(--dark-brown)' }}>Invoice 2</strong> — After items arrive, we send service fee + international shipping. You pay the balance before we ship.
          </div>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Contact */}
          <FormSection label="Your details">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Full name">
                <input style={input} required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Maya Chen" />
              </FormField>
              <FormField label="Email">
                <input style={input} type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="maya@example.com" />
              </FormField>
              <FormField label="Phone">
                <input style={input} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+65 9123 4567" />
              </FormField>
              <FormField label="Instagram handle (optional)">
                <div style={{ display: 'flex', alignItems: 'center', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '10px', background: 'white', overflow: 'hidden' }}>
                  <span style={{ padding: '12px 12px 12px 16px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>@</span>
                  <input style={{ ...input, border: 'none', borderRadius: 0, paddingLeft: 0 }} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="studio2j25" />
                </div>
              </FormField>
            </div>
          </FormSection>

          {/* Shipping */}
          <FormSection label="Shipping address">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormField label="Street address" style={{ gridColumn: '1 / -1' }}>
                <input style={input} value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Maple Street, Apt 4B" />
              </FormField>
              <FormField label="City">
                <input style={input} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Singapore" />
              </FormField>
              <FormField label="Postal code">
                <input style={input} value={form.postal_code} onChange={e => set('postal_code', e.target.value)} placeholder="049145" />
              </FormField>
              <FormField label="Country" style={{ gridColumn: '1 / -1' }}>
                <input style={input} required value={form.country} onChange={e => set('country', e.target.value)} placeholder="Singapore" />
              </FormField>
            </div>
          </FormSection>

          {/* Items */}
          <FormSection label="Items you want">
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '16px', lineHeight: 1.6 }}>
              Add each item. Paste the product URL if you have it — otherwise just the artist/brand name is fine.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 60px auto', gap: '8px', alignItems: 'center', background: 'var(--beige)', padding: '12px', borderRadius: '12px' }}>
                  <input style={input} placeholder="Artist / item name" value={item.name} onChange={e => setItem(i, 'name', e.target.value)} />
                  <input style={input} placeholder="URL (optional)" value={item.url} onChange={e => setItem(i, 'url', e.target.value)} />
                  <input style={{ ...input, textAlign: 'center' }} type="number" min="1" value={item.qty} onChange={e => setItem(i, 'qty', e.target.value)} />
                  <button type="button" onClick={() => remItem(i)} disabled={items.length === 1} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '20px', color: 'var(--tan)', background: 'none', border: 'none', cursor: items.length === 1 ? 'default' : 'pointer', opacity: items.length === 1 ? 0.3 : 1 }}>×</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addItem} style={{ marginTop: '10px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '99px', padding: '8px 18px', cursor: 'pointer' }}>
              + Add another item
            </button>
          </FormSection>

          {/* Payment preference */}
          <FormSection label="Payment preference">
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { value: 'wise',     label: 'Wise (international)' },
                { value: 'korea',    label: 'Korea – Shinhan Bank' },
                { value: 'malaysia', label: 'Malaysia – Maybank' },
                { value: 'japan',    label: 'Japan – Yuucho Bank' },
              ].map(opt => (
                <button key={opt.value} type="button" onClick={() => set('payment_method', opt.value)} style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px',
                  fontWeight: form.payment_method === opt.value ? 500 : 300,
                  padding: '9px 18px', borderRadius: '99px', cursor: 'pointer',
                  background: form.payment_method === opt.value ? 'var(--dark-brown)' : 'transparent',
                  color: form.payment_method === opt.value ? 'var(--cream)' : 'var(--brown)',
                  border: `0.5px solid ${form.payment_method === opt.value ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
                  transition: 'all 0.15s',
                }}>{opt.label}</button>
              ))}
            </div>
          </FormSection>

          {/* Notes */}
          <FormSection label="Additional notes (optional)">
            <textarea style={{ ...input, minHeight: '80px', resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Colour preferences, sizes, or anything else we should know…" />
          </FormSection>

          {/* Service agreement */}
          <FormSection label="Terms & policies">
            <div style={{ background: 'var(--beige)', borderRadius: '12px', padding: '20px', fontSize: '13px', fontFamily: 'var(--font-inter), sans-serif', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, marginBottom: '16px' }}>
              <strong style={{ fontWeight: 500, color: 'var(--dark-brown)', display: 'block', marginBottom: '8px' }}>Service fee</strong>
              Minimum ₩25,000 (or ¥2,500 for Japan), or 15% of total goods value — whichever is higher. This covers sourcing, transport, packing, and care.
              <strong style={{ fontWeight: 500, color: 'var(--dark-brown)', display: 'block', marginTop: '14px', marginBottom: '8px' }}>Payment</strong>
              Invoice 1 (item costs) is sent first — please pay within 24 hours so we can purchase. Invoice 2 (service fee + shipping) is sent after items are confirmed.
              <strong style={{ fontWeight: 500, color: 'var(--dark-brown)', display: 'block', marginTop: '14px', marginBottom: '8px' }}>Refund & cancellation</strong>
              Cancellations are accepted before we purchase. Once items are bought we cannot refund for change of mind — we source specifically for your order. If items arrive damaged, photograph everything within 48 hours and DM us — we will resolve it. International customs fees are the buyer&apos;s responsibility.
            </div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: '3px', flexShrink: 0, width: '16px', height: '16px', cursor: 'pointer' }} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>
                I have read and agree to the service terms, payment structure, and refund policy above.
              </span>
            </label>
          </FormSection>

          {error && (
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#8A3A20', padding: '12px 16px', background: '#F5DDD5', borderRadius: '10px' }}>{error}</p>
          )}

          <button type="submit" disabled={loading || !agreed} style={{
            background: agreed ? 'var(--dark-blue)' : 'rgba(31,58,95,0.3)',
            color: 'var(--cream)',
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 500,
            padding: '16px 40px', borderRadius: '99px', border: 'none',
            cursor: loading ? 'wait' : agreed ? 'pointer' : 'not-allowed',
            opacity: loading ? 0.7 : 1,
            letterSpacing: '0.02em', alignSelf: 'flex-start', transition: 'all 0.2s',
          }}>
            {loading ? 'Submitting…' : 'Submit order request'}
          </button>
        </form>
      </div>
    </main>
  )
}

function FormSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function FormField({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--brown)', marginBottom: '6px' }}>{label}</div>
      {children}
    </div>
  )
}
