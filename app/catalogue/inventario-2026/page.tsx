export const runtime = 'edge'

import { createServiceClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { InventarioCatalogue } from './InventarioCatalogue'
import type { CatalogueBrand } from './InventarioCatalogue'

export default async function InventarioPage() {
  const supabase = createServiceClient()
  const { data: brands, count } = await supabase
    .from('catalogue_brands')
    .select('*', { count: 'exact' })
    .eq('catalogue_id', 'inventario-2026')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">
          <InventarioCatalogue
            brands={(brands ?? []) as CatalogueBrand[]}
            totalCount={count ?? 0}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
