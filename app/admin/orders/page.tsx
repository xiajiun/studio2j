export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { OrderCard } from '@/components/dashboard/OrderCard'
import Link from 'next/link'
import type { Order, OrderStatus } from '@/lib/database.types'

const FILTERS: { label: string; value: string }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Unpaid',    value: 'awaiting_payment' },
  { label: 'Shipped',   value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
]

export default async function AdminOrders({ searchParams }: { searchParams: { filter?: string } }) {
  const supabase = createClient()
  const filter   = searchParams.filter ?? 'all'

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (filter === 'active')            query = query.not('status', 'in', '(delivered,cancelled)')
  else if (filter !== 'all')          query = query.eq('status', filter as OrderStatus)

  const { data: orders } = await query

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em' }}>
          Orders
        </h1>
        <Link href="/admin/orders/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '11px 22px', borderRadius: '99px', textDecoration: 'none' }}>
          + New order
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {FILTERS.map(f => (
          <Link key={f.value} href={`/admin/orders?filter=${f.value}`} style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '12px', fontWeight: filter === f.value ? 500 : 300,
            padding: '7px 16px', borderRadius: '99px', textDecoration: 'none',
            background: filter === f.value ? 'var(--dark-brown)' : 'transparent',
            color: filter === f.value ? 'var(--cream)' : 'var(--brown)',
            border: `0.5px solid ${filter === f.value ? 'var(--dark-brown)' : 'rgba(122,92,69,0.15)'}`,
          }}>
            {f.label}
          </Link>
        ))}
      </div>

      {orders && orders.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(orders as Order[]).map(o => <OrderCard key={o.id} order={o} adminView />)}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No orders yet.
        </p>
      )}
    </div>
  )
}
