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
    ? 'grid-template-columns:3fr 1fr 1fr 50px 88px 70px 88px'
    : 'grid-template-columns:3fr 1fr 1fr 50px 88px 88px'

  const headers = ['Item', 'Colour', 'Ccy', 'Qty', 'Unit price', ...(hasDomDel ? ['Dom.del'] : []), `Total (${ccy})`]
  const headerRow = headers.map((h, i) => {
    const right = i >= 3
    return `<div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#A8CBE0;text-align:${right ? 'right' : 'left'}">${esc(h)}</div>`
  }).join('')

  const itemRows = items.map((item, i) => {
    const total = item.total
      ? num(item.total)
      : (item.price && item.qty ? num(item.price * item.qty + (item.dom_del ?? 0)) : '—')
    return `<div style="display:grid;${colTpl};gap:8px;padding:12px 0;border-bottom:.5px solid rgba(168,203,224,.07);align-items:start">
      <div style="font-size:13px;font-weight:400;color:#2D3748">${i + 1}. ${esc(item.name)}</div>
      <div style="font-size:12px;color:#6BA3C8">${esc(item.color ?? '')}</div>
      <div style="font-size:12px;color:#6BA3C8">${esc(item.item_ccy ?? ccy)}</div>
      <div style="font-size:13px;color:#2D3748;text-align:right">${item.qty}</div>
      <div style="font-size:13px;color:#2D3748;text-align:right">${item.price ? num(item.price) : '—'}</div>
      ${hasDomDel ? `<div style="font-size:12px;color:#6BA3C8;text-align:right">${item.dom_del ? num(item.dom_del) : '—'}</div>` : ''}
      <div style="font-size:13px;font-weight:500;color:#2D3748;text-align:right">${total}</div>
    </div>`
  }).join('')

  const addrLines = [
    o.customer_email,
    addr?.phone,
    addr?.address,
    (addr?.city || addr?.postal_code) ? [addr?.city, addr?.postal_code].filter(Boolean).join('  ') : null,
    addr?.country,
  ].filter(Boolean).map(l => esc(l!)).join('<br>')

  const totalRows = `
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#6BA3C8">Items subtotal</span>
      <span style="font-size:13px;font-weight:400;color:#2D3748;white-space:nowrap">${num(goods)} ${esc(ccy)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#6BA3C8">Handling fee</span>
      <span style="font-size:13px;font-weight:400;color:#2D3748;white-space:nowrap">${fee ? `${num(fee)} ${esc(ccy)}` : '—'}</span>
    </div>
    ${runner > 0 ? `<div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#6BA3C8">Runner / Transportation fee</span>
      <span style="font-size:13px;font-weight:400;color:#2D3748;white-space:nowrap">${num(runner)} ${esc(ccy)}</span>
    </div>` : ''}
    <div style="display:flex;justify-content:space-between;align-items:baseline;gap:16px;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#6BA3C8">International shipping</span>
      <span style="font-size:13px;font-weight:400;color:#2D3748;white-space:nowrap">${ship ? `${num(ship)} ${esc(ccy)}` : '—'}</span>
    </div>
    ${totalPaid > 0 ? `
    <div style="border-top:.5px solid rgba(168,203,224,.2);margin-top:4px;padding-top:12px;display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#6BA3C8">Total</span>
      <span style="font-size:14px;font-weight:400;color:#6BA3C8">${num(grandTotal)} ${esc(ccy)}</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">
      <span style="font-size:12px;font-weight:300;color:#2A5C35">Paid</span>
      <span style="font-size:14px;font-weight:400;color:#2A5C35">&#x2212;${num(totalPaid)} ${esc(ccy)}</span>
    </div>` : ''}
    <div style="border-top:1px solid rgba(168,203,224,.2);margin-top:4px;padding-top:16px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${paid ? '#2A5C35' : '#4A8AB5'}">${paid ? 'Paid in full ✓' : totalPaid > 0 ? 'Balance due' : 'Amount due'}</span>
      ${!paid ? `<span style="font-family:'Fraunces',Georgia,serif;font-size:32px;font-weight:300;color:#4A8AB5;letter-spacing:-.02em">${num(balanceDue)} ${esc(ccy)}</span>` : ''}
    </div>
  `

  const wiseBlock = `<div style="background:${payMethod === 'wise' ? 'white' : 'rgba(255,255,255,.5)'};border-radius:10px;padding:16px 18px;border:.5px solid ${payMethod === 'wise' ? 'rgba(168,203,224,.25)' : 'rgba(168,203,224,.12)'}">
    <div style="font-size:11px;font-weight:500;color:#2D3748;margin-bottom:10px;letter-spacing:.04em">Wise (international)</div>
    <a href="https://wise.com/pay/me/keweih6" style="font-size:13px;color:#4A8AB5;font-weight:500;display:inline-block;text-decoration:none;background:rgba(74,138,181,.07);padding:6px 14px;border-radius:99px">Pay via Wise &#8594;</a>
    <div style="margin-top:10px;padding-top:10px;border-top:.5px solid rgba(168,203,224,.12);font-size:11px;font-weight:300;color:#6BA3C8">Reference: <strong style="font-weight:500;color:#2D3748">${esc(o.order_number)}</strong></div>
  </div>`

  const bankBlock = payMethod !== 'wise' ? (() => {
    const bankLines = payInfo.lines.map((l, i) => `<div style="font-size:13px;font-weight:${i === 0 ? 400 : 300};color:${i === 0 ? '#2D3748' : '#6BA3C8'};margin-bottom:3px">${esc(l)}</div>`).join('')
    return `<div style="background:white;border-radius:10px;padding:16px 18px;border:.5px solid rgba(168,203,224,.25)">
      <div style="font-size:11px;font-weight:500;color:#2D3748;margin-bottom:10px;letter-spacing:.04em">${esc(payInfo.label)}</div>
      ${bankLines}
      <div style="margin-top:10px;padding-top:10px;border-top:.5px solid rgba(168,203,224,.12);font-size:11px;font-weight:300;color:#6BA3C8">Reference: <strong style="font-weight:500;color:#2D3748">${esc(o.order_number)}</strong></div>
    </div>`
  })() : ''

  const payGrid = payMethod === 'wise'
    ? wiseBlock
    : `<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">${wiseBlock}${bankBlock}</div>`

  const noteHtml = o.customer_notes
    ? `<div style="padding:16px 20px;border-left:2px solid #A8CBE0;background:rgba(200,169,141,.06);border-radius:0 8px 8px 0">
        <div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#A8CBE0;margin-bottom:8px">Note</div>
        <p style="font-size:13px;font-weight:300;color:#6BA3C8;line-height:1.7;margin:0">${esc(o.customer_notes)}</p>
      </div>` : ''

  const sectionLabel = (text: string) =>
    `<div style="font-size:11px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#A8CBE0;margin-bottom:14px;padding-bottom:10px;border-bottom:.5px solid rgba(168,203,224,.1)">${esc(text)}</div>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Studio2J ${esc(invoiceLabel)} &#8212; ${esc(o.order_number)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;1,300;1,400&family=Inter:wght@300;400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',Arial,sans-serif;background:#F8F8F6;color:#2D3748;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:12mm}
</style>
</head>
<body>
<div style="max-width:680px;margin:0 auto;padding:40px 24px 60px">

  <!-- Eyebrow + Heading -->
  <div style="margin-bottom:40px">
    <div style="font-family:'Fraunces',Georgia,serif;font-style:italic;font-weight:300;font-size:18px;color:#6BA3C8;margin-bottom:12px;display:flex;align-items:center;gap:12px">
      <span style="width:32px;height:0.5px;background:#A8CBE0;display:inline-block;flex-shrink:0"></span>
      ${esc(invoiceLabel)}
    </div>
    <div style="font-family:'Fraunces',Georgia,serif;font-weight:300;font-size:52px;color:#2D3748;letter-spacing:-.03em;line-height:1.05;margin-bottom:12px">
      ${esc(o.order_number)}${paid ? ' <em style="font-style:italic;color:#2A5C35">&#10003;</em>' : ''}
    </div>
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
      <span style="font-size:13px;font-weight:300;color:#A8CBE0">${fmt(o.created_at)}</span>
      ${paid ? '<span style="background:#D5E8D8;color:#2A5C35;font-size:10px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;padding:3px 10px;border-radius:99px">Paid in full</span>' : ''}
    </div>
  </div>

  <div style="display:flex;flex-direction:column;gap:28px">

    <!-- Billed to -->
    <div>
      ${sectionLabel('Billed to')}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
        <div>
          <div style="font-family:'Fraunces',Georgia,serif;font-size:20px;font-weight:400;color:#4A8AB5;margin-bottom:8px;letter-spacing:-.01em">${esc(o.customer_name ?? addr?.name ?? '—')}</div>
          <div style="font-size:13px;font-weight:300;color:#6BA3C8;line-height:1.8">${addrLines}</div>
        </div>
        <div>
          <div style="font-size:13px;font-weight:300;color:#6BA3C8;line-height:2">
            <span style="color:#2D3748;font-weight:500">Type</span> ${o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'}<br>
            <span style="color:#2D3748;font-weight:500">Currency</span> ${esc(ccy)}<br>
            <span style="color:#2D3748;font-weight:500">Payment</span> ${esc(payInfo.label)}
          </div>
        </div>
      </div>
    </div>

    <!-- Items -->
    <div>
      ${sectionLabel('Items' + (items.length > 0 ? ` · ${items.length}` : ''))}
      <div style="display:grid;${colTpl};gap:8px;padding:0 0 10px;border-bottom:.5px solid rgba(168,203,224,.2);margin-bottom:2px">${headerRow}</div>
      ${itemRows || '<div style="padding:32px 0;text-align:center;font-family:\'Fraunces\',Georgia,serif;font-style:italic;font-size:14px;color:#A8CBE0">No items listed</div>'}
    </div>

    <!-- Summary -->
    <div>
      ${sectionLabel('Summary')}
      <div style="background:#E8F4FA;border-radius:12px;padding:20px 24px;border:.5px solid rgba(168,203,224,.12)">
        ${totalRows}
      </div>
    </div>

    <!-- Pay note -->
    <div style="background:#E8F4FA;border-radius:12px;padding:16px 20px;border:.5px solid rgba(168,203,224,.12)">
      <p style="font-size:13px;font-weight:300;color:#2D3748;line-height:1.7;margin:0">${esc(payNote)}</p>
    </div>

    <!-- Payment -->
    <div>
      ${sectionLabel('Payment')}
      ${payGrid}
    </div>

    ${noteHtml ? `<div>${noteHtml}</div>` : ''}

    <!-- Tracking -->
    <div style="background:rgba(74,138,181,.04);border-radius:12px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
      <div>
        <div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#4A8AB5;margin-bottom:4px">Order tracking</div>
        <div style="font-size:12px;font-weight:300;color:#6BA3C8">Check your order status anytime.</div>
      </div>
      <a href="https://studio2j.pages.dev/order/${esc(o.order_number)}" style="font-size:12px;font-weight:500;color:#4A8AB5;text-decoration:none;white-space:nowrap;background:white;padding:8px 18px;border-radius:99px;border:.5px solid rgba(74,138,181,.2)">Track ${esc(o.order_number)} &#8594;</a>
    </div>

    <!-- Footer -->
    <div style="padding-top:20px;border-top:.5px solid rgba(168,203,224,.1);display:flex;justify-content:space-between;align-items:center">
      <div style="font-family:'Fraunces',Georgia,serif;font-size:13px;font-style:italic;color:#A8CBE0">Studio<em>2J</em> &#8212; Seoul &amp; Tokyo</div>
      <div style="font-size:11px;font-weight:300;color:#A8CBE0">studio2j25@gmail.com</div>
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
