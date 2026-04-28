# Studio2J — Data

## Current TypeScript types (`lib/database.types.ts`)

```ts
export type OrderStatus =
  | 'awaiting_payment'    // Invoice 1 sent, waiting for payment
  | 'paid'                // Invoice 1 paid
  | 'going_to_fair'       // Fair haul only
  | 'purchased'           // Items bought
  | 'packing'             // Packing items
  | 'awaiting_payment_2'  // Invoice 2 sent, waiting for final payment
  | 'paid_2'              // Invoice 2 paid
  | 'shipped'             // Parcel shipped
  | 'delivered'           // Delivered
  | 'cancelled'

export type OrderKind = 'proxy' | 'fair' | 'personal'

export interface OrderItem {
  name: string
  color?: string           // colour / size variant
  item_ccy?: 'KRW' | 'JPY'  // per-item origin currency
  qty: number
  price: number            // unit price
  dom_del?: number         // domestic delivery fee (included in total)
  total?: number           // manual total override (or auto = price×qty + dom_del)
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
  source_url: string | null
  title: string
  description: string | null
  items: OrderItem[] | null
  goods_total: number | null    // Invoice 1 amount (auto-calc from items)
  service_fee: number | null    // Invoice 2 partial (rounded up ₩1000/¥100)
  shipping_cost: number | null  // Invoice 2 partial
  currency: string              // 'KRW' | 'JPY' | 'MYR' | 'USD'
  status: OrderStatus
  tracking_number: string | null
  shipping_address: ShippingAddress | null
  notes: string | null          // admin-only internal notes
  customer_notes: string | null // visible to customer on tracking page
  // Payment tracking (filled in Payments received section on order edit page)
  paid_1_amount: number | null
  paid_1_date: string | null
  paid_1_via: 'jin' | 'jo' | null   // jin = Shinhan; jo = Wise
  paid_1_transfer_fee: number | null // auto-calc: paid_1_amount - jin_received_from_jo
  paid_2_amount: number | null
  paid_2_date: string | null
  paid_2_via: 'jin' | 'jo' | null
  paid_2_transfer_fee: number | null
  actual_goods_cost: number | null   // defaults to goods_total; override if actual differs
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

export interface Subscriber {
  id: number
  email: string
  source: string | null  // 'homepage'
  active: boolean
  created_at: string
}
```

---

## Database tables (Supabase)

| Table | Description |
|-------|-------------|
| `orders` | Main order table. `order_number` uses `order_number_seq` sequence |
| `order_events` | Timeline entries (status + note + photo_url per step) |
| `magiclink_customers` | Old auth-based table (renamed from `customers`). Unused — nobody logs in via magic link |
| `fairs` | Managed via `/admin/fairs`; seeded from `lib/fairs.ts` static data |
| `subscribers` | Email signups from homepage subscribe button |
| `fair_reminders` | Per-fair email signups from FairTracker "Save" button |

**SQL to create `fair_reminders` table** (run once in Supabase SQL editor):
```sql
CREATE TABLE IF NOT EXISTS fair_reminders (
  id            bigserial PRIMARY KEY,
  email         text NOT NULL,
  fair_id       integer NOT NULL,
  fair_name     text NOT NULL,
  fair_date     date NOT NULL,
  fair_deadline date,
  created_at    timestamptz DEFAULT now(),
  UNIQUE(email, fair_id)
);
```

**SQL to add payment tracking columns to orders** (run once):
```sql
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS paid_1_amount numeric,
  ADD COLUMN IF NOT EXISTS paid_1_date date,
  ADD COLUMN IF NOT EXISTS paid_1_via text,
  ADD COLUMN IF NOT EXISTS paid_1_transfer_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS paid_2_amount numeric,
  ADD COLUMN IF NOT EXISTS paid_2_date date,
  ADD COLUMN IF NOT EXISTS paid_2_via text,
  ADD COLUMN IF NOT EXISTS paid_2_transfer_fee numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS actual_goods_cost numeric;
```

**Order number sequence fix** (run if numbers skip):
```sql
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 1;
ALTER TABLE orders ALTER COLUMN order_number
  SET DEFAULT ('S2J-' || lpad(nextval('order_number_seq')::text, 4, '0'));
```

---

## Payment methods

| Value | Handler | Bank | Details |
|-------|---------|------|---------|
| `wise` | Jo | Wise | wise.com/pay/me/keweih6 |
| `korea` | Jin | Shinhan Bank | LAU XIA JIUN · 110-437-478592 · Swift SHBKKRSE · TEL 01029838831 |
| `malaysia` | — | Maybank | HO KE WEI · 1624 3302 2400 |
| `japan` | Jo | Yuucho Bank (9900) | Branch 038 · HO KE WEI · Futsuu Savings · 8992079 |

**Transfer fee flow:** When customer pays Jo (Wise) but Jin is the handler (KRW order):
- Admin enters "Customer paid" amount + "Jin received from Jo" amount
- Transfer fee = Customer paid − Jin received (auto-calculated, stored in `paid_1_transfer_fee`)

---

## Order flow

1. Customer submits `/order/new` → POST `/api/orders` → order created (`awaiting_payment`)
2. Admin reviews → fills in item prices → generates **Invoice 1** (`?type=1`) → emails customer via Gmail draft
3. Customer pays Invoice 1 → admin fills `paid_1_amount` in Payments received → status `paid`
4. Admin buys items → status `purchased`, then `packing`
5. Admin fills in service_fee + shipping_cost → generates **Invoice 2** (`?type=2`)
   - Invoice 2 auto-detects paid status: if `paid_1_amount` set → shows fee+ship only; else shows full total
6. Customer pays Invoice 2 → admin fills `paid_2_amount` → status `awaiting_payment_2` → `paid_2`
7. Admin ships → enters tracking number → status `shipped` → sends shipped email via Gmail draft
8. Delivered → status `delivered`

---

## Finance tracking

Finance page (`/admin/finance`) is filtered by logged-in admin:
- `xiajiun21@gmail.com` → KRW orders only (Jin — Korea)
- `jovynkw@gmail.com` → JPY orders only (Jo — Japan)
- `studio2j25@gmail.com` → all orders

**Net earnings** = service_fee − transfer_fees (what Jin actually keeps after Wise cuts)

---

## Status order (timeline)

```
awaiting_payment → paid → [going_to_fair] → purchased → packing
  → awaiting_payment_2 → paid_2 → shipped → delivered
```

`going_to_fair` only shown for `kind === 'fair'` orders.

---

## OrderItem: total calculation

```
total = price × qty + dom_del
```

- Auto-calculated when price or qty or dom_del changes
- Can be manually overridden (useful for fair haul orders where you write brand + total directly)
- If `total` is set, it takes precedence in goods_total calculation and invoice display
- `dom_del` shown as separate column in invoice only if any item has it

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

Save button → email input → POST `/api/fair-reminder` → stored in `fair_reminders` table.
Subscribe button → POST `/api/subscribe` → stored in `subscribers` table.

---

## Static fairs fallback (`lib/fairs.ts`)

14 fairs used when Supabase `fairs` table is empty. Homepage `/` fetches from Supabase first; falls back to static data. Admin can seed via "Import default fairs" button at `/admin/fairs`.
