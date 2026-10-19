'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Admin-only: permanently deletes an order (and its timeline events) via /api/admin/orders/:id
export function DeleteOrderButton({ id, orderNumber, title, paid }: {
  id: number
  orderNumber: string
  title: string
  paid: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function del() {
    const warning = paid
      ? `\n\nThis order has a recorded payment — deleting it also removes it from the finance dashboard.`
      : ''
    if (!confirm(`Delete order ${orderNumber} (${title})?${warning}\n\nThis can't be undone.`)) return

    setBusy(true)
    const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: res.statusText }))
      alert(`Couldn't delete ${orderNumber}: ${error}`)
      setBusy(false)
      return
    }
    router.refresh()
  }

  return (
    <button type="button" onClick={del} disabled={busy} className="order-delete-btn" aria-label={`Delete order ${orderNumber}`}
      style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: 'var(--tan)', background: 'none', border: '0.5px solid rgba(107,163,200,0.2)', borderRadius: '99px', padding: '7px 14px', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1, whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
      {busy ? 'Deleting…' : 'Delete'}
    </button>
  )
}
