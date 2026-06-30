'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function nameToSlug(n: string) {
  return n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function CatalogueButton({ id, name, catalogueUrl }: { id: number; name: string; catalogueUrl: string | null }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  if (catalogueUrl) {
    const slug = catalogueUrl.replace('/catalogue/', '')
    return (
      <a href={`/admin/catalogue/${slug}`} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: '#7A6010', textDecoration: 'none', background: 'rgba(243,227,161,0.4)', border: '0.5px solid rgba(243,227,161,0.7)', padding: '4px 10px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
        Catalogue ↗︎
      </a>
    )
  }

  async function generate() {
    setBusy(true)
    const slug = nameToSlug(name)
    const supabase = createClient()
    await supabase.from('fairs').update({ catalogue_url: `/catalogue/${slug}` }).eq('id', id)
    router.push(`/admin/catalogue/${slug}`)
  }

  return (
    <button onClick={generate} disabled={busy} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--brown)', background: 'transparent', border: '0.5px solid rgba(107,163,200,0.25)', padding: '4px 10px', borderRadius: '99px', cursor: busy ? 'wait' : 'pointer', whiteSpace: 'nowrap', opacity: busy ? 0.6 : 1 }}>
      {busy ? 'Creating…' : '+ Catalogue'}
    </button>
  )
}

export function DeleteFairButton({ id }: { id: number }) {
  const router = useRouter()
  async function del() {
    if (!confirm('Delete this fair?')) return
    const supabase = createClient()
    await supabase.from('fairs').delete().eq('id', id)
    router.refresh()
  }
  return (
    <button onClick={del} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
      Delete
    </button>
  )
}

export function KeepOnlyKoreaJapanButton() {
  const router  = useRouter()
  const [busy, setBusy] = useState(false)
  async function clean() {
    if (!confirm('Delete all fairs except Korea and Japan?')) return
    setBusy(true)
    const supabase = createClient()
    await supabase.from('fairs').delete().not('country', 'in', '("Korea","Japan")')
    setBusy(false)
    router.refresh()
  }
  return (
    <button onClick={clean} disabled={busy} style={{
      fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400,
      color: '#8A3A20', background: '#F5DDD5', border: '0.5px solid rgba(138,58,32,0.2)',
      padding: '10px 20px', borderRadius: '99px', cursor: busy ? 'wait' : 'pointer',
      opacity: busy ? 0.7 : 1,
    }}>
      {busy ? 'Deleting…' : 'Keep only Korea & Japan'}
    </button>
  )
}
