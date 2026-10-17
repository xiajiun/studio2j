# Studio2J — Claude Code Brief

You are maintaining the Studio2J production website. Live at **https://studio2j.pages.dev**, deployed via Cloudflare Pages from GitHub repo **xiajiun/studio2j**.

`reference.html` is the original homepage design, kept for history only — the live homepage was refurbished on 2026-10-17 (see DESIGN.md "Surfaces & text"). The dashboards and order system are documented below.

---

## About Studio2J

Seoul + Tokyo personal shopping service, founded 2025. Jin is in Korea, Jo is in Japan.

**Services:** Proxy buying (main), fair hauls (secondary), personal requests (third).

**Service fee:** Min ₩25,000 / ¥2,500, or 15% of goods value — whichever is higher. Fee is rounded **up** to the nearest ₩1,000 (JPY: ¥100).

**Single-invoice payment flow:**
- One invoice covering item cost + service fee + international shipping
- Customer pays once before we purchase anything
- `paid_1_amount` records the payment received

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
| `/brands` | Public | Brand directory with logos |
| `/markets` | Public | Live Twenty Style Korean illustrator markets |
| `/catalogue/sif-v21` | Public | Seoul Illustration Fair V.21 brand catalogue |
| `/catalogue/inventario-2026` | Public | INVENTARIO 2026 brand catalogue |
| `/catalogue/dotdotexpress` | Public | DOTDOTDOT v.7 brand catalogue with interactive booth map |
| `/catalogue/planners-2027` | Public | 2027 planners & diaries (JP + KR), filter by layout/size, order prefill |
| `/planner` | Public | Redirects to `/catalogue/planners-2027` |
| `/policy` | Public | Privacy Policy, Terms of Service, Refund Policy |
| `/order/new` | Public | Customer order form (translated EN/JA/ZH-TW) |
| `/order/[number]` | Public | Order tracking (no login, tracking number links to carrier) |
| `/invoice/[number]` | Public | Customer-facing invoice (print/PDF, single invoice) |
| `/login` | Public | Password login (admins only) |
| `/auth/callback` | Public | Supabase auth handler |
| `/admin` | Admin | Overview stats + welcome by name |
| `/admin/todos` | Admin | Internal todo/ideas list with categories |
| `/admin/orders` | Admin | Order list + filters |
| `/admin/orders/new` | Admin | Create order |
| `/admin/orders/[id]` | Admin | Edit order + timeline + shipped email button |
| `/admin/orders/[id]/invoice` | Admin | Single invoice (auto-detects paid from paid_1_amount) |
| `/admin/finance` | Admin | Finance dashboard (filtered by logged-in admin) |
| `/admin/fairs` | Admin | Manage fairs (url, image_url, catalogue_url fields) |
| `/admin/customers` | Admin | Customer list (pulled from orders table) |
| `/admin/fair-reminders` | Admin | Fair reminder signups by fair + language, Draft email buttons |
| `/admin/subscribers` | Admin | Newsletter list + CSV + Draft newsletter button |
| `/api/orders` | Public POST | Customer order submission |
| `/api/fair-reminder` | Public POST | Save fair reminder (stores lang of user's browser language) |
| `/api/subscribe` | Public POST | Save newsletter subscriber |

---

## Key files

```
app/
  layout.tsx                 fonts, metadata, LangProvider wrapper
  page.tsx                   homepage — fetches fairs + Twenty markets (1hr cache)
  globals.css                CSS vars, keyframes, admin mobile (<768px), carousel animations
  login/page.tsx             password-only login (no magic link)
  auth/callback/page.tsx     redirects all 3 admin emails → /admin
  order/new/page.tsx         customer order form (fully translated)
  order/[number]/page.tsx    public tracking page
  invoice/[number]/page.tsx  customer invoice — single invoice, print/PDF
  brands/page.tsx            brand directory with favicon logos, Japan filter in JA mode
  markets/page.tsx           live Twenty Style markets (fetched server-side)
  catalogue/inventario-2026/page.tsx  INVENTARIO brand catalogue (88 brands, 7 categories)
  catalogue/dotdotexpress/page.tsx    DOTDOTDOT v.7 catalogue (166 brands, interactive booth map,
                                      Instagram embed popup on hover, inline embed per brand card)
  api/orders/route.ts        POST — inserts order via service role
  api/fair-reminder/route.ts POST — stores email + fair info + lang
  api/subscribe/route.ts     POST — upserts into subscribers table
  admin/layout.tsx           requireAdmin gate
  admin/page.tsx             stats + welcome name
  admin/todos/page.tsx       todo list: task/idea/feature/bug/note, drag-to-reorder, split done/active
  admin/orders/[id]/invoice/page.tsx  single invoice admin view
  admin/finance/page.tsx     finance dashboard
  admin/fair-reminders/page.tsx  signups by fair → grouped by language → separate Draft buttons per lang

components/
  Nav.tsx                    fixed nav: Home · Fairs · Markets · Brands · How it works · FAQ
                             + language switcher + mobile hamburger
  Hero.tsx                   market image carousel (2 rows, opposite scroll), live stats
  MarketStrip.tsx            full-width market carousel (standalone, currently unused on homepage)
  TwentyMarketsSection.tsx   market grid section (used on /markets and homepage preview)
  FairTracker.tsx            tabs: Upcoming · Going · Deadline · Saved · All
                             "See catalogue" button auto-shows for INVENTARIO/dotdotdot fairs
  Services.tsx, HowItWorks.tsx, OrderCTA.tsx, FAQ.tsx, Footer.tsx  all translated
  Homepage order: Hero → TrustStrip → PlannersFeature → Services → FeeEstimator → FairTracker
                  → SocialProof (hidden until lib/social-proof.ts has real entries) → FAQ → OrderCTA → Footer
  FeeEstimator.tsx           uses lib/fee.ts serviceFee() — keep in sync with the fee rule above
  Colors/surfaces            one background (var(--cream)) everywhere — see DESIGN.md "Surfaces & text"
  LangProvider.tsx           React context; lang in localStorage 's2j-lang'
  dashboard/DashShell.tsx    flex layout; mobile: column with sticky top nav
  dashboard/DashNav.tsx      desktop sidebar + mobile hamburger
  dashboard/OrderForm.tsx    single payment section (paid_1 only); items with dom_del/total
  dashboard/GmailDraftButton.tsx  Gmail compose modal (createPortal)
  dashboard/ShippedEmailButton.tsx  shipped email with carrier auto-detect
  dashboard/FairForm.tsx     includes url, image_url, catalogue_url fields

lib/
  database.types.ts          all types — see DATA.md
  auth.ts                    requireAdmin() checks all 3 emails; adminWelcomeName()
  i18n.ts                    EN/JA/ZH-TW — nav, hero, services, tracker, how, order, faq,
                             footer, brands, markets, orderForm (full translation)
  brands.ts                  Brand interface with image? and url? for favicon logos
  supabase/client.ts         browser client (anon key)
  supabase/server.ts         createClient (SSR) + createServiceClient (direct, bypasses RLS)
  fairs.ts                   static fallback fairs
```

---

## Critical rules

1. Homepage copy lives in `lib/i18n.ts` (EN + JA + ZH-TW) and was rewritten for conversion on 2026-10-17 (hero: "Korea & Japan won't ship? *We will.*"). `reference.html` copy is no longer binding — edit the i18n strings, and only change homepage copy when the user asks.
2. Every server page/route: `export const runtime = 'edge'`.
3. Never use `usePathname()` in DashShell components — hydration mismatch on CF Edge.
4. Wordmark: `Studio<em>2J</em>` — no image, no SVG.
5. Colors: only the 8 CSS variables in DESIGN.md.
6. Fonts: Fraunces (display/serif), Inter (body/UI).
7. **All admin server pages must use `createServiceClient()` (not `createClient()`)** — bypasses RLS.
8. No emojis in email templates.
9. No Resend — all customer emails drafted via `GmailDraftButton` and sent manually.
10. **Always update i18n.ts (EN + JA + ZH-TW) whenever any text changes.** Japanese copy is Korea-only: no Japan, Tokyo, Loft, Hobonichi, ¥2,500 references.
11. Invoice is now **single** — one invoice covering everything. No more `?type=1|2` on customer-facing invoice.

---

## Admin data access pattern

```ts
import { createServiceClient as createClient } from '@/lib/supabase/server'
```

---

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hclclmdfcswdrdpqtyyl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...    # CF Pages secret
ADMIN_EMAIL=studio2j25@gmail.com
NEXT_PUBLIC_ADMIN_EMAIL=studio2j25@gmail.com
```

---

## Tracking number carrier detection

- Ends in `KR` → Korea Post EMS: `https://service.epost.go.kr/trace.RetrieveEmsRigiTraceList.comm?POST_CODE=`
- Ends in `JP` → Japan Post: `https://trackings.post.japanpost.jp/services/srv/search/?requestNo1=`
- Otherwise → 17track: `https://www.17track.net/en/track#nums=`

---

## Twenty Style market integration

- API: `https://api.twenty.style/common/v2/opened-market` (public, no auth)
- Image CDN: `https://cdn.twenty.style/{marketCover}`
- Market URL: `https://twenty.style/m/{sellerPublicId}/{marketPublicId}`
- Fetched server-side in `page.tsx` with `next: { revalidate: 3600 }` (1-hour cache)
- Filter: remove markets with `테스트` in title
- Used in: Hero carousel (2 rows), `/markets` page, homepage preview section

---

## Catalogue pages

**Rule: always create a new `/catalogue/<slug>/` page for each new fair. Never reuse an existing catalogue page.**

### `/catalogue/sif-v21`
- Seoul Illustration Fair V.21
- Brand grid with search + category filter (no booth map yet)
- Brands stored in `catalogue_brands` table with `catalogue_id = 'sif-v21'`
- Admin: `/admin/catalogue/sif-v21`
- Categories: Illustration, Print & Zine, Art Goods, Stationery, Textile, Craft, Other

### `/catalogue/inventario-2026`
- INVENTARIO 2026 (June 10–14, COEX THE PLATZ HALL, Seoul)
- Interactive booth map + brand grid with Instagram post strips
- Brands stored in `catalogue_brands` table with `catalogue_id = 'inventario-2026'`
- Admin: `/admin/catalogue/inventario-2026`

### `/catalogue/dotdotexpress`
- DOTDOTDOT v.7 — 166 brands synced from official booth layout PDF
- Interactive booth map (A01–K16): hover shows Instagram embed popup
- Brand data hardcoded in `app/catalogue/dotdotexpress/page.tsx`

### `/catalogue/planners-2027`
- Product catalogue (not a fair): 2027 planners/diaries from Japanese and Korean brands
- Data hardcoded in `lib/planners-2027/` — `types.ts`, `japan.ts`, `korea.ts`; `index.ts` sorts picks first
- Photos are **hotlinked** from official brand sites (`referrerPolicy="no-referrer"`, initial-letter fallback on error); every link goes to the official store
- "Order via Studio2J" links to `/order/new?item=…&url=…`, which prefills the first item row
- Fully translated via `t.planners` in `i18n.ts`; feature chips are `FeatureKey`s translated in `planners.features`
- JA mode hides all `country: 'JP'` items and the country filter (rule 10)
- Linked from Nav and Footer

---

## Fair catalogue links

Fairs now have a `catalogue_url` field. FairTracker auto-shows "See catalogue ↗" for:
- Any fair with `catalogue_url` set in DB (takes priority)
- Any fair with "seoul illustration fair" in the name → `/catalogue/sif-v21`
- Any fair with "inventario" in the name → `/catalogue/inventario-2026`
- Any fair with "dotdot" in the name → `/catalogue/dotdotexpress`
- For new fairs: set `catalogue_url` in the fairs table, or add a name match in `FairTracker.tsx`
