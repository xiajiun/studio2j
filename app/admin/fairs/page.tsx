export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { FairForm } from '@/components/dashboard/FairForm'
import type { FairRow } from '@/lib/database.types'

export default async function AdminFairs() {
  const supabase = createClient()
  const { data: fairs } = await supabase.from('fairs').select('*').order('date', { ascending: true })

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '32px' }}>
        Fairs
      </h1>

      <FairForm />

      <div style={{ marginTop: '40px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
          {fairs?.length ?? 0} fairs
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {(fairs as FairRow[] ?? []).map(f => (
            <div key={f.id} style={{
              background: 'white',
              border: '0.5px solid rgba(122,92,69,0.12)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'center',
              gap: '16px',
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', color: 'var(--dark-brown)', marginBottom: '4px' }}>
                  {f.name}
                  {f.going && <span style={{ marginLeft: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '99px', background: 'var(--dark-blue)', color: 'var(--cream)' }}>Going</span>}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)' }}>
                  {f.city}, {f.country} · {new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <DeleteFairButton id={f.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DeleteFairButton({ id }: { id: number }) {
  return (
    <form action={`/api/admin/fairs/${id}/delete`} method="POST">
      <button type="submit" style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '11px', fontWeight: 300,
        color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
      }}>
        Delete
      </button>
    </form>
  )
}
