export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const CATALOGUES = [
  {
    id: 'inventario-2026',
    name: 'INVENTARIO 2026',
    description: 'June 10–14, 2026 · COEX THE PLATZ HALL, Seoul',
    href: '/admin/catalogue/inventario-2026',
    public: '/catalogue/inventario-2026',
  },
  {
    id: 'dotdotexpress',
    name: 'DOTDOTDOT v.7',
    description: 'Booth layout · 184 brands',
    href: null,
    public: '/catalogue/dotdotexpress',
  },
]

export default async function AdminCataloguePage() {
  const supabase = createClient()

  const counts: Record<string, number> = {}
  for (const cat of CATALOGUES.filter(c => c.href)) {
    const { count } = await supabase
      .from('catalogue_brands')
      .select('id', { count: 'exact', head: true })
      .eq('catalogue_id', cat.id)
    counts[cat.id] = count ?? 0
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '32px' }}>
        Catalogue
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {CATALOGUES.map(cat => (
          <div key={cat.id} style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '0.5px solid rgba(122,92,69,0.12)' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '6px' }}>
              {cat.name}
            </div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '4px' }}>
              {cat.description}
            </div>
            {counts[cat.id] !== undefined && (
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--brown)', marginBottom: '20px' }}>
                {counts[cat.id]} brands in database
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              {cat.href ? (
                <Link href={cat.href} style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '8px 18px', borderRadius: '99px', textDecoration: 'none' }}>
                  Manage brands
                </Link>
              ) : (
                <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', padding: '8px 0' }}>
                  Hardcoded (no DB yet)
                </span>
              )}
              <Link href={cat.public} target="_blank" style={{ border: '0.5px solid rgba(122,92,69,0.2)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, padding: '8px 18px', borderRadius: '99px', textDecoration: 'none' }}>
                View ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
