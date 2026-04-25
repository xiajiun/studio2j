export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth'
import { OrderTimeline } from '@/components/dashboard/OrderTimeline'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Order, OrderEvent } from '@/lib/database.types'

export default async function AccountOrderDetail({ params }: { params: { number: string } }) {
  const user     = await requireAuth()
  const supabase = createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', params.number)
    .or(`customer_id.eq.${user.id},customer_email.eq.${user.email}`)
    .single()

  if (!order) notFound()

  // Link the order to this user if it wasn't already
  if (!order.customer_id) {
    await supabase.from('orders')
      .update({ customer_id: user.id })
      .eq('id', order.id)
  }

  const { data: events } = await supabase
    .from('order_events')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true })

  const o = order as Order

  return (
    <div style={{ maxWidth: '600px' }}>
      <Link href="/account" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', display: 'inline-block', marginBottom: '32px' }}>
        ← Back to orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px', gap: '16px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '32px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: 0 }}>
          {o.title}
        </h1>
        <StatusBadge status={o.status} />
      </div>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '40px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <span>{o.order_number}</span>
        <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
        <span>{new Date(o.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
      </div>

      {/* Order summary */}
      {(o.goods_total || o.service_fee || o.shipping_cost) && (
        <div style={{ background: 'var(--beige)', borderRadius: '14px', padding: '20px 24px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {o.goods_total    && <SummaryRow label="Items" value={`${o.currency === 'KRW' ? '₩' : '¥'}${o.goods_total.toLocaleString()}`} />}
          {o.service_fee    && <SummaryRow label="Service fee" value={`${o.currency === 'KRW' ? '₩' : '¥'}${o.service_fee.toLocaleString()}`} />}
          {o.shipping_cost  && <SummaryRow label="Shipping" value={`${o.currency === 'KRW' ? '₩' : '¥'}${o.shipping_cost.toLocaleString()}`} />}
        </div>
      )}

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px' }}>
        Order timeline
      </div>
      <OrderTimeline currentStatus={o.status} events={events as OrderEvent[] ?? []} />

      {o.tracking_number && (
        <div style={{ marginTop: '32px', padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>Tracking</div>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', color: 'var(--dark-brown)' }}>{o.tracking_number}</div>
        </div>
      )}

      {o.customer_notes && (
        <div style={{ marginTop: '16px', padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>Note</div>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7, margin: 0 }}>{o.customer_notes}</p>
        </div>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)' }}>
      <span>{label}</span>
      <span style={{ color: 'var(--dark-brown)', fontWeight: 400 }}>{value}</span>
    </div>
  )
}
