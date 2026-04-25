import { STATUS_LABELS, type OrderStatus } from '@/lib/database.types'

const COLORS: Record<OrderStatus, { bg: string; color: string; border: string }> = {
  awaiting_payment: { bg: '#F5DDD5', color: '#8A3A20', border: 'rgba(138,58,32,0.2)' },
  paid:             { bg: '#D8E5EE', color: '#1F3A5F', border: 'rgba(31,58,95,0.2)' },
  going_to_fair:    { bg: '#F0E0C8', color: '#7A5020', border: 'rgba(122,80,32,0.2)' },
  purchased:        { bg: '#F0E0C8', color: '#7A5020', border: 'rgba(122,80,32,0.2)' },
  packing:          { bg: '#E8DFD1', color: '#7A5C45', border: 'rgba(122,92,69,0.2)' },
  shipped:          { bg: '#D8E5EE', color: '#1F3A5F', border: 'rgba(31,58,95,0.2)' },
  delivered:        { bg: '#D5E8D8', color: '#2A5C35', border: 'rgba(42,92,53,0.2)' },
  cancelled:        { bg: '#E8DFD1', color: '#C8A98D', border: 'rgba(200,169,141,0.2)' },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const c = COLORS[status]
  return (
    <span style={{
      fontFamily: 'var(--font-inter), sans-serif',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.04em',
      padding: '4px 10px',
      borderRadius: '7px',
      background: c.bg,
      color: c.color,
      border: `0.5px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status]}
    </span>
  )
}
