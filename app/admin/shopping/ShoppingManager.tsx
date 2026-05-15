'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Packaging', 'Marketing', 'Stationery', 'Operations', 'Other']
const STATUSES = ['needed', 'ordered', 'received'] as const
type Status = typeof STATUSES[number]

export type ShoppingItem = {
  id: number
  name: string
  category: string | null
  quantity: string | null
  estimated_cost: number | null
  currency: string | null
  status: Status
  url: string | null
  notes: string | null
  created_at: string
}

type FormData = {
  name: string; category: string; quantity: string
  estimated_cost: string; currency: string; url: string; notes: string
}

const emptyForm = (): FormData => ({
  name: '', category: 'Packaging', quantity: '', estimated_cost: '', currency: 'KRW', url: '', notes: '',
})

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
  color: 'var(--dark-brown)', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
  letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)',
  display: 'block', marginBottom: '4px',
}

const STATUS_COLORS: Record<Status, { bg: string; color: string }> = {
  needed:   { bg: 'rgba(122,92,69,0.08)',  color: 'var(--brown)' },
  ordered:  { bg: 'rgba(31,58,95,0.1)',    color: 'var(--dark-blue)' },
  received: { bg: 'rgba(42,92,53,0.1)',    color: '#2A5C35' },
}

function ItemForm({ initial, onSave, onCancel, saving }: {
  initial: FormData; onSave: (f: FormData) => void; onCancel: () => void; saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '12px' }}>
      <div style={{ gridColumn: '1 / span 2' }}>
        <label style={labelStyle}>Item *</label>
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Bubble wrap, business cards…" />
      </div>
      <div>
        <label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Quantity</label>
        <input style={inputStyle} value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="100 pcs, 2 rolls…" />
      </div>
      <div>
        <label style={labelStyle}>Est. cost</label>
        <input style={inputStyle} type="text" inputMode="decimal" value={form.estimated_cost} onChange={e => set('estimated_cost', e.target.value)} placeholder="0" />
      </div>
      <div>
        <label style={labelStyle}>Currency</label>
        <select style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
          {['KRW', 'JPY', 'MYR', 'USD'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Link (where to buy)</label>
        <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://…" />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Notes</label>
        <input style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Size, colour, supplier…" />
      </div>
      <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '8px' }}>
        <button type="button" disabled={saving || !form.name.trim()} onClick={() => onSave(form)}
          style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '9px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={onCancel}
          style={{ background: 'transparent', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, padding: '9px 22px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export function ShoppingManager({ items }: { items: ShoppingItem[] }) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState<Status | 'all'>('all')

  async function addItem(form: FormData) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('business_shopping').insert({
      name: form.name.trim(),
      category: form.category || null,
      quantity: form.quantity.trim() || null,
      estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
      currency: form.currency || 'KRW',
      url: form.url.trim() || null,
      notes: form.notes.trim() || null,
    })
    setSaving(false)
    setShowAdd(false)
    router.refresh()
  }

  async function updateItem(id: number, form: FormData) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('business_shopping').update({
      name: form.name.trim(),
      category: form.category || null,
      quantity: form.quantity.trim() || null,
      estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
      currency: form.currency || 'KRW',
      url: form.url.trim() || null,
      notes: form.notes.trim() || null,
    }).eq('id', id)
    setSaving(false)
    setEditId(null)
    router.refresh()
  }

  async function setStatus(id: number, status: Status) {
    const supabase = createClient()
    await supabase.from('business_shopping').update({ status }).eq('id', id)
    router.refresh()
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this item?')) return
    const supabase = createClient()
    await supabase.from('business_shopping').delete().eq('id', id)
    router.refresh()
  }

  const visible = filter === 'all' ? items : items.filter(i => i.status === filter)
  const counts = {
    all: items.length,
    needed: items.filter(i => i.status === 'needed').length,
    ordered: items.filter(i => i.status === 'ordered').length,
    received: items.filter(i => i.status === 'received').length,
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        {(['all', 'needed', 'ordered', 'received'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)} type="button" style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: filter === s ? 500 : 300,
            padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer',
            background: filter === s ? 'var(--dark-brown)' : 'rgba(122,92,69,0.08)',
            color: filter === s ? 'var(--cream)' : 'var(--brown)',
          }}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s]})
          </button>
        ))}
        <button type="button" onClick={() => setShowAdd(v => !v)} style={{ marginLeft: 'auto', background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '9px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>
          + Add item
        </button>
      </div>

      {showAdd && <ItemForm initial={emptyForm()} onSave={addItem} onCancel={() => setShowAdd(false)} saving={saving} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {visible.map(item => (
          <div key={item.id}>
            {editId === item.id ? (
              <ItemForm
                initial={{ name: item.name, category: item.category ?? 'Packaging', quantity: item.quantity ?? '', estimated_cost: item.estimated_cost?.toString() ?? '', currency: item.currency ?? 'KRW', url: item.url ?? '', notes: item.notes ?? '' }}
                onSave={f => updateItem(item.id, f)}
                onCancel={() => setEditId(null)}
                saving={saving}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '10px 14px', background: 'white', borderRadius: '10px', border: '0.5px solid rgba(122,92,69,0.1)', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)' }}>{item.name}</span>
                  {item.notes && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginLeft: '8px' }}>{item.notes}</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
                  {item.category}{item.quantity ? ` · ${item.quantity}` : ''}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: item.estimated_cost ? 'var(--dark-brown)' : 'var(--tan)' }}>
                  {item.estimated_cost ? `${item.estimated_cost.toLocaleString()} ${item.currency}` : '—'}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {STATUSES.map(s => (
                    <button key={s} type="button" onClick={() => setStatus(item.id, s)} style={{
                      fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: item.status === s ? 500 : 300,
                      padding: '3px 8px', borderRadius: '99px', border: 'none', cursor: 'pointer',
                      background: item.status === s ? STATUS_COLORS[s].bg : 'transparent',
                      color: item.status === s ? STATUS_COLORS[s].color : 'var(--tan)',
                      outline: item.status === s ? `1px solid ${STATUS_COLORS[s].color}22` : 'none',
                    }}>{s}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--dark-blue)', background: 'none', borderRadius: '6px', padding: '4px 10px', border: '0.5px solid rgba(31,58,95,0.2)', textDecoration: 'none' }}>↗</a>
                  )}
                  <button type="button" onClick={() => setEditId(item.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>Edit</button>
                  <button type="button" onClick={() => deleteItem(item.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#8A3A20', background: 'none', border: '0.5px solid rgba(138,58,32,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>×</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>
            {filter === 'all' ? 'No items yet.' : `Nothing ${filter}.`}
          </div>
        )}
      </div>
    </div>
  )
}
