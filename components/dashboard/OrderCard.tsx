import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import type { Order } from '@/lib/database.types'

const KIND_LABEL = { proxy: 'Proxy buy', fair: 'Fair haul', personal: 'Personal request' }

export function OrderCard({ order, compact = false, adminView = false }: {
  order: Order
  compact?: boolean
  adminView?: boolean
}) {
  const href = adminView ? `/admin/orders/${order.id}` : `/account/orders/${order.order_number}`

  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div style={{
        background: compact ? 'transparent' : 'white',
        border: compact ? 'none' : '0.5px solid rgba(122,92,69,0.12)',
        borderBottom: compact ? '0.5px solid rgba(122,92,69,0.08)' : undefined,
        borderRadius: compact ? 0 : '16px',
        padding: compact ? '14px 0' : '20px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: '16px',
        alignItems: 'center',
        transition: 'all 0.2s',
        cursor: 'pointer',
      }} className="order-card-hover">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em' }}>
              {order.title}
            </span>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--tan)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {KIND_LABEL[order.kind]}
            </span>
          </div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span>{order.order_number}</span>
            {adminView && <><span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span><span>{order.customer_email}</span></>}
            <span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span>
            <span>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>
    </Link>
  )
}
