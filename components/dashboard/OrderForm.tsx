'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FairRow, OrderKind, OrderStatus, OrderItem, ShippingAddress } from '@/lib/database.types'

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

type ItemRow = { name: string; color: string; item_ccy: string; qty: string; price: string; dom_del: string; total: string }

function emptyItem(): ItemRow {
  return { name: '', color: '', item_ccy: 'KRW', qty: '1', price: '', dom_del: '', total: '' }
}

type AddrForm = {
  name: string; address: string; city: string; country: string
  postal_code: string; phone: string; payment_method: string
}

function emptyAddr(a?: ShippingAddress | null): AddrForm {
  return {
    name:           a?.name           ?? '',
    address:        a?.address        ?? '',
    city:           a?.city           ?? '',
    country:        a?.country        ?? '',
    postal_code:    a?.postal_code    ?? '',
    phone:          a?.phone          ?? '',
    payment_method: a?.payment_method ?? 'wise',
  }
}

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
    shipping_address?: ShippingAddress | null
    paid_1_amount?: string; paid_1_date?: string; paid_1_via?: string; paid_1_transfer_fee?: string
    paid_2_amount?: string; paid_2_date?: string; paid_2_via?: string; paid_2_transfer_fee?: string
    actual_goods_cost?: string
  }
}) {
  const router  = useRouter()
  const isEdit  = !!orderId
  const [saving, setSaving] = useState(false)

  const init1Amt = parseFloat(initial?.paid_1_amount ?? '') || 0
  const init1Fee = parseFloat(initial?.paid_1_transfer_fee ?? '') || 0
  const init2Amt = parseFloat(initial?.paid_2_amount ?? '') || 0
  const init2Fee = parseFloat(initial?.paid_2_transfer_fee ?? '') || 0

  const [form, setForm] = useState({
    customer_email:      initial?.customer_email  ?? '',
    customer_name:       initial?.customer_name   ?? '',
    kind:                (initial?.kind           ?? 'proxy') as OrderKind,
    fair_id:             initial?.fair_id         ?? '',
    title:               initial?.title           ?? '',
    description:         initial?.description     ?? '',
    goods_total:         initial?.goods_total     ?? '',
    service_fee:         initial?.service_fee     ?? '',
    shipping_cost:       initial?.shipping_cost   ?? '',
    currency:            initial?.currency        ?? 'KRW',
    status:              (initial?.status         ?? 'awaiting_payment') as OrderStatus,
    tracking_number:     initial?.tracking_number ?? '',
    notes:               initial?.notes           ?? '',
    customer_notes:      initial?.customer_notes  ?? '',
    paid_1_amount:       initial?.paid_1_amount   ?? '',
    paid_1_date:         initial?.paid_1_date     ?? '',
    paid_1_via:          initial?.paid_1_via      ?? 'jin',
    paid_1_transfer_fee: initial?.paid_1_transfer_fee ?? '',
    jin_received_1:      init1Amt && init1Fee ? String(init1Amt - init1Fee) : '',
    paid_2_amount:       initial?.paid_2_amount   ?? '',
    paid_2_date:         initial?.paid_2_date     ?? '',
    paid_2_via:          initial?.paid_2_via      ?? 'jin',
    paid_2_transfer_fee: initial?.paid_2_transfer_fee ?? '',
    jin_received_2:      init2Amt && init2Fee ? String(init2Amt - init2Fee) : '',
    actual_goods_cost:   initial?.actual_goods_cost ?? initial?.goods_total ?? '',
  })

  const [addr, setAddr] = useState<AddrForm>(emptyAddr(initial?.shipping_address))

  const [items, setItems] = useState<ItemRow[]>(
    initial?.items?.length
      ? initial.items.map(i => ({
          name:     i.name,
          color:    i.color    ?? '',
          item_ccy: i.item_ccy ?? 'KRW',
          qty:      String(i.qty),
          price:    String(i.price),
          dom_del:  i.dom_del != null ? String(i.dom_del) : '',
          total:    i.total   != null ? String(i.total)   : '',
        }))
      : [emptyItem()]
  )

  function set(k: string, v: string)  { setForm(p => ({ ...p, [k]: v })) }
  function setA(k: string, v: string) { setAddr(p => ({ ...p, [k]: v })) }

  function setJinReceived(num: 1 | 2, v: string) {
    const amtKey = `paid_${num}_amount` as const
    const feeKey = `paid_${num}_transfer_fee` as const
    const recKey = `jin_received_${num}` as const
    const fee = (parseFloat((form as any)[amtKey]) || 0) - (parseFloat(v) || 0)
    setForm(p => ({ ...p, [recKey]: v, [feeKey]: fee > 0 ? String(fee) : '' }))
  }

  function setItem(idx: number, k: keyof ItemRow, v: string) {
    setItems(prev => prev.map((row, i) => {
      if (i !== idx) return row
      const updated = { ...row, [k]: v }
      if (k === 'price' || k === 'qty' || k === 'dom_del') {
        const p = parseFloat(k === 'price'   ? v : updated.price)   || 0
        const q = parseInt (k === 'qty'     ? v : updated.qty)      || 0
        const d = parseFloat(k === 'dom_del' ? v : updated.dom_del) || 0
        if (p > 0 && q > 0) updated.total = String(p * q + d)
      }
      return updated
    }))
  }
  function addItem()              { setItems(prev => [...prev, emptyItem()]) }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  // Auto-calculate goods_total and service_fee from items
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => {
      const manual = parseFloat(item.total) || 0
      if (manual > 0) return sum + manual
      const price   = parseFloat(item.price)   || 0
      const qty     = parseInt(item.qty)        || 0
      const dom_del = parseFloat(item.dom_del)  || 0
      return sum + price * qty + dom_del
    }, 0)
    if (subtotal === 0) return
    const minFee  = form.currency === 'JPY' ? 2500 : 25000
    const rawFee  = subtotal * 0.15
    const unit    = form.currency === 'JPY' ? 100 : 1000
    const rounded = Math.ceil(rawFee / unit) * unit
    const fee     = Math.max(minFee, rounded)
    setForm(p => ({ ...p, goods_total: String(subtotal), service_fee: String(fee), actual_goods_cost: p.actual_goods_cost || String(subtotal) }))
  }, [items, form.currency]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const parsedItems: OrderItem[] = items
      .filter(i => i.name.trim())
      .map(i => ({
        name:     i.name.trim(),
        color:    i.color.trim() || undefined,
        item_ccy: (i.item_ccy as 'KRW' | 'JPY'),
        qty:      parseInt(i.qty)    || 1,
        price:    parseFloat(i.price) || 0,
        dom_del:  parseFloat(i.dom_del) || undefined,
        total:    parseFloat(i.total)   || undefined,
      }))

    const shippingAddress: ShippingAddress = {
      name:           addr.name,
      address:        addr.address,
      city:           addr.city,
      country:        addr.country,
      postal_code:    addr.postal_code,
      phone:          addr.phone || undefined,
      payment_method: (addr.payment_method as ShippingAddress['payment_method']) || 'wise',
    }

    const payload = {
      customer_email:      form.customer_email,
      customer_name:       form.customer_name  || null,
      kind:                form.kind,
      fair_id:             form.fair_id        ? parseInt(form.fair_id) : null,
      title:               form.title || (parsedItems[0]?.name ? `${parsedItems[0].name}${parsedItems.length > 1 ? ` + ${parsedItems.length - 1} more` : ''}` : `Order from ${form.customer_name || form.customer_email}`),
      description:         form.description    || null,
      items:               parsedItems.length  ? parsedItems : null,
      goods_total:         form.goods_total    ? parseFloat(form.goods_total)  : null,
      service_fee:         form.service_fee    ? parseFloat(form.service_fee)  : null,
      shipping_cost:       form.shipping_cost  ? parseFloat(form.shipping_cost): null,
      currency:            form.currency,
      status:              form.status,
      tracking_number:     form.tracking_number || null,
      notes:               form.notes          || null,
      customer_notes:      form.customer_notes || null,
      shipping_address:    shippingAddress,
      paid_1_amount:       form.paid_1_amount       ? parseFloat(form.paid_1_amount)       : null,
      paid_1_date:         form.paid_1_date         || null,
      paid_1_via:          form.paid_1_amount       ? (form.paid_1_via as 'jin' | 'jo')    : null,
      paid_1_transfer_fee: form.paid_1_transfer_fee ? parseFloat(form.paid_1_transfer_fee) : null,
      paid_2_amount:       form.paid_2_amount       ? parseFloat(form.paid_2_amount)       : null,
      paid_2_date:         form.paid_2_date         || null,
      paid_2_via:          form.paid_2_amount       ? (form.paid_2_via as 'jin' | 'jo')    : null,
      paid_2_transfer_fee: form.paid_2_transfer_fee ? parseFloat(form.paid_2_transfer_fee) : null,
      actual_goods_cost:   form.actual_goods_cost   ? parseFloat(form.actual_goods_cost)   : null,
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
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>

      {/* Customer */}
      <Section label="Customer">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Field label="Email">
            <input style={inputStyle} type="email" required value={form.customer_email} onChange={e => set('customer_email', e.target.value)} placeholder="maya@example.com" />
          </Field>
          <Field label="Name">
            <input style={inputStyle} value={form.customer_name} onChange={e => set('customer_name', e.target.value)} placeholder="Maya Chen" />
          </Field>
        </div>
      </Section>

      {/* Shipping address */}
      <Section label="Shipping & payment">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
          <Field label="Recipient name">
            <input style={inputStyle} value={addr.name} onChange={e => setA('name', e.target.value)} placeholder="Maya Chen" />
          </Field>
          <Field label="Phone">
            <input style={inputStyle} value={addr.phone} onChange={e => setA('phone', e.target.value)} placeholder="+65 9123 4567" />
          </Field>
          <Field label="Address" style={{ gridColumn: '1 / -1' }}>
            <input style={inputStyle} value={addr.address} onChange={e => setA('address', e.target.value)} placeholder="123 Orchard Road, #08-01" />
          </Field>
          <Field label="City">
            <input style={inputStyle} value={addr.city} onChange={e => setA('city', e.target.value)} placeholder="Singapore" />
          </Field>
          <Field label="Postal code">
            <input style={inputStyle} value={addr.postal_code} onChange={e => setA('postal_code', e.target.value)} placeholder="238858" />
          </Field>
          <Field label="Country">
            <input style={inputStyle} value={addr.country} onChange={e => setA('country', e.target.value)} placeholder="Singapore" />
          </Field>
          <Field label="Currency">
            <select style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
              <option value="KRW">KRW ₩</option>
              <option value="JPY">JPY ¥</option>
              <option value="MYR">MYR RM</option>
              <option value="USD">USD $</option>
            </select>
          </Field>
        </div>
        <Field label="Payment method">
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { value: 'wise',     label: 'Wise' },
              { value: 'korea',    label: 'Korea – Shinhan Bank' },
              { value: 'malaysia', label: 'Malaysia – Maybank' },
              { value: 'japan',    label: 'Japan – Yuucho Bank' },
            ].map(opt => (
              <button key={opt.value} type="button" onClick={() => setA('payment_method', opt.value)} style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: addr.payment_method === opt.value ? 500 : 300,
                padding: '7px 16px', borderRadius: '99px', cursor: 'pointer',
                background: addr.payment_method === opt.value ? 'var(--dark-brown)' : 'transparent',
                color: addr.payment_method === opt.value ? 'var(--cream)' : 'var(--brown)',
                border: `0.5px solid ${addr.payment_method === opt.value ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
              }}>{opt.label}</button>
            ))}
          </div>
        </Field>
      </Section>

      {/* Order type */}
      <Section label="Order">
        <Field label="Type" style={{ marginBottom: '12px' }}>
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
          <Field label="Fair" style={{ marginBottom: '12px' }}>
            <select style={inputStyle} value={form.fair_id} onChange={e => set('fair_id', e.target.value)}>
              <option value="">Select a fair…</option>
              {fairs.map(f => <option key={f.id} value={f.id}>{f.name} — {new Date(f.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</option>)}
            </select>
          </Field>
        )}
      </Section>

      {/* Items */}
      <Section label="Items">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px 80px 70px 90px auto', gap: '6px', padding: '0 4px' }}>
            {['Item name', 'Color/size', 'Ccy', 'Qty', 'Unit price', 'Dom.del', 'Total', ''].map(h => (
              <div key={h} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--tan)' }}>{h}</div>
            ))}
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px 80px 70px 90px auto', gap: '6px', alignItems: 'center', background: 'var(--beige)', padding: '10px', borderRadius: '10px' }}>
              <input style={inputStyle} placeholder="Artist / item name" value={item.name} onChange={e => setItem(idx, 'name', e.target.value)} />
              <input style={inputStyle} placeholder="A5, pink…" value={item.color} onChange={e => setItem(idx, 'color', e.target.value)} />
              <select style={inputStyle} value={item.item_ccy} onChange={e => setItem(idx, 'item_ccy', e.target.value)}>
                <option value="KRW">KRW</option>
                <option value="JPY">JPY</option>
              </select>
              <input style={{ ...inputStyle, textAlign: 'center' }} type="number" min="1" value={item.qty} onChange={e => setItem(idx, 'qty', e.target.value)} />
              <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={item.price} onChange={e => setItem(idx, 'price', e.target.value)} />
              <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={item.dom_del} onChange={e => setItem(idx, 'dom_del', e.target.value)} />
              <input style={{ ...inputStyle, background: item.total ? 'white' : 'rgba(122,92,69,0.04)', fontWeight: item.total ? 500 : 300 }} type="text" inputMode="decimal" placeholder="auto" value={item.total} onChange={e => setItem(idx, 'total', e.target.value)} />
              <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '18px', color: 'var(--tan)', background: 'none', border: 'none', cursor: items.length === 1 ? 'default' : 'pointer', opacity: items.length === 1 ? 0.3 : 1, padding: '0 4px' }}>×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} style={{ marginTop: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '99px', padding: '7px 16px', cursor: 'pointer' }}>
          + Add item
        </button>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '8px' }}>
          Dom.del = domestic delivery fee (included in total)
        </p>
      </Section>

      {/* Totals */}
      <Section label="Totals — auto-calculated from items, editable">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <Field label="Goods subtotal">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.goods_total} onChange={e => set('goods_total', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Handling fee">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.service_fee} onChange={e => set('service_fee', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Intl shipping">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.shipping_cost} onChange={e => set('shipping_cost', e.target.value)} placeholder="0" />
          </Field>
        </div>
      </Section>

      {/* Status / tracking — edit only */}
      {isEdit && (
        <Section label="Status">
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
        </Section>
      )}

      {/* Payments received — edit only */}
      {isEdit && (
        <Section label="Payments received">
          {([
            { num: 1 as const, amtKey: 'paid_1_amount', dateKey: 'paid_1_date', viaKey: 'paid_1_via', feeKey: 'paid_1_transfer_fee', recKey: 'jin_received_1', label: 'Invoice 1 — items' },
            { num: 2 as const, amtKey: 'paid_2_amount', dateKey: 'paid_2_date', viaKey: 'paid_2_via', feeKey: 'paid_2_transfer_fee', recKey: 'jin_received_2', label: 'Invoice 2 — fee + shipping' },
          ]).map(({ num, amtKey, dateKey, viaKey, feeKey, recKey, label }) => {
            const isJo       = (form as any)[viaKey] === 'jo'
            const jinHandles = form.currency === 'KRW'
            const fee  = parseFloat((form as any)[feeKey]) || 0
            return (
              <div key={num} style={{ marginBottom: '20px', padding: '16px', background: 'var(--beige)', borderRadius: '12px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px' }}>{label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: isJo && jinHandles ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '10px' }}>
                  <Field label="Customer paid">
                    <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={(form as any)[amtKey]} onChange={e => set(amtKey, e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <input style={inputStyle} type="date" value={(form as any)[dateKey]} onChange={e => set(dateKey, e.target.value)} />
                  </Field>
                  <Field label="Received by">
                    <select style={inputStyle} value={(form as any)[viaKey]} onChange={e => set(viaKey, e.target.value)}>
                      <option value="jin">Jin (Shinhan)</option>
                      <option value="jo">Jo (Wise)</option>
                    </select>
                  </Field>
                  {isJo && jinHandles && (
                    <>
                      <Field label="Jin received from Jo">
                        <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={(form as any)[recKey]} onChange={e => setJinReceived(num, e.target.value)} />
                      </Field>
                      <Field label="Transfer fee (auto)">
                        <div style={{ ...inputStyle, background: 'rgba(122,92,69,0.04)', color: fee > 0 ? '#8A3A20' : 'var(--tan)', display: 'flex', alignItems: 'center' }}>
                          {fee > 0 ? `−${fee.toLocaleString()}` : '—'}
                        </div>
                      </Field>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          <Field label="Actual goods cost">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, maxWidth: '200px' }} type="text" inputMode="decimal" placeholder="0" value={form.actual_goods_cost} onChange={e => set('actual_goods_cost', e.target.value)} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)' }}>defaults to goods subtotal</span>
            </div>
          </Field>
        </Section>
      )}

      {/* Notes */}
      <Section label="Notes">
        <Field label="Customer-visible note" style={{ marginBottom: '12px' }}>
          <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.customer_notes} onChange={e => set('customer_notes', e.target.value)} placeholder="We found a beautiful version — photos incoming soon!" />
        </Field>
        <Field label="Internal notes (admin only)">
          <textarea style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notes for yourself…" />
        </Field>
      </Section>

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

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px', paddingBottom: '8px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={style}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>{label}</div>
      {children}
    </div>
  )
}
