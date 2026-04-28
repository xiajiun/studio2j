export const runtime = 'edge'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, fair_id, fair_name, fair_date, fair_deadline } = await req.json()

  if (!email || !fair_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error: dbError } = await supabase.from('fair_reminders').upsert(
    { email, fair_id, fair_name, fair_date, fair_deadline },
    { onConflict: 'email,fair_id' }
  )

  if (dbError) {
    console.error('fair_reminders insert error:', dbError.message)
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
