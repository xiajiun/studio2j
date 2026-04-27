# Studio2J — Data

## Current TypeScript types (`lib/database.types.ts`)

```ts
export type OrderStatus =
  | 'awaiting_payment' | 'paid' | 'going_to_fair' | 'purchased'
  | 'packing' | 'shipped' | 'delivered' | 'cancelled'

export type OrderKind = 'proxy' | 'fair' | 'personal'

export interface OrderItem {
  name: string
  url?: string
  color?: string          // colour / size variant
  item_ccy?: 'KRW' | 'JPY'  // per-item origin currency
  qty: number
  price: number           // unit price
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  country: string
  postal_code: string
  phone?: string
  instagram?: string
  payment_method?: 'wise' | 'korea' | 'malaysia' | 'japan'
}

export interface Order {
  id: number
  order_number: string       // 'S2J-0001' format
  customer_id: string | null
  customer_email: string
  customer_name: string | null
  kind: OrderKind
  fair_id: number | null
  source_url: string | null  // legacy — replaced by items[].url
  title: string              // auto-generated from first item name
  description: string | null
  items: OrderItem[] | null
  goods_total: number | null   // Invoice 1 amount
  service_fee: number | null   // Invoice 2 partial
  shipping_cost: number | null // Invoice 2 partial
  currency: string             // 'KRW' | 'JPY' | 'MYR'
  status: OrderStatus
  tracking_number: string | null
  shipping_address: ShippingAddress | null
  notes: string | null         // admin-only internal notes
  customer_notes: string | null  // visible to customer
  created_at: string
  updated_at: string
}

export interface OrderEvent {
  id: number
  order_id: number
  status: OrderStatus
  note: string | null
  photo_url: string | null
  created_at: string
}

export interface FairRow {
  id: number
  name: string
  city: string
  country: string
  region: string    // 'Asia' | 'Europe' | 'North America' | 'Oceania'
  date: string      // ISO YYYY-MM-DD
  deadline: string
  types: string[]   // 'illustration' | 'stationery' | 'zine' | 'art' | 'craft'
  featured: boolean
  going: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string      // = auth.users.id
  email: string
  display_name: string | null
  instagram: string | null
  notes: string | null
  created_at: string
}

export interface Subscriber {
  id: number
  email: string
  source: string | null
  active: boolean
  created_at: string
}

// Status display
export const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  paid:             'Paid',
  going_to_fair:    'Going to fair',
  purchased:        'Purchased',
  packing:          'Packing',
  shipped:          'Shipped',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
}

// Timeline steps — going_to_fair filtered out for proxy/personal orders
export const STATUS_ORDER: OrderStatus[] = [
  'awaiting_payment', 'paid', 'going_to_fair', 'purchased',
  'packing', 'shipped', 'delivered',
]
```

---

## Database tables (Supabase)

- `orders` — main order table. `order_number` uses a dedicated sequence `order_number_seq`
- `order_events` — timeline entries (status + note + photo_url per step)
- `customers` — created on first magic link click; linked to `auth.users`
- `fairs` — managed via `/admin/fairs`; seeded from `lib/fairs.ts` static data
- `subscribers` — email signups from homepage fair tracker

**Order number sequence fix** (run in Supabase SQL editor if numbers skip):
```sql
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;
ALTER TABLE orders ALTER COLUMN order_number
  SET DEFAULT ('S2J-' || lpad(nextval('order_number_seq')::text, 4, '0'));
```

**Reset all orders for fresh start:**
```sql
TRUNCATE order_events, orders RESTART IDENTITY CASCADE;
DROP SEQUENCE IF EXISTS order_number_seq;
CREATE SEQUENCE order_number_seq START WITH 1;
ALTER TABLE orders ALTER COLUMN order_number
  SET DEFAULT ('S2J-' || lpad(nextval('order_number_seq')::text, 4, '0'));
```

---

## Payment methods

| Value | Bank | Details |
|-------|------|---------|
| `wise` | Wise | wise.com/pay/me/keweih6 |
| `korea` | Shinhan Bank | LAU XIA JIUN · 110-437-478592 · Swift SHBKKRSE · TEL 01029838831 |
| `malaysia` | Maybank | HO KE WEI · 1624 3302 2400 |
| `japan` | Yuucho Bank (9900) | Branch 038 · ホカウェイ · 普通 Futsuu · 8992079 |

---

## Order flow

1. Customer submits `/order/new` → POST `/api/orders` → order created (status: `awaiting_payment`) → admin emailed via Resend
2. Admin reviews → fills in item prices → generates **Invoice 1** (`?type=1`) → sends tracking link
3. Customer pays Invoice 1 → admin marks `paid` → goes to buy items
4. Admin buys items → marks `purchased`, then `packing`
5. Admin fills in service_fee + shipping_cost → generates **Invoice 2** (`?type=2`) → sends
6. Customer pays Invoice 2 → admin ships → marks `shipped`, then `delivered`

---

## Static fairs fallback (`lib/fairs.ts`)

14 fairs used when Supabase `fairs` table is empty. Homepage `/` fetches from Supabase first; falls back to static data. Admin can seed via "Import default fairs" button at `/admin/fairs`.

---

## Filter logic (FairTracker)

| View | Filter |
|------|--------|
| `upcoming` | Fair date >= today |
| `going` | `fair.going === true` |
| `deadline` | Deadline in future |
| `saved` | ID in localStorage `s2j-saved` |
| `asia` | region === 'Asia' |
| `europe` | region === 'Europe' |

Plus free-text search matching name, city, or country. Results sorted by date ascending, grouped by month.
