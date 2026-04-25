# Studio2J — Dashboards (Admin + Customer)

This document specifies the admin and customer dashboards. They are an **add-on** to the homepage built per `BUILD.md` — build the homepage first, then add this layer.

---

## Philosophy

**Customer accounts are optional.** Studio2J's brand is built on personal DM-based ordering — that flow stays exactly the same. Accounts are an enhancement, not a gate.

- A customer DMs Studio2J on Instagram with their order.
- Studio2J creates the order in the admin dashboard, entering the customer's email.
- The system sends a magic link: "Track your Studio2J order."
- Customer clicks → dashboard appears. No password, no signup form.
- If they never click, nothing breaks. The order ships exactly as it would today.

Magic links are "passwordless email" auth (used by Substack, Notion, Vercel). Customers don't sign up — they're just *granted access* to view their orders.

---

## Tech additions

| Layer            | Choice                | Free tier              |
|------------------|----------------------|------------------------|
| Database         | Supabase             | 500MB Postgres, 2 projects |
| Auth             | Supabase Auth        | 50,000 monthly active users |
| Magic link email | Supabase built-in    | included               |
| File storage     | Supabase Storage     | 1GB (for order photos) |
| Admin styling    | Same Tailwind design system as homepage |

Everything stays on Supabase — one provider, one billing account, free forever for your scale.

---

## Database schema

Create these tables in Supabase. Use the SQL editor and paste:

```sql
-- ─── FAIRS ────────────────────────────────────────────────────────────────
create table fairs (
  id          bigserial primary key,
  name        text not null,
  city        text not null,
  country     text not null,
  region      text not null check (region in ('Asia','Europe','North America','Oceania')),
  date        date not null,
  deadline    date not null,
  types       text[] not null,
  featured    boolean default false,
  going       boolean default false,
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ─── CUSTOMERS ────────────────────────────────────────────────────────────
-- Created automatically when admin creates an order with a new email.
-- The actual auth.users table is managed by Supabase.
create table customers (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  display_name text,
  instagram    text,
  notes        text,                              -- internal notes (admin only)
  created_at   timestamptz default now()
);

-- ─── ORDERS ───────────────────────────────────────────────────────────────
create type order_status as enum (
  'awaiting_payment',
  'paid',
  'going_to_fair',
  'purchased',
  'packing',
  'shipped',
  'delivered',
  'cancelled'
);

create type order_kind as enum ('proxy','fair','personal');

create table orders (
  id              bigserial primary key,
  order_number    text unique not null default ('S2J-' || lpad(nextval('orders_id_seq')::text, 4, '0')),
  customer_id     uuid references customers(id) on delete set null,
  customer_email  text not null,                  -- captured even if customer hasn't logged in
  customer_name   text,
  kind            order_kind not null,
  fair_id         bigint references fairs(id),    -- if kind='fair'
  source_url      text,                           -- if kind='proxy' (e.g. Twenty link)
  title           text not null,                  -- short order title
  description     text,
  items           jsonb,                          -- array of {name, qty, price}
  goods_total     numeric(10,2),
  service_fee     numeric(10,2),
  shipping_cost   numeric(10,2),
  currency        text default 'KRW',
  status          order_status default 'awaiting_payment',
  tracking_number text,
  shipping_address jsonb,
  notes           text,                           -- internal admin notes
  customer_notes  text,                           -- visible to customer
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ─── ORDER STATUS HISTORY ────────────────────────────────────────────────
create table order_events (
  id          bigserial primary key,
  order_id    bigint references orders(id) on delete cascade,
  status      order_status not null,
  note        text,                               -- e.g. "Found at booth 47"
  photo_url   text,                               -- optional Supabase Storage URL
  created_at  timestamptz default now()
);

-- ─── SUBSCRIBERS (newsletter) ────────────────────────────────────────────
create table subscribers (
  id          bigserial primary key,
  email       text unique not null,
  source      text,                               -- 'tracker_inline', 'footer', etc.
  active      boolean default true,
  created_at  timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────
alter table fairs       enable row level security;
alter table orders      enable row level security;
alter table customers   enable row level security;
alter table order_events enable row level security;
alter table subscribers enable row level security;

-- Anyone can read fairs (public homepage)
create policy "fairs are public" on fairs for select using (true);

-- Customers can only see their own orders
create policy "customers see own orders" on orders for select
  using (auth.uid() = customer_id);

create policy "customers see own events" on order_events for select
  using (exists (select 1 from orders where orders.id = order_events.order_id and orders.customer_id = auth.uid()));

create policy "customers see own profile" on customers for select
  using (auth.uid() = id);

-- Admin (defined as specific email or role) can do everything
-- This requires an admin claim in the JWT — see Supabase docs for "admin role"
create policy "admin full access fairs" on fairs for all
  using ((auth.jwt()->>'email') = 'studio2j25@gmail.com');
create policy "admin full access orders" on orders for all
  using ((auth.jwt()->>'email') = 'studio2j25@gmail.com');
create policy "admin full access events" on order_events for all
  using ((auth.jwt()->>'email') = 'studio2j25@gmail.com');
create policy "admin full access customers" on customers for all
  using ((auth.jwt()->>'email') = 'studio2j25@gmail.com');
create policy "admin full access subs" on subscribers for all
  using ((auth.jwt()->>'email') = 'studio2j25@gmail.com');

-- Anyone can subscribe to newsletter (insert only)
create policy "anyone can subscribe" on subscribers for insert with check (true);
```

