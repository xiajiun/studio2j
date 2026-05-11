'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

const CATEGORIES = ['Small Thing', 'Writing & Drawing', 'Daily Finds', 'Paper', 'Office & Desk', 'Kiosk', 'Workshop']
const COUNTRIES = [
  { value: 'KR', label: '🇰🇷 Korea' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'INTL', label: '🌍 International' },
]

type FormData = {
  name: string; korean_name: string; instagram: string; post: string
  category: string; country: string; booth: string; url: string
}

const emptyForm = (): FormData => ({
  name: '', korean_name: '', instagram: '', post: '',
  category: 'Small Thing', country: 'KR', booth: '', url: '',
})

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 12px', borderRadius: '8px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
  color: 'var(--dark-brown)', outline: 'none',
}

function BrandForm({ initial, onSave, onCancel, saving }: {
  initial: FormData
  onSave: (f: FormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof FormData, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '12px' }}>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Name *</label>
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Brand name" /></div>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Korean name</label>
        <input style={inputStyle} value={form.korean_name} onChange={e => set('korean_name', e.target.value)} placeholder="한국어 이름" /></div>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Category</label>
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select></div>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Country</label>
        <select style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select></div>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Booth</label>
        <input style={inputStyle} value={form.booth} onChange={e => set('booth', e.target.value)} placeholder="A-01" /></div>
      <div><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Instagram</label>
        <input style={inputStyle} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="handle (no @)" /></div>
      <div style={{ gridColumn: '1 / -1' }}><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Instagram post URL</label>
        <input style={inputStyle} value={form.post} onChange={e => set('post', e.target.value)} placeholder="https://www.instagram.com/p/..." /></div>
      <div style={{ gridColumn: '1 / -1' }}><label style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', display: 'block', marginBottom: '4px' }}>Website URL (for logo)</label>
        <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)} placeholder="brand.com" /></div>
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

export function BrandManager({ brands }: { brands: CatalogueBrand[] }) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('')

  async function addBrand(form: FormData) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('catalogue_brands').insert({
      catalogue_id: 'inventario-2026',
      name: form.name.trim(),
      korean_name: form.korean_name.trim() || null,
      instagram: form.instagram.trim() || null,
      post: form.post.trim() || null,
      category: form.category || null,
      country: form.country || 'KR',
      booth: form.booth.trim() || null,
      url: form.url.trim() || null,
      sort_order: brands.length,
    })
    setSaving(false)
    setShowAdd(false)
    router.refresh()
  }

  async function updateBrand(id: number, form: FormData) {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('catalogue_brands').update({
      name: form.name.trim(),
      korean_name: form.korean_name.trim() || null,
      instagram: form.instagram.trim() || null,
      post: form.post.trim() || null,
      category: form.category || null,
      country: form.country || 'KR',
      booth: form.booth.trim() || null,
      url: form.url.trim() || null,
    }).eq('id', id)
    setSaving(false)
    setEditId(null)
    router.refresh()
  }

  async function deleteBrand(id: number) {
    if (!confirm('Delete this brand?')) return
    const supabase = createClient()
    await supabase.from('catalogue_brands').delete().eq('id', id)
    router.refresh()
  }

  const q = filter.toLowerCase()
  const visible = q ? brands.filter(b => b.name.toLowerCase().includes(q) || (b.korean_name ?? '').toLowerCase().includes(q) || (b.category ?? '').toLowerCase().includes(q)) : brands

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center' }}>
        <input
          style={{ ...inputStyle, maxWidth: '280px' }}
          placeholder="Search brands…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)' }}>{brands.length} brands</span>
        <button type="button" onClick={() => setShowAdd(v => !v)}
          style={{ marginLeft: 'auto', background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '9px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>
          + Add brand
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <BrandForm initial={emptyForm()} onSave={addBrand} onCancel={() => setShowAdd(false)} saving={saving} />
      )}

      {/* Brand list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {visible.map(brand => (
          <div key={brand.id}>
            {editId === brand.id ? (
              <BrandForm
                initial={{ name: brand.name, korean_name: brand.korean_name ?? '', instagram: brand.instagram ?? '', post: brand.post ?? '', category: brand.category ?? 'Small Thing', country: brand.country ?? 'KR', booth: brand.booth ?? '', url: brand.url ?? '' }}
                onSave={f => updateBrand(brand.id, f)}
                onCancel={() => setEditId(null)}
                saving={saving}
              />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '8px', padding: '10px 14px', background: 'white', borderRadius: '10px', border: '0.5px solid rgba(122,92,69,0.1)', alignItems: 'center' }}>
                <div>
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)' }}>{brand.name}</span>
                  {brand.korean_name && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginLeft: '8px' }}>{brand.korean_name}</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>{brand.category}</div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: brand.instagram ? 'var(--dark-blue)' : 'var(--tan)' }}>
                  {brand.instagram ? `@${brand.instagram}` : '—'}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: brand.post ? '#2A5C35' : 'var(--tan)' }}>
                  {brand.post ? '✓ post' : 'no post'}{brand.booth ? ` · ${brand.booth}` : ''}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button type="button" onClick={() => setEditId(brand.id)}
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--brown)', background: 'none', border: '0.5px solid rgba(122,92,69,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteBrand(brand.id)}
                    style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#8A3A20', background: 'none', border: '0.5px solid rgba(138,58,32,0.2)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }}>
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
