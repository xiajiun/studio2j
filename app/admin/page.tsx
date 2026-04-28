export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { getUser, adminWelcomeName } from '@/lib/auth'
import { OrderCard } from '@/components/dashboard/OrderCard'
import Link from 'next/link'
import type { Order } from '@/lib/database.types'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: 'var(--beige)', borderRadius: '14px', padding: '20px 24px', border: '0.5px solid rgba(122,92,69,0.1)' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
    </div>
  )
}

export default async function AdminHome() {
  const supabase = createClient()
  const user = await getUser()
  const name = adminWelcomeName(user?.email ?? '')

  const [
    { count: activeOrders },
    { count: pendingPayment },
    { count: totalFairs },
    { count: subs },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).not('status', 'in', '(delivered,cancelled)'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'awaiting_payment'),
    supabase.from('fairs').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('active', true),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ])

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '40px', color: 'var(--dark-brown)', marginBottom: '8px', letterSpacing: '-0.03em' }}>
        Welcome back, <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{name}</em>.
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', marginBottom: '40px' }}>
        {activeOrders ?? 0} active orders · {pendingPayment ?? 0} awaiting payment
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '48px' }}>
        <Stat label="Active orders"   value={activeOrders ?? 0} />
        <Stat label="Pending payment" value={pendingPayment ?? 0} />
        <Stat label="Fairs tracked"   value={totalFairs ?? 0} />
        <Stat label="Subscribers"     value={subs ?? 0} />
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '48px' }}>
        <Link href="/admin/orders/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
          + New order
        </Link>
        <Link href="/admin/fairs" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
          Manage fairs
        </Link>
        <Link href="/admin/subscribers" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
          Subscribers
        </Link>
      </div>

      {recentOrders && recentOrders.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            Recent orders
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(recentOrders as Order[]).map(o => <OrderCard key={o.id} order={o} adminView />)}
          </div>
          <Link href="/admin/orders" style={{ display: 'inline-block', marginTop: '16px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', textDecoration: 'none' }}>
            View all orders →
          </Link>
        </div>
      )}
    </div>
  )
}