---

## Routes

### Public (no auth)
- `/` — homepage (already built)
- `/fairs` — full fair tracker page (optional standalone version)
- `/login` — magic link request form
- `/auth/callback` — Supabase magic link redirect handler
- `/order/:orderNumber` — public read-only order view (anyone with the link can see status, but not edit)

### Customer (logged in, any user)
- `/account` — customer dashboard (active orders + history)
- `/account/orders/:orderNumber` — order detail with full timeline

### Admin (logged in as studio2j25@gmail.com only)
- `/admin` — overview (stats, recent orders, alerts)
- `/admin/orders` — order list with filters
- `/admin/orders/new` — create new order
- `/admin/orders/:id` — edit order, update status, upload photos
- `/admin/fairs` — manage fairs (add, edit, delete)
- `/admin/customers` — customer list
- `/admin/subscribers` — newsletter subscribers (export CSV)
- `/admin/content` — edit homepage copy stored in Supabase

---

## Authentication flow

### Customer first-time access (the magic moment)

1. Studio2J (admin) creates an order with `customer_email = "maya@example.com"`.
2. Server-side, after order creation, send a magic link:
   ```ts
   await supabase.auth.signInWithOtp({
     email: customer_email,
     options: {
       redirectTo: `https://studio2j.com/auth/callback?order=${orderNumber}`
     }
   })
   ```
3. Customer receives email: *"Track your Studio2J order — click here."*
4. Click → Supabase verifies → user record created in `auth.users` → redirect to `/auth/callback?order=S2J-1042`.
5. Callback handler: insert customer row if not exists, link `orders.customer_id` to this user, redirect to `/account/orders/S2J-1042`.
6. From now on, this customer is logged in. Future orders to the same email automatically appear in their `/account`.

### Subsequent logins

Customer goes to `studio2j.com/login`, enters email, gets magic link, clicks it, lands on `/account`. No password ever required.

### Admin login

Same magic link flow, but only the admin email (`studio2j25@gmail.com`) gets admin policy access. The RLS policies above enforce this server-side.

---

## Component structure (additions to existing project)

```
studio2j/
├── app/
│   ├── (existing homepage routes)
│   ├── login/page.tsx                 # magic link request form
│   ├── auth/callback/route.ts         # OAuth callback handler
│   ├── order/[number]/page.tsx        # public order view
│   ├── account/
│   │   ├── layout.tsx                 # customer auth gate
│   │   ├── page.tsx                   # customer dashboard
│   │   └── orders/[number]/page.tsx
│   └── admin/
│       ├── layout.tsx                 # admin auth gate
│       ├── page.tsx                   # admin home
│       ├── orders/
│       │   ├── page.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/page.tsx
│       ├── fairs/page.tsx
│       ├── customers/page.tsx
│       ├── subscribers/page.tsx
│       └── content/page.tsx
├── components/
│   ├── (existing components)
│   └── dashboard/
│       ├── DashShell.tsx              # shared dashboard layout
│       ├── DashNav.tsx                # sidebar nav
│       ├── OrderCard.tsx              # admin & customer order rows
│       ├── OrderTimeline.tsx          # progress steps
│       ├── OrderForm.tsx              # admin: create/edit order
│       ├── FairForm.tsx               # admin: create/edit fair
│       └── StatusBadge.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts                  # browser client
    │   ├── server.ts                  # server client (RSC, route handlers)
    │   └── middleware.ts              # auth refresh middleware
    └── auth.ts                        # isAdmin(), requireAuth()
