export const runtime = 'edge'

import { createServiceClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { GenericCatalogue } from './GenericCatalogue'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export default async function CatalogueSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createServiceClient()

  const [{ data: fair }, { data: brands, count }] = await Promise.all([
    supabase.from('fairs').select('name, date, city').eq('catalogue_url', `/catalogue/${slug}`).maybeSingle(),
    supabase.from('catalogue_brands').select('*', { count: 'exact' })
      .eq('catalogue_id', slug)
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true }),
  ])

  const list = (brands ?? []) as CatalogueBrand[]
  const fairName = fair?.name ?? slug
  const subtitle = fair ? `${fair.city} · ${new Date(fair.date).getFullYear()}` : 'Studio2J Catalogue'

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">
          <GenericCatalogue
            brands={list}
            totalCount={count ?? list.length}
            fairName={fairName}
            subtitle={subtitle}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
