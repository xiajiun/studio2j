export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CatalogueAdmin } from './CatalogueAdmin'
import type { CatalogueBrand } from '@/app/catalogue/inventario-2026/InventarioCatalogue'

export default async function AdminCatalogueSlug({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createClient()

  const [{ data: fair }, { data: brands }] = await Promise.all([
    supabase.from('fairs').select('name').eq('catalogue_url', `/catalogue/${slug}`).maybeSingle(),
    supabase.from('catalogue_brands').select('*').eq('catalogue_id', slug)
      .order('sort_order', { ascending: true }).order('name', { ascending: true }),
  ])

  const title = fair?.name ?? slug

  return (
    <div>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <Link href="/admin/catalogue" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>
            ← Catalogue
          </Link>
          <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '32px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginTop: '8px', marginBottom: 0 }}>
            {title}
          </h1>
          <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginTop: '4px' }}>
            catalogue id: <code>{slug}</code>
          </p>
        </div>
        <Link href={`/catalogue/${slug}`} target="_blank"
          style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', border: '0.5px solid rgba(31,58,95,0.2)', padding: '8px 18px', borderRadius: '99px', whiteSpace: 'nowrap' }}>
          View public page ↗︎
        </Link>
      </div>

      <CatalogueAdmin brands={(brands ?? []) as CatalogueBrand[]} catalogueId={slug} />
    </div>
  )
}
