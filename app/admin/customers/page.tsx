export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import type { Order, ShippingAddress } from '@/lib/database.types'

type CustomerRow = {
  email: string
  name: string
  instagram: string
  phone: string
  orders: { number: string; created_at: string }[]
  first_order: string
}

export default async function AdminCustomers() {
  const supabase = createClient()
  const { data } = await supabase
    .from('orders')
    .select('customer_email, customer_name, shipping_address, order_number, created_at')
    .order('created_at', { ascending: false })

  const orders = (data ?? []) as Pick<Order, 'customer_email' | 'customer_name' | 'shipping_address' | 'order_number' | 'created_at'>[]

  // Group by email
  const map = new Map<string, CustomerRow>()
  for (const o of orders) {
    const email = o.customer_email ?? ''
    const addr  = o.shipping_address as ShippingAddress | null
    if (!map.has(email)) {
      map.set(email, {
        email,
        name:       o.customer_name ?? addr?.name ?? '',
        instagram:  (addr as any)?.instagram ?? '',
        phone:      addr?.phone ?? '',
        orders:     [],
        first_order: o.created_at,
      })
    }
    map.get(email)!.orders.push({ number: o.order_number, created_at: o.created_at })
  }

  const customers = Array.from(map.values())

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Customers
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
        {customers.length} customer{customers.length !== 1 ? 's' : ''} · from orders
      </p>

      {customers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {customers.map(c => (
            <div key={c.email} style={{
              padding: '18px 0',
              borderBottom: '0.5px solid rgba(122,92,69,0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'start',
              gap: '16px',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '4px' }}>
                  {c.name || c.email}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                  <span>{c.email}</span>
                  {c.phone     && <><span style={{ opacity: 0.3 }}>·</span><span>{c.phone}</span></>}
                  {c.instagram && <><span style={{ opacity: 0.3 }}>·</span><span>@{c.instagram}</span></>}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {c.orders.map(o => (
                    <a key={o.number} href={`/admin/orders?q=${o.number}`} style={{
                      fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400,
                      color: 'var(--dark-blue)', textDecoration: 'none',
                      background: 'rgba(31,58,95,0.06)', padding: '3px 10px', borderRadius: '99px',
                    }}>{o.number}</a>
                  ))}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {c.orders.length} order{c.orders.length !== 1 ? 's' : ''}<br />
                <span style={{ fontSize: '10px' }}>since {new Date(c.first_order).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No orders yet.
        </p>
      )}
    </div>
  )
}
