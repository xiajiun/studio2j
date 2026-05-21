'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { OrderItem } from '@/lib/database.types'

export function ItemArrivalRow({ orderId, items }: { orderId: number; items: OrderItem[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState<number | null>(null)

  async function toggle(idx: number) {
    setBusy(idx)
    const updated = items.map((item, i) =>
      i === idx ? { ...item, arrived: !item.arrived } : item
    )
    const supabase = createClient()
    await supabase.from('orders').update({ items: updated }).eq('id', orderId)
    setBusy(null)
    router.refresh()
  }

  if (!items.length) return null

  return (
    <div style={{
      padding: '6px 24px 14px',
      display: 'flex', gap: '6px', flexWrap: 'wrap',
      borderBottom: '0.5px solid rgba(122,92,69,0.08)',
      marginTop: '-4px',
    }}>
      {items.map((item, i) => {
        const arrived = !!item.arrived
        return (
          <button
            key={i}
            onClick={() => toggle(i)}
            disabled={busy === i}
            style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '11px', fontWeight: arrived ? 500 : 300,
              padding: '4px 10px', borderRadius: '99px',
              border: arrived
                ? '1px solid rgba(42,92,53,0.3)'
                : '0.5px solid rgba(122,92,69,0.2)',
              background: arrived ? 'rgba(42,92,53,0.08)' : 'transparent',
              color: arrived ? '#2A5C35' : 'var(--tan)',
              cursor: 'pointer',
              opacity: busy === i ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            {arrived ? '✓ ' : ''}{item.name}{item.qty > 1 ? ` ×${item.qty}` : ''}
          </button>
        )
      })}
    </div>
  )
}
