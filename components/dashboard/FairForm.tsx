'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const FAIR_TYPES = ['illustration', 'stationery', 'zine', 'art', 'craft']
const REGIONS    = ['Asia', 'Europe', 'North America', 'Oceania']

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

export function FairForm() {
  const router  = useRouter()
  const [open, setOpen]   = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm]   = useState({
    name: '', city: '', country: '', region: 'Asia',
    date: '', deadline: '', types: [] as string[],
    featured: false, going: false, notes: '',
  })

  function set(k: string, v: unknown) { setForm(p => ({ ...p, [k]: v })) }

  function toggleType(t: string) {
    setForm(p => ({
      ...p,
      types: p.types.includes(t) ? p.types.filter(x => x !== t) : [...p.types, t],
    }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.date || !form.deadline || form.types.length === 0) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('fairs').insert({
      name: form.name, city: form.city, country: form.country,
      region: form.region, date: form.date, deadline: form.deadline,
      types: form.types, featured: form.featured, going: form.going,
      notes: form.notes || null,
    })
    setSaving(false)
    setOpen(false)
    setForm({ name: '', city: '', country: '', region: 'Asia', date: '', deadline: '', types: [], featured: false, going: false, notes: '' })
    router.refresh()
  }

  return (
    <div>
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}
        >
          + Add fair
        </button>
      ) : (
        <form onSubmit={submit} style={{ background: 'white', border: '0.5px solid rgba(122,92,69,0.12)', borderRadius: '18px', padding: '28px', marginBottom: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', color: 'var(--dark-brown)', marginBottom: '20px', fontWeight: 400 }}>Add fair</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <Field label="Fair name"><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Seoul Illustration Fair" required /></Field>
            <Field label="City"><input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} placeholder="Seoul" /></Field>
            <Field label="Country"><input style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)} placeholder="Korea" /></Field>
            <Field label="Region">
              <select style={inputStyle} value={form.region} onChange={e => set('region', e.target.value)}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Fair date"><input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} required /></Field>
            <Field label="Order deadline"><input type="date" style={inputStyle} value={form.deadline} onChange={e => set('deadline', e.target.value)} required /></Field>
          </div>

          <Field label="Types" style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {FAIR_TYPES.map(t => (
                <button key={t} type="button" onClick={() => toggleType(t)} style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: form.types.includes(t) ? 500 : 300,
                  padding: '6px 14px', borderRadius: '99px', cursor: 'pointer',
                  background: form.types.includes(t) ? 'var(--dark-brown)' : 'transparent',
                  color: form.types.includes(t) ? 'var(--cream)' : 'var(--brown)',
                  border: `0.5px solid ${form.types.includes(t) ? 'var(--dark-brown)' : 'rgba(122,92,69,0.2)'}`,
                }}>{t}</button>
              ))}
            </div>
          </Field>

          <Field label="Notes (optional)" style={{ marginBottom: '12px' }}>
            <input style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="One of our favourite Japan fairs" />
          </Field>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.going} onChange={e => set('going', e.target.checked)} /> We&apos;re attending
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', cursor: 'pointer' }}>
              <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured
            </label>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" disabled={saving} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving…' : 'Save fair'}
            </button>
            <button type="button" onClick={() => setOpen(false)} style={{ color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, padding: '11px 22px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'transparent', cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </form>
      )}
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
