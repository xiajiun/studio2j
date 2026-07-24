export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { brand_id } = await req.json()
  if (!brand_id || typeof brand_id !== 'number') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('catalogue_brands')
    .select('saves')
    .eq('id', brand_id)
    .single()

  await supabase
    .from('catalogue_brands')
    .update({ saves: (data?.saves ?? 0) + 1 })
    .eq('id', brand_id)

  return NextResponse.json({ ok: true })
}
