'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CATEGORIES = ['Packaging', 'Marketing', 'Stationery', 'Operations', 'Other']

export type ShoppingItem = {
  id: number
  name: string
  category: string | null
  quantity: string | null
  estimated_cost: number | null
  currency: string | null
  purchase_date: string | null
  url: string | null
  notes: string | null
  created_at: string
}

type FormData = {
  name: string; category: string; quantity: string
  estimated_cost: string; currency: string; purchase_date: string; url: string; notes: string
}

function today() { return new Date().toISOString().slice(0, 10) }

const emptyForm = (): FormData => ({
  name: '', category: 'Packaging', quantity: '', estimated_cost: '', currency: 'KRW', purchase_date: today(), url: '', notes: '',
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

function ItemForm({ initial, onSave, onCancel, saving }: {
  initial: FormData; onSave: (f: FormData) => void; onCancel: () => void; saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '12px' }}>
      <div style={{ gridColumn: '1 / span 2' }}>
        <label style={labelStyle}>Item *</label>
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Bubble mailers, business cards…" />
      </div>
      <div>
        <label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Date purchased</label>
        <input style={inputStyle} type="date" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} />
      </div>
      <div>
        <label style={labelStyle}>Amount</label>
        <input style={inputStyle} type="text" inputMode="decimal" value={form.estimated_cost} onChange={e => set('estimated_cost', e.target.value)} placeholder="0" />
      </div>
      <div>
        <label style={labelStyle}>Currency</label>
        <select style={inputStyle} value={form.currency} onChange={e => set('currency', e.target.value)}>
          {['KRW', 'JPY', 'MYR', 'USD'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Quantity</label>
        <input style={inputStyle} value={form.quantity} onChange={e => set('quantity', e.target.value)} placeholder="100 pcs…" />
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Notes</label>
        <input style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Supplier, colour, specs…" />
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

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ShoppingManager({ items }: { items: ShoppingItem[] }) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [filterCat, setFilterCat] = useState('All')

  async function addItem(form: FormData) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('business_shopping').insert({
      name: form.name.trim(),
      category: form.category || null,
      quantity: form.quantity.trim() || null,
      estimated_cost: form.estimated_cost ? parseFloat(form.estimated_cost) : null,
      currency: form.currency || 'KRW',
      purchase_date: form.purchase_date || null,
      notes: form.notes.trim() || null,
    })
    setSaving(false); setShowAdd(false); router.refresh()
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
      purchase_date: form.purchase_date || null,
      notes: form.notes.trim() || null,
    }).eq('id', id)
    setSaving(false); setEditId(null); router.refresh()
  }

  async function deleteItem(id: number) {
    if (!confirm('Delete this expense?')) return
    const supabase = createClient()
    await supabase.from('business_shopping').delete().eq('id', id)
    router.refresh()
  }

  const cats = ['All', ...Array.from(new Set(items.map(i => i.category ?? 'Other')))]
  const visible = filterCat === 'All' ? items : items.filter(i => (i.category ?? 'Other') === filterCat)

  // Totals by currency
  const totals: Record<string, number> = {}
  for (const i of items) {
    if (i.estimated_cost) {
      const ccy = i.currency ?? 'KRW'
      totals[ccy] = (totals[ccy] ?? 0) + i.estimated_cost
    }
  }

  return (
    <div>
      {/* Totals */}
      {Object.entries(totals).length > 0 && (
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {Object.entries(totals).map(([ccy, amt]) => (
            <div key={ccy} style={{ background: 'var(--beige)', borderRadius: '12px', padding: '14px 20px', border: '0.5px solid rgba(122,92,69,0.1)' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>Total spent · {ccy}</div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 300, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>{amt.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} type="button" style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: filterCat === c ? 500 : 300,
            padding: '6px 14px', borderRadius: '99px', border: 'none', cursor: 'pointer',
            background: filterCat === c ? 'var(--dark-brown)' : 'rgba(122,92,69,0.08)',
            color: filterCat === c ? 'var(--cream)' : 'var(--brown)',
          }}>{c}</button>
        ))}
        <button type="button" onClick={() => setShowAdd(v => !v)} style={{ marginLeft: 'auto', background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '9px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>
          + Add expense
        </button>
      </div>

      {showAdd && <ItemForm initial={emptyForm()} onSave={addItem} onCancel={() => setShowAdd(false)} saving={saving} />}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {visible.map(item => (
          <div key={item.id}>
            {editId === item.id ? (
              <ItemForm
                initial={{ name: item.name, category: item.category ?? 'Packaging', quantity: item.quantity ?? '', estimated_cost: item.estimated_cost?.toString() ?? '', currency: item.currency ?? 'KRW', purchase_date: item.purchase_date ?? today(), url: item.url ?? '', notes: item.notes ?? '' }}
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
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
                  {item.purchase_date ? fmtDate(item.purchase_date) : '—'}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: item.estimated_cost ? '#8A3A20' : 'var(--tan)', textAlign: 'right' }}>
                  {item.estimated_cost ? `${item.estimated_cost.toLocaleString()} ${item.currency}` : '—'}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" onClick={() => setEditId(item.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>Edit</button>
                  <button type="button" onClick={() => deleteItem(item.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#8A3A20', background: 'none', border: '0.5px solid rgba(138,58,32,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>×</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {visible.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>No expenses recorded yet.</div>
        )}
      </div>
    </div>
  )
}
