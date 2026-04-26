'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
