export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { STATUS_LABELS, STATUS_ORDER } from '@/lib/database.types'
import type { Order, OrderEvent, OrderKind } from '@/lib/database.types'
import Link from 'next/link'

function trackingUrl(num: string): string {
  const upper = num.toUpperCase()
  if (upper.endsWith('KR')) return `https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=${num}`
  if (upper.endsWith('JP')) return `https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=${num}`
  return `https://www.17track.net/en/track#nums=${num}`
}

function getSteps(kind: OrderKind) {
  if (kind === 'fair') return STATUS_ORDER
  return STATUS_ORDER.filter(s => s !== 'going_to_fair')
}

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

  const o     = order as Order
  const steps = getSteps(o.kind)

  return (
    <main style={{ minHeight: '100vh', padding: '48px 24px', maxWidth: '640px', margin: '0 auto' }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
          Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
        </div>
      </Link>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>
        {o.order_number}
      </div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
        {o.title}
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', marginBottom: '40px' }}>
        {STATUS_LABELS[o.status as keyof typeof STATUS_LABELS]}
      </p>

      {/* Timeline */}
      <div style={{ marginBottom: '40px' }}>
        {steps
          .map(s => ({ s, event: events?.find((e: OrderEvent) => e.status === s) }))
          .filter(({ event }) => !!event)
          .map(({ s, event }, i, visible) => (
            <div key={s} style={{ display: 'flex', gap: '16px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: 'var(--dark-blue)', marginTop: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ color: 'white', fontSize: '8px' }}>✓</span>
                </div>
                {i < visible.length - 1 && (
                  <div style={{ width: '1px', flex: 1, background: 'var(--dark-blue)', minHeight: '24px' }} />
                )}
              </div>
              <div style={{ paddingBottom: '20px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--dark-brown)', marginBottom: '2px' }}>
                  {STATUS_LABELS[s]}
                </div>
                {event?.note && <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--brown)' }}>&quot;{event.note}&quot;</div>}
                {event?.photo_url && <img src={event.photo_url} alt="" style={{ marginTop: '8px', borderRadius: '10px', maxWidth: '240px', width: '100%' }} />}
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '4px' }}>{new Date(event!.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </div>
          ))}
      </div>

      {o.tracking_number && (
        <div style={{ padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '4px' }}>Tracking number</div>
          <a
            href={trackingUrl(o.tracking_number)}
            target="_blank"
            rel="noreferrer"
            style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', color: 'var(--dark-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            {o.tracking_number}
            <span style={{ fontSize: '12px', opacity: 0.6 }}>↗</span>
          </a>
        </div>
      )}

      {o.customer_notes && (
        <div style={{ padding: '16px 20px', background: 'var(--beige)', borderRadius: '12px', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>Note from Studio2J</div>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>{o.customer_notes}</p>
        </div>
      )}

      {/* Help + save link footer */}
      <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '0.5px solid rgba(122,92,69,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)' }}>
          Questions? DM us on Instagram.
        </span>
        <a href="https://www.instagram.com/studio2j25/" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--dark-blue)', textDecoration: 'none', border: '0.5px solid rgba(31,58,95,0.25)', padding: '8px 16px', borderRadius: '99px' }}>
          DM us @studio2j25 →
        </a>
      </div>
    </main>
  )
}
