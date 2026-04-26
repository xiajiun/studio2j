export const runtime = 'edge'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_email:  body.email,
      customer_name:   body.name,
      title:           body.title || `Order from ${body.name}`,
      kind:            body.kind  ?? 'proxy',
      status:          'awaiting_payment',
      currency:        'KRW',
      items:           body.items ?? null,
      description:     body.notes ?? null,
      shipping_address: {
        name:           body.name,
        phone:          body.phone,
        address:        body.address,
        city:           body.city,
        country:        body.country,
        postal_code:    body.postal_code,
        payment_method: body.payment_method ?? 'wise',
      },
    })
    .select('order_number')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ order_number: data.order_number })
}
