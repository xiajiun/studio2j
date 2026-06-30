'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

const inp: React.CSSProperties = {
  padding: '8px 12px', borderRadius: '8px', border: '0.5px solid rgba(122,92,69,0.2)',
  background: 'white', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px',
  fontWeight: 300, color: 'var(--dark-brown)', outline: 'none', width: '100%',
}

const emptyForm = () => ({ name: '', korean_name: '', instagram: '', booth: '', category: '', url: '' })

export function CatalogueAdmin({ brands: init, catalogueId }: { brands: CatalogueBrand[]; catalogueId: string }) {
  const router = useRouter()
  const [brands, setBrands] = useState(init)
  const [form, setForm] = useState(emptyForm())
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const supabase = createClient()
    const { data } = await supabase.from('catalogue_brands').insert({
      catalogue_id: catalogueId,
      name: form.name.trim(),
      korean_name: form.korean_name.trim() || null,
      instagram: form.instagram.trim() || null,
      booth: form.booth.trim() || null,
      category: form.category.trim() || null,
      url: form.url.trim() || null,
      sort_order: brands.length,
      posts: [],
    }).select().single()
    if (data) setBrands(prev => [...prev, data as CatalogueBrand])
    setForm(emptyForm())
    setSaving(false)
    setAdding(false)
  }

  async function remove(id: number) {
    if (!confirm('Delete this brand?')) return
    const supabase = createClient()
    await supabase.from('catalogue_brands').delete().eq('id', id)
    setBrands(prev => prev.filter(b => b.id !== id))
  }

  const visible = brands.filter(b =>
    !search || b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.korean_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (b.booth ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search brands…"
          style={{ ...inp, width: '220px' }}
        />
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)' }}>
          {brands.length} brand{brands.length !== 1 ? 's' : ''}
        </span>
        <button onClick={() => setAdding(v => !v)} style={{ marginLeft: 'auto', background: 'var(--dark-blue)', color: 'var(--cream)', border: 'none', padding: '8px 18px', borderRadius: '99px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500 }}>
          {adding ? 'Cancel' : '+ Add brand'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={add} style={{ background: 'white', border: '0.5px solid rgba(122,92,69,0.12)', borderRadius: '14px', padding: '20px', marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Brand name *" style={inp} />
          <input value={form.korean_name} onChange={e => setForm(f => ({ ...f, korean_name: e.target.value }))} placeholder="Korean name" style={inp} />
          <input value={form.instagram} onChange={e => setForm(f => ({ ...f, instagram: e.target.value }))} placeholder="Instagram handle (no @)" style={inp} />
          <input value={form.booth} onChange={e => setForm(f => ({ ...f, booth: e.target.value }))} placeholder="Booth number" style={inp} />
          <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Category" style={inp} />
          <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="Website URL" style={inp} />
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={() => setAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', border: 'none', padding: '8px 20px', borderRadius: '99px', cursor: saving ? 'wait' : 'pointer', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Add brand'}
            </button>
          </div>
        </form>
      )}

      {/* Brand list */}
      {visible.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          {search ? 'No brands match.' : 'No brands yet — add the first one above.'}
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {visible.map(b => (
            <div key={b.id} style={{ background: 'white', border: '0.5px solid rgba(122,92,69,0.1)', borderRadius: '12px', padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '12px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', color: 'var(--dark-brown)' }}>{b.name}</span>
                {b.korean_name && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: 'var(--tan)', marginLeft: '8px' }}>{b.korean_name}</span>}
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '4px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {b.booth && <span>Booth {b.booth}</span>}
                  {b.category && <span>{b.category}</span>}
                  {b.instagram && <span>@{b.instagram}</span>}
                </div>
              </div>
              <button onClick={() => remove(b.id)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
