export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { ShoppingManager, type ShoppingItem } from './ShoppingManager'

export default async function ShoppingPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('business_shopping')
    .select('*')
    .order('status')
    .order('created_at', { ascending: false })

  const items = (data ?? []) as ShoppingItem[]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Business expenses
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
        Packaging, marketing materials, and other company purchases
      </p>
      <ShoppingManager items={items} />
    </div>
  )
}
