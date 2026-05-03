export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Order, OrderItem, ShippingAddress } from '@/lib/database.types'
import { PrintButton } from './PrintButton'
import { GmailDraftButton } from '@/components/dashboard/GmailDraftButton'

export async function generateMetadata({ params, searchParams }: { params: { id: string }; searchParams: { type?: string } }) {
  const supabase = createClient()
  const { data } = await supabase.from('orders').select('order_number').eq('id', params.id).single()
  const part = searchParams.type === '1' ? ' — Part 1 (Procurement)' : searchParams.type === '2' ? ' — Part 2 (Final)' : ''
  return { title: `Studio2J Invoice ${data?.order_number ?? ''}${part}` }
}

const PAYMENT = {
  wise:     { label: 'Wise (international)', lines: [], link: 'https://wise.com/pay/me/keweih6' },
  korea:    { label: 'Bank Transfer — South Korea', lines: ['Shinhan Bank', 'LAU XIA JIUN', '110-437-478592', 'Swift: SHBKKRSE · TEL: 01029838831'] },
  malaysia: { label: 'Bank Transfer — Malaysia',     lines: ['Maybank', 'HO KE WEI', '1624 3302 2400'] },
  japan:    { label: 'Bank Transfer — Japan',         lines: ['Yuucho Bank (9900)', 'Branch: 038', 'ホカウェイ', '普通 Futsuu Savings · 8992079'] },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { type?: string }
}) {
  const supabase = createClient()
  const { data: order } = await supabase.from('orders').select('*').eq('id', params.id).single()
  if (!order) notFound()

  const o    = order as Order
  const fair = o.fair_id
    ? (await supabase.from('fairs').select('name, date').eq('id', o.fair_id).single()).data
    : null
  const items  = (o.items ?? []) as OrderItem[]
  const addr   = o.shipping_address as ShippingAddress | null
  const ccy    = o.currency ?? 'KRW'
  const hasDomDel  = items.some(i => (i.dom_del ?? 0) > 0)

  const itemsTotal = items.reduce((sum, i) => {
    if (i.total != null && i.total > 0) return sum + i.total
    return sum + (i.price ?? 0) * (i.qty ?? 1) + (i.dom_del ?? 0)
  }, 0)
  const goods  = (o.goods_total && o.goods_total > 0) ? o.goods_total : itemsTotal
  const fee    = o.service_fee   ?? 0
  const ship   = o.shipping_cost ?? 0
  const grandTotal = goods + fee + ship

  const payMethod = (addr?.payment_method ?? 'wise') as keyof typeof PAYMENT
  const payInfo   = PAYMENT[payMethod] ?? PAYMENT.wise

  const invoiceLabel = (goods > 0 || fee > 0) ? 'Invoice' : 'Quotation'
  const payNote = 'Please complete payment within 24 hours. This invoice covers item cost, service fee, and international shipping.'

  return (
    <>
      {/* Toolbar */}
      <div className="no-print" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(245,239,230,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(122,92,69,0.12)',
        padding: '12px 32px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', fontWeight: 500, color: 'var(--dark-brown)', flex: 1 }}>
          Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginLeft: '12px' }}>
            {invoiceLabel}
          </span>
        </span>
        <GmailDraftButton
          to={o.customer_email}
          subject={`Studio2J ${invoiceLabel} — ${o.order_number}`}
          body={`Dear ${o.customer_name ?? addr?.name ?? 'there'},\n\nThank you so much for shopping with Studio2J! We have reviewed your order.\n\nPlease find your invoice attached. This covers item cost, service fee, and international shipping — all in one.\n\nAmount due: ${grandTotal.toLocaleString()} ${ccy}\n\nView and download your invoice:\nhttps://studio2j.pages.dev/invoice/${o.order_number}\n\nNext steps: Please reply to this email with a screenshot of your payment. We will purchase and ship your items once payment is received.\n\nYou can also track your order anytime:\nhttps://studio2j.pages.dev/order/${o.order_number}\n\nQuestions? DM us @studio2j25 on Instagram or reply to this email.`}
          label="Email customer"
        />
        <PrintButton />
        <a href={`/admin/orders/${params.id}`} style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
          color: 'var(--brown)', textDecoration: 'none',
          border: '0.5px solid rgba(122,92,69,0.2)', padding: '9px 20px', borderRadius: '99px', background: 'white',
        }}>← Back</a>
      </div>

      {/* Invoice body */}
      <div style={{ background: '#f9f6f1', minHeight: '100vh', paddingTop: '72px', paddingBottom: '60px' }} className="no-print-bg">
        <div id="invoice" style={{
          maxWidth: '720px', margin: '0 auto',
          background: 'white',
          boxShadow: '0 4px 40px rgba(31,58,95,0.08)',
          borderRadius: '4px',
          overflow: 'hidden',
          fontFamily: 'Georgia, serif',
          color: '#2a1f18',
        }}>

          {/* Header */}
          <div style={{ background: '#1F3A5F', padding: '36px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 500, color: 'white', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                Studio<em style={{ fontStyle: 'italic', color: '#C8A98D' }}>2J</em>
              </div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,239,230,0.5)' }}>
                {invoiceLabel}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 300, color: '#C8A98D', letterSpacing: '-0.01em' }}>{o.order_number}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'rgba(245,239,230,0.55)', marginTop: '4px' }}>{fmtDate(o.created_at)}</div>
            </div>
          </div>

          <div style={{ padding: '40px 48px' }}>

            {/* Customer info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>Billed to</div>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 400, color: '#1F3A5F', marginBottom: '6px' }}>
                  {o.customer_name ?? addr?.name ?? '—'}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.7 }}>
                  {o.customer_email}
                  {addr?.phone     && <><br />{addr.phone}</>}
                  {addr?.instagram && <><br />@{addr.instagram}</>}
                  {addr?.address   && <><br />{addr.address}</>}
                  {(addr?.city || addr?.postal_code) && <><br />{[addr.city, addr.postal_code].filter(Boolean).join('  ')}</>}
                  {addr?.country   && <><br />{addr.country}</>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>Order details</div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 2 }}>
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Type</span> {o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'}<br />
                  {fair && <><span style={{ color: '#4B372A', fontWeight: 500 }}>Fair</span> {fair.name} · {new Date(fair.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}<br /></>}
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Currency</span> {ccy}<br />
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Payment</span> {payInfo.label}
                </div>
              </div>
            </div>

            {/* Items — always shown */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: hasDomDel ? '3fr 1fr 1fr 60px 90px 70px 90px' : '3fr 1fr 1fr 60px 90px 90px', gap: '8px', padding: '8px 0', borderBottom: '1.5px solid #1F3A5F', marginBottom: '4px' }}>
                {[...['Item', 'Colour', 'Ccy', 'Qty', 'Unit price'], ...(hasDomDel ? ['Dom.del'] : []), `Total (${ccy})`].map(h => (
                  <div key={h} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A5C45', textAlign: h.startsWith('Total') || h === 'Unit price' || h === 'Qty' || h === 'Dom.del' ? 'right' : 'left' }}>
                    {h}
                  </div>
                ))}
              </div>

              {items.length > 0 ? items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: hasDomDel ? '3fr 1fr 1fr 60px 90px 70px 90px' : '3fr 1fr 1fr 60px 90px 90px', gap: '8px', padding: '11px 0', borderBottom: '0.5px solid #ede7de', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18' }}>{i + 1}. {item.name}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#7A5C45' }}>{item.color ?? ''}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#7A5C45' }}>{item.item_ccy ?? ccy}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#2a1f18', textAlign: 'right' }}>{item.qty}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#2a1f18', textAlign: 'right' }}>{item.price ? item.price.toLocaleString() : '—'}</div>
                  {hasDomDel && <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#7A5C45', textAlign: 'right' }}>{item.dom_del ? item.dom_del.toLocaleString() : '—'}</div>}
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18', textAlign: 'right' }}>
                    {item.total ? item.total.toLocaleString() : item.price && item.qty ? (item.price * item.qty + (item.dom_del ?? 0)).toLocaleString() : '—'}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', color: '#C8A98D' }}>No items listed</div>
              )}

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '20px' }}>
                <TotalRow label="Items subtotal" value={goods.toLocaleString()} />
                <TotalRow label="Handling fee" value={fee ? fee.toLocaleString() : '—'} />
                <TotalRow label="International shipping" value={ship ? ship.toLocaleString() : '—'} />

                {/* Grand total */}
                <div style={{ width: '300px', borderTop: '1.5px solid #1F3A5F', marginTop: '4px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1F3A5F' }}>
                    Amount due
                  </span>
                  <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 400, color: '#1F3A5F', letterSpacing: '-0.01em' }}>
                    {grandTotal.toLocaleString()} {ccy}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div style={{ background: '#f0ebe3', borderRadius: '4px', padding: '16px 20px', marginBottom: '24px', borderLeft: '3px solid #C8A98D' }}>
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#4B372A', lineHeight: 1.7, margin: 0 }}>
                {payNote}
              </p>
            </div>

            {/* Payment block */}
            <div style={{ background: '#f5efe6', borderRadius: '4px', padding: '28px 32px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '16px' }}>
                Payment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: payMethod === 'wise' ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <PayBlock label="Wise (international)" link="https://wise.com/pay/me/keweih6" lines={[]} reference={o.order_number} highlight={payMethod === 'wise'} />
                {payMethod !== 'wise' && (
                  <PayBlock label={payInfo.label} lines={(payInfo as any).lines ?? []} reference={o.order_number} highlight />
                )}
              </div>
            </div>

            {/* Note */}
            {o.customer_notes && (
              <div style={{ marginTop: '24px', padding: '20px 24px', borderLeft: '2px solid #C8A98D' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '8px' }}>Note</div>
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.7, margin: 0 }}>{o.customer_notes}</p>
              </div>
            )}

            {/* Tracking link — bottom */}
            <div style={{ background: '#EEF3F8', borderRadius: '4px', padding: '14px 20px', marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A6A8A', marginBottom: '4px' }}>Order tracking</div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#4B372A' }}>Check your order status anytime — no login required.</div>
              </div>
              <a href={`https://studio2j.pages.dev/order/${o.order_number}`} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, color: '#1F3A5F', textDecoration: 'none', whiteSpace: 'nowrap', background: 'white', padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(31,58,95,0.2)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Track order {o.order_number} →
              </a>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '0.5px solid #ede7de', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '13px', fontStyle: 'italic', color: '#C8A98D' }}>Studio<em>2J</em> — Seoul &amp; Tokyo</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#C8A98D' }}>studio2j25@gmail.com</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .no-print-bg { background: white !important; padding: 0 !important; min-height: 0 !important; height: auto !important; }
          #invoice { box-shadow: none !important; border-radius: 0 !important; max-width: 100% !important; margin: 0 !important; }
          body { background: white !important; }
        }
      `}</style>
    </>
  )
}

function TotalRowBadge({ label, value, paid }: { label: string; value: string; paid?: boolean }) {
  return (
    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: paid !== undefined ? '#aaa' : '#2a1f18', textDecoration: paid ? 'line-through' : 'none' }}>{value}</span>
        {paid !== undefined && (
          <span style={{
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500,
            padding: '2px 8px', borderRadius: '99px',
            background: paid ? '#D5E8D8' : '#F5DDD5',
            color: paid ? '#2A5C35' : '#8A3A20',
          }}>{paid ? 'Paid ✓' : 'Unpaid'}</span>
        )}
      </span>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function PayBlock({ label, lines, link, reference, highlight }: { label: string; lines: string[]; link?: string; reference: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? 'white' : 'rgba(255,255,255,0.6)', borderRadius: '4px', padding: '16px 20px', border: highlight ? '1px solid #C8A98D' : '1px solid rgba(200,169,141,0.3)' }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: '#4B372A', marginBottom: '10px', letterSpacing: '0.04em' }}>{label}</div>
      {link
        ? <a href={link} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#1F3A5F', fontWeight: 500, marginBottom: '8px', display: 'inline-block', textDecoration: 'none', background: '#E8F0F8', padding: '6px 14px', borderRadius: '6px' }}>Pay via Wise →</a>
        : lines.map((l, i) => <div key={i} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: i === 0 ? 400 : 300, color: i === 0 ? '#4B372A' : '#7A5C45', marginBottom: '3px' }}>{l}</div>)
      }
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid rgba(122,92,69,0.15)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#7A5C45' }}>
        Reference: <strong style={{ fontWeight: 500, color: '#4B372A' }}>{reference}</strong>
      </div>
    </div>
  )
}
