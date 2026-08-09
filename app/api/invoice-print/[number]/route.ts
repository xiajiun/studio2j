export const runtime = 'edge'

import { createServiceClient } from '@/lib/supabase/server'
import type { Order, OrderItem, ShippingAddress } from '@/lib/database.types'

const PAYMENT: Record<string, { label: string; lines: string[]; link?: string }> = {
  wise:     { label: 'Wise (international)', lines: [], link: 'https://wise.com/pay/me/keweih6' },
  korea:    { label: 'Bank Transfer — South Korea', lines: ['Shinhan Bank', 'LAU XIA JIUN', '110-437-478592', 'Swift: SHBKKRSE · TEL: 01029838831'] },
  malaysia: { label: 'Bank Transfer — Malaysia', lines: ['Maybank', 'HO KE WEI', '1624 3302 2400'] },
  japan:    { label: 'Bank Transfer — Japan', lines: ['Yuucho Bank (9900)', 'Branch: 038', 'ホカウェイ', '普通 Futsuu Savings · 8992079'] },
}

function esc(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}
function num(n: number) { return n.toLocaleString('en-US') }

export async function GET(_req: Request, { params }: { params: { number: string } }) {
  const supabase = createServiceClient()
  const { data: order } = await supabase.from('orders').select('*').eq('order_number', params.number).single()
  if (!order) return new Response('Not found', { status: 404 })

  const o = order as Order
  const items = (o.items ?? []) as OrderItem[]
  const addr = o.shipping_address as ShippingAddress | null
  const ccy = o.currency ?? 'KRW'
  const hasDomDel = items.some(i => (i.dom_del ?? 0) > 0)
  const itemsTotal = items.reduce((sum, i) => {
    if (i.total != null && i.total > 0) return sum + i.total
    return sum + (i.price ?? 0) * (i.qty ?? 1) + (i.dom_del ?? 0)
  }, 0)
  const goods = itemsTotal > 0 ? itemsTotal : (o.goods_total ?? 0)
  const fee = o.service_fee ?? 0
  const runner = o.runner_fee ?? 0
  const ship = o.shipping_cost ?? 0
  const grandTotal = goods + fee + runner + ship
  const totalPaid = (o.paid_1_amount ?? 0) + (o.paid_2_amount ?? 0) + (o.paid_3_amount ?? 0)
  const balanceDue = grandTotal - totalPaid
  const paid = balanceDue <= 0 && totalPaid > 0
  const payMethod = (addr?.payment_method ?? 'wise') as string
  const payInfo = PAYMENT[payMethod] ?? PAYMENT.wise
  const invoiceLabel = (goods > 0 || fee > 0) ? 'Invoice' : 'Quotation'
  const payNote = totalPaid > 0
    ? balanceDue > 0
      ? `Thank you for your part payment of ${num(totalPaid)} ${ccy}. Please complete the remaining balance of ${num(balanceDue)} ${ccy} within 24 hours.`
      : 'Payment received in full. Thank you!'
    : 'Please complete the payment. This invoice covers item cost, service fee, and international shipping.'

  const colTpl = hasDomDel
    ? 'grid-template-columns:3fr 1fr 1fr 48px 84px 64px 84px'
    : 'grid-template-columns:3fr 1fr 1fr 48px 84px 84px'

  const headers = ['Item', 'Colour', 'Ccy', 'Qty', 'Unit price', ...(hasDomDel ? ['Dom.del'] : []), `Total (${ccy})`]
  const headerRow = headers.map((h, i) => {
    const right = i >= 3
    return `<div style="font-size:10px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#18293F;text-align:${right ? 'right' : 'left'}">${esc(h)}</div>`
  }).join('')

  const itemRows = items.map((item, i) => {
    const total = item.total
      ? num(item.total)
      : (item.price && item.qty ? num(item.price * item.qty + (item.dom_del ?? 0)) : '—')
    return `<div style="display:grid;${colTpl};gap:8px;padding:13px 0;border-bottom:1px solid #F3F4F6;align-items:start">
      <div style="font-size:13px;font-weight:400;color:#111827">${i + 1}. ${esc(item.name)}</div>
      <div style="font-size:12px;color:#9CA3AF">${esc(item.color ?? '')}</div>
      <div style="font-size:12px;color:#9CA3AF">${esc(item.item_ccy ?? ccy)}</div>
      <div style="font-size:13px;color:#374151;text-align:right">${item.qty}</div>
      <div style="font-size:13px;color:#374151;text-align:right">${item.price ? num(item.price) : '—'}</div>
      ${hasDomDel ? `<div style="font-size:12px;color:#9CA3AF;text-align:right">${item.dom_del ? num(item.dom_del) : '—'}</div>` : ''}
      <div style="font-size:13px;font-weight:500;color:#111827;text-align:right">${total}</div>
    </div>`
  }).join('')

  const addrLines = [
    o.customer_email,
    addr?.phone,
    addr?.address,
    (addr?.city || addr?.postal_code) ? [addr?.city, addr?.postal_code].filter(Boolean).join('  ') : null,
    addr?.country,
  ].filter(Boolean).map(l => esc(l!)).join('<br>')

  const orderDetailRows = [
    ['Type', o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'],
    ['Currency', ccy],
    ['Payment', payInfo.label],
  ].map(([k, v]) => `<tr>
    <td style="font-size:12px;font-weight:500;color:#9CA3AF;padding-bottom:6px;padding-right:16px;vertical-align:top;white-space:nowrap">${esc(k)}</td>
    <td style="font-size:13px;font-weight:400;color:#374151;padding-bottom:6px">${esc(v)}</td>
  </tr>`).join('')

  const totalRows = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:400;color:#6B7280">Items subtotal</span>
      <span style="font-size:13px;font-weight:400;color:#374151;white-space:nowrap">${num(goods)} ${esc(ccy)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:400;color:#6B7280">Handling fee</span>
      <span style="font-size:13px;font-weight:400;color:#374151;white-space:nowrap">${fee ? `${num(fee)} ${esc(ccy)}` : '—'}</span>
    </div>
    ${runner > 0 ? `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:400;color:#6B7280">Runner / Transportation fee</span>
      <span style="font-size:13px;font-weight:400;color:#374151;white-space:nowrap">${num(runner)} ${esc(ccy)}</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:400;color:#6B7280">International shipping</span>
      <span style="font-size:13px;font-weight:400;color:#374151;white-space:nowrap">${ship ? `${num(ship)} ${esc(ccy)}` : '—'}</span>
    </div>
    ${totalPaid > 0 ? `
    <div style="border-top:1px solid #E5E7EB;margin-top:4px;padding-top:10px;display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <span style="font-size:12px;color:#9CA3AF">Total</span>
      <span style="font-size:14px;color:#6B7280">${num(grandTotal)} ${esc(ccy)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <span style="font-size:12px;color:#059669">Paid</span>
      <span style="font-size:14px;color:#059669">&#x2212;${num(totalPaid)} ${esc(ccy)}</span>
    </div>` : ''}
    <div style="background:${paid ? '#F0FDF4' : '#18293F'};border-radius:6px;padding:14px 16px;margin-top:4px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${paid ? '#059669' : 'rgba(255,255,255,0.65)'}">${paid ? 'Paid in full &#10003;' : totalPaid > 0 ? 'Balance due' : 'Amount due'}</span>
      ${!paid ? `<span style="font-family:'Fraunces',Georgia,serif;font-size:24px;font-weight:400;color:white;letter-spacing:-.01em">${num(balanceDue)} ${esc(ccy)}</span>` : `<span style="font-family:'Fraunces',Georgia,serif;font-size:18px;font-weight:400;color:#059669">${num(grandTotal)} ${esc(ccy)}</span>`}
    </div>
  `

  const wiseBlock = `<div style="background:${payMethod === 'wise' ? 'white' : '#F9FAFB'};border-radius:6px;padding:16px 18px;border:1px solid ${payMethod === 'wise' ? '#E5E7EB' : '#F3F4F6'}">
    <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:10px">Wise (international)</div>
    <a href="https://wise.com/pay/me/keweih6" style="font-size:13px;color:white;font-weight:500;display:inline-block;text-decoration:none;background:#18293F;padding:7px 16px;border-radius:6px">Pay via Wise &#8594;</a>
    <div style="margin-top:10px;padding-top:10px;border-top:1px solid #F3F4F6;font-size:11px;color:#9CA3AF">Reference: <strong style="font-weight:600;color:#374151">${esc(o.order_number)}</strong></div>
  </div>`

  const bankBlock = payMethod !== 'wise' ? (() => {
    const bankLines = payInfo.lines.map((l, i) => `<div style="font-size:13px;font-weight:${i === 0 ? 500 : 400};color:${i === 0 ? '#111827' : '#6B7280'};margin-bottom:3px">${esc(l)}</div>`).join('')
    return `<div style="background:white;border-radius:6px;padding:16px 18px;border:1px solid #E5E7EB">
      <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:10px">${esc(payInfo.label)}</div>
      ${bankLines}
      <div style="margin-top:10px;padding-top:10px;border-top:1px solid #F3F4F6;font-size:11px;color:#9CA3AF">Reference: <strong style="font-weight:600;color:#374151">${esc(o.order_number)}</strong></div>
    </div>`
  })() : ''

  const payGrid = payMethod === 'wise'
    ? `<div style="max-width:320px">${wiseBlock}</div>`
    : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${wiseBlock}${bankBlock}</div>`

  const noteHtml = o.customer_notes
    ? `<div style="margin-bottom:24px;padding:14px 18px;background:#FFFBEB;border-radius:6px;border-left:3px solid #F59E0B">
        <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#92400E;margin-bottom:6px">Note</div>
        <p style="font-size:13px;font-weight:400;color:#78350F;line-height:1.7;margin:0">${esc(o.customer_notes)}</p>
      </div>` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Studio2J ${esc(invoiceLabel)} &#8212; ${esc(o.order_number)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',Arial,sans-serif;background:#F4F6F8;color:#111827;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:8mm}
</style>
</head>
<body>
<div style="max-width:740px;margin:0 auto;padding:20px 12px">
<div style="background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.08),0 8px 32px rgba(0,0,0,0.05);overflow:hidden">

  <!-- Navy header -->
  <div style="background:#18293F;padding:32px 48px;display:flex;justify-content:space-between;align-items:flex-start">
    <div>
      <div style="font-family:'Fraunces',Georgia,serif;font-size:26px;font-weight:500;color:white;letter-spacing:-.02em;line-height:1;margin-bottom:6px">Studio<em style="font-style:italic;color:#C8A98D">2J</em></div>
      <div style="font-size:11px;font-weight:400;color:rgba(255,255,255,0.4);letter-spacing:.06em">Seoul &amp; Tokyo personal shopping</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:10px;font-weight:500;color:rgba(255,255,255,0.4);letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px">${esc(invoiceLabel)}</div>
      <div style="font-family:'Fraunces',Georgia,serif;font-size:22px;font-weight:300;color:white;letter-spacing:-.01em;margin-bottom:4px">${esc(o.order_number)}</div>
      <div style="font-size:12px;font-weight:300;color:rgba(255,255,255,0.45)">${fmt(o.created_at)}</div>
      ${paid ? '<div style="margin-top:10px;display:inline-block;background:#22543D;color:#9AE6B4;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:4px">Paid in full</div>' : ''}
    </div>
  </div>

  <!-- Body -->
  <div style="padding:36px 48px">

    <!-- Billed to / Order details -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:36px;padding-bottom:32px;border-bottom:1px solid #F3F4F6">
      <div>
        <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px">Billed to</div>
        <div style="font-size:16px;font-weight:500;color:#111827;margin-bottom:6px">${esc(o.customer_name ?? addr?.name ?? '—')}</div>
        <div style="font-size:13px;font-weight:400;color:#6B7280;line-height:1.8">${addrLines}</div>
      </div>
      <div>
        <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px">Order details</div>
        <table style="border-collapse:collapse;width:100%"><tbody>${orderDetailRows}</tbody></table>
      </div>
    </div>

    <!-- Items -->
    <div style="margin-bottom:32px">
      <div style="display:grid;${colTpl};gap:8px;padding:8px 0;border-bottom:2px solid #18293F">${headerRow}</div>
      ${itemRows || '<div style="padding:32px 0;text-align:center;font-family:\'Fraunces\',Georgia,serif;font-style:italic;font-size:14px;color:#9CA3AF">No items listed</div>'}
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-top:20px">
        ${totalRows}
      </div>
    </div>

    <!-- Pay note -->
    <div style="background:#F9FAFB;border-radius:6px;padding:14px 18px;margin-bottom:24px;border-left:3px solid #18293F">
      <p style="font-size:13px;font-weight:400;color:#374151;line-height:1.7;margin:0">${esc(payNote)}</p>
    </div>

    <!-- Payment -->
    <div style="margin-bottom:24px">
      <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px">Payment</div>
      ${payGrid}
    </div>

    ${noteHtml}

    <!-- Tracking -->
    <div style="background:#F0F4FF;border-radius:6px;padding:14px 18px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
      <div>
        <div style="font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#4B5FCC;margin-bottom:3px">Order tracking</div>
        <div style="font-size:12px;font-weight:400;color:#374151">Check your order status anytime.</div>
      </div>
      <a href="https://studio2j.pages.dev/order/${esc(o.order_number)}" style="font-size:12px;font-weight:500;color:#18293F;text-decoration:none;white-space:nowrap;background:white;padding:8px 16px;border-radius:6px;border:1px solid #E5E7EB">Track ${esc(o.order_number)} &#8594;</a>
    </div>

    <!-- Footer -->
    <div style="padding-top:20px;border-top:1px solid #F3F4F6;display:flex;justify-content:space-between;align-items:center">
      <div style="font-family:'Fraunces',Georgia,serif;font-size:13px;font-style:italic;color:#9CA3AF">Studio<em>2J</em> &#8212; Seoul &amp; Tokyo</div>
      <div style="font-size:11px;color:#9CA3AF">studio2j25@gmail.com</div>
    </div>

  </div>
</div>
</div>
<script>window.onload=()=>window.print()</script>
</body>
</html>`

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
