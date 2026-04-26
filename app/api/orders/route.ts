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
        instagram:      body.instagram || undefined,
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

  // Send email notification to admin via Resend
  const resendKey = process.env.RESEND_API_KEY
  if (resendKey && data) {
    const itemLines = (body.items ?? [])
      .filter((i: any) => i.name)
      .map((i: any) => `<li>${i.name}${i.url ? ` — <a href="${i.url}">${i.url}</a>` : ''} (qty: ${i.qty})</li>`)
      .join('')

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Studio2J Orders <orders@studio2j.com>',
        to:      ['studio2j25@gmail.com'],
        subject: `New order ${data.order_number} from ${body.name}`,
        html: `
          <h2>New order: ${data.order_number}</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          ${body.phone ? `<p><strong>Phone:</strong> ${body.phone}</p>` : ''}
          ${body.instagram ? `<p><strong>Instagram:</strong> @${body.instagram}</p>` : ''}
          <p><strong>Country:</strong> ${body.country}</p>
          <p><strong>Payment:</strong> ${body.payment_method}</p>
          ${itemLines ? `<p><strong>Items:</strong></p><ul>${itemLines}</ul>` : ''}
          ${body.notes ? `<p><strong>Notes:</strong> ${body.notes}</p>` : ''}
          <hr/>
          <p><a href="https://studio2j.pages.dev/admin/orders">View in admin →</a></p>
        `,
      }),
    }).catch(() => {}) // don't fail the order if email fails
  }

  return NextResponse.json({ order_number: data!.order_number })
}
