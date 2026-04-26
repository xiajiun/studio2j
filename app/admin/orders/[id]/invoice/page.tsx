export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Order, OrderItem, ShippingAddress } from '@/lib/database.types'
import { PrintButton } from './PrintButton'

const PAYMENT = {
  wise: {
    label: 'Wise',
    lines: ['wise.com/pay/me/keweih6'],
    isLink: true,
  },
  korea: {
    label: 'Bank Transfer — South Korea',
    lines: [
      'Shinhan Bank',
      'LAU XIA JIUN',
      '110-437-478592',
      'Swift: SHBKKRSE · TEL: 01029838831',
    ],
  },
  malaysia: {
    label: 'Bank Transfer — Malaysia',
    lines: [
      'Maybank',
      'HO KE WEI',
      '1624 3302 2400',
    ],
  },
  japan: {
    label: 'Bank Transfer — Japan',
    lines: [
      'Yuucho Bank (9900)',
      'Branch: 038',
      'ホカウェイ',
      '普通 Futsuu Savings · 8992079',
    ],
  },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function n(v: number | null | undefined) {
  return v ? v.toLocaleString() : '—'
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!order) notFound()

  const o     = order as Order
  const items = (o.items ?? []) as OrderItem[]
  const addr  = o.shipping_address as ShippingAddress | null
  const goods = o.goods_total   ?? 0
  const fee   = o.service_fee   ?? 0
  const ship  = o.shipping_cost ?? 0
  const grand = goods + fee + ship
  const ccy   = o.currency ?? 'KRW'

  const payMethod = (addr?.payment_method ?? 'wise') as keyof typeof PAYMENT
  const payInfo   = PAYMENT[payMethod] ?? PAYMENT.wise

  return (
    <>
      {/* Toolbar — hidden when printing */}
      <div className="no-print" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(245,239,230,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(122,92,69,0.12)',
        padding: '12px 32px', display: 'flex', gap: '10px', alignItems: 'center',
      }}>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', fontWeight: 500, color: 'var(--dark-brown)', flex: 1 }}>
          Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', marginLeft: '12px' }}>Invoice preview</span>
        </span>
        <PrintButton />
        <a href={`/admin/orders/${params.id}`} style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
          color: 'var(--brown)', textDecoration: 'none',
          border: '0.5px solid rgba(122,92,69,0.2)', padding: '9px 20px', borderRadius: '99px',
          background: 'white',
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

          {/* Header band */}
          <div style={{
            background: '#1F3A5F',
            padding: '36px 48px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: '28px', fontWeight: 500,
                color: 'white', letterSpacing: '-0.02em',
                marginBottom: '4px',
              }}>
                Studio<em style={{ fontStyle: 'italic', color: '#C8A98D' }}>2J</em>
              </div>
              <div style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '10px', fontWeight: 500,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(245,239,230,0.5)',
              }}>Quotation</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontSize: '22px', fontWeight: 300,
                color: '#C8A98D', letterSpacing: '-0.01em',
              }}>{o.order_number}</div>
              <div style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '12px', fontWeight: 300,
                color: 'rgba(245,239,230,0.55)', marginTop: '4px',
              }}>{fmtDate(o.created_at)}</div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '40px 48px' }}>

            {/* Customer info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>
                  Billed to
                </div>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 400, color: '#1F3A5F', marginBottom: '6px' }}>
                  {o.customer_name ?? addr?.name ?? '—'}
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.7 }}>
                  {o.customer_email}
                  {addr?.phone && <><br />{addr.phone}</>}
                  {addr?.address && <><br />{addr.address}</>}
                  {(addr?.city || addr?.postal_code) && (
                    <><br />{[addr.city, addr.postal_code].filter(Boolean).join('  ')}</>
                  )}
                  {addr?.country && <><br />{addr.country}</>}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>
                  Order details
                </div>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 2 }}>
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Currency</span> {ccy}<br />
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Type</span> {o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'}<br />
                  <span style={{ color: '#4B372A', fontWeight: 500 }}>Payment</span> {payInfo.label}
                </div>
              </div>
            </div>

            {/* Items table */}
            <div style={{ marginBottom: '32px' }}>
              {/* Table header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '3fr 1fr 1fr 60px 90px 90px',
                gap: '8px',
                padding: '8px 0',
                borderBottom: '1.5px solid #1F3A5F',
                marginBottom: '4px',
              }}>
                {['Item', 'Colour', 'Ccy', 'Qty', 'Unit price', `Total (${ccy})`].map(h => (
                  <div key={h} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A5C45', textAlign: h.startsWith('Total') || h === 'Unit price' || h === 'Qty' ? 'right' : 'left' }}>
                    {h}
                  </div>
                ))}
              </div>

              {/* Item rows */}
              {items.length > 0 ? items.map((item, i) => (
                <div key={i} style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 60px 90px 90px',
                  gap: '8px',
                  padding: '11px 0',
                  borderBottom: '0.5px solid #ede7de',
                  alignItems: 'start',
                }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18' }}>
                      {i + 1}. {item.name}
                    </div>
                    {item.url && (
                      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', color: '#C8A98D', marginTop: '2px', wordBreak: 'break-all' }}>
                        {item.url}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#7A5C45' }}>{item.color ?? ''}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#7A5C45' }}>{item.item_ccy ?? ccy}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#2a1f18', textAlign: 'right' }}>{item.qty}</div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#2a1f18', textAlign: 'right' }}>
                    {item.price ? item.price.toLocaleString() : '—'}
                  </div>
                  <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18', textAlign: 'right' }}>
                    {item.price && item.qty ? (item.price * item.qty).toLocaleString() : '—'}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '24px 0', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', color: '#C8A98D' }}>
                  No items listed
                </div>
              )}

              {/* Totals */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px', marginTop: '20px' }}>
                <TotalRow label="Subtotal" value={n(goods)} ccy={ccy} />
                <TotalRow label="Handling fee (15% or min ₩25,000)" value={n(fee)} ccy={ccy} />
                <TotalRow label={`Intl shipping`} value={n(ship)} ccy={ccy} />
                <div style={{ width: '280px', borderTop: '1.5px solid #1F3A5F', marginTop: '4px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1F3A5F' }}>Grand total</span>
                  <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 400, color: '#1F3A5F', letterSpacing: '-0.01em' }}>{grand.toLocaleString()} {ccy}</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div style={{
              background: '#f5efe6',
              borderRadius: '4px',
              padding: '28px 32px',
              marginTop: '8px',
            }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '16px' }}>
                Payment · Please complete within 24 hours
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: addr?.payment_method === 'wise' ? '1fr' : '1fr 1fr', gap: '24px' }}>

                {/* Wise — always first */}
                <PayBlock
                  label="Wise (international)"
                  lines={[]}
                  link="https://wise.com/pay/me/keweih6"
                  reference={o.order_number}
                  highlight={payMethod === 'wise'}
                />

                {/* Bank — if not wise */}
                {payMethod !== 'wise' && (
                  <PayBlock
                    label={payInfo.label}
                    lines={(payInfo as any).lines ?? []}
                    reference={o.order_number}
                    highlight
                  />
                )}
              </div>
            </div>

            {/* Customer note */}
            {o.customer_notes && (
              <div style={{ marginTop: '24px', padding: '20px 24px', borderLeft: '2px solid #C8A98D' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '8px' }}>Note</div>
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.7, margin: 0 }}>{o.customer_notes}</p>
              </div>
            )}

            {/* Footer */}
            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '0.5px solid #ede7de', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '13px', fontStyle: 'italic', color: '#C8A98D' }}>
                Studio<em>2J</em> — Seoul &amp; Tokyo
              </div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#C8A98D' }}>
                studio2j25@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .no-print-bg { background: white !important; padding: 0 !important; }
          #invoice {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </>
  )
}

