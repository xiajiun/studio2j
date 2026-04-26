export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Order, OrderItem } from '@/lib/database.types'
import { PrintButton } from './PrintButton'

const BANK = {
  name:    'SHINHAN BANK',
  account: 'LAU XIA JIUN',
  number:  '110-437-478592',
  swift:   'SHBKKRSE',
  tel:     '01029838831',
}

function fmt(n: number | null | undefined, ccy = 'KRW') {
  if (!n) return '—'
  return n.toLocaleString()
}

function fmtDate(d: string) {
  return new Date(d).toISOString().split('T')[0]
}

export default async function InvoicePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!order) notFound()

  const o       = order as Order
  const items   = (o.items ?? []) as OrderItem[]
  const addr    = o.shipping_address as any
  const goods   = o.goods_total   ?? 0
  const fee     = o.service_fee   ?? 0
  const ship    = o.shipping_cost ?? 0
  const grand   = goods + fee + ship
  const ccy     = o.currency ?? 'KRW'
  const symbol  = ccy === 'KRW' ? '₩' : ccy === 'JPY' ? '¥' : '$'

  return (
    <>
      {/* Print button — hidden in print */}
      <div className="no-print" style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, display: 'flex', gap: '8px' }}>
        <PrintButton />
        <a href={`/admin/orders/${params.id}`} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', textDecoration: 'none', background: 'white', border: '0.5px solid rgba(122,92,69,0.2)', padding: '10px 20px', borderRadius: '99px' }}>
          ← Back
        </a>
      </div>

      <div id="invoice" style={{ maxWidth: '900px', margin: '0 auto', padding: '48px 40px', fontFamily: 'Arial, sans-serif', fontSize: '12px', color: '#111', background: 'white' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '0.02em' }}>STUDIO2J QUOTATION</div>
          <div style={{ textAlign: 'right', fontSize: '12px' }}>
            <div><strong>Date:</strong> {fmtDate(o.created_at)}</div>
          </div>
        </div>

        {/* Order + Customer info */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '12px' }}>
          <tbody>
            <tr>
              <td style={{ width: '160px', fontWeight: 700, paddingBottom: '4px' }}>Order ID:</td>
              <td style={{ paddingBottom: '4px' }}>{o.order_number}</td>
              <td style={{ width: '160px', fontWeight: 700, paddingBottom: '4px', textAlign: 'right' }}>Target Ccy:</td>
              <td style={{ width: '100px', paddingBottom: '4px', textAlign: 'right', fontWeight: 700, color: '#1F3A5F' }}>{ccy}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Customer Name:</td>
              <td style={{ paddingBottom: '4px' }}>{o.customer_name ?? '—'}</td>
              <td style={{ fontWeight: 700, paddingBottom: '4px', textAlign: 'right' }}>Min Fee Base (KRW):</td>
              <td style={{ paddingBottom: '4px', textAlign: 'right' }}>25,000</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Email:</td>
              <td style={{ paddingBottom: '4px' }}>{o.customer_email}</td>
              <td></td><td></td>
            </tr>
            {addr?.phone && (
              <tr>
                <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Phone:</td>
                <td style={{ paddingBottom: '4px' }}>{addr.phone}</td>
                <td></td><td></td>
              </tr>
            )}
            {addr && (
              <tr>
                <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Shipping Address:</td>
                <td style={{ paddingBottom: '4px' }} colSpan={3}>
                  {[addr.address, addr.city, addr.postal_code, addr.country].filter(Boolean).join(', ')}
                </td>
              </tr>
            )}
            {addr?.country && (
              <tr>
                <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Destination:</td>
                <td style={{ paddingBottom: '4px' }}>{addr.country}</td>
                <td></td><td></td>
              </tr>
            )}
            <tr>
              <td style={{ fontWeight: 700, paddingBottom: '4px' }}>Payment Method:</td>
              <td style={{ paddingBottom: '4px' }}>Bank Transfer</td>
              <td></td><td></td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
          <thead>
            <tr style={{ background: '#f5c6c6' }}>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'left', fontWeight: 700 }}>Item Name</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>Color/Size</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>Origin Ccy</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>Unit Price</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'center', fontWeight: 700 }}>Qty</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>Dom. Delivery</th>
              <th style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'right', fontWeight: 700 }}>Total ({ccy})</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? items.map((item, i) => (
              <tr key={i}>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>
                  {i + 1}. {item.name}
                  {item.url && <div style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>{item.url}</div>}
                </td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'center' }}></td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'center' }}>{ccy}</td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>{item.price ? item.price.toLocaleString() : ''}</td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}></td>
                <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>
                  {item.price && item.qty ? (item.price * item.qty).toLocaleString() : ''}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ border: '1px solid #ddd', padding: '12px 8px', textAlign: 'center', color: '#999' }}>No items listed</td>
              </tr>
            )}
            {/* Padding rows */}
            {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, i) => (
              <tr key={`pad-${i}`}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <td key={j} style={{ border: '1px solid #ddd', padding: '5px 8px' }}>&nbsp;</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
          <tbody>
            <tr>
              <td style={{ width: '60%' }}></td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px', fontWeight: 700 }}>Subtotal (Items + Dom. Ship):</td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right', fontWeight: 700 }}>{goods.toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <table style={{ borderCollapse: 'collapse', fontSize: '11px' }}>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #ddd', padding: '4px 8px', width: '60px' }}>KRW</td>
                      <td style={{ border: '1px solid #ddd', padding: '4px 8px', width: '60px', textAlign: 'right' }}>0</td>
                      <td style={{ padding: '4px 8px' }}>Intl Shipping (from KR):</td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #ddd', padding: '4px 8px' }}>JPY</td>
                      <td style={{ border: '1px solid #ddd', padding: '4px 8px', textAlign: 'right' }}>0</td>
                      <td style={{ padding: '4px 8px' }}>Intl Shipping (from JP):</td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Handling Fee (15% or Min):</td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>{fee.toLocaleString()}</td>
            </tr>
            <tr>
              <td></td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Intl Shipping (from KR):</td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>{ccy !== 'JPY' ? ship.toLocaleString() : 0}</td>
            </tr>
            <tr>
              <td></td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px' }}>Intl Shipping (from JP):</td>
              <td style={{ border: '1px solid #ddd', padding: '5px 8px', textAlign: 'right' }}>{ccy === 'JPY' ? ship.toLocaleString() : 0}</td>
            </tr>
            <tr style={{ background: '#e8f5e9' }}>
              <td></td>
              <td style={{ border: '1px solid #ddd', padding: '6px 8px', fontWeight: 700, fontSize: '13px' }}>GRAND TOTAL:</td>
              <td style={{ border: '1px solid #ddd', padding: '6px 8px', textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>{grand.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Payment details */}
        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '8px' }}>PAYMENT DETAILS</div>
        <div style={{ fontSize: '11px', marginBottom: '12px', color: '#555' }}>Please complete payment within 24 hours to secure your items.</div>
        <table style={{ borderCollapse: 'collapse', fontSize: '12px' }}>
          <tbody>
            {[
              ['Bank Name:',    BANK.name],
              ['Account Name:', BANK.account],
              ['Account No:',   BANK.number],
              ['Swift code:',   BANK.swift],
              ['TEL:',          BANK.tel],
              ['Reference:',    o.order_number],
            ].map(([label, val]) => (
              <tr key={label}>
                <td style={{ fontWeight: 700, paddingRight: '24px', paddingBottom: '4px', width: '140px' }}>{label}</td>
                <td style={{ paddingBottom: '4px' }}>{val}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          #invoice { padding: 16px !important; max-width: 100% !important; }
        }
      `}</style>
    </>
  )
}
