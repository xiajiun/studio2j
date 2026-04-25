import { createClient } from '@/lib/supabase/server'
import type { Customer } from '@/lib/database.types'

export default async function AdminCustomers() {
  const supabase  = createClient()
  const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '32px' }}>
        Customers
      </h1>

      {customers && customers.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {(customers as Customer[]).map(c => (
            <div key={c.id} style={{
              padding: '16px 0',
              borderBottom: '0.5px solid rgba(122,92,69,0.08)',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '2px' }}>
                  {c.display_name ?? c.email}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', display: 'flex', gap: '10px' }}>
                  <span>{c.email}</span>
                  {c.instagram && <><span style={{ color: 'rgba(200,169,141,0.4)' }}>·</span><span>@{c.instagram}</span></>}
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
                {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No customers yet. They appear here after clicking their first magic link.
        </p>
      )}
    </div>
  )
}
