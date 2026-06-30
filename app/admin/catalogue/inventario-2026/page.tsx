export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { BrandManager } from './BrandManager'
import Link from 'next/link'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export default async function AdminInventarioPage() {
  const supabase = createClient()
  const { data: brands } = await supabase
    .from('catalogue_brands')
    .select('*')
    .eq('catalogue_id', 'inventario-2026')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true })

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/admin" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>← Admin</Link>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '32px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginTop: '8px' }}>
            INVENTARIO 2026 — Brands
          </h1>
        </div>
        <Link href="/catalogue/inventario-2026" target="_blank"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', border: '0.5px solid rgba(31,58,95,0.2)', padding: '8px 18px', borderRadius: '99px' }}>
          View catalogue ↗︎
        </Link>
      </div>
      <BrandManager brands={(brands ?? []) as CatalogueBrand[]} />
    </div>
  )
}
