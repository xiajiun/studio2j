'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FairRow, OrderKind, OrderStatus, OrderItem, ShippingAddress } from '@/lib/database.types'

type CustomerOption = { email: string; name: string | null; shipping_address: ShippingAddress | null }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

const ALL_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: 'awaiting_payment',   label: 'Awaiting payment' },
  { value: 'paid',               label: 'Paid' },
  { value: 'going_to_fair',      label: 'Going to fair' },
  { value: 'purchased',          label: 'Purchased' },
  { value: 'packing',            label: 'Packing' },
  { value: 'awaiting_payment_2', label: 'Awaiting final payment' },
  { value: 'paid_2',             label: 'Final payment confirmed' },
  { value: 'shipped',            label: 'Shipped' },
  { value: 'delivered',          label: 'Delivered' },
  { value: 'cancelled',          label: 'Cancelled' },
]

type ItemRow = { name: string; color: string; item_ccy: string; qty: string; price: string; dom_del: string; total: string; actual_cost: string; arrived: boolean }

function emptyItem(): ItemRow {
  return { name: '', color: '', item_ccy: 'KRW', qty: '1', price: '', dom_del: '', total: '', actual_cost: '', arrived: false }
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

export function OrderForm({ fairs, orderId, initial, customers }: {
  fairs: FairRow[]
  orderId?: number
  customers?: CustomerOption[]
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
    paid_3_amount?: string; paid_3_date?: string; paid_3_via?: string; paid_3_transfer_fee?: string
    actual_goods_cost?: string
    actual_shipping_cost?: string
    runner_fee?: string
  }
}) {
  const router  = useRouter()
  const isEdit  = !!orderId
  const [saving, setSaving] = useState(false)

  const init1Amt = parseFloat(initial?.paid_1_amount ?? '') || 0
  const init1Fee = parseFloat(initial?.paid_1_transfer_fee ?? '') || 0
  const init2Amt = parseFloat(initial?.paid_2_amount ?? '') || 0
  const init2Fee = parseFloat(initial?.paid_2_transfer_fee ?? '') || 0
  const init3Amt = parseFloat(initial?.paid_3_amount ?? '') || 0
  const init3Fee = parseFloat(initial?.paid_3_transfer_fee ?? '') || 0

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
    customer_notes:      initial?.customer_notes  ?? 'Thank you for shopping with us!',
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
    paid_3_amount:       initial?.paid_3_amount   ?? '',
    paid_3_date:         initial?.paid_3_date     ?? '',
    paid_3_via:          initial?.paid_3_via      ?? 'jin',
    paid_3_transfer_fee: initial?.paid_3_transfer_fee ?? '',
    jin_received_3:      init3Amt && init3Fee ? String(init3Amt - init3Fee) : '',
    actual_goods_cost:    initial?.actual_goods_cost ?? '',
    actual_shipping_cost: initial?.actual_shipping_cost ?? '',
    runner_fee:           initial?.runner_fee ?? '',
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
          dom_del:     i.dom_del     != null ? String(i.dom_del)     : '',
          total:       i.total       != null ? String(i.total)       : '',
          actual_cost: i.actual_cost != null ? String(i.actual_cost) : '',
          arrived:     i.arrived ?? false,
        }))
      : [emptyItem()]
  )

  function set(k: string, v: string)  { setForm(p => ({ ...p, [k]: v })) }
  function setA(k: string, v: string) { setAddr(p => ({ ...p, [k]: v })) }

  function setJinReceived(num: 1 | 2 | 3, v: string) {
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

  async function toggleArrived(idx: number) {
    const updated = items.map((row, i) => i === idx ? { ...row, arrived: !row.arrived } : row)
    setItems(updated)
    if (orderId) {
      const supabase = createClient()
      const payload = updated.map(r => ({
        name: r.name, color: r.color || undefined, item_ccy: r.item_ccy as 'KRW' | 'JPY',
        qty: parseInt(r.qty) || 1, price: parseFloat(r.price) || 0,
        dom_del: r.dom_del ? parseFloat(r.dom_del) : undefined,
        total: r.total ? parseFloat(r.total) : undefined,
        actual_cost: r.actual_cost ? parseFloat(r.actual_cost) : undefined,
        arrived: r.arrived,
      }))
      await supabase.from('orders').update({ items: payload }).eq('id', orderId)
    }
  }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)) }

  const [fxRate, setFxRate] = useState('9.5') // JPY → KRW
  const manualActualCostRef = useRef(!!initial?.actual_goods_cost)

  useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=JPY&to=KRW')
      .then(r => r.json())
      .then(d => { if (d.rates?.KRW) setFxRate(String(Math.round(d.rates.KRW * 100) / 100)) })
      .catch(() => {})
  }, [])

  // Auto-calculate goods_total and service_fee from items
  useEffect(() => {
    const rate = parseFloat(fxRate) || 1
    const subtotal = items.reduce((sum, item) => {
      const raw = parseFloat(item.total) || ((parseFloat(item.price) || 0) * (parseInt(item.qty) || 0) + (parseFloat(item.dom_del) || 0))
      if (!raw) return sum
      if (item.item_ccy === form.currency) return sum + raw
      if (form.currency === 'KRW' && item.item_ccy === 'JPY') return sum + Math.round(raw * rate)
      if (form.currency === 'JPY' && item.item_ccy === 'KRW') return sum + Math.round(raw / rate)
      return sum + raw
    }, 0)
    if (subtotal === 0) return
    const minFee  = form.currency === 'JPY' ? 2500 : 25000
    const rawFee  = subtotal * 0.15
    const unit    = form.currency === 'JPY' ? 100 : 1000
    const rounded = Math.ceil(rawFee / unit) * unit
    const fee     = Math.max(minFee, rounded)
    const actualSum = items.reduce((sum, item) => {
      const v = parseFloat(item.actual_cost)
      if (!v) return sum
      if (item.item_ccy === form.currency) return sum + v
      if (form.currency === 'KRW' && item.item_ccy === 'JPY') return sum + Math.round(v * rate)
      if (form.currency === 'JPY' && item.item_ccy === 'KRW') return sum + Math.round(v / rate)
      return sum + v
    }, 0)
    const hasPerItemActual = items.some(i => !!i.actual_cost)
    setForm(p => ({ ...p, goods_total: String(subtotal), service_fee: String(fee), actual_goods_cost: hasPerItemActual ? String(actualSum) : manualActualCostRef.current ? p.actual_goods_cost : String(subtotal) }))
  }, [items, form.currency, fxRate]) // eslint-disable-line react-hooks/exhaustive-deps

  const [saveError, setSaveError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    const supabase = createClient()

    const parsedItems: OrderItem[] = items
      .filter(i => i.name.trim())
      .map(i => ({
        name:     i.name.trim(),
        color:    i.color.trim() || undefined,
        item_ccy: (i.item_ccy as 'KRW' | 'JPY'),
        qty:      parseInt(i.qty)    || 1,
        price:    parseFloat(i.price) || 0,
        dom_del:     parseFloat(i.dom_del)     || undefined,
        total:       parseFloat(i.total)       || undefined,
        actual_cost: parseFloat(i.actual_cost) || undefined,
        arrived:     i.arrived || undefined,
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
      title:               form.title || (
        form.kind === 'fair' && form.fair_id
          ? (fairs.find(f => String(f.id) === form.fair_id)?.name ?? `Order from ${form.customer_name || form.customer_email}`)
          : parsedItems[0]?.name
            ? `${parsedItems[0].name}${parsedItems.length > 1 ? ` + ${parsedItems.length - 1} more` : ''}`
            : `Order from ${form.customer_name || form.customer_email}`
      ),
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
      paid_3_amount:       form.paid_3_amount       ? parseFloat(form.paid_3_amount)       : null,
      paid_3_date:         form.paid_3_date         || null,
      paid_3_via:          form.paid_3_amount       ? (form.paid_3_via as 'jin' | 'jo')    : null,
      paid_3_transfer_fee: form.paid_3_transfer_fee ? parseFloat(form.paid_3_transfer_fee) : null,
      actual_goods_cost:    form.actual_goods_cost    ? parseFloat(form.actual_goods_cost)    : null,
      actual_shipping_cost: form.actual_shipping_cost ? parseFloat(form.actual_shipping_cost) : null,
      runner_fee:           form.runner_fee           ? parseFloat(form.runner_fee)           : null,
    }

    try {
      const { error } = isEdit
        ? await supabase.from('orders').update(payload).eq('id', orderId)
        : await supabase.from('orders').insert(payload).select('order_number').single()

      if (error) {
        setSaveError(error.message)
        return
      }

      router.push('/admin/orders')
      router.refresh()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '760px' }}>

      {/* Customer */}
      <Section label="Customer">
        {!isEdit && customers && customers.length > 0 && (
          <CustomerSearch customers={customers} onSelect={c => {
            set('customer_email', c.email)
            set('customer_name', c.name ?? '')
            if (c.shipping_address) {
              setAddr({
                name:           c.shipping_address.name           ?? '',
                address:        c.shipping_address.address        ?? '',
                city:           c.shipping_address.city           ?? '',
                country:        c.shipping_address.country        ?? '',
                postal_code:    c.shipping_address.postal_code    ?? '',
                phone:          c.shipping_address.phone          ?? '',
                payment_method: c.shipping_address.payment_method ?? 'wise',
              })
            }
          }} />
        )}
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
        <Field label="Order name (optional — auto-generated if blank)">
          <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder={form.kind === 'fair' && form.fair_id ? fairs.find(f => String(f.id) === form.fair_id)?.name ?? 'e.g. DOTDOTDOT haul' : 'e.g. Sosumuth + 3 items'} />
        </Field>
      </Section>

      {/* Items */}
      <Section label="Items">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px 80px 70px 90px 80px 70px auto', gap: '6px', padding: '0 4px' }}>
            {['Item name', 'Color/size', 'Ccy', 'Qty', 'Unit price', 'Dom.del', 'Total', 'Actual cost', 'Arrived', ''].map(h => (
              <div key={h} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--tan)' }}>{h}</div>
            ))}
          </div>
          {items.map((item, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 60px 80px 70px 90px 80px 70px auto', gap: '6px', alignItems: 'center', background: item.arrived ? 'rgba(42,92,53,0.05)' : 'var(--beige)', padding: '10px', borderRadius: '10px', transition: 'background 0.2s' }}>
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
              <input style={{ ...inputStyle, background: item.actual_cost ? 'rgba(42,92,53,0.06)' : 'rgba(122,92,69,0.04)', fontWeight: item.actual_cost ? 500 : 300, color: item.actual_cost ? '#2A5C35' : undefined }} type="text" inputMode="decimal" placeholder="—" value={item.actual_cost} onChange={e => setItem(idx, 'actual_cost', e.target.value)} />
              <button type="button" onClick={() => toggleArrived(idx)} style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: item.arrived ? 600 : 300,
                padding: '6px 8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                background: item.arrived ? 'rgba(42,92,53,0.15)' : 'rgba(122,92,69,0.1)',
                color: item.arrived ? '#2A5C35' : 'var(--tan)',
              }}>
                {item.arrived ? '✓ Yes' : 'No'}
              </button>
              <button type="button" onClick={() => removeItem(idx)} disabled={items.length === 1} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '18px', color: 'var(--tan)', background: 'none', border: 'none', cursor: items.length === 1 ? 'default' : 'pointer', opacity: items.length === 1 ? 0.3 : 1, padding: '0 4px' }}>×</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addItem} style={{ marginTop: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '99px', padding: '7px 16px', cursor: 'pointer' }}>
          + Add item
        </button>
        {items.some(i => i.item_ccy !== form.currency) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', padding: '8px 12px', background: 'rgba(31,58,95,0.05)', borderRadius: '8px', border: '0.5px solid rgba(31,58,95,0.1)' }}>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--dark-blue)', whiteSpace: 'nowrap' }}>1 JPY =</span>
            <input
              style={{ ...inputStyle, width: '80px', padding: '6px 10px', fontSize: '12px' }}
              type="text" inputMode="decimal"
              value={fxRate}
              onChange={e => setFxRate(e.target.value)}
            />
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--dark-blue)', whiteSpace: 'nowrap' }}>{form.currency}</span>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>· auto-fetched, editable</span>
          </div>
        )}
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '8px' }}>
          Dom.del = domestic delivery fee (included in total)
        </p>
      </Section>

      {/* Totals */}
      <Section label="Totals — auto-calculated from items, editable">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          <Field label="Goods subtotal">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.goods_total} onChange={e => set('goods_total', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Handling fee">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.service_fee} onChange={e => set('service_fee', e.target.value)} placeholder="0" />
          </Field>
          <Field label="Runner fee">
            <input style={inputStyle} type="text" inputMode="decimal" value={form.runner_fee} onChange={e => set('runner_fee', e.target.value)} placeholder="0 (fair / in-store only)" />
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

      {/* Payment received — edit only */}
      {isEdit && (
        <Section label="Payment received">
          {/* Payment 1 */}
          {(() => {
            const isJo       = form.paid_1_via === 'jo'
            const jinHandles = form.currency === 'KRW'
            const fee        = parseFloat(form.paid_1_transfer_fee) || 0
            return (
              <div style={{ padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>Payment 1</div>
                <div style={{ display: 'grid', gridTemplateColumns: isJo && jinHandles ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '10px' }}>
                  <Field label="Amount received">
                    <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.paid_1_amount} onChange={e => set('paid_1_amount', e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <input style={inputStyle} type="date" value={form.paid_1_date} onChange={e => set('paid_1_date', e.target.value)} />
                  </Field>
                  <Field label="Received by">
                    <select style={inputStyle} value={form.paid_1_via} onChange={e => set('paid_1_via', e.target.value)}>
                      <option value="jin">Jin (Shinhan)</option>
                      <option value="jo">Jo (Wise)</option>
                    </select>
                  </Field>
                  {isJo && jinHandles && (
                    <>
                      <Field label="Jin received from Jo">
                        <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.jin_received_1} onChange={e => setJinReceived(1, e.target.value)} />
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
          })()}
          {/* Payment 2 */}
          {(() => {
            const isJo       = form.paid_2_via === 'jo'
            const jinHandles = form.currency === 'KRW'
            const fee        = parseFloat(form.paid_2_transfer_fee) || 0
            return (
              <div style={{ padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>Payment 2 (optional)</div>
                <div style={{ display: 'grid', gridTemplateColumns: isJo && jinHandles ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '10px' }}>
                  <Field label="Amount received">
                    <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.paid_2_amount} onChange={e => set('paid_2_amount', e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <input style={inputStyle} type="date" value={form.paid_2_date} onChange={e => set('paid_2_date', e.target.value)} />
                  </Field>
                  <Field label="Received by">
                    <select style={inputStyle} value={form.paid_2_via} onChange={e => set('paid_2_via', e.target.value)}>
                      <option value="jin">Jin (Shinhan)</option>
                      <option value="jo">Jo (Wise)</option>
                    </select>
                  </Field>
                  {isJo && jinHandles && (
                    <>
                      <Field label="Jin received from Jo">
                        <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.jin_received_2} onChange={e => setJinReceived(2, e.target.value)} />
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
          })()}
          {/* Payment 3 */}
          {(() => {
            const isJo       = form.paid_3_via === 'jo'
            const jinHandles = form.currency === 'KRW'
            const fee        = parseFloat(form.paid_3_transfer_fee) || 0
            return (
              <div style={{ padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>Payment 3 (optional)</div>
                <div style={{ display: 'grid', gridTemplateColumns: isJo && jinHandles ? '1fr 1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', gap: '10px' }}>
                  <Field label="Amount received">
                    <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.paid_3_amount} onChange={e => set('paid_3_amount', e.target.value)} />
                  </Field>
                  <Field label="Date">
                    <input style={inputStyle} type="date" value={form.paid_3_date} onChange={e => set('paid_3_date', e.target.value)} />
                  </Field>
                  <Field label="Received by">
                    <select style={inputStyle} value={form.paid_3_via} onChange={e => set('paid_3_via', e.target.value)}>
                      <option value="jin">Jin (Shinhan)</option>
                      <option value="jo">Jo (Wise)</option>
                    </select>
                  </Field>
                  {isJo && jinHandles && (
                    <>
                      <Field label="Jin received from Jo">
                        <input style={inputStyle} type="text" inputMode="decimal" placeholder="0" value={form.jin_received_3} onChange={e => setJinReceived(3, e.target.value)} />
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
          })()}
          <Field label="Actual goods cost">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, maxWidth: '200px' }} type="text" inputMode="decimal" placeholder="0" value={form.actual_goods_cost} onChange={e => { manualActualCostRef.current = true; set('actual_goods_cost', e.target.value) }} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)' }}>defaults to goods subtotal</span>
            </div>
          </Field>
          <Field label="Actual shipping cost">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input style={{ ...inputStyle, maxWidth: '200px' }} type="text" inputMode="decimal" placeholder="0" value={form.actual_shipping_cost} onChange={e => set('actual_shipping_cost', e.target.value)} />
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)' }}>what you paid — invoice may be higher</span>
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

function CustomerSearch({ customers, onSelect }: { customers: CustomerOption[]; onSelect: (c: CustomerOption) => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const q = query.toLowerCase()
  const filtered = q
    ? customers.filter(c => c.email.toLowerCase().includes(q) || (c.name ?? '').toLowerCase().includes(q))
    : customers

  return (
    <div ref={ref} style={{ position: 'relative', marginBottom: '16px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>
        Fill from past customer
      </div>
      <input
        style={inputStyle}
        placeholder="Search by name or email…"
        value={query}
        onFocus={() => setOpen(true)}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
      />
      {open && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', zIndex: 50, maxHeight: '220px', overflowY: 'auto' }}>
          {filtered.slice(0, 30).map(c => (
            <button
              key={c.email}
              type="button"
              onMouseDown={() => { onSelect(c); setQuery(''); setOpen(false) }}
              style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', borderBottom: '0.5px solid rgba(122,92,69,0.08)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(122,92,69,0.04)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <div style={{ fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)' }}>{c.name || c.email}</div>
              {c.name && <div style={{ fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '1px' }}>{c.email}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
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
