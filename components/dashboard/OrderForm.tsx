'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FairRow, OrderKind, OrderStatus } from '@/lib/database.types'

const inputStyle = {
  width: '100%',
  padding: '10px 16px',
  borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)',
  background: 'white',
  color: 'var(--dark-brown)',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px',
  fontWeight: 300,
  outline: 'none',
}

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'awaiting_payment', label: 'Awaiting payment' },
  { value: 'paid',             label: 'Paid' },
  { value: 'going_to_fair',    label: 'Going to fair' },
  { value: 'purchased',        label: 'Purchased' },
  { value: 'packing',          label: 'Packing' },
  { value: 'shipped',          label: 'Shipped' },
  { value: 'delivered',        label: 'Delivered' },
  { value: 'cancelled',        label: 'Cancelled' },
]

export function OrderForm({ fairs, orderId, initial }: {
  fairs: FairRow[]
  orderId?: number
  initial?: {
    customer_email: string; customer_name: string; kind: OrderKind
    fair_id: string; source_url: string; title: string; description: string
    goods_total: string; service_fee: string; shipping_cost: string
    currency: string; status: OrderStatus; tracking_number: string
    notes: string; customer_notes: string
  }
}) {
  const router  = useRouter()
  const isEdit  = !!orderId
  const [saving, setSaving] = useState(false)
  const [sent,   setSent]   = useState(false)
  const [form,   setForm]   = useState({
    customer_email:  initial?.customer_email  ?? '',
    customer_name:   initial?.customer_name   ?? '',
    kind:            (initial?.kind           ?? 'proxy') as OrderKind,
    fair_id:         initial?.fair_id         ?? '',
    source_url:      initial?.source_url      ?? '',
    title:           initial?.title           ?? '',
    description:     initial?.description     ?? '',
    goods_total:     initial?.goods_total     ?? '',
    service_fee:     initial?.service_fee     ?? '',
    shipping_cost:   initial?.shipping_cost   ?? '',
    currency:        initial?.currency        ?? 'KRW',
    status:          (initial?.status         ?? 'awaiting_payment') as OrderStatus,
    tracking_number: initial?.tracking_number ?? '',
    notes:           initial?.notes           ?? '',
    customer_notes:  initial?.customer_notes  ?? '',
  })

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const payload = {
      customer_email:  form.customer_email,
      customer_name:   form.customer_name  || null,
      kind:            form.kind,
      fair_id:         form.fair_id        ? parseInt(form.fair_id) : null,
      source_url:      form.source_url     || null,
      title:           form.title,
      description:     form.description   || null,
      goods_total:     form.goods_total    ? parseFloat(form.goods_total) : null,
      service_fee:     form.service_fee    ? parseFloat(form.service_fee) : null,
      shipping_cost:   form.shipping_cost  ? parseFloat(form.shipping_cost) : null,
      currency:        form.currency,
      status:          form.status,
      tracking_number: form.tracking_number || null,
      notes:           form.notes          || null,
      customer_notes:  form.customer_notes || null,
    }

    if (isEdit) {
      await supabase.from('orders').update(payload).eq('id', orderId)
    } else {
      const { data } = await supabase.from('orders').insert(payload).select('order_number').single()
      // Send magic link to customer
      if (form.customer_email) {
        await supabase.auth.signInWithOtp({
          email: form.customer_email,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback?order=${data?.order_number}`,
            shouldCreateUser: true,
          },
        })
        setSent(true)
      }
    }

    setSaving(false)
    router.push('/admin/orders')
    router.refresh()
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Customer email">
          <input style={inputStyle} type="email" required value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="customer@email.com" />
        </Field>
        <Field label="Customer name">
          <input style={inputStyle} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Maya" />
        </Field>
      </div>

      <Field label="Order type">
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['proxy', 'fair', 'personal'] as OrderKind[]).map(k => (
            <button key={k} type="button" onClick={() => set('kind', k)} style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: form.kind === k ? 500 : 300,
              padding: '8px 18px', borderRadius: '99px', cursor: 'pointer',
              background: form.kind === k ? 'var(--dark-brown)' : 'transparent',
              color: form.kind === k ? 'var(--cream)' : 'var(--brown)',
              border: `0.5px solid ${form.kind === k ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
            }}>
              {k === 'proxy' ? 'Proxy buy' : k === 'fair' ? 'Fair haul' : 'Personal request'}
            </button>
          ))}
        </div>
      </Field>

      {form.kind === 'fair' && (
        <Field label="Fair">
          <select style={inputStyle} value={form.fair_id} onChange={e => set('fair_id', e.target.value)}>
            <option value="">Select a fair…</option>
            {fairs.map(f => <option key={f.id} value={f.id}>{f.name} — {new Date(f.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</option>)}
          </select>
        </Field>
      )}

      {form.kind === 'proxy' && (
        <Field label="Source URL">
          <input style={inputStyle} value={form.source_url} onChange={e => set('source_url', e.target.value)} placeholder="https://www.twenty.com/..." />
        </Field>
      )}

      <Field label="Order title">
        <input style={inputStyle} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Hyuna Kim sticker set" />
      </Field>

      <Field label="Description">
        <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Details about the order…" />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        <Field label="Goods total">
          <input style={inputStyle} type="number" step="0.01" value={form.goods_total} onChange={e => set('goods_total', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Service fee">
          <input style={inputStyle} type="number" step="0.01" value={form.service_fee} onChange={e => set('service_fee', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Shipping">
          <input style={inputStyle} type="number" step="0.01" value={form.shipping_cost} onChange={e => set('shipping_cost', e.target.value)} placeholder="0" />
        </Field>
        <Field label="Currency">
          <select style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
            <option value="KRW">KRW ₩</option>
            <option value="JPY">JPY ¥</option>
            <option value="USD">USD $</option>
          </select>
        </Field>
      </div>

      {isEdit && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Status">
            <select style={inputStyle} value={form.status} onChange={e => set('status', e.target.value as OrderStatus)}>
              {ALL_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </Field>
          <Field label="Tracking number">
            <input style={inputStyle} value={form.tracking_number} onChange={e => set('tracking_number', e.target.value)} placeholder="EK123456789KR" />
          </Field>
        </div>
      )}

      <Field label="Customer-visible note">
        <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.customer_notes} onChange={e => set('customer_notes', e.target.value)} placeholder="We found a beautiful version — photos incoming soon!" />
      </Field>

      <Field label="Internal notes (admin only)">
        <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notes for yourself…" />
      </Field>

      {sent && (
        <div style={{ padding: '12px 16px', background: '#D8E5EE', borderRadius: '10px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#1F3A5F' }}>
          ✓ Magic link sent to {form.customer_email}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={saving} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '13px 28px', borderRadius: '99px', border: 'none', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create order & send link'}
        </button>
        <button type="button" onClick={() => router.back()} style={{ color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, padding: '13px 28px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'transparent', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>{label}</div>
      {children}
    </div>
  )
}
