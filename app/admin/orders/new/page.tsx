export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { OrderForm } from '@/components/dashboard/OrderForm'
import Link from 'next/link'
import type { FairRow } from '@/lib/database.types'

export default async function NewOrder() {
  const supabase = createClient()
  const { data: fairs } = await supabase.from('fairs').select('*').order('date', { ascending: true })

  return (
    <div>
      <Link href="/admin/orders" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none', display: 'inline-block', marginBottom: '24px' }}>
        ← Orders
      </Link>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '32px' }}>
        New order
      </h1>
      <OrderForm fairs={fairs as FairRow[] ?? []} />
    </div>
  )
}
