export const runtime = 'edge'

import { createServiceClient as createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import type { Order } from '@/lib/database.types'
import Link from 'next/link'

function handler(ccy: string) {
  if (ccy === 'KRW') return 'Jin — Korea'
  if (ccy === 'JPY') return 'Jo — Japan'
  return 'Other'
}

function fmtMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

type GroupRow = {
  received:          number
  transfer_fee:      number
  goods_cost:        number
  service_fee:       number
  goods_markup:      number
  runner_fee:        number
  shipping_markup:   number
  net:               number
  currency:          string
  order_count:       number
}

function addToGroup(map: Map<string, GroupRow>, key: string, o: Order) {
  const ccy = o.currency ?? 'KRW'
  const groupKey = `${key}__${ccy}`
  if (!map.has(groupKey)) {
    map.set(groupKey, { received: 0, transfer_fee: 0, goods_cost: 0, service_fee: 0, goods_markup: 0, runner_fee: 0, shipping_markup: 0, net: 0, currency: ccy, order_count: 0 })
  }
  const g = map.get(groupKey)!
  const received         = (o.paid_1_amount ?? 0) + (o.paid_2_amount ?? 0)
  const transfer_fee     = (o.paid_1_transfer_fee ?? 0) + (o.paid_2_transfer_fee ?? 0)
  const goods_cost       = o.actual_goods_cost ?? o.goods_total ?? 0
  const service_fee      = o.service_fee ?? 0
  const goods_markup     = o.actual_goods_cost != null ? (o.goods_total ?? 0) - o.actual_goods_cost : 0
  const runner_fee       = o.runner_fee ?? 0
  const shipping_markup  = o.actual_shipping_cost != null ? (o.shipping_cost ?? 0) - o.actual_shipping_cost : 0
  g.received        += received
  g.transfer_fee    += transfer_fee
  g.goods_cost      += goods_cost
  g.service_fee     += service_fee
  g.goods_markup    += goods_markup
  g.runner_fee      += runner_fee
  g.shipping_markup += shipping_markup
  g.net             += service_fee + goods_markup + runner_fee + shipping_markup - transfer_fee
  if (received > 0 || service_fee > 0) g.order_count++
}

export default async function FinancePage() {
  const supabase = createClient()
  const user     = await getUser()
  const email    = user?.email ?? ''

  // Jo sees only JPY (Japan), Jin sees only KRW (Korea), shared email sees all
  const currencies =
    email === 'jovynkw@gmail.com'   ? ['JPY'] :
    email === 'xiajiun21@gmail.com' ? ['KRW'] : null

  let query = supabase.from('orders').select('*').neq('status', 'cancelled').order('created_at', { ascending: false })
  if (currencies) query = query.in('currency', currencies)
  const { data } = await query

  const orders = (data ?? []) as Order[]

  // Business expenses
  const { data: expData } = await supabase
    .from('business_shopping')
    .select('estimated_cost, currency, purchase_date, name, category')
    .not('estimated_cost', 'is', null)
    .order('purchase_date', { ascending: false })

  type ExpRow = { estimated_cost: number; currency: string; purchase_date: string | null; name: string; category: string | null }
  const expenses = (expData ?? []) as ExpRow[]

  // Group expenses by month+currency
  const expMonthMap = new Map<string, { total: number; currency: string; label: string }>()
  for (const e of expenses) {
    const refDate = e.purchase_date ?? ''
    if (!refDate) continue
    const month = refDate.slice(0, 7)
    const key = `${month}__${e.currency}`
    if (!expMonthMap.has(key)) expMonthMap.set(key, { total: 0, currency: e.currency, label: fmtMonth(month + '-01') })
    expMonthMap.get(key)!.total += e.estimated_cost
  }
  const expByMonth = Array.from(expMonthMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, v]) => ({ month: key.split('__')[0], ...v }))

  // Per-order rows with computed values
  const orderRows = orders.map(o => {
    const received        = (o.paid_1_amount ?? 0) + (o.paid_2_amount ?? 0)
    const transfer_fee    = (o.paid_1_transfer_fee ?? 0) + (o.paid_2_transfer_fee ?? 0)
    const goods_cost      = o.actual_goods_cost ?? o.goods_total ?? 0
    const service_fee     = o.service_fee ?? 0
    const goods_markup    = o.actual_goods_cost != null ? (o.goods_total ?? 0) - o.actual_goods_cost : null
    const runner_fee      = o.runner_fee ?? 0
    const shipping_markup = o.actual_shipping_cost != null ? (o.shipping_cost ?? 0) - o.actual_shipping_cost : null
    const net             = service_fee + (goods_markup ?? 0) + runner_fee + (shipping_markup ?? 0) - transfer_fee
    return { ...o, received, transfer_fee, goods_cost, service_fee, goods_markup, runner_fee, shipping_markup, net }
  })

  // Monthly grouping — use the most recent paid date, fall back to created_at
  const monthMap = new Map<string, GroupRow>()
  for (const o of orders) {
    const refDate = o.paid_2_date ?? o.paid_1_date ?? o.created_at
    const month = refDate.slice(0, 7) // YYYY-MM
    addToGroup(monthMap, month, o)
  }
  const months = Array.from(monthMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, g]) => ({ label: fmtMonth(key.split('__')[0] + '-01'), ...g }))

  // Yearly grouping
  const yearMap = new Map<string, GroupRow>()
  for (const o of orders) {
    const refDate = o.paid_2_date ?? o.paid_1_date ?? o.created_at
    const year = refDate.slice(0, 4)
    addToGroup(yearMap, year, o)
  }
  const years = Array.from(yearMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, g]) => ({ label: key.split('__')[0], ...g }))

  // Totals (KRW and JPY separately)
  const totalMap = new Map<string, GroupRow>()
  for (const o of orders) addToGroup(totalMap, 'all', o)
  const totals = Array.from(totalMap.values())

  const card: React.CSSProperties = {
    background: 'var(--beige)',
    borderRadius: '14px',
    padding: '20px 24px',
    border: '0.5px solid rgba(122,92,69,0.1)',
  }
  const label: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'var(--tan)', marginBottom: '6px',
  }
  const bigNum: React.CSSProperties = {
    fontFamily: 'var(--font-fraunces), serif',
    fontSize: '26px', fontWeight: 300,
    color: 'var(--dark-brown)', letterSpacing: '-0.02em',
  }
  const th: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--tan)', padding: '8px 12px',
    borderBottom: '0.5px solid rgba(122,92,69,0.15)',
    textAlign: 'right',
  }
  const td: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '13px', fontWeight: 300,
    color: 'var(--dark-brown)', padding: '12px',
    borderBottom: '0.5px solid rgba(122,92,69,0.06)',
    textAlign: 'right', whiteSpace: 'nowrap',
  }
  const tdLeft: React.CSSProperties = { ...td, textAlign: 'left' }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Finance
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '40px' }}>
        All figures in original currency · Update payment details on each order page
      </p>

      {/* Summary cards */}
      {totals.map(g => (
        <div key={g.currency} style={{ marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            {handler(g.currency)} · {g.currency}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px', marginBottom: '8px' }}>
            <div style={card}>
              <div style={label}>Received from customers</div>
              <div style={bigNum}>{g.received.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency}</div>
            </div>
            <div style={card}>
              <div style={label}>Transfer fees (Wise)</div>
              <div style={{ ...bigNum, color: '#8A3A20' }}>{g.transfer_fee.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency}</div>
            </div>
            <div style={card}>
              <div style={label}>Goods cost</div>
              <div style={bigNum}>{g.goods_cost.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency}</div>
            </div>
            <div style={card}>
              <div style={label}>Service fees charged</div>
              <div style={bigNum}>{g.service_fee.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency}</div>
            </div>
            <div style={card}>
              <div style={label}>Runner fees</div>
              <div style={{ ...bigNum, color: g.runner_fee > 0 ? '#2A5C35' : 'var(--dark-brown)' }}>{g.runner_fee > 0 ? `+${g.runner_fee.toLocaleString()}` : '—'}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency} · fair / in-store</div>
            </div>
            <div style={card}>
              <div style={label}>Goods markup</div>
              <div style={{ ...bigNum, color: g.goods_markup > 0 ? '#2A5C35' : 'var(--dark-brown)' }}>{g.goods_markup > 0 ? `+${g.goods_markup.toLocaleString()}` : '—'}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency} · charged − actual</div>
            </div>
            <div style={card}>
              <div style={label}>Shipping markup</div>
              <div style={{ ...bigNum, color: g.shipping_markup > 0 ? '#2A5C35' : 'var(--dark-brown)' }}>{g.shipping_markup > 0 ? `+${g.shipping_markup.toLocaleString()}` : '—'}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'var(--tan)', marginTop: '2px' }}>{g.currency} · charged − actual</div>
            </div>
            <div style={{ ...card, background: 'var(--dark-blue)', border: 'none' }}>
              <div style={{ ...label, color: 'rgba(245,239,230,0.5)' }}>Net earnings</div>
              <div style={{ ...bigNum, color: 'var(--cream)' }}>{g.net.toLocaleString()}</div>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: 'rgba(245,239,230,0.5)', marginTop: '2px' }}>{g.currency} · fee + markups − transfer</div>
            </div>
          </div>
        </div>
      ))}

      {/* Per-order table */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
          Per order
        </div>
        <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr>
                {['Order', 'Customer', 'Handler', 'Ccy', 'Goods cost', 'Service fee', 'Runner fee', 'Goods markup', 'Ship. markup', 'Received', 'Via', 'Transfer fee', 'Net', 'Status'].map((h, i) => (
                  <th key={h} style={{ ...th, textAlign: i <= 2 ? 'left' : 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderRows.map(o => (
                <tr key={o.id} style={{ transition: 'background 0.1s' }}>
                  <td style={tdLeft}>
                    <Link href={`/admin/orders/${o.id}`} style={{ color: 'var(--dark-blue)', textDecoration: 'none', fontWeight: 400 }}>
                      {o.order_number}
                    </Link>
                  </td>
                  <td style={{ ...tdLeft, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {o.customer_name ?? o.customer_email}
                  </td>
                  <td style={{ ...tdLeft, fontSize: '11px', color: o.currency === 'KRW' ? 'var(--dark-blue)' : o.currency === 'JPY' ? 'var(--brown)' : 'var(--tan)' }}>
                    {handler(o.currency)}
                  </td>
                  <td style={td}>{o.currency}</td>
                  <td style={td}>{o.goods_cost ? o.goods_cost.toLocaleString() : '—'}</td>
                  <td style={td}>{o.service_fee ? o.service_fee.toLocaleString() : '—'}</td>
                  <td style={{ ...td, color: o.runner_fee > 0 ? '#2A5C35' : 'var(--tan)' }}>
                    {o.runner_fee > 0 ? `+${o.runner_fee.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ ...td, color: o.goods_markup != null && o.goods_markup > 0 ? '#2A5C35' : 'var(--tan)' }}>
                    {o.goods_markup != null ? (o.goods_markup > 0 ? `+${o.goods_markup.toLocaleString()}` : o.goods_markup.toLocaleString()) : '—'}
                  </td>
                  <td style={{ ...td, color: o.shipping_markup != null && o.shipping_markup > 0 ? '#2A5C35' : 'var(--tan)' }}>
                    {o.shipping_markup != null ? (o.shipping_markup > 0 ? `+${o.shipping_markup.toLocaleString()}` : o.shipping_markup.toLocaleString()) : '—'}
                  </td>
                  <td style={td}>
                    {o.received > 0 ? (
                      <span>
                        {o.paid_1_amount ? <span style={{ display: 'block', fontSize: '12px' }}>①{o.paid_1_amount.toLocaleString()}{o.paid_1_date ? <span style={{ color: 'var(--tan)', fontSize: '11px' }}> {fmtDate(o.paid_1_date)}</span> : ''}</span> : null}
                        {o.paid_2_amount ? <span style={{ display: 'block', fontSize: '12px' }}>②{o.paid_2_amount.toLocaleString()}{o.paid_2_date ? <span style={{ color: 'var(--tan)', fontSize: '11px' }}> {fmtDate(o.paid_2_date)}</span> : ''}</span> : null}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={td}>
                    {o.paid_1_via || o.paid_2_via ? (
                      <span style={{ fontSize: '11px' }}>
                        {o.paid_1_via && <span style={{ display: 'block' }}>①{o.paid_1_via === 'jo' ? '🔄 Jo' : 'Jin'}</span>}
                        {o.paid_2_via && <span style={{ display: 'block' }}>②{o.paid_2_via === 'jo' ? '🔄 Jo' : 'Jin'}</span>}
                      </span>
                    ) : '—'}
                  </td>
                  <td style={{ ...td, color: o.transfer_fee > 0 ? '#8A3A20' : 'var(--tan)' }}>
                    {o.transfer_fee > 0 ? `−${o.transfer_fee.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ ...td, fontWeight: 500, color: o.net > 0 ? 'var(--dark-blue)' : o.net < 0 ? '#8A3A20' : 'var(--tan)' }}>
                    {o.service_fee ? o.net.toLocaleString() : '—'}
                  </td>
                  <td style={{ ...td, fontSize: '11px' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '99px',
                      background: o.status === 'delivered' ? '#D5E8D8' : o.status === 'cancelled' ? '#F5DDD5' : 'rgba(122,92,69,0.08)',
                      color: o.status === 'delivered' ? '#2A5C35' : o.status === 'cancelled' ? '#8A3A20' : 'var(--brown)',
                    }}>{o.status.replace('_', ' ')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orderRows.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--tan)' }}>No orders yet.</div>
          )}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            Monthly
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Month', 'Ccy', 'Received', 'Fees', 'Net'].map((h, i) => (
                    <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {months.map((m, i) => (
                  <tr key={i}>
                    <td style={tdLeft}>{m.label}</td>
                    <td style={td}>{m.currency}</td>
                    <td style={td}>{m.received.toLocaleString()}</td>
                    <td style={{ ...td, color: m.transfer_fee > 0 ? '#8A3A20' : 'var(--tan)' }}>{m.transfer_fee > 0 ? `−${m.transfer_fee.toLocaleString()}` : '—'}</td>
                    <td style={{ ...td, fontWeight: 500, color: 'var(--dark-blue)' }}>{m.net.toLocaleString()}</td>
                  </tr>
                ))}
                {months.length === 0 && <tr><td colSpan={5} style={{ ...td, textAlign: 'center', color: 'var(--tan)', fontStyle: 'italic' }}>No data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }}>
            Yearly
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Year', 'Ccy', 'Received', 'Fees', 'Orders', 'Net'].map((h, i) => (
                    <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {years.map((y, i) => (
                  <tr key={i}>
                    <td style={tdLeft}>{y.label}</td>
                    <td style={td}>{y.currency}</td>
                    <td style={td}>{y.received.toLocaleString()}</td>
                    <td style={{ ...td, color: y.transfer_fee > 0 ? '#8A3A20' : 'var(--tan)' }}>{y.transfer_fee > 0 ? `−${y.transfer_fee.toLocaleString()}` : '—'}</td>
                    <td style={td}>{y.order_count}</td>
                    <td style={{ ...td, fontWeight: 500, color: 'var(--dark-blue)' }}>{y.net.toLocaleString()}</td>
                  </tr>
                ))}
                {years.length === 0 && <tr><td colSpan={6} style={{ ...td, textAlign: 'center', color: 'var(--tan)', fontStyle: 'italic' }}>No data</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Business expenses */}
      <div style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)' }}>
            Business expenses
          </div>
          <a href="/admin/shopping" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--dark-blue)', textDecoration: 'none' }}>
            Manage ↗
          </a>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Month', 'Currency', 'Spent'].map((h, i) => (
                  <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expByMonth.map((e, i) => {
                // Find revenue net for same month+currency from monthMap
                const monthKey = `${e.month}__${e.currency}`
                const rev = monthMap.get(monthKey)
                return (
                  <tr key={i}>
                    <td style={tdLeft}>{e.label}</td>
                    <td style={td}>{e.currency}</td>
                    <td style={{ ...td, color: '#8A3A20' }}>−{e.total.toLocaleString()}</td>
                  </tr>
                )
              })}
              {expByMonth.length === 0 && (
                <tr><td colSpan={3} style={{ ...td, textAlign: 'center', color: 'var(--tan)', fontStyle: 'italic', fontFamily: 'var(--font-fraunces), serif' }}>No expenses recorded yet</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Net after expenses per month */}
        {expByMonth.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px' }}>
              Net after expenses (monthly)
            </div>
            <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    {['Month', 'Ccy', 'Revenue net', 'Expenses', 'After expenses'].map((h, i) => (
                      <th key={h} style={{ ...th, textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {expByMonth.map((e, i) => {
                    const monthKey = `${e.month}__${e.currency}`
                    const rev = monthMap.get(monthKey)
                    const revNet = rev?.net ?? 0
                    const afterExp = revNet - e.total
                    return (
                      <tr key={i}>
                        <td style={tdLeft}>{e.label}</td>
                        <td style={td}>{e.currency}</td>
                        <td style={{ ...td, color: 'var(--dark-blue)' }}>{revNet > 0 ? revNet.toLocaleString() : '—'}</td>
                        <td style={{ ...td, color: '#8A3A20' }}>−{e.total.toLocaleString()}</td>
                        <td style={{ ...td, fontWeight: 500, color: afterExp >= 0 ? '#2A5C35' : '#8A3A20' }}>{afterExp.toLocaleString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
