# Studio2J — Claude Code Brief

You are maintaining the Studio2J production website. Live at **https://studio2j.pages.dev**, deployed via Cloudflare Pages from GitHub repo **xiajiun/studio2j**.

`reference.html` is the source of truth for the homepage design only. The dashboards and order system are documented below.

---

## About Studio2J

Seoul + Tokyo personal shopping service, founded 2025. Jin is in Korea, Jo is in Japan.

**Services:** Proxy buying (main), fair hauls (secondary), personal requests (third).

**Service fee:** Min ₩25,000 / ¥2,500, or 15% of goods value — whichever is higher. Fee is rounded **up** to the nearest ₩1,000 (JPY: ¥100).

**Two-invoice payment flow:**
- Invoice 1: Item costs only → customer pays upfront so we can buy
- Invoice 2: Service fee + international shipping → sent after items confirmed
- If Part 1 unpaid, Part 2 amount includes goods too (auto-detected from `paid_1_amount`)

**Finance split:** KRW orders = Jin (Korea), JPY orders = Jo (Japan)

**Admins:**
- `studio2j25@gmail.com` — shared account, sees all data
- `xiajiun21@gmail.com` — Jin, sees KRW finance only
- `jovynkw@gmail.com` — Jo, sees JPY finance only

**Socials:** Instagram @studio2j25 · Threads @studio2j25 · studio2j25@gmail.com

---

## Tech stack

- Next.js 14.2.29, App Router, TypeScript
- Tailwind CSS + CSS variables (inline styles dominant)
- Fraunces (display) + Inter (body) via `next/font/google`
- Supabase (Postgres + Auth) — project: `hclclmdfcswdrdpqtyyl`
- Cloudflare Pages — SSR via `@cloudflare/next-on-pages@1`
- **All server pages must have `export const runtime = 'edge'`**
- No Resend — emails are composed manually via Gmail draft buttons

---

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Homepage |
| `/order/new` | Public | Customer order form |
| `/order/[number]` | Public | Order tracking (no login, tracking number links to carrier) |
| `/invoice/[number]?type=1\|2` | Public | Customer-facing invoice (print/PDF) |
| `/login` | Public | Password login (admins only) |
| `/auth/callback` | Public | Supabase auth handler |
| `/admin` | Admin | Overview stats + welcome by name |
| `/admin/orders` | Admin | Order list + filters |
| `/admin/orders/new` | Admin | Create order |
| `/admin/orders/[id]` | Admin | Edit order + timeline + shipped email button |
| `/admin/orders/[id]/invoice?type=1\|2` | Admin | Invoice — auto-detects paid status from paid_1_amount |
| `/admin/finance` | Admin | Finance dashboard (filtered by logged-in admin) |
| `/admin/fairs` | Admin | Manage fairs |
| `/admin/customers` | Admin | Customer list (pulled from orders table, no login needed) |
| `/admin/fair-reminders` | Admin | Fair reminder signups + Draft email button |
| `/admin/subscribers` | Admin | Newsletter list + CSV export + Draft newsletter button |
| `/api/orders` | Public POST | Customer order submission |
| `/api/fair-reminder` | Public POST | Save fair reminder signup to Supabase |
| `/api/subscribe` | Public POST | Save newsletter subscriber to Supabase |

---

## Key files

