export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PrintButton, AutoPrint } from '@/components/dashboard/PrintButton'
import type { Order, OrderItem, ShippingAddress } from '@/lib/database.types'

const PAYMENT = {
  wise:     { label: 'Wise (international)', lines: [], link: 'https://wise.com/pay/me/keweih6' },
  korea:    { label: 'Bank Transfer — South Korea', lines: ['Shinhan Bank', 'LAU XIA JIUN', '110-437-478592', 'Swift: SHBKKRSE · TEL: 01029838831'] },
  malaysia: { label: 'Bank Transfer — Malaysia',     lines: ['Maybank', 'HO KE WEI', '1624 3302 2400'] },
  japan:    { label: 'Bank Transfer — Japan',         lines: ['Yuucho Bank (9900)', 'Branch: 038', 'HO KE WEI', 'Futsuu Savings · 8992079'] },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function CustomerInvoicePage({
  params,
  searchParams,
}: {
  params: { number: string }
  searchParams: { print?: string }
}) {
  const isPrint = searchParams.print === '1'
  const supabase = createClient()
  const { data: order } = await supabase.from('orders').select('*').eq('order_number', params.number).single()
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
  const goods  = itemsTotal > 0 ? itemsTotal : (o.goods_total ?? 0)
  const fee    = o.service_fee   ?? 0
  const runner = o.runner_fee    ?? 0
  const ship   = o.shipping_cost ?? 0
  const grandTotal = goods + fee + runner + ship
  const totalPaid  = (o.paid_1_amount ?? 0) + (o.paid_2_amount ?? 0) + (o.paid_3_amount ?? 0)
  const balanceDue = grandTotal - totalPaid

  const payMethod = (addr?.payment_method ?? 'wise') as keyof typeof PAYMENT
  const payInfo   = PAYMENT[payMethod] ?? PAYMENT.wise

  const invoiceLabel = (goods > 0 || fee > 0) ? 'Invoice' : 'Quotation'
  const payNote = totalPaid > 0
    ? balanceDue > 0
      ? `Thank you for your part payment of ${totalPaid.toLocaleString()} ${ccy}. Please complete the remaining balance of ${balanceDue.toLocaleString()} ${ccy} within 24 hours.`
      : 'Payment received in full. Thank you!'
    : 'Please complete the payment. This invoice covers item cost, service fee, and international shipping.'

  if (isPrint) {
    return (
      <>
        <AutoPrint />
        <div style={{ background: '#F4F6F8' }}>
          <CustomerInvoiceBody o={o} fair={fair} items={items} addr={addr} ccy={ccy} hasDomDel={hasDomDel} goods={goods} fee={fee} runner={runner} ship={ship} grandTotal={grandTotal} totalPaid={totalPaid} balanceDue={balanceDue} payMethod={payMethod} payInfo={payInfo} invoiceLabel={invoiceLabel} payNote={payNote} />
        </div>
        <style>{`@page { size: A4; margin: 8mm; } body { margin: 0; background: #F4F6F8; }`}</style>
      </>
    )
  }

  return (
    <>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(244,246,248,0.96)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E5E7EB',
        padding: '12px 32px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '17px', fontWeight: 500, color: '#18293F', flex: 1, letterSpacing: '-0.02em' }}>
          Studio<em style={{ fontStyle: 'italic', color: '#C8A98D' }}>2J</em>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 400, color: '#9CA3AF', marginLeft: '10px' }}>{invoiceLabel}</span>
        </span>
        <PrintButton printUrl={`/api/invoice-print/${params.number}`} />
      </div>

      <div style={{ background: '#F4F6F8', minHeight: '100vh', paddingTop: '64px', paddingBottom: '60px' }}>
        <CustomerInvoiceBody o={o} fair={fair} items={items} addr={addr} ccy={ccy} hasDomDel={hasDomDel} goods={goods} fee={fee} runner={runner} ship={ship} grandTotal={grandTotal} totalPaid={totalPaid} balanceDue={balanceDue} payMethod={payMethod} payInfo={payInfo} invoiceLabel={invoiceLabel} payNote={payNote} />
      </div>
      <style>{`
        @media (max-width: 640px) {
          .inv-billed { grid-template-columns: 1fr !important; gap: 20px !important; }
          .inv-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -24px; padding: 0 24px; }
          .inv-table-inner { min-width: 480px; }
          .inv-pay-grid { grid-template-columns: 1fr !important; }
          .inv-track { flex-direction: column !important; align-items: flex-start !important; }
          .inv-header { padding: 24px 24px !important; }
          .inv-body { padding: 28px 24px !important; }
        }
      `}</style>
    </>
  )
}

