# Studio2J — Claude Code Brief

You are maintaining the Studio2J production website. Live at **https://studio2j.pages.dev**, deployed via Cloudflare Pages from GitHub repo **xiajiun/studio2j**.

`reference.html` is the source of truth for the homepage design only. The dashboards and order system are documented below.

---

## About Studio2J

Seoul + Tokyo personal shopping service, founded 2025.

**Services:** Proxy buying (main), fair hauls (secondary), personal requests (third).

**Service fee:** Min ₩25,000 / ¥2,500, or 15% of goods value — whichever is higher.

**Two-invoice payment flow:**
- Invoice 1: Item costs only → customer pays upfront so we can buy
- Invoice 2: Service fee + international shipping → sent after items confirmed
- If Part 1 unpaid, Part 2 amount includes goods too

**Socials:** Instagram @studio2j25 · Threads @studio2j25 · studio2j25@gmail.com

---

## Tech stack

- Next.js 14.2.29, App Router, TypeScript
- Tailwind CSS + CSS variables (inline styles dominant)
- Fraunces (display) + Inter (body) via `next/font/google`
- Supabase (Postgres + Auth) — project: `hclclmdfcswdrdpqtyyl`
- Resend — order notification emails
- Cloudflare Pages — SSR via `@cloudflare/next-on-pages@1`
- **All server pages must have `export const runtime = 'edge'`**

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/order/new` | Public | Customer order form |
| `/order/[number]` | Public | Order tracking (no login) |
| `/login` | Public | Password (admin) or magic link (customers) |
| `/auth/callback` | Public | Supabase auth handler |
| `/account` | Customer | Order list |
| `/account/orders/[number]` | Customer | Order detail + timeline |
| `/admin` | Admin | Overview stats |
| `/admin/orders` | Admin | Order list + filters |
| `/admin/orders/new` | Admin | Create order |
| `/admin/orders/[id]` | Admin | Edit order + timeline |
| `/admin/orders/[id]/invoice?type=1` | Admin | Invoice 1 — items only |
| `/admin/orders/[id]/invoice?type=2` | Admin | Invoice 2 — fee + shipping |
| `/admin/orders/[id]/invoice?type=2&paid=0` | Admin | Invoice 2 — Part 1 unpaid variant |
| `/admin/fairs` | Admin | Manage fairs |
| `/admin/customers` | Admin | Customer list |
| `/admin/subscribers` | Admin | Newsletter list + CSV export |
| `/api/orders` | Public POST | Customer order submission endpoint |

---

## Key files

```
app/
  layout.tsx                 fonts, metadata
  page.tsx                   homepage — fetches fairs from Supabase, passes to Hero + FairTracker
  globals.css                CSS vars, keyframes, @media print (hides .dash-sidebar)
  login/page.tsx             password (admin) + magic link (customers)
  auth/callback/page.tsx     client — handles PKCE + implicit auth flows
  order/new/page.tsx         customer order form — name/email/phone/instagram/address/items/payment/terms
  order/[number]/page.tsx    public tracking — timeline filtered by order.kind
  api/orders/route.ts        POST — inserts order via service role, emails admin via Resend
  account/layout.tsx         requireAuth gate
  account/page.tsx           customer orders (queries by customer_id OR customer_email)
  account/orders/[number]/page.tsx
  admin/layout.tsx           requireAdmin gate
  admin/page.tsx             stats + recent orders
  admin/orders/page.tsx      list with filter: all/active/unpaid/shipped/delivered
  admin/orders/new/page.tsx
  admin/orders/[id]/page.tsx  edit + two invoice links + timeline
  admin/orders/[id]/invoice/page.tsx  two-part invoice with paid toggle
  admin/fairs/page.tsx       add/edit/delete fairs + seed button
  admin/customers/page.tsx
  admin/subscribers/page.tsx

components/
  Nav.tsx                    fixed, scroll blur, CTA → /order/new
  Hero.tsx                   accepts fairCount + countryCount props (dynamic from Supabase)
  FairTracker.tsx            accepts fairs prop from server; filter/search/save to localStorage
  HowItWorks.tsx             3-step grid — updated copy mentions two invoices
  OrderCTA.tsx               CTA → /order/new
  FAQ.tsx                    accordion — "When do I pay?" updated for two invoices
  Footer.tsx                 "Email us" mailto + Instagram + Threads + Place an order
  AuthRedirect.tsx           handles #access_token hash on homepage → pushes to /admin or /account
  dashboard/DashShell.tsx    flex layout — .dash-sidebar + .dash-main classes
  dashboard/DashNav.tsx      sidebar — NO usePathname (CF Edge hydration bug)
  dashboard/OrderTimeline.tsx  filters going_to_fair for proxy/personal kinds
  dashboard/OrderForm.tsx    auto-calculates goods_total + service_fee from items × qty
  dashboard/FairForm.tsx     AddFairButton + EditFairButton + SeedFairsButton
  dashboard/StatusBadge.tsx  earth-tone chips

lib/
  database.types.ts          all types — see DATA.md for current schema
  auth.ts                    requireAuth(), requireAdmin(), getUser(), isAdmin()
  supabase/client.ts         createBrowserClient
  supabase/server.ts         createServerClient + createServiceClient
  fairs.ts                   static fallback fairs (14 fairs, used when DB empty)
```

---

## Critical rules

1. All homepage copy from `reference.html` must be preserved exactly.
2. Every server page/route: `export const runtime = 'edge'`.
3. Never use `usePathname()` in DashShell components — hydration mismatch on CF Edge.
4. Wordmark: `Studio<em>2J</em>` — no image, no SVG.
5. Colors: only the 8 CSS variables in DESIGN.md.
6. Fonts: Fraunces (display/serif), Inter (body/UI).

---

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hclclmdfcswdrdpqtyyl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # set as CF Pages secret, NOT in wrangler.toml
ADMIN_EMAIL=studio2j25@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=studio2j25@gmail.com
RESEND_API_KEY=re_...               # Resend API key for order notification emails
```
