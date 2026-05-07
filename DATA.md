# Studio2J — Data

## Current TypeScript types (`lib/database.types.ts`)

```ts
export type OrderStatus =
  | 'awaiting_payment'    // Invoice sent, waiting for payment
  | 'paid'                // Invoice paid
  | 'going_to_fair'       // Fair haul only
  | 'purchased'           // Items bought
  | 'packing'             // Packing items
  | 'awaiting_payment_2'  // Legacy (kept for existing orders)
  | 'paid_2'              // Legacy (kept for existing orders)
  | 'shipped'             // Parcel shipped
  | 'delivered'           // Delivered
  | 'cancelled'

export type OrderKind = 'proxy' | 'fair' | 'personal'

export interface OrderItem {
  name: string
  color?: string           // colour / size variant
  item_ccy?: 'KRW' | 'JPY'
  qty: number
  price: number            // unit price
  dom_del?: number         // domestic delivery fee (included in total)
  total?: number           // manual total override (or auto = price×qty + dom_del)
}

export interface ShippingAddress {
  name: string; address: string; city: string; country: string; postal_code: string
  phone?: string; instagram?: string
  payment_method?: 'wise' | 'korea' | 'malaysia' | 'japan'
}

export interface Order {
  id: number; order_number: string; customer_id: string | null
  customer_email: string; customer_name: string | null
  kind: OrderKind; fair_id: number | null; source_url: string | null
  title: string; description: string | null; items: OrderItem[] | null
  goods_total: number | null; service_fee: number | null; shipping_cost: number | null
  currency: string; status: OrderStatus; tracking_number: string | null
  shipping_address: ShippingAddress | null
  notes: string | null; customer_notes: string | null
  // Payment tracking
  paid_1_amount: number | null; paid_1_date: string | null
  paid_1_via: 'jin' | 'jo' | null; paid_1_transfer_fee: number | null
  paid_2_amount: number | null; paid_2_date: string | null  // legacy
  paid_2_via: 'jin' | 'jo' | null; paid_2_transfer_fee: number | null  // legacy
  actual_goods_cost: number | null
  created_at: string; updated_at: string
}

export interface FairRow {
  id: number; name: string; city: string; country: string
  region: string; date: string; deadline: string; types: string[]
  featured: boolean; going: boolean
  url: string | null          // Instagram or website URL
  image_url: string | null    // Cover image for fair card
  catalogue_url: string | null // Link to catalogue page (e.g. /catalogue/inventario-2026)
  notes: string | null
  created_at: string; updated_at: string
}

export interface TwentyMarket {
  marketUID: string; marketTitle: string; marketCover: string
  marketST: number; marketED: number  // ms timestamps
  marketPublicId: number; sellerPublicId: string
  sellerInfoName: string; sellerCategory: string
}

export interface Subscriber {
  id: number; email: string; source: string | null; active: boolean; created_at: string
}
```

---

## Database tables (Supabase)

| Table | Description |
|-------|-------------|
| `orders` | Main order table |
| `order_events` | Timeline entries |
| `magiclink_customers` | Old auth-based table (renamed, unused) |
| `fairs` | Managed via `/admin/fairs` |
| `subscribers` | Homepage subscribe button signups |
| `fair_reminders` | Per-fair email signups (stores lang of user) |
| `todos` | Admin internal todo/ideas list |

**SQL — all pending migrations (run once each):**
```sql
-- fair_reminders table
CREATE TABLE IF NOT EXISTS fair_reminders (
  id            bigserial PRIMARY KEY,
  email         text NOT NULL,
  fair_id       integer NOT NULL,
  fair_name     text NOT NULL,
  fair_date     date NOT NULL,
  fair_deadline date,
  lang          text DEFAULT 'en',
  created_at    timestamptz DEFAULT now(),
  UNIQUE(email, fair_id)
);

-- fairs: add new columns
ALTER TABLE fairs ADD COLUMN IF NOT EXISTS url text;
ALTER TABLE fairs ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE fairs ADD COLUMN IF NOT EXISTS catalogue_url text;

-- orders: payment tracking columns
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

-- todos table
CREATE TABLE IF NOT EXISTS todos (
  id          bigserial PRIMARY KEY,
  text        text NOT NULL,
  category    text DEFAULT 'task',
  completed   boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;

-- magiclink_customers rename (if not done)
-- ALTER TABLE customers RENAME TO magiclink_customers;
```

