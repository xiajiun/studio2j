export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { OrderForm } from '@/components/dashboard/OrderForm'
import { OrderTimeline } from '@/components/dashboard/OrderTimeline'
import { StatusBadge } from '@/components/dashboard/StatusBadge'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Order, OrderEvent, FairRow } from '@/lib/database.types'
import { AddEventForm } from './AddEventForm'
import { ShippedEmailButton } from '@/components/dashboard/ShippedEmailButton'

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const [{ data: order }, { data: events }, { data: fairs }] = await Promise.all([
    supabase.from('orders').select('*').eq('id', params.id).single(),
    supabase.from('order_events').select('*').eq('order_id', params.id).order('created_at', { ascending: true }),
    supabase.from('fairs').select('*').order('date', { ascending: true }),
  ])

  if (!order) notFound()

  const o = order as Order

  return (
    <div>
      <Link href="/admin/orders" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        ← Orders
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '32px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: 0 }}>
          {o.title}
        </h1>
        <StatusBadge status={o.status} />
      </div>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '40px', display: 'flex', gap: '10px' }}>
        <span>{o.order_number}</span>
        <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
        <span>{o.customer_email}</span>
        <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
        <Link href={`/order/${o.order_number}`} target="_blank" style={{ color: 'var(--dark-blue)', textDecoration: 'none' }}>Customer view ↗</Link>
        <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
        <Link href={`/admin/orders/${o.id}/invoice?type=1`} target="_blank" style={{ color: 'var(--dark-blue)', textDecoration: 'none' }}>🧾 Invoice 1 (items) ↗</Link>
        <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
        <Link href={`/admin/orders/${o.id}/invoice?type=2`} target="_blank" style={{ color: 'var(--dark-blue)', textDecoration: 'none' }}>🧾 Invoice 2 (fee+ship) ↗</Link>
        {o.tracking_number && (
          <>
            <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
            <ShippedEmailButton
              customerEmail={o.customer_email}
              customerName={o.customer_name}
              orderNumber={o.order_number}
              trackingNumber={o.tracking_number}
            />
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px' }}>
            Edit order
          </div>
          <OrderForm
            fairs={fairs as FairRow[] ?? []}
            orderId={o.id}
            initial={{
              customer_email:  o.customer_email,
              customer_name:   o.customer_name  ?? '',
              kind:            o.kind,
              fair_id:         o.fair_id?.toString() ?? '',
              title:           o.title,
              description:     o.description     ?? '',
              goods_total:     o.goods_total?.toString()  ?? '',
              service_fee:     o.service_fee?.toString()  ?? '',
              shipping_cost:   o.shipping_cost?.toString() ?? '',
              currency:        o.currency,
              status:          o.status,
              tracking_number: o.tracking_number ?? '',
              notes:           o.notes           ?? '',
              customer_notes:  o.customer_notes  ?? '',
              items:               (o.items as any[]) ?? [],
              shipping_address:    o.shipping_address,
              paid_1_amount:       o.paid_1_amount?.toString()       ?? '',
              paid_1_date:         o.paid_1_date                     ?? '',
              paid_1_via:          o.paid_1_via                      ?? 'jin',
              paid_1_transfer_fee: o.paid_1_transfer_fee?.toString() ?? '',
              paid_2_amount:       o.paid_2_amount?.toString()       ?? '',
              paid_2_date:         o.paid_2_date                     ?? '',
              paid_2_via:          o.paid_2_via                      ?? 'jin',
              paid_2_transfer_fee: o.paid_2_transfer_fee?.toString() ?? '',
              actual_goods_cost:   o.actual_goods_cost?.toString()   ?? o.goods_total?.toString() ?? '',
            }}
          />
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px' }}>
            Timeline
          </div>
          <OrderTimeline currentStatus={o.status} events={events as OrderEvent[] ?? []} kind={o.kind} />
          <div style={{ marginTop: '24px', borderTop: '0.5px solid rgba(122,92,69,0.1)', paddingTop: '24px' }}>
            <AddEventForm orderId={o.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