function TotalRow({ label, value, ccy }: { label: string; value: string; ccy: string }) {
  return (
    <div style={{ width: '280px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: '#2a1f18', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function PayBlock({ label, lines, link, reference, highlight }: {
  label: string
  lines: string[]
  link?: string
  reference: string
  highlight?: boolean
}) {
  return (
    <div style={{
      background: highlight ? 'white' : 'rgba(255,255,255,0.6)',
      borderRadius: '4px',
      padding: '16px 20px',
      border: highlight ? '1px solid #C8A98D' : '1px solid rgba(200,169,141,0.3)',
    }}>
      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: '#4B372A', marginBottom: '10px', letterSpacing: '0.04em' }}>
        {label}
      </div>
      {link ? (
        <a href={link} target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#1F3A5F', fontWeight: 400, marginBottom: '8px', display: 'block', textDecoration: 'underline' }}>
          {link}
        </a>
      ) : (
        lines.map((line, i) => (
          <div key={i} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: i === 0 ? 400 : 300, color: i === 0 ? '#4B372A' : '#7A5C45', marginBottom: '3px' }}>
            {line}
          </div>
        ))
      )}
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid rgba(122,92,69,0.15)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: '#7A5C45' }}>
        Reference: <strong style={{ fontWeight: 500, color: '#4B372A' }}>{reference}</strong>
      </div>
    </div>
  )
}
