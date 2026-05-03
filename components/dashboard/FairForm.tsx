'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { FairRow } from '@/lib/database.types'

const FAIR_TYPES = ['illustration', 'stationery', 'zine', 'art', 'craft']
const REGIONS    = ['Asia', 'Europe', 'North America', 'Oceania']

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 16px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

type FormState = {
  name: string; city: string; country: string; region: string
  date: string; deadline: string; types: string[]
  featured: boolean; going: boolean; url: string; image_url: string; catalogue_url: string; notes: string
}

function blankForm(f?: FairRow): FormState {
  return {
    name:      f?.name      ?? '',
    city:      f?.city      ?? '',
    country:   f?.country   ?? '',
    region:    f?.region    ?? 'Asia',
    date:      f?.date      ?? '',
    deadline:  f?.deadline  ?? '',
    types:     f?.types     ?? [],
    featured:  f?.featured  ?? false,
    going:     f?.going     ?? false,
    url:           f?.url           ?? '',
    image_url:     f?.image_url     ?? '',
    catalogue_url: f?.catalogue_url ?? '',
    notes:         f?.notes         ?? '',
  }
}

function FairFormInner({ fair, onClose }: { fair?: FairRow; onClose: () => void }) {
  const router  = useRouter()
  const isEdit  = !!fair
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormState>(blankForm(fair))

  function set(k: string, v: unknown) { setForm(p => ({ ...p, [k]: v })) }
  function toggleType(t: string) {
    setForm(p => ({ ...p, types: p.types.includes(t) ? p.types.filter(x => x !== t) : [...p.types, t] }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (form.types.length === 0) return
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name: form.name, city: form.city, country: form.country,
      region: form.region, date: form.date, deadline: form.deadline,
      types: form.types, featured: form.featured, going: form.going,
      url:           form.url           || null,
      image_url:     form.image_url     || null,
      catalogue_url: form.catalogue_url || null,
      notes:         form.notes         || null,
    }
    if (isEdit) {
      await supabase.from('fairs').update(payload).eq('id', fair.id)
    } else {
      await supabase.from('fairs').insert(payload)
    }
    setSaving(false)
    onClose()
    router.refresh()
  }

  return (
    <form onSubmit={submit} style={{ background: 'white', border: '0.5px solid rgba(122,92,69,0.12)', borderRadius: '18px', padding: '24px', marginBottom: '20px' }}>
      <h3 style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', color: 'var(--dark-brown)', marginBottom: '16px', fontWeight: 400 }}>
        {isEdit ? `Edit — ${fair.name}` : 'Add fair'}
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <Field label="Name"><input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} required /></Field>
        <Field label="City"><input style={inputStyle} value={form.city} onChange={e => set('city', e.target.value)} /></Field>
        <Field label="Country"><input style={inputStyle} value={form.country} onChange={e => set('country', e.target.value)} /></Field>
        <Field label="Region">
          <select style={inputStyle} value={form.region} onChange={e => set('region', e.target.value)}>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Fair date"><input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} required /></Field>
        <Field label="Order deadline"><input type="date" style={inputStyle} value={form.deadline} onChange={e => set('deadline', e.target.value)} required /></Field>
      </div>

      <Field label="Types" style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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

      <Field label="Website / Instagram URL (optional)" style={{ marginBottom: '10px' }}>
        <input style={inputStyle} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://www.instagram.com/dotdotdot_kr/" />
      </Field>
      <Field label="Cover image URL (optional)" style={{ marginBottom: '10px' }}>
        <input style={inputStyle} value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
      </Field>
      <Field label="Catalogue URL (optional)" style={{ marginBottom: '10px' }}>
        <input style={inputStyle} value={form.catalogue_url} onChange={e => set('catalogue_url', e.target.value)} placeholder="/catalogue/inventario-2026" />
      </Field>

      <Field label="Notes (optional)" style={{ marginBottom: '12px' }}>
        <input style={inputStyle} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="One of our favourite Japan fairs" />
      </Field>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.going} onChange={e => set('going', e.target.checked)} /> We&apos;re attending
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured
        </label>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={saving} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add fair'}
        </button>
        <button type="button" onClick={onClose} style={{ color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, padding: '11px 22px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'transparent', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
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

// ─── Public exports ──────────────────────────────────────────────────────────

export function AddFairButton() {
  const [open, setOpen] = useState(false)
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', border: 'none', cursor: 'pointer' }}>
      + Add fair
    </button>
  )
  return <FairFormInner onClose={() => setOpen(false)} />
}

export function EditFairButton({ fair }: { fair: FairRow }) {
  const [open, setOpen] = useState(false)
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--brown)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
      Edit
    </button>
  )
  return (
    <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
      <FairFormInner fair={fair} onClose={() => setOpen(false)} />
    </div>
  )
}

export function SeedFairsButton({ count }: { count: number }) {
  const router  = useRouter()
  const [seeding, setSeeding] = useState(false)
  const [done, setDone] = useState(false)

  if (count > 0 || done) return null

  async function seed() {
    setSeeding(true)
    const supabase = createClient()
    const { FAIRS } = await import('@/lib/fairs')
    await supabase.from('fairs').insert(
      FAIRS.map(f => ({
        name: f.name, city: f.city, country: f.country, region: f.region,
        date: f.date, deadline: f.deadline, types: f.types,
        featured: f.featured, going: f.going, notes: f.notes ?? null,
      }))
    )
    setSeeding(false)
    setDone(true)
    router.refresh()
  }

  return (
    <button onClick={seed} disabled={seeding} style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '11px 22px', borderRadius: '99px', background: 'transparent', cursor: 'pointer', opacity: seeding ? 0.7 : 1 }}>
      {seeding ? 'Importing…' : '↓ Import default fairs (14)'}
    </button>
  )
}
