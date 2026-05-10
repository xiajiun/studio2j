export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { OrderForm } from '@/components/dashboard/OrderForm'
import Link from 'next/link'
import type { FairRow, ShippingAddress } from '@/lib/database.types'

export default async function NewOrder() {
  const supabase = createClient()
  const [{ data: fairs }, { data: pastOrders }] = await Promise.all([
    supabase.from('fairs').select('*').order('date', { ascending: true }),
    supabase.from('orders')
      .select('customer_email, customer_name, shipping_address')
      .order('created_at', { ascending: false })
      .limit(500),
  ])

  // Deduplicate by email — keep the most recent entry per customer
  const seen = new Set<string>()
  type RawOrder = { customer_email: string; customer_name: string | null; shipping_address: unknown }
  const customers = ((pastOrders ?? []) as RawOrder[])
    .filter(o => { if (seen.has(o.customer_email)) return false; seen.add(o.customer_email); return true })
    .map(o => ({ email: o.customer_email, name: o.customer_name, shipping_address: o.shipping_address as ShippingAddress | null }))

  return (
    <div>
      <Link href="/admin/orders" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        ← Orders
      </Link>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '32px' }}>
        New order
      </h1>
      <OrderForm fairs={fairs as FairRow[] ?? []} customers={customers} />
    </div>
  )
}
