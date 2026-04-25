import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { STATUS_LABELS, STATUS_ORDER } from '@/lib/database.types'
import type { Order, OrderEvent } from '@/lib/database.types'
import Link from 'next/link'

export default async function PublicOrderPage({ params }: { params: { number: string } }) {
  const supabase = createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', params.number)
    .single()

  if (!order) notFound()

  const { data: events } = await supabase
    .from('order_events')
    .select('*')
    .eq('order_id', order.id)
    .order('created_at', { ascending: true })

  return (
    <main style={{ minHeight: '100vh', padding: '48px 24px', maxWidth: '640px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
        </div>
      </Link>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>
        {order.order_number}
      </div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
        {order.title}
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', marginBottom: '40px' }}>
        {STATUS_LABELS[order.status as keyof typeof STATUS_LABELS]}
      </p>

      {/* Timeline */}
      <div style={{ marginBottom: '40px' }}>
        {STATUS_ORDER.map((s, i) => {
          const currentIdx = STATUS_ORDER.indexOf(order.status as any)
          const isDone    = i < currentIdx
          const isCurrent = i === currentIdx
          const event = events?.find(e => e.status === s)
          return (
            <div key={s} style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: isDone ? 'var(--dark-blue)' : isCurrent ? 'var(--tan)' : 'transparent',
                  border: `1.5px solid ${isDone || isCurrent ? 'transparent' : 'rgba(122,92,69,0.25)'}`,
                  marginTop: '2px',
                }} />
                {i < STATUS_ORDER.length - 1 && (
                  <div style={{ width: '1px', flex: 1, background: isDone ? 'var(--dark-blue)' : 'rgba(122,92,69,0.12)', minHeight: '24px' }} />
                )}
              </div>
              <div style={{ paddingBottom: '20px' }}>
                <div style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '13px',
                  fontWeight: isCurrent ? 500 : 300,
                  color: isDone || isCurrent ? 'var(--dark-brown)' : 'var(--tan)',
                  marginBottom: '2px',
                }}>
                  {STATUS_LABELS[s]}
                </div>
                {event?.note && (
                  <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--brown)' }}>
                    &quot;{event.note}&quot;
                  </div>
                )}
                {event?.photo_url && (
                  <img src={event.photo_url} alt="" style={{ marginTop: '8px', borderRadius: '10px', maxWidth: '240px', width: '100%' }} />
                )}
                {event && (
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '4px' }}>
                    {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {order.tracking_number && (
        <div style={{ padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '24px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>Tracking number</div>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', color: 'var(--dark-brown)' }}>{order.tracking_number}</div>
        </div>
      )}

      {order.customer_notes && (
        <div style={{ padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>Note from Studio2J</div>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>{order.customer_notes}</p>
        </div>
      )}
    </main>
  )
}