type BodyProps = {
  o: Order; fair: { name: string; date: string } | null
  items: OrderItem[]; addr: ShippingAddress | null; ccy: string; hasDomDel: boolean
  goods: number; fee: number; runner: number; ship: number; grandTotal: number
  totalPaid: number; balanceDue: number
  payMethod: keyof typeof PAYMENT; payInfo: typeof PAYMENT[keyof typeof PAYMENT]
  invoiceLabel: string; payNote: string
}

function CustomerInvoiceBody({ o, fair, items, addr, ccy, hasDomDel, goods, fee, runner, ship, grandTotal, totalPaid, balanceDue, payMethod, payInfo, invoiceLabel, payNote }: BodyProps) {
  const paid = balanceDue <= 0 && totalPaid > 0
  const colTpl = hasDomDel ? '3fr 1fr 1fr 48px 84px 64px 84px' : '3fr 1fr 1fr 48px 84px 84px'

  return (
    <div id="invoice" style={{ maxWidth: '740px', margin: '0 auto', padding: '24px 16px', fontFamily: 'var(--font-inter), sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

        {/* Navy header */}
        <div className="inv-header" style={{ background: '#18293F', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '26px', fontWeight: 500, color: 'white', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '6px' }}>
              Studio<em style={{ fontStyle: 'italic', color: '#C8A98D' }}>2J</em>
            </div>
            <div style={{ fontSize: '11px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>Seoul &amp; Tokyo personal shopping</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '6px' }}>{invoiceLabel}</div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 300, color: '#C8A98D', letterSpacing: '-0.01em', marginBottom: '4px' }}>{o.order_number}</div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: 'rgba(255,255,255,0.45)' }}>{fmtDate(o.created_at)}</div>
            {paid && <div style={{ marginTop: '10px', display: 'inline-block', background: '#22543D', color: '#9AE6B4', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '4px' }}>Paid in full</div>}
          </div>
        </div>

        {/* Body */}
        <div className="inv-body" style={{ padding: '36px 48px' }}>

          {/* Billed to / Order details */}
          <div className="inv-billed" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '36px', paddingBottom: '32px', borderBottom: '1px solid #F3F4F6' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Billed to</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: '#111827', marginBottom: '6px' }}>{o.customer_name ?? addr?.name ?? '—'}</div>
              <div style={{ fontSize: '13px', fontWeight: 400, color: '#6B7280', lineHeight: 1.8 }}>
                {o.customer_email}
                {addr?.phone && <><br />{addr.phone}</>}
                {addr?.address && <><br />{addr.address}</>}
                {(addr?.city || addr?.postal_code) && <><br />{[addr.city, addr.postal_code].filter(Boolean).join('  ')}</>}
                {addr?.country && <><br />{addr.country}</>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '12px' }}>Order details</div>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {([
                    ['Type', o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'],
                    ...(fair ? [['Fair', `${fair.name} · ${new Date(fair.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`]] : []),
                    ['Currency', ccy],
                    ['Payment', payInfo.label],
                  ] as [string, string][]).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ fontSize: '12px', fontWeight: 500, color: '#9CA3AF', paddingBottom: '6px', paddingRight: '16px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{k}</td>
                      <td style={{ fontSize: '13px', fontWeight: 400, color: '#374151', paddingBottom: '6px' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '32px' }}>
            <div className="inv-table-scroll">
              <div className="inv-table-inner">
                <div style={{ display: 'grid', gridTemplateColumns: colTpl, gap: '8px', padding: '8px 0', borderBottom: '2px solid #18293F' }}>
                  {['Item', 'Colour', 'Ccy', 'Qty', 'Unit price', ...(hasDomDel ? ['Dom.del'] : []), `Total (${ccy})`].map((h, i) => (
                    <div key={h} style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#18293F', textAlign: i >= 3 ? 'right' : 'left' }}>{h}</div>
                  ))}
                </div>
                {items.length > 0 ? items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: colTpl, gap: '8px', padding: '13px 0', borderBottom: '1px solid #F3F4F6', alignItems: 'start' }}>
                    <div style={{ fontSize: '13px', fontWeight: 400, color: '#111827' }}>{i + 1}. {item.name}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.color ?? ''}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{item.item_ccy ?? ccy}</div>
                    <div style={{ fontSize: '13px', color: '#374151', textAlign: 'right' }}>{item.qty}</div>
                    <div style={{ fontSize: '13px', color: '#374151', textAlign: 'right' }}>{item.price ? item.price.toLocaleString() : '—'}</div>
                    {hasDomDel && <div style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'right' }}>{item.dom_del ? item.dom_del.toLocaleString() : '—'}</div>}
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#111827', textAlign: 'right' }}>
                      {item.total ? item.total.toLocaleString() : item.price && item.qty ? (item.price * item.qty + (item.dom_del ?? 0)).toLocaleString() : '—'}
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', color: '#9CA3AF' }}>No items listed yet</div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="inv-totals" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginTop: '20px' }}>
              <TotalRow label="Items subtotal" value={`${goods.toLocaleString()} ${ccy}`} />
              <TotalRow label="Handling fee" value={fee ? `${fee.toLocaleString()} ${ccy}` : '—'} />
              {runner > 0 && <TotalRow label="Runner / Transportation fee" value={`${runner.toLocaleString()} ${ccy}`} />}
              <TotalRow label="International shipping" value={ship ? `${ship.toLocaleString()} ${ccy}` : '—'} />
              {totalPaid > 0 && (
                <>
                  <div style={{ width: '300px', borderTop: '1px solid #E5E7EB', marginTop: '4px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Total</span>
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>{grandTotal.toLocaleString()} {ccy}</span>
                  </div>
                  <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '12px', color: '#059669' }}>Paid</span>
                    <span style={{ fontSize: '14px', color: '#059669' }}>−{totalPaid.toLocaleString()} {ccy}</span>
                  </div>
                </>
              )}
              <div style={{ width: '300px', borderTop: '1px solid #E5E7EB', marginTop: '4px', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: paid ? '#059669' : '#18293F' }}>
                  {paid ? 'Paid in full ✓' : totalPaid > 0 ? 'Balance due' : 'Amount due'}
                </span>
                {!paid
                  ? <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 400, color: '#C8A98D', letterSpacing: '-0.01em' }}>{balanceDue.toLocaleString()} {ccy}</span>
                  : <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', fontWeight: 400, color: '#059669' }}>{grandTotal.toLocaleString()} {ccy}</span>
                }
              </div>
            </div>
          </div>

          {/* Pay note */}
          <div style={{ background: '#F5EFE6', borderRadius: '6px', padding: '14px 18px', marginBottom: '16px', borderLeft: '3px solid #18293F' }}>
            <p style={{ fontSize: '13px', fontWeight: 400, color: '#374151', lineHeight: 1.7, margin: 0 }}>{payNote}</p>
          </div>

          {/* Payment */}
          <div style={{ background: '#F5EFE6', borderRadius: '6px', padding: '20px 22px', marginBottom: '24px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: '14px' }}>Payment</div>
            <div className="inv-pay-grid" style={{ display: 'grid', gridTemplateColumns: payMethod === 'wise' ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <PayBlock label="Wise (international)" link="https://wise.com/pay/me/keweih6" lines={[]} reference={o.order_number} highlight={payMethod === 'wise'} />
              {payMethod !== 'wise' && <PayBlock label={payInfo.label} lines={(payInfo as any).lines ?? []} reference={o.order_number} highlight />}
            </div>
          </div>

          {/* Customer note */}
          {o.customer_notes && (
            <div style={{ marginBottom: '24px', padding: '14px 18px', background: '#FFFBEB', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#92400E', marginBottom: '6px' }}>Note</div>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#78350F', lineHeight: 1.7, margin: 0 }}>{o.customer_notes}</p>
            </div>
          )}

          {/* Tracking */}
          <div className="inv-track" style={{ background: '#F0F4FF', borderRadius: '6px', padding: '14px 18px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#4B5FCC', marginBottom: '3px' }}>Order tracking</div>
              <div style={{ fontSize: '12px', fontWeight: 400, color: '#374151' }}>Check your order status anytime.</div>
            </div>
            <a href={`https://studio2j.pages.dev/order/${o.order_number}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 500, color: '#18293F', textDecoration: 'none', whiteSpace: 'nowrap', background: 'white', padding: '8px 16px', borderRadius: '6px', border: '1px solid #E5E7EB' }}>
              Track {o.order_number} →
            </a>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: '20px', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '13px', fontStyle: 'italic', color: '#9CA3AF' }}>Studio<em>2J</em> — Seoul &amp; Tokyo</div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>studio2j25@gmail.com</div>
          </div>

        </div>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
      <span style={{ fontSize: '12px', fontWeight: 400, color: '#6B7280' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 400, color: '#374151', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function PayBlock({ label, lines, link, reference, highlight }: { label: string; lines: string[]; link?: string; reference: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? 'white' : '#F9FAFB', borderRadius: '6px', padding: '16px 18px', border: `1px solid ${highlight ? '#E5E7EB' : '#F3F4F6'}` }}>
      <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '10px' }}>{label}</div>
      {link
        ? <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'white', fontWeight: 500, display: 'inline-block', textDecoration: 'none', background: '#18293F', padding: '7px 16px', borderRadius: '6px' }}>Pay via Wise →</a>
        : lines.map((l, i) => <div key={i} style={{ fontSize: '13px', fontWeight: i === 0 ? 500 : 400, color: i === 0 ? '#111827' : '#6B7280', marginBottom: '3px' }}>{l}</div>)
      }
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #F3F4F6', fontSize: '11px', color: '#9CA3AF' }}>
        Reference: <strong style={{ fontWeight: 600, color: '#374151' }}>{reference}</strong>
      </div>
    </div>
  )
}
