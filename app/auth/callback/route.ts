export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code  = searchParams.get('code')
  const order = searchParams.get('order')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Ensure customer row exists
      await supabase.from('customers').upsert(
        { id: user.id, email: user.email! },
        { onConflict: 'id' },
      )

      // Link the order to this user if they came via an order magic link
      if (order) {
        await supabase.from('orders')
          .update({ customer_id: user.id })
          .eq('order_number', order)
          .eq('customer_email', user.email!)
      }

      const isAdmin = user.email === process.env.ADMIN_EMAIL
      if (isAdmin) return NextResponse.redirect(`${origin}/admin`)
    }
  }

  return NextResponse.redirect(
    order ? `${origin}/account/orders/${order}` : `${origin}/account`,
  )
}