```

---

## Key components

### `lib/supabase/client.ts`
```ts
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
```

### `lib/supabase/server.ts`
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set(name, value, options),
        remove: (name, options) => cookieStore.set(name, '', options),
      },
    },
  )
}
```

### `lib/auth.ts`
```ts
import { createClient } from './supabase/server'

const ADMIN_EMAIL = 'studio2j25@gmail.com'

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  const user = await getUser()
  return user?.email === ADMIN_EMAIL
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error('Unauthorized')
}
```

### `app/login/page.tsx`
```tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <h1 className="font-fraunces text-4xl text-dark-brown mb-3">
          Welcome <em className="italic text-dark-blue">back</em>.
        </h1>
        <p className="font-inter text-brown text-sm mb-8">
          Enter your email — we'll send you a magic link. No password needed.
        </p>
        {sent ? (
          <p className="font-inter text-brown text-sm">
            ✓ Check your email. The link expires in 1 hour.
          </p>
        ) : (
          <form onSubmit={send} className="flex flex-col gap-3">
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="px-5 py-3 rounded-full border border-brown/20 bg-cream font-inter text-sm outline-none focus:border-brown"
            />
            <button type="submit"
              className="bg-dark-blue text-cream font-inter text-sm font-medium py-3 rounded-full hover:bg-muted-blue transition-all">
              Send magic link
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
```

### `app/auth/callback/route.ts`
```ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  const order = searchParams.get('order')

  if (code) {
    const supabase = createClient()
    await supabase.auth.exchangeCodeForSession(code)

    // Ensure customer row exists
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('customers').upsert({
        id: user.id,
        email: user.email!,
      }, { onConflict: 'id' })

      // If they came in via an order link, link the order to them
      if (order) {
        await supabase.from('orders')
          .update({ customer_id: user.id })
          .eq('order_number', order)
          .eq('customer_email', user.email)
      }
    }
  }

  return NextResponse.redirect(
    order ? `${origin}/account/orders/${order}` : `${origin}/account`,
  )
}
```

### `app/account/page.tsx` — customer dashboard
```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import OrderCard from '@/components/dashboard/OrderCard'

export default async function Account() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })

  const active = orders?.filter(o => !['delivered','cancelled'].includes(o.status)) ?? []
  const past   = orders?.filter(o => ['delivered','cancelled'].includes(o.status)) ?? []

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-fraunces text-5xl text-dark-brown mb-2">
        Hello, <em className="italic text-dark-blue">{user.email?.split('@')[0]}</em>.
      </h1>
      <p className="font-inter text-brown text-sm mb-12">
        {active.length} active · {past.length} completed
      </p>

      {active.length > 0 && (
        <section className="mb-12">
          <h2 className="font-inter text-xs uppercase tracking-widest text-tan mb-4">Active orders</h2>
          <div className="flex flex-col gap-3">
            {active.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-inter text-xs uppercase tracking-widest text-tan mb-4">Order history</h2>
          <div className="flex flex-col gap-2">
            {past.map(o => <OrderCard key={o.id} order={o} compact />)}
          </div>
        </section>
      )}

      {orders?.length === 0 && (
        <p className="font-fraunces italic text-tan text-lg">
          No orders yet. DM us on Instagram to place your first.
        </p>
      )}
    </main>
  )
}
```

