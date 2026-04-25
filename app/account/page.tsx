import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { OrderCard } from '@/components/dashboard/OrderCard'
import type { Order } from '@/lib/database.types'

export default async function AccountPage() {
  const user     = await requireAuth()
  const supabase = createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  const active = (orders as Order[] ?? []).filter(o => !['delivered', 'cancelled'].includes(o.status))
  const past   = (orders as Order[] ?? []).filter(o => ['delivered', 'cancelled'].includes(o.status))

  const name = user.email?.split('@')[0] ?? 'there'

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '40px', color: 'var(--dark-brown)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
        Hello, <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{name}</em>.
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', marginBottom: '48px' }}>
        {active.length} active · {past.length} completed
      </p>

      {active.length > 0 && (
        <section style={{ marginBottom: '48px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            Active orders
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {active.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            Order history
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {past.map(o => <OrderCard key={o.id} order={o} compact />)}
          </div>
        </section>
      )}

      {(!orders || orders.length === 0) && (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
          No orders yet. DM us on Instagram to place your first.
        </p>
      )}
    </div>
  )
}
