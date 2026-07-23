export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import Link from 'next/link'

const CATALOGUES = [
  {
    id: 'inventario-2026',
    aliases: ['inventario-2026'],
    name: 'INVENTARIO 2026',
    description: 'June 10–14, 2026 · COEX THE PLATZ HALL, Seoul',
    href: '/admin/catalogue/inventario-2026',
    public: '/catalogue/inventario-2026',
    date: '2026-06-10',
  },
  {
    id: 'dotdotexpress',
    aliases: ['dotdotdot-v-7'],
    name: 'DOTDOTDOT v.7',
    description: 'Booth layout · 184 brands',
    href: null,
    public: '/catalogue/dotdotexpress',
    date: '',
  },
]

export default async function AdminCataloguePage() {
  const supabase = createClient()

  // Fetch fairs that have a catalogue_url set (but not already in CATALOGUES)
  const { data: fairsWithCatalogue } = await supabase
    .from('fairs')
    .select('id, name, date, city, catalogue_url')
    .not('catalogue_url', 'is', null)
    .order('date', { ascending: true })

  const EXCLUDE_SLUGS = new Set(['okiki-popup'])
  const existingIds = new Set([
    ...CATALOGUES.map(c => c.id),
    ...CATALOGUES.flatMap(c => c.aliases ?? []),
  ])
  const fairCatalogues = (fairsWithCatalogue ?? [])
    .map((f: { id: number; name: string; date: string; city: string; catalogue_url: string }) => {
      const slug = f.catalogue_url.replace('/catalogue/', '')
      return { id: slug, name: f.name, description: `${f.city} · ${new Date(f.date).getFullYear()}`, href: `/admin/catalogue/${slug}`, public: f.catalogue_url, date: f.date }
    })
    .filter((c: { id: string }) => !existingIds.has(c.id) && !EXCLUDE_SLUGS.has(c.id))

  const allCatalogues = [...CATALOGUES, ...fairCatalogues]
    .sort((a, b) => {
      if (!a.date && !b.date) return 0
      if (!a.date) return 1
      if (!b.date) return -1
      return b.date.localeCompare(a.date)
    })

  const counts: Record<string, number> = {}
  for (const cat of allCatalogues.filter(c => c.href)) {
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
        {allCatalogues.map(cat => (
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
                View ↗︎
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
