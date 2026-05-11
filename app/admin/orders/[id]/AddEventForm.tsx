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

const ALL_EVENT_STATUSES: OrderStatus[] = [...STATUS_ORDER, 'cancelled']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function AddEventForm({ orderId }: { orderId: number }) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>('paid')
  const [note,   setNote]   = useState('')
  const [date,   setDate]   = useState(todayStr())
  const [saving, setSaving] = useState(false)

  const [error, setError] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const supabase = createClient()
      const eventTs = new Date(date + 'T12:00:00').toISOString()
      const { error: e1 } = await supabase.from('order_events').insert({ order_id: orderId, status, note: note || null, created_at: eventTs })
      if (e1) { setError(e1.message); return }
      const { error: e2 } = await supabase.from('orders').update({ status, updated_at: eventTs }).eq('id', orderId)
      if (e2) { setError(e2.message); return }
      setNote('')
      setDate(todayStr())
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>
        Add timeline event
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value as OrderStatus)}>
          {ALL_EVENT_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <input style={inputStyle} type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>
      <input style={inputStyle} value={note} onChange={e => setNote(e.target.value)} placeholder='Note, e.g. "Found at booth 47!"' />
      {error && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#8A3A20', background: '#F5DDD5', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}
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
