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
  const ship = o.shipping_cost ?? 0
  const grandTotal = goods + fee + ship
  const totalPaid = (o.paid_1_amount ?? 0) + (o.paid_2_amount ?? 0) + (o.paid_3_amount ?? 0)
  const balanceDue = grandTotal - totalPaid
  const payMethod = (addr?.payment_method ?? 'wise') as string
  const payInfo = PAYMENT[payMethod] ?? PAYMENT.wise
  const invoiceLabel = (goods > 0 || fee > 0) ? 'Invoice' : 'Quotation'

  const colTpl = hasDomDel
    ? 'grid-template-columns:3fr 1fr 1fr 60px 90px 70px 90px'
    : 'grid-template-columns:3fr 1fr 1fr 60px 90px 90px'

  const headers = ['Item','Colour','Ccy','Qty','Unit price', ...(hasDomDel?['Dom.del']:[]), `Total (${ccy})`]
  const headerRow = headers.map((h,i) => {
    const right = i >= 3
    return `<div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#7A5C45;text-align:${right?'right':'left'}">${esc(h)}</div>`
  }).join('')

  const itemRows = items.map((item, i) => {
    const total = item.total
      ? num(item.total)
      : (item.price && item.qty ? num(item.price * item.qty + (item.dom_del ?? 0)) : '—')
    return `<div style="display:grid;${colTpl};gap:8px;padding:11px 0;border-bottom:.5px solid #ede7de;align-items:start">
      <div style="font-size:13px;font-weight:400;color:#2a1f18">${i+1}. ${esc(item.name)}</div>
      <div style="font-size:12px;color:#7A5C45">${esc(item.color??'')}</div>
      <div style="font-size:12px;color:#7A5C45">${esc(item.item_ccy??ccy)}</div>
      <div style="font-size:13px;color:#2a1f18;text-align:right">${item.qty}</div>
      <div style="font-size:13px;color:#2a1f18;text-align:right">${item.price?num(item.price):'—'}</div>
      ${hasDomDel?`<div style="font-size:12px;color:#7A5C45;text-align:right">${item.dom_del?num(item.dom_del):'—'}</div>`:''}
      <div style="font-size:13px;font-weight:400;color:#2a1f18;text-align:right">${total}</div>
    </div>`
  }).join('')

  const addrLines = [
    o.customer_email,
    addr?.phone,
    addr?.address,
    (addr?.city || addr?.postal_code) ? [addr?.city, addr?.postal_code].filter(Boolean).join('  ') : null,
    addr?.country,
  ].filter(Boolean).map(l => esc(l!)).join('<br>')

  const payBlocks = (() => {
    const wise = `<div style="background:${payMethod==='wise'?'white':'rgba(255,255,255,0.6)'};border-radius:4px;padding:16px 20px;border:${payMethod==='wise'?'1px solid #C8A98D':'1px solid rgba(200,169,141,0.3)'}">
      <div style="font-size:11px;font-weight:500;color:#4B372A;margin-bottom:10px">Wise (international)</div>
      <a href="https://wise.com/pay/me/keweih6" style="font-size:13px;color:#1F3A5F;font-weight:500;display:inline-block;text-decoration:none;background:#E8F0F8;padding:6px 14px;border-radius:6px">Pay via Wise</a>
      <div style="margin-top:10px;padding-top:10px;border-top:.5px solid rgba(122,92,69,.15);font-size:11px;font-weight:300;color:#7A5C45">Reference: <strong style="font-weight:500;color:#4B372A">${esc(o.order_number)}</strong></div>
    </div>`
    if (payMethod === 'wise') return wise
    const bankLines = payInfo.lines.map((l,i) => `<div style="font-size:13px;font-weight:${i===0?400:300};color:${i===0?'#4B372A':'#7A5C45'};margin-bottom:3px">${esc(l)}</div>`).join('')
    const bank = `<div style="background:white;border-radius:4px;padding:16px 20px;border:1px solid #C8A98D">
      <div style="font-size:11px;font-weight:500;color:#4B372A;margin-bottom:10px">${esc(payInfo.label)}</div>
      ${bankLines}
      <div style="margin-top:10px;padding-top:10px;border-top:.5px solid rgba(122,92,69,.15);font-size:11px;font-weight:300;color:#7A5C45">Reference: <strong style="font-weight:500;color:#4B372A">${esc(o.order_number)}</strong></div>
    </div>`
    return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">${wise}${bank}</div>`
  })()

  const noteHtml = o.customer_notes
    ? `<div style="margin-top:24px;padding:20px 24px;border-left:2px solid #C8A98D">
        <div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#C8A98D;margin-bottom:8px">Note</div>
        <p style="font-size:13px;font-weight:300;color:#7A5C45;line-height:1.7;margin:0">${esc(o.customer_notes)}</p>
      </div>` : ''

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Studio2J ${esc(invoiceLabel)} — ${esc(o.order_number)}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Georgia,serif;background:white;color:#2a1f18;-webkit-print-color-adjust:exact;print-color-adjust:exact}
@page{size:A4;margin:12mm}
</style>
</head>
<body>
<div style="max-width:720px;margin:0 auto;background:white">

  <!-- Header -->
  <div style="background:#1F3A5F;padding:36px 48px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <div style="font-family:Georgia,serif;font-size:28px;font-weight:500;color:white;letter-spacing:-.02em;margin-bottom:4px">Studio<em style="font-style:italic;color:#C8A98D">2J</em></div>
      <div style="font-family:Arial,sans-serif;font-size:10px;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,239,230,.5)">${esc(invoiceLabel)}</div>
    </div>
    <div style="text-align:right">
      <div style="font-family:Georgia,serif;font-size:22px;font-weight:300;color:#C8A98D;letter-spacing:-.01em">${esc(o.order_number)}</div>
      <div style="font-family:Arial,sans-serif;font-size:12px;font-weight:300;color:rgba(245,239,230,.55);margin-top:4px">${fmt(o.created_at)}</div>
    </div>
  </div>

  <div style="padding:40px 48px;font-family:Arial,sans-serif">

    <!-- Billed to / Order details -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px">
      <div>
        <div style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#C8A98D;margin-bottom:12px">Billed to</div>
        <div style="font-family:Georgia,serif;font-size:18px;font-weight:400;color:#1F3A5F;margin-bottom:6px">${esc(o.customer_name ?? addr?.name ?? '—')}</div>
        <div style="font-size:13px;font-weight:300;color:#7A5C45;line-height:1.7">${addrLines}</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#C8A98D;margin-bottom:12px">Order details</div>
        <div style="font-size:13px;font-weight:300;color:#7A5C45;line-height:2">
          <span style="color:#4B372A;font-weight:500">Type</span> ${o.kind==='proxy'?'Proxy buy':o.kind==='fair'?'Fair haul':'Personal request'}<br>
          <span style="color:#4B372A;font-weight:500">Currency</span> ${esc(ccy)}<br>
          <span style="color:#4B372A;font-weight:500">Payment</span> ${esc(payInfo.label)}
        </div>
      </div>
    </div>

    <!-- Items -->
    <div style="margin-bottom:32px">
      <div style="display:grid;${colTpl};gap:8px;padding:8px 0;border-bottom:1.5px solid #1F3A5F;margin-bottom:4px">${headerRow}</div>
      ${itemRows || '<div style="padding:24px 0;text-align:center;font-style:italic;font-size:14px;color:#C8A98D">No items listed</div>'}
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;margin-top:20px">
        <div style="width:300px;display:flex;justify-content:space-between;align-items:baseline;gap:16px">
          <span style="font-size:12px;font-weight:300;color:#7A5C45">Items subtotal</span>
          <span style="font-size:13px;color:#2a1f18">${num(goods)}</span>
        </div>
        <div style="width:300px;display:flex;justify-content:space-between;align-items:baseline;gap:16px">
          <span style="font-size:12px;font-weight:300;color:#7A5C45">Handling fee</span>
          <span style="font-size:13px;color:#2a1f18">${fee?num(fee):'—'}</span>
        </div>
        <div style="width:300px;display:flex;justify-content:space-between;align-items:baseline;gap:16px">
          <span style="font-size:12px;font-weight:300;color:#7A5C45">International shipping</span>
          <span style="font-size:13px;color:#2a1f18">${ship?num(ship):'—'}</span>
        </div>
        ${totalPaid > 0 ? `
        <div style="width:300px;border-top:1.5px solid #1F3A5F;margin-top:4px;padding-top:10px;display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-size:11px;font-weight:400;color:#7A5C45">Total</span>
          <span style="font-size:14px;font-weight:400;color:#7A5C45">${num(grandTotal)} ${esc(ccy)}</span>
        </div>
        <div style="width:300px;display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-size:11px;font-weight:400;color:#2A5C35">Paid</span>
          <span style="font-size:14px;font-weight:400;color:#2A5C35">−${num(totalPaid)} ${esc(ccy)}</span>
        </div>` : ''}
        <div style="width:300px;border-top:1.5px solid #1F3A5F;margin-top:4px;padding-top:12px;display:flex;justify-content:space-between;align-items:baseline">
          <span style="font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:${balanceDue<=0?'#2A5C35':'#1F3A5F'}">${balanceDue<=0?'Paid in full ✓':totalPaid>0?'Balance due':'Amount due'}</span>
          <span style="font-family:Georgia,serif;font-size:22px;font-weight:400;color:${balanceDue<=0?'#2A5C35':'#1F3A5F'};letter-spacing:-.01em">${balanceDue>0?`${num(balanceDue)} ${esc(ccy)}`:''}</span>
        </div>
      </div>
    </div>

    <!-- Payment note -->
    <div style="background:#f0ebe3;border-radius:4px;padding:16px 20px;margin-bottom:24px;border-left:3px solid #C8A98D">
      <p style="font-size:13px;font-weight:300;color:#4B372A;line-height:1.7">Please complete payment within 24 hours. This invoice covers item cost, service fee, and international shipping.</p>
    </div>

    <!-- Payment -->
    <div style="background:#f5efe6;border-radius:4px;padding:28px 32px">
      <div style="font-size:10px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:#C8A98D;margin-bottom:16px">Payment</div>
      ${payMethod==='wise'?`<div style="max-width:340px">${payBlocks}</div>`:payBlocks}
    </div>

    ${noteHtml}

    <!-- Tracking -->
    <div style="background:#EEF3F8;border-radius:4px;padding:14px 20px;margin-top:24px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
      <div>
        <div style="font-size:10px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#4A6A8A;margin-bottom:4px">Order tracking</div>
        <div style="font-size:12px;font-weight:300;color:#4B372A">Check your order status anytime — no login required.</div>
      </div>
      <a href="https://studio2j.pages.dev/order/${esc(o.order_number)}" style="font-size:12px;font-weight:500;color:#1F3A5F;text-decoration:none;white-space:nowrap;background:white;padding:8px 16px;border-radius:6px;border:1px solid rgba(31,58,95,.2)">Track order ${esc(o.order_number)} →</a>
    </div>

    <!-- Footer -->
    <div style="margin-top:24px;padding-top:20px;border-top:.5px solid #ede7de;display:flex;justify-content:space-between;align-items:center">
      <div style="font-family:Georgia,serif;font-size:13px;font-style:italic;color:#C8A98D">Studio<em>2J</em> — Seoul &amp; Tokyo</div>
      <div style="font-size:11px;font-weight:300;color:#C8A98D">studio2j25@gmail.com</div>
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
