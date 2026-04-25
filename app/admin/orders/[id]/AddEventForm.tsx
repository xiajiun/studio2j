'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { STATUS_LABELS, STATUS_ORDER, type OrderStatus } from '@/lib/database.types'

const inputStyle = {
  width: '100%', padding: '9px 14px', borderRadius: '10px',
  border: '0.5px solid rgba(122,92,69,0.2)', background: 'white',
  color: 'var(--dark-brown)', fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px', fontWeight: 300, outline: 'none',
}

export function AddEventForm({ orderId }: { orderId: number }) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>('paid')
  const [note,   setNote]   = useState('')
  const [saving, setSaving] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    await supabase.from('order_events').insert({ order_id: orderId, status, note: note || null })
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
    setNote('')
    setSaving(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>
        Add timeline event
      </div>
      <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as OrderStatus)}>
        {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
      </select>
      <input style={inputStyle} value={note} onChange={e => setNote(e.target.value)} placeholder='Note, e.g. "Found at booth 47!"' />
      <button type="submit" disabled={saving} style={{
        background: 'var(--dark-blue)', color: 'var(--cream)',
        fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500,
        padding: '10px 20px', borderRadius: '99px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1,
      }}>
        {saving ? 'Saving…' : 'Add event'}
      </button>
    </form>
  )
}
