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
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('order_number', params.number)
    .single()

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
    : 'Please complete payment within 24 hours. This invoice covers item cost, service fee, and international shipping.'

  if (isPrint) {
    return (
      <>
        <AutoPrint />
        <div style={{ background: 'white', padding: '0' }}>
          <CustomerInvoiceBody o={o} fair={fair} items={items} addr={addr} ccy={ccy} hasDomDel={hasDomDel} goods={goods} fee={fee} runner={runner} ship={ship} grandTotal={grandTotal} totalPaid={totalPaid} balanceDue={balanceDue} payMethod={payMethod} payInfo={payInfo} invoiceLabel={invoiceLabel} payNote={payNote} />
        </div>
        <style>{`@page { size: A4; margin: 10mm; } body { margin: 0; background: white; }`}</style>
      </>
    )
  }

  return (
    <>
      {/* Toolbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(254,250,240,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(122,92,69,0.12)',
        padding: '12px 32px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap',
      }}>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', fontWeight: 400, color: '#2C1810', flex: 1 }}>
          Studio<em style={{ fontStyle: 'italic', color: '#1F3A5F' }}>2J</em>
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: '#C8A98D', marginLeft: '12px' }}>{invoiceLabel}</span>
        </span>
        <PrintButton printUrl={`/api/invoice-print/${params.number}`} />
      </div>

      <div style={{ background: '#FEFAF0', minHeight: '100vh', paddingTop: '72px', paddingBottom: '60px' }}>
        <CustomerInvoiceBody o={o} fair={fair} items={items} addr={addr} ccy={ccy} hasDomDel={hasDomDel} goods={goods} fee={fee} runner={runner} ship={ship} grandTotal={grandTotal} totalPaid={totalPaid} balanceDue={balanceDue} payMethod={payMethod} payInfo={payInfo} invoiceLabel={invoiceLabel} payNote={payNote} />
      </div>
      <style>{`
        @media (max-width: 640px) {
          #invoice { border-radius: 0 !important; }
          .inv-header { padding: 24px 20px !important; }
          .inv-body { padding: 24px 20px !important; }
          .inv-billed { grid-template-columns: 1fr !important; gap: 20px !important; }
          .inv-table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -20px; padding: 0 20px; }
          .inv-table-inner { min-width: 460px; }
          .inv-totals > div { width: auto !important; min-width: 260px; }
          .inv-pay-grid { grid-template-columns: 1fr !important; }
          .inv-track { flex-direction: column !important; align-items: flex-start !important; }
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
  return (
    <div id="invoice" style={{ maxWidth: '740px', margin: '0 auto', background: 'white', borderRadius: '16px', boxShadow: '0 2px 40px rgba(44,24,16,0.07), 0 0 0 0.5px rgba(122,92,69,0.1)', overflow: 'hidden', fontFamily: 'var(--font-inter), sans-serif', color: '#2C1810' }}>

      {/* Header */}
      <div className="inv-header" style={{ background: '#FEFAF0', padding: '36px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '0.5px solid rgba(122,92,69,0.12)' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '30px', fontWeight: 400, color: '#2C1810', letterSpacing: '-0.02em', lineHeight: 1 }}>
            Studio<em style={{ fontStyle: 'italic', color: '#1F3A5F' }}>2J</em>
          </div>
          <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C8A98D', marginTop: '6px' }}>{invoiceLabel}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '24px', fontWeight: 300, color: '#1F3A5F', letterSpacing: '-0.01em' }}>{o.order_number}</div>
          <div style={{ fontSize: '12px', fontWeight: 300, color: '#C8A98D', marginTop: '4px' }}>{fmtDate(o.created_at)}</div>
          {paid && (
            <div style={{ marginTop: '8px', display: 'inline-block', background: '#D5E8D8', color: '#2A5C35', fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: '99px' }}>Paid in full</div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="inv-body" style={{ padding: '40px 48px' }}>

        {/* Billed to + Order details */}
        <div className="inv-billed" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>Billed to</div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 400, color: '#1F3A5F', marginBottom: '8px', letterSpacing: '-0.01em' }}>{o.customer_name ?? addr?.name ?? '—'}</div>
            <div style={{ fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.8 }}>
              {o.customer_email}
              {addr?.phone && <><br />{addr.phone}</>}
              {addr?.address && <><br />{addr.address}</>}
              {(addr?.city || addr?.postal_code) && <><br />{[addr.city, addr.postal_code].filter(Boolean).join('  ')}</>}
              {addr?.country && <><br />{addr.country}</>}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '12px' }}>Order details</div>
            <div style={{ fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 2 }}>
              <span style={{ color: '#2C1810', fontWeight: 500 }}>Type</span>{' '}
              {o.kind === 'proxy' ? 'Proxy buy' : o.kind === 'fair' ? 'Fair haul' : 'Personal request'}<br />
              {fair && <><span style={{ color: '#2C1810', fontWeight: 500 }}>Fair</span>{' '}{fair.name} · {new Date(fair.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}<br /></>}
              <span style={{ color: '#2C1810', fontWeight: 500 }}>Currency</span>{' '}{ccy}<br />
              <span style={{ color: '#2C1810', fontWeight: 500 }}>Payment</span>{' '}{payInfo.label}
            </div>
          </div>
        </div>

        {/* Items table */}
        <div style={{ marginBottom: '32px' }}>
          <div className="inv-table-scroll">
            <div className="inv-table-inner">
              <div style={{ display: 'grid', gridTemplateColumns: hasDomDel ? '3fr 1fr 1fr 50px 88px 70px 88px' : '3fr 1fr 1fr 50px 88px 88px', gap: '8px', padding: '0 0 10px', borderBottom: '0.5px solid rgba(122,92,69,0.25)', marginBottom: '2px' }}>
                {[...['Item', 'Colour', 'Ccy', 'Qty', 'Unit price'], ...(hasDomDel ? ['Dom.del'] : []), `Total (${ccy})`].map(h => (
                  <div key={h} style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8A98D', textAlign: h.startsWith('Total') || h === 'Unit price' || h === 'Qty' || h === 'Dom.del' ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>
              {items.length > 0 ? items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: hasDomDel ? '3fr 1fr 1fr 50px 88px 70px 88px' : '3fr 1fr 1fr 50px 88px 88px', gap: '8px', padding: '12px 0', borderBottom: '0.5px solid rgba(122,92,69,0.07)', alignItems: 'start' }}>
                  <div style={{ fontSize: '13px', fontWeight: 400, color: '#2C1810' }}>{i + 1}. {item.name}</div>
                  <div style={{ fontSize: '12px', color: '#7A5C45' }}>{item.color ?? ''}</div>
                  <div style={{ fontSize: '12px', color: '#7A5C45' }}>{item.item_ccy ?? ccy}</div>
                  <div style={{ fontSize: '13px', color: '#2C1810', textAlign: 'right' }}>{item.qty}</div>
                  <div style={{ fontSize: '13px', color: '#2C1810', textAlign: 'right' }}>{item.price ? item.price.toLocaleString() : '—'}</div>
                  {hasDomDel && <div style={{ fontSize: '12px', color: '#7A5C45', textAlign: 'right' }}>{item.dom_del ? item.dom_del.toLocaleString() : '—'}</div>}
                  <div style={{ fontSize: '13px', fontWeight: 500, color: '#2C1810', textAlign: 'right' }}>
                    {item.total ? item.total.toLocaleString() : item.price && item.qty ? (item.price * item.qty + (item.dom_del ?? 0)).toLocaleString() : '—'}
                  </div>
                </div>
              )) : (
                <div style={{ padding: '32px 0', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', color: '#C8A98D' }}>No items listed yet</div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="inv-totals" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', marginTop: '24px' }}>
            <TotalRow label="Items subtotal" value={`${goods.toLocaleString()} ${ccy}`} />
            <TotalRow label="Handling fee" value={fee ? `${fee.toLocaleString()} ${ccy}` : '—'} />
            {runner > 0 && <TotalRow label="Runner / Transportation fee" value={`${runner.toLocaleString()} ${ccy}`} />}
            <TotalRow label="International shipping" value={ship ? `${ship.toLocaleString()} ${ccy}` : '—'} />
            {totalPaid > 0 && (
              <>
                <div style={{ width: '300px', borderTop: '0.5px solid rgba(122,92,69,0.2)', marginTop: '6px', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>Total</span>
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#7A5C45' }}>{grandTotal.toLocaleString()} {ccy}</span>
                </div>
                <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '12px', fontWeight: 300, color: '#2A5C35' }}>Paid</span>
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#2A5C35' }}>−{totalPaid.toLocaleString()} {ccy}</span>
                </div>
              </>
            )}
            <div style={{ width: '300px', borderTop: '1px solid rgba(122,92,69,0.2)', marginTop: '6px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: paid ? '#2A5C35' : '#1F3A5F' }}>
                {paid ? 'Paid in full ✓' : totalPaid > 0 ? 'Balance due' : 'Amount due'}
              </span>
              {!paid && (
                <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '26px', fontWeight: 300, color: '#1F3A5F', letterSpacing: '-0.02em' }}>
                  {balanceDue.toLocaleString()} {ccy}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pay note */}
        <div style={{ background: '#F5EFE6', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px', borderLeft: '3px solid #C8A98D' }}>
          <p style={{ fontSize: '13px', fontWeight: 300, color: '#4B372A', lineHeight: 1.7, margin: 0 }}>{payNote}</p>
        </div>

        {/* Payment section */}
        <div style={{ background: '#F5EFE6', borderRadius: '12px', padding: '24px 28px', marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '16px' }}>Payment</div>
          <div className="inv-pay-grid" style={{ display: 'grid', gridTemplateColumns: payMethod === 'wise' ? '1fr' : '1fr 1fr', gap: '12px' }}>
            <PayBlock label="Wise (international)" link="https://wise.com/pay/me/keweih6" lines={[]} reference={o.order_number} highlight={payMethod === 'wise'} />
            {payMethod !== 'wise' && <PayBlock label={payInfo.label} lines={(payInfo as any).lines ?? []} reference={o.order_number} highlight />}
          </div>
        </div>

        {/* Customer note */}
        {o.customer_notes && (
          <div style={{ marginBottom: '20px', padding: '16px 20px', borderLeft: '2px solid #C8A98D', background: 'rgba(200,169,141,0.06)', borderRadius: '0 8px 8px 0' }}>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C8A98D', marginBottom: '8px' }}>Note</div>
            <p style={{ fontSize: '13px', fontWeight: 300, color: '#7A5C45', lineHeight: 1.7, margin: 0 }}>{o.customer_notes}</p>
          </div>
        )}

        {/* Tracking */}
        <div style={{ background: 'rgba(31,58,95,0.04)', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }} className="inv-track">
          <div>
            <div style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#1F3A5F', marginBottom: '4px' }}>Order tracking</div>
            <div style={{ fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>Check your order status anytime — no login required.</div>
          </div>
          <a href={`https://studio2j.pages.dev/order/${o.order_number}`} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontWeight: 500, color: '#1F3A5F', textDecoration: 'none', whiteSpace: 'nowrap', background: 'white', padding: '8px 18px', borderRadius: '99px', border: '0.5px solid rgba(31,58,95,0.2)' }}>
            Track {o.order_number} →
          </a>
        </div>

        {/* Footer */}
        <div style={{ paddingTop: '20px', borderTop: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '13px', fontStyle: 'italic', color: '#C8A98D' }}>Studio<em>2J</em> — Seoul &amp; Tokyo</div>
          <div style={{ fontSize: '11px', fontWeight: 300, color: '#C8A98D' }}>studio2j25@gmail.com</div>
        </div>
      </div>
    </div>
  )
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ width: '300px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '16px' }}>
      <span style={{ fontSize: '12px', fontWeight: 300, color: '#7A5C45' }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 400, color: '#2C1810', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

function PayBlock({ label, lines, link, reference, highlight }: { label: string; lines: string[]; link?: string; reference: string; highlight?: boolean }) {
  return (
    <div style={{ background: highlight ? 'white' : 'rgba(255,255,255,0.5)', borderRadius: '10px', padding: '16px 18px', border: `0.5px solid ${highlight ? 'rgba(122,92,69,0.25)' : 'rgba(122,92,69,0.12)'}` }}>
      <div style={{ fontSize: '11px', fontWeight: 500, color: '#2C1810', marginBottom: '10px', letterSpacing: '0.04em' }}>{label}</div>
      {link
        ? <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#1F3A5F', fontWeight: 500, display: 'inline-block', textDecoration: 'none', background: 'rgba(31,58,95,0.07)', padding: '6px 14px', borderRadius: '99px' }}>Pay via Wise →</a>
        : lines.map((l, i) => <div key={i} style={{ fontSize: '13px', fontWeight: i === 0 ? 400 : 300, color: i === 0 ? '#2C1810' : '#7A5C45', marginBottom: '3px' }}>{l}</div>)
      }
      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '0.5px solid rgba(122,92,69,0.12)', fontSize: '11px', fontWeight: 300, color: '#7A5C45' }}>
        Reference: <strong style={{ fontWeight: 500, color: '#2C1810' }}>{reference}</strong>
      </div>
    </div>
  )
}