---

## Payment methods

| Value | Handler | Bank | Details |
|-------|---------|------|---------|
| `wise` | Jo | Wise | wise.com/pay/me/keweih6 |
| `korea` | Jin | Shinhan Bank | LAU XIA JIUN · 110-437-478592 · Swift SHBKKRSE · TEL 01029838831 |
| `malaysia` | — | Maybank | HO KE WEI · 1624 3302 2400 |
| `japan` | Jo | Yuucho Bank (9900) | Branch 038 · HO KE WEI · Futsuu Savings · 8992079 |

**Transfer fee:** Admin enters "Customer paid" + "Jin received from Jo" → fee auto-calculated

---

## Order flow (single invoice)

1. Customer submits `/order/new` → order created (`awaiting_payment`)
2. Admin reviews → sets item prices → generates **Invoice** via Gmail draft
3. Invoice covers: items + service fee + international shipping (all in one)
4. Customer pays → admin fills `paid_1_amount` → status `paid`
5. Admin buys items → `purchased` → `packing`
6. Admin ships → tracking number → `shipped` → sends shipped email
7. `delivered`

---

## Finance tracking

`/admin/finance` filtered by login:
- `xiajiun21@gmail.com` → KRW only (Jin — Korea)
- `jovynkw@gmail.com` → JPY only (Jo — Japan)
- `studio2j25@gmail.com` → all

**Net earnings** = service_fee − transfer_fees

---

## Status order (timeline)

```
awaiting_payment → paid → [going_to_fair] → purchased → packing → shipped → delivered
```

`going_to_fair` only for `kind === 'fair'`. `awaiting_payment_2` / `paid_2` kept for legacy orders.

---

## OrderItem total calculation

```
total = price × qty + dom_del
```
Manual override allowed. `dom_del` shown in invoice only if any item has it.

---

## FairTracker filter tabs

| Tab | Filter |
|-----|--------|
| Upcoming (default) | date >= today |
| Going | fair.going === true |
| Deadline | deadline in future |
| Saved | in localStorage `s2j-saved` |
| All | no filter |

Asia/Europe tabs removed. Save button → stores email + fair info + user's lang in `fair_reminders`.

---

## Fair reminders — multi-language draft

When admin opens `/admin/fair-reminders`, signups are grouped by language per fair:
- **Draft EN (N)** · **Draft 日本語 (N)** · **Draft 繁中 (N)** — separate buttons
- Each opens Gmail with email body written in the correct language
- Lang stored at time of signup from user's `useLang()` context

---

## Twenty Style market data

- API: `https://api.twenty.style/common/v2/opened-market`
- Image CDN: `https://cdn.twenty.style/{marketCover}`
- Market link: `https://twenty.style/m/{sellerPublicId}/{marketPublicId}`
- Updates: fetched fresh on each page load, cached 1hr at Cloudflare edge
- Filter: remove markets with `테스트` in title

---

## Catalogue pages

### INVENTARIO 2026 (`/catalogue/inventario-2026`)
- 88 brands across 7 categories (Small Thing, Writing & Drawing, Daily Finds, Paper, Office & Desk, Kiosk, Workshop)
- Favicon logos via `https://www.google.com/s2/favicons?domain={url}&sz=128`
- Country flags: 🇰🇷 🇯🇵 🌍

### DOTDOTDOT v.7 (`/catalogue/dotdotexpress`)
- 166 brands from official PDF booth layout (A01–K16)
- `BOOTH_LAYOUT` object is the single source of truth
- Interactive booth map: hover 350ms → Instagram embed popup (380×520px iframe)
- Brands not in BOOTH_LAYOUT are removed; brands with booth set update the map
- Each brand card shows inline Instagram embed (lazy loaded)
- `lang` stored with fair reminder signups

---

## Static fairs fallback (`lib/fairs.ts`)

Used when Supabase `fairs` table is empty. Includes `url: null`, `image_url: null`, `catalogue_url: null` in mapping.
