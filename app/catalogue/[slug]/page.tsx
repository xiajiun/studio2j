export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export default async function CatalogueSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createClient()

  const [{ data: fair }, { data: brands }] = await Promise.all([
    supabase.from('fairs').select('name, date, city').eq('catalogue_url', `/catalogue/${slug}`).maybeSingle(),
    supabase.from('catalogue_brands').select('*').eq('catalogue_id', slug)
      .order('sort_order', { ascending: true }).order('name', { ascending: true }),
  ])

  const list = (brands ?? []) as CatalogueBrand[]
  const title = fair?.name ?? slug
  const subtitle = fair ? `${fair.city} · ${new Date(fair.date).getFullYear()}` : ''

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: '#FEFAF0', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '56px' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '16px', color: 'var(--brown)', marginBottom: '16px' }}>
              Studio2J Catalogue
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(36px, 4.5vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '12px' }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
                {subtitle}
              </p>
            )}
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginTop: '8px' }}>
              {list.length} brand{list.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Grid */}
          {list.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)', textAlign: 'center', padding: '80px 0' }}>
              Catalogue coming soon.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
              {list.map(b => (
                <a
                  key={b.id}
                  href={b.instagram ? `https://instagram.com/${b.instagram}` : (b.url ?? '#')}
                  target={b.instagram || b.url ? '_blank' : undefined}
                  rel="noreferrer"
                  style={{ textDecoration: 'none', display: 'block', background: 'white', borderRadius: '16px', padding: '20px 22px', border: '0.5px solid rgba(107,163,200,0.15)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  className="cat-brand-card"
                >
                  <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '16px', fontWeight: 400, color: 'var(--dark-brown)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    {b.name}
                  </div>
                  {b.korean_name && (
                    <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginBottom: '8px' }}>
                      {b.korean_name}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                    {b.booth && (
                      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, padding: '3px 8px', borderRadius: '99px', background: 'rgba(107,163,200,0.1)', color: 'var(--brown)' }}>
                        Booth {b.booth}
                      </span>
                    )}
                    {b.category && (
                      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, padding: '3px 8px', borderRadius: '99px', background: 'rgba(107,163,200,0.06)', color: 'var(--brown)' }}>
                        {b.category}
                      </span>
                    )}
                  </div>
                  {b.instagram && (
                    <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', marginTop: '10px' }}>
                      @{b.instagram} ↗︎
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </main>
      <style jsx global>{`
        .cat-brand-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(31,58,95,0.07) !important;
        }
      `}</style>
      <Footer />
    </>
  )
}
