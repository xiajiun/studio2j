'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FairRow, OrderKind, OrderStatus, OrderItem } from '@/lib/database.types'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
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

type ItemRow = { name: string; url: string; qty: string; price: string }

function emptyItem(): ItemRow { return { name: '', url: '', qty: '1', price: '' } }

export function OrderForm({ fairs, orderId, initial }: {
  fairs: FairRow[]
  orderId?: number
  initial?: {
    customer_email: string; customer_name: string; kind: OrderKind
    fair_id: string; title: string; description: string
    goods_total: string; service_fee: string; shipping_cost: string
    currency: string; status: OrderStatus; tracking_number: string
    notes: string; customer_notes: string
    items: OrderItem[]
  }
}) {
  const router  = useRouter()
  const isEdit  = !!orderId
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    customer_email:  initial?.customer_email  ?? '',
    customer_name:   initial?.customer_name   ?? '',
    kind:            (initial?.kind           ?? 'proxy') as OrderKind,
    fair_id:         initial?.fair_id         ?? '',
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

  const [items, setItems] = useState<ItemRow[]>(
    initial?.items?.length
      ? initial.items.map(i => ({ name: i.name, url: i.url ?? '', qty: String(i.qty), price: String(i.price) }))
      : [emptyItem()]
  )

  function set(k: string, v: string) { setForm(p => ({ ...p, [k]: v })) }

  function setItem(idx: number, k: keyof ItemRow, v: string) {
    setItems(prev => prev.map((row, i) => i === idx ? { ...row, [k]: v } : row))
  }
  function addItem()       { setItems(prev => [...prev, emptyItem()]) }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const parsedItems: OrderItem[] = items
      .filter(i => i.name.trim())
      .map(i => ({
        name:  i.name.trim(),
        url:   i.url.trim() || undefined,
        qty:   parseInt(i.qty) || 1,
        price: parseFloat(i.price) || 0,
      }))

    const payload = {
      customer_email:  form.customer_email,
      customer_name:   form.customer_name  || null,
      kind:            form.kind,
      fair_id:         form.fair_id        ? parseInt(form.fair_id) : null,
      title:           form.title,
      description:     form.description    || null,
      items:           parsedItems.length  ? parsedItems : null,
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
      if (form.customer_email) {
        await supabase.auth.signInWithOtp({
          email: form.customer_email,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback?order=${data?.order_number}`,
            shouldCreateUser: true,
          },
        })
      }
    }

    setSaving(false)
    router.push('/admin/orders')
    router.refresh()
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '720px' }}>

      {/* Customer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Field label="Customer email">
          <input style={inputStyle} type="email" required value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="customer@email.com" />
        </Field>
        <Field label="Customer name">
          <input style={inputStyle} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Maya" />
        </Field>
      </div>

      {/* Order type */}
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

      {/* Order title */}
      <Field label="Order title">
        <input style={inputStyle} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Hyuna Kim sticker set + washi tape" />
      </Field>

      {/* Items list */}
      <div>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>
          Items
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px 80px auto', gap: '8px', alignItems: 'center', background: 'var(--beige)', padding: '12px', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)' }}>
              <input
                style={inputStyle}
                placeholder="Item name"
                value={item.name}
                onChange={e => setItem(idx, 'name', e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="URL (optional)"
                value={item.url}
                onChange={e => setItem(idx, 'url', e.target.value)}
              />
              <input
                style={{ ...inputStyle, textAlign: 'center' }}
                placeholder="Qty"
                type="number"
                min="1"
                value={item.qty}
                onChange={e => setItem(idx, 'qty', e.target.value)}
              />
              <input
                style={inputStyle}
                placeholder="Price"
                type="number"
                step="0.01"
                value={item.price}
                onChange={e => setItem(idx, 'price', e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '18px', color: 'var(--tan)', background: 'none', border: 'none', cursor: items.length === 1 ? 'default' : 'pointer', opacity: items.length === 1 ? 0.3 : 1, padding: '0 4px' }}
              >×</button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addItem}
          style={{ marginTop: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '99px', padding: '7px 16px', cursor: 'pointer' }}
        >
          + Add item
        </button>
      </div>

      {/* Description */}
      <Field label="Description / notes for yourself">
        <textarea style={{ ...inputStyle, minHeight: '72px', resize: 'vertical' }} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Any extra details…" />
      </Field>

      {/* Financials */}
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
