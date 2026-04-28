export const runtime = 'edge'

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { email, fair_id, fair_name, fair_date, fair_deadline, fair_city, fair_country, going } = await req.json()

  if (!email || !fair_id) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  await supabase.from('fair_reminders').upsert(
    { email, fair_id, fair_name, fair_date, fair_deadline },
    { onConflict: 'email,fair_id' }
  )

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const daysUntil   = Math.ceil((new Date(fair_date).getTime() - Date.now()) / 86400000)
    const fairFmt     = new Date(fair_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const deadlineFmt = fair_deadline
      ? new Date(fair_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : null

    const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#FAF7F3;font-family:Georgia,serif;">
<div style="max-width:520px;margin:0 auto;padding:48px 24px;">

  <div style="font-size:22px;font-weight:500;color:#1F3A5F;margin-bottom:40px;letter-spacing:-0.02em;">
    Studio<em style="font-style:italic;color:#C8A98D;">2J</em>
  </div>

  <h2 style="font-family:Georgia,serif;font-size:28px;font-weight:300;color:#4B372A;margin:0 0 6px;letter-spacing:-0.02em;">
    You saved ${fair_name}
  </h2>
  <p style="font-family:sans-serif;font-size:13px;font-weight:300;color:#7A5C45;margin:0 0 32px;">
    ${daysUntil > 0 ? `${daysUntil} day${daysUntil !== 1 ? 's' : ''} to go` : 'Coming up very soon!'}
  </p>

  <div style="background:white;border-radius:14px;padding:24px 28px;margin-bottom:20px;border:0.5px solid rgba(122,92,69,0.12);">
    <div style="font-family:sans-serif;font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#C8A98D;margin-bottom:14px;">Fair details</div>
    <div style="font-family:sans-serif;font-size:14px;font-weight:300;color:#4B372A;line-height:2;">
      <strong style="font-weight:500;">${fair_name}</strong><br/>
      ${fairFmt}<br/>
      ${fair_city}, ${fair_country}
    </div>
  </div>

  ${going ? `
  <div style="background:#1F3A5F;border-radius:14px;padding:24px 28px;margin-bottom:20px;">
    <div style="font-family:sans-serif;font-size:10px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:rgba(200,169,141,0.8);margin-bottom:10px;">Studio2J is attending</div>
    <p style="font-family:sans-serif;font-size:13px;font-weight:300;color:rgba(245,239,230,0.8);line-height:1.8;margin:0 0 16px;">
      We'll be at ${fair_name}! Place your order before
      <strong style="color:#C8A98D;font-weight:500;">${deadlineFmt ?? 'the deadline'}</strong>
      and we'll pick up your items.
    </p>
    <a href="https://studio2j.pages.dev/order/new"
       style="display:inline-block;background:#C8A98D;color:#4B372A;padding:12px 28px;border-radius:99px;text-decoration:none;font-family:sans-serif;font-size:12px;font-weight:600;letter-spacing:0.03em;">
      Place an order →
    </a>
  </div>
  ` : `
  <div style="background:#F5EFE6;border-radius:14px;padding:20px 24px;margin-bottom:20px;">
    <p style="font-family:sans-serif;font-size:13px;font-weight:300;color:#7A5C45;line-height:1.8;margin:0;">
      Interested in items from this fair? Send us a message on
      <a href="https://www.instagram.com/studio2j25/" style="color:#1F3A5F;">@studio2j25</a>
      or submit an order request and we'll see what we can do.
    </p>
  </div>
  `}

  <div style="border-top:0.5px solid rgba(122,92,69,0.15);margin-top:32px;padding-top:24px;text-align:center;">
    <p style="font-family:sans-serif;font-size:11px;font-weight:300;color:#C8A98D;margin:0;">
      Studio2J · Seoul &amp; Tokyo · studio2j25@gmail.com
    </p>
  </div>
</div>
</body>
</html>`

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from:    'Studio2J <onboarding@resend.dev>',
        to:      [email],
        subject: `You saved ${fair_name} — ${daysUntil > 0 ? `${daysUntil} days to go` : 'coming up soon!'}`,
        html,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
