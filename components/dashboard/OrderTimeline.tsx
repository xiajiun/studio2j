import { STATUS_LABELS, STATUS_ORDER, type OrderStatus, type OrderEvent } from '@/lib/database.types'

export function OrderTimeline({ currentStatus, events }: {
  currentStatus: OrderStatus
  events: OrderEvent[]
}) {
  const currentIdx = STATUS_ORDER.indexOf(currentStatus)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {STATUS_ORDER.map((s, i) => {
        const isDone    = i < currentIdx
        const isCurrent = i === currentIdx
        const event     = events.find(e => e.status === s)

        return (
          <div key={s} style={{ display: 'flex', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%', marginTop: '1px', flexShrink: 0,
                background: isDone ? 'var(--dark-blue)' : isCurrent ? 'var(--tan)' : 'transparent',
                border: `1.5px solid ${isDone ? 'var(--dark-blue)' : isCurrent ? 'var(--tan)' : 'rgba(122,92,69,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDone && <span style={{ color: 'white', fontSize: '9px' }}>✓</span>}
              </div>
              {i < STATUS_ORDER.length - 1 && (
                <div style={{ width: '1.5px', flex: 1, minHeight: '32px', background: isDone ? 'var(--dark-blue)' : 'rgba(122,92,69,0.1)' }} />
              )}
            </div>

            <div style={{ paddingBottom: '24px', flex: 1 }}>
              <div style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: isCurrent ? 500 : 300,
                color: isDone || isCurrent ? 'var(--dark-brown)' : 'var(--tan)',
                marginBottom: '2px',
              }}>
                {STATUS_LABELS[s]}
              </div>

              {event && (
                <>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginBottom: '6px' }}>
                    {new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {event.note && (
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', color: 'var(--brown)', marginBottom: '8px' }}>
                      &quot;{event.note}&quot;
                    </div>
                  )}
                  {event.photo_url && (
                    <img src={event.photo_url} alt="" style={{ borderRadius: '10px', maxWidth: '280px', width: '100%', display: 'block', marginTop: '8px' }} />
                  )}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
