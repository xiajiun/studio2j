export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { AddFairButton, SeedFairsButton } from '@/components/dashboard/FairForm'
import { DeleteFairButton, CatalogueButton } from './FairActions'
import { EditFairButton } from '@/components/dashboard/FairForm'
import type { FairRow } from '@/lib/database.types'

export default async function AdminFairs() {
  const supabase = createClient()
  const { data: fairs } = await supabase.from('fairs').select('*').order('date', { ascending: true })
  const list = (fairs ?? []) as FairRow[]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '24px' }}>
        Fairs & Popups
      </h1>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center' }}>
        <AddFairButton />
        <SeedFairsButton count={list.length} />
      </div>

      {list.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No fairs yet. Import the defaults or add one above.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {list.map(f => (
            <div key={f.id} style={{ background: 'white', border: '0.5px solid rgba(122,92,69,0.12)', borderRadius: '14px', padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', color: 'var(--dark-brown)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {f.name}
                    <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '99px', background: f.kind === 'popup' ? 'rgba(243,227,161,0.5)' : 'rgba(107,163,200,0.12)', color: f.kind === 'popup' ? '#7A6010' : 'var(--dark-blue)' }}>{f.kind === 'popup' ? 'Popup' : 'Fair'}</span>
                    {f.going && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '99px', background: 'var(--dark-blue)', color: 'var(--cream)' }}>Going</span>}
                    {f.featured && !f.going && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '9px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: '99px', background: 'var(--beige)', color: 'var(--brown)' }}>Featured</span>}
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span>{f.city}, {f.country}</span>
                    <span>·</span>
                    <span>{new Date(f.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>·</span>
                    <span>Deadline {new Date(f.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    {f.notes && <><span>·</span><span style={{ fontStyle: 'italic' }}>{f.notes}</span></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <CatalogueButton id={f.id} name={f.name} catalogueUrl={f.catalogue_url} />
                  <EditFairButton fair={f} />
                  <DeleteFairButton id={f.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