```
app/
  layout.tsx                 fonts, metadata, LangProvider wrapper
  page.tsx                   homepage — fetches fairs from Supabase
  globals.css                CSS vars, keyframes, @media print, admin mobile (<768px)
  login/page.tsx             password-only login (no magic link)
  auth/callback/page.tsx     handles PKCE + implicit; redirects all 3 admin emails → /admin
  order/new/page.tsx         customer order form
  order/[number]/page.tsx    public tracking — tracking number links to carrier (KR/JP/17track)
  invoice/[number]/page.tsx  customer invoice — full layout, print/PDF, auto-detects paid status
  api/orders/route.ts        POST — inserts order via service role (no email)
  api/fair-reminder/route.ts POST — upserts into fair_reminders table
  api/subscribe/route.ts     POST — upserts into subscribers table
  admin/layout.tsx           requireAdmin gate (all 3 admin emails)
  admin/page.tsx             stats + recent orders; welcome name based on logged-in email
  admin/orders/page.tsx      list with filters
  admin/orders/new/page.tsx
  admin/orders/[id]/page.tsx edit + invoice links + shipped email button (shown when tracking set)
  admin/orders/[id]/invoice/page.tsx  two-part invoice; paid status auto from paid_1_amount
  admin/finance/page.tsx     finance dashboard filtered by admin email (KRW/JPY split)
  admin/fairs/page.tsx       add/edit/delete fairs
  admin/customers/page.tsx   customers from orders table (service client)
  admin/fair-reminders/page.tsx  signups grouped by fair + Draft email button
  admin/subscribers/page.tsx newsletter list + Draft newsletter button

components/
  Nav.tsx                    fixed, scroll blur, language switcher (EN/日本語/繁中)
  Hero.tsx                   'use client', useLang()
  FairTracker.tsx            'use client'; Save button → email input → saves to fair_reminders
                             Subscribe button → saves to subscribers table
  HowItWorks.tsx             'use client', useLang()
  OrderCTA.tsx               'use client', useLang()
  FAQ.tsx                    'use client', useLang()
  Footer.tsx                 'use client', useLang()
  LangProvider.tsx           React context; lang persisted to localStorage 's2j-lang'
  dashboard/DashShell.tsx    flex layout — .dash-sidebar + .dash-main; mobile: column layout
  dashboard/DashNav.tsx      desktop sidebar + mobile hamburger; NO usePathname (CF Edge bug)
  dashboard/OrderForm.tsx    items: name/color/ccy/qty/unit price/dom_del/total (auto-calc)
                             service fee rounded up to nearest ₩1000; payments received section
                             Jin received from Jo → auto-calc transfer fee
  dashboard/OrderTimeline.tsx filters going_to_fair for proxy/personal
  dashboard/FairForm.tsx     AddFairButton + EditFairButton + SeedFairsButton
  dashboard/StatusBadge.tsx  earth-tone chips
  dashboard/GmailDraftButton.tsx  reusable Gmail compose modal (uses createPortal)
  dashboard/ShippedEmailButton.tsx  shipped email template with carrier/tracking auto-detect

lib/
  database.types.ts          all types — see DATA.md for current schema
  auth.ts                    requireAuth(), requireAdmin(), getUser(), isAdmin()
                             adminWelcomeName(email) → 'Jin' | 'Jo' | 'Jin and Jo'
                             ADMIN_EMAILS = [studio2j25, xiajiun21, jovynkw]
  i18n.ts                    EN / 日本語 / 繁中 translations for all homepage sections
  supabase/client.ts         createBrowserClient (anon key, for client components)
  supabase/server.ts         createClient (SSR, anon key) + createServiceClient (direct supabase-js,
                             service role key — use this for ALL admin server pages)
  fairs.ts                   static fallback fairs
```

---

## Critical rules

1. All homepage copy from `reference.html` must be preserved exactly.
2. Every server page/route: `export const runtime = 'edge'`.
3. Never use `usePathname()` in DashShell components — hydration mismatch on CF Edge.
4. Wordmark: `Studio<em>2J</em>` — no image, no SVG.
5. Colors: only the 8 CSS variables in DESIGN.md.
6. Fonts: Fraunces (display/serif), Inter (body/UI).
7. **All admin server pages must use `createServiceClient()` (not `createClient()`)** — bypasses RLS so all admin emails see the same data.
8. No emojis in email templates.
9. No Resend — all customer emails are drafted via `GmailDraftButton` and sent manually.
10. **Always update i18n.ts (EN + JA + ZH-TW) whenever any text changes.** New pages, new sections, form labels, buttons — all must have translations in all three languages before committing. Japanese copy must be Korea-only: remove any mentions of Japan, Tokyo, Loft, Hobonichi, ¥2,500 from the Japanese translations.

---

## Admin data access pattern

All admin server pages import `createServiceClient as createClient` from `@/lib/supabase/server`. This uses the direct `@supabase/supabase-js` client with the service role key, bypassing all RLS. Never use the regular `createClient` for admin data reads.

```ts
import { createServiceClient as createClient } from '@/lib/supabase/server'
```

---

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hclclmdfcswdrdpqtyyl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # set as CF Pages secret, NOT in wrangler.toml
ADMIN_EMAIL=studio2j25@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=studio2j25@gmail.com
# RESEND_API_KEY — removed, no longer used
```

---

## Tracking number carrier detection

Used in both `/order/[number]` (customer tracking page) and `ShippedEmailButton`:
- Ends in `KR` → Korea Post EMS: `https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=`
- Ends in `JP` → Japan Post: `https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=`
- Otherwise → 17track: `https://www.17track.net/en/track#nums=`
