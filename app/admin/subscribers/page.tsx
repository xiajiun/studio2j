import { createClient } from '@/lib/supabase/server'
import type { Subscriber } from '@/lib/database.types'

export default async function AdminSubscribers() {
  const supabase = createClient()
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  const csv = ['email,source,joined']
    .concat((subscribers ?? []).map((s: Subscriber) =>
      `${s.email},${s.source ?? ''},${new Date(s.created_at).toISOString().split('T')[0]}`
    ))
    .join('\n')

  const csvDataUrl = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em' }}>
          Subscribers
        </h1>
        <a
          href={csvDataUrl}
          download="studio2j-subscribers.csv"
          style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '11px 22px', borderRadius: '99px', textDecoration: 'none' }}
        >
          Export CSV ↓
        </a>
      </div>

      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
        {subscribers?.length ?? 0} active subscribers
      </div>

      {subscribers && subscribers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {(subscribers as Subscriber[]).map(s => (
            <div key={s.id} style={{
              padding: '14px 0',
              borderBottom: '0.5px solid rgba(122,92,69,0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              alignItems: 'center',
              gap: '24px',
            }}>
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--dark-brown)' }}>{s.email}</span>
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>{s.source ?? '—'}</span>
              <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
                {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No subscribers yet.
        </p>
      )}
    </div>
  )
}
