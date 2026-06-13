'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

const CATEGORIES = ['Illustration', 'Print & Zine', 'Art Goods', 'Stationery', 'Textile', 'Craft', 'Other']
const COUNTRIES = [
  { value: 'KR', label: '🇰🇷 Korea' },
  { value: 'JP', label: '🇯🇵 Japan' },
  { value: 'INTL', label: '🌍 International' },
]

type FormData = {
  name: string; korean_name: string; instagram: string; posts: string[]
  category: string; country: string; booth: string; url: string
}

const emptyForm = (): FormData => ({
  name: '', korean_name: '', instagram: '', posts: [''],
  category: 'Illustration', country: 'KR', booth: '', url: '',
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

function BrandForm({ initial, onSave, onCancel, saving }: {
  initial: FormData
  onSave: (f: FormData) => void
  onCancel: () => void
  saving: boolean
}) {
  const [form, setForm] = useState(initial)
  const set = (k: keyof Omit<FormData, 'posts'>, v: string) => setForm(p => ({ ...p, [k]: v }))

  function setPost(i: number, v: string) {
    setForm(p => { const posts = [...p.posts]; posts[i] = v; return { ...p, posts } })
  }
  function addPost() {
    setForm(p => ({ ...p, posts: [...p.posts, ''] }))
  }
  function removePost(i: number) {
    setForm(p => ({ ...p, posts: p.posts.filter((_, idx) => idx !== i) }))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '16px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '12px' }}>
      <div><label style={labelStyle}>Name *</label>
        <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Brand name" /></div>
      <div><label style={labelStyle}>Korean name</label>
        <input style={inputStyle} value={form.korean_name} onChange={e => set('korean_name', e.target.value)} placeholder="한국어 이름" /></div>
      <div><label style={labelStyle}>Category</label>
        <select style={inputStyle} value={form.category} onChange={e => set('category', e.target.value)}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select></div>
      <div><label style={labelStyle}>Country</label>
        <select style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)}>
          {COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select></div>
      <div><label style={labelStyle}>Booth</label>
        <input style={inputStyle} value={form.booth} onChange={e => set('booth', e.target.value)} placeholder="A01" /></div>
      <div><label style={labelStyle}>Instagram</label>
        <input style={inputStyle} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="handle (no @)" /></div>

      <div style={{ gridColumn: '1 / -1' }}>
        <label style={labelStyle}>Instagram post URLs</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {form.posts.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={p}
                onChange={e => setPost(i, e.target.value)}
                placeholder="https://www.instagram.com/p/..."
              />
              {form.posts.length > 1 && (
                <button type="button" onClick={() => removePost(i)}
                  style={{ background: 'none', border: '0.5px solid rgba(138,58,32,0.25)', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#8A3A20', fontSize: '13px', flexShrink: 0 }}>
                  ×
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addPost}
            style={{ alignSelf: 'flex-start', background: 'none', border: '0.5px solid rgba(122,92,69,0.25)', borderRadius: '99px', padding: '5px 14px', cursor: 'pointer', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--brown)' }}>
            + Add post
          </button>
        </div>
      </div>

      <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Website URL (for logo)</label>
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

function brandToForm(brand: CatalogueBrand): FormData {
  const posts = brand.posts?.length ? brand.posts : brand.post ? [brand.post] : ['']
  return {
    name: brand.name,
    korean_name: brand.korean_name ?? '',
    instagram: brand.instagram ?? '',
    posts,
    category: brand.category ?? 'Illustration',
    country: brand.country ?? 'KR',
    booth: brand.booth ?? '',
    url: brand.url ?? '',
  }
}

export function BrandManager({ brands }: { brands: CatalogueBrand[] }) {
  const router = useRouter()
  const [showAdd, setShowAdd] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('')

  function cleanPosts(posts: string[]) {
    return posts.map(p => p.trim()).filter(Boolean)
  }

  async function addBrand(form: FormData) {
    setSaving(true)
    const supabase = createClient()
    const posts = cleanPosts(form.posts)
    await supabase.from('catalogue_brands').insert({
      catalogue_id: 'sif-v21',
      name: form.name.trim(),
      korean_name: form.korean_name.trim() || null,
      instagram: form.instagram.trim() || null,
      post: null,
      posts: posts.length ? posts : null,
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
    const posts = cleanPosts(form.posts)
    await supabase.from('catalogue_brands').update({
      name: form.name.trim(),
      korean_name: form.korean_name.trim() || null,
      instagram: form.instagram.trim() || null,
      post: null,
      posts: posts.length ? posts : null,
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

      {showAdd && (
        <BrandForm initial={emptyForm()} onSave={addBrand} onCancel={() => setShowAdd(false)} saving={saving} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {visible.map(brand => {
          const postCount = brand.posts?.length ?? (brand.post ? 1 : 0)
          return (
            <div key={brand.id}>
              {editId === brand.id ? (
                <BrandForm
                  initial={brandToForm(brand)}
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
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: postCount > 0 ? '#2A5C35' : 'var(--tan)' }}>
                    {postCount > 0 ? `✓ ${postCount} post${postCount > 1 ? 's' : ''}` : 'no post'}{brand.booth ? ` · ${brand.booth}` : ''}
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
          )
        })}
      </div>
    </div>
  )
}