### `app/admin/page.tsx` — admin home
```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminHome() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.email !== 'studio2j25@gmail.com') redirect('/login')

  const [{ count: activeOrders }, { count: pendingPayment }, { count: totalFairs }, { count: subs }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).not('status', 'in', '(delivered,cancelled)'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'awaiting_payment'),
    supabase.from('fairs').select('*', { count: 'exact', head: true }),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }).eq('active', true),
  ])

  return (
    <div>
      <h1 className="font-fraunces text-4xl text-dark-brown mb-2">
        Welcome back, <em className="italic text-dark-blue">Jin</em>.
      </h1>
      <p className="font-inter text-brown text-sm mb-10">
        {activeOrders} active orders · {pendingPayment} pending invoices
      </p>

      <div className="grid grid-cols-4 gap-3 mb-12">
        <Stat label="Active orders" value={activeOrders ?? 0} />
        <Stat label="Pending invoices" value={pendingPayment ?? 0} />
        <Stat label="Fairs tracked" value={totalFairs ?? 0} />
        <Stat label="Subscribers" value={subs ?? 0} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <Link href="/admin/orders/new" className="btn-primary">+ Add order</Link>
        <Link href="/admin/fairs" className="btn-secondary">+ Add fair</Link>
        <Link href="/admin/subscribers" className="btn-secondary">Export subscribers</Link>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-beige rounded-xl p-4">
      <div className="font-inter text-[11px] uppercase tracking-widest text-tan">{label}</div>
      <div className="font-fraunces text-2xl text-dark-brown mt-1">{value}</div>
    </div>
  )
}
```

---

## Order timeline component

This is the centerpiece of the customer experience. A 5-step horizontal progress strip:

```
[Confirmed] → [Buying] → [Packing] → [Shipped] → [Delivered]
```

Each step has:
- Status (done / current / future)
- Timestamp once completed
- Optional photo upload (admin uploads booth photos, packing photos)
- Optional note ("Found at booth 47!", "Packed with extra care")

Photos live in Supabase Storage (`order-photos` bucket, public read).

Customers love this because every order becomes a little story. A photo from the booth where their item was bought, a photo of the package before shipping — these are the brand moments that turn first-time buyers into repeat ones.

---

## Email notifications

Use Supabase Edge Functions + Resend (free 100 emails/day) to send:

1. **Magic link** — handled automatically by Supabase Auth.
2. **Order created** — "We received your order #S2J-1042. Track it here."
3. **Status change** — when admin marks an order as "shipped" or "delivered."
4. **Newsletter** — admin sends manually from `/admin/subscribers`.

Set up via Database Webhooks in Supabase: when `orders.status` changes, fire a function that calls Resend.

---

## Environment variables

Add to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
RESEND_API_KEY=re_...
ADMIN_EMAIL=studio2j25@gmail.com
```

Add the same to Vercel environment variables when deploying.

---

## Build order

1. Build homepage per `BUILD.md`
2. Set up Supabase project, run schema SQL
3. Migrate fairs from `lib/fairs.ts` static array → Supabase `fairs` table (one-time INSERT)
4. Update `FairTracker.tsx` to fetch from Supabase instead of static import
5. Build login + auth/callback pages
6. Build customer dashboard (`/account`)
7. Build admin dashboard (`/admin`)
8. Add email notifications (last — manual sending works fine while you have a small number of orders)

---

## Costs at scale

| Volume                              | Monthly cost |
|-------------------------------------|--------------|
| 0–500 orders/month, 0–2GB storage   | $0           |
| 500–5,000 orders/month              | $25 (Supabase Pro) |
| 50,000+ active customers            | $25 + email costs |

You'll be on the free tier for at least the first year.
