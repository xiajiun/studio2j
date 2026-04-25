# Studio2J — Claude Code Brief

You are building the Studio2J production website. A complete, working prototype lives in `reference.html` — it is the **single source of truth** for design, copy, colors, typography, layout, data, and behavior. Your job is to convert it into a production Next.js 14 app with the same look, feel, and content.

---

## About Studio2J

Studio2J is a Seoul + Tokyo based personal shopping service, founded 2025.

**The positioning (important — proxy is primary, fairs are the trust signal):**
1. **Proxy buying is the main product.** Customers send us a link from Twenty, Rakuten, or any region-locked Korean/Japanese website, and we buy it on their behalf and ship worldwide.
2. **Fair hauls are secondary but strategic.** We physically attend illustration and stationery fairs in Korea and Japan. The live fair tracker on the site serves as social proof that we're actually on the ground — not just another online proxy reseller.
3. **Personal requests are the third service.** Bespoke sourcing for specific artists, out-of-stock items, or niche Korean/Japanese brands.

**Service fee:** Minimum ₩25,000 (or ¥2,500 for Japan-based sourcing), or 15% of total goods value — whichever is higher.

**Locations:** Seoul, Korea + Tokyo, Japan. Ships worldwide.

**Socials:**
- Instagram: https://www.instagram.com/studio2j25/
- Threads: https://www.threads.com/@studio2j25
- Email: studio2j25@gmail.com

---

## Tech stack

**Phase 1 (homepage):**
- Framework: Next.js 14 (App Router, TypeScript)
- Styling: Tailwind CSS + CSS variables
- Fonts: Google Fonts — Fraunces (display) + Inter (body)
- Deployment: Vercel (free tier)
- No database — fairs data is a static TypeScript file
- Email capture: localStorage fallback

**Phase 2 (dashboards — see DASHBOARDS.md):**
- Database: Supabase (Postgres + Auth + Storage, free tier)
- Authentication: Supabase magic link (passwordless, optional for customers)
- Email: Resend API for notifications (free 100/day)
- Migration: Move fairs from static file to Supabase `fairs` table

---

## File structure to create

```
studio2j/
├── CLAUDE.md                     # this file
├── reference.html                # design/copy reference — keep this
├── DESIGN.md                     # design system
├── DATA.md                       # fairs data + types
├── BUILD.md                      # phase 1 build guide
├── DASHBOARDS.md                 # phase 2 — admin + customer dashboards
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── .env.local                    # phase 2 — Supabase keys
├── app/
│   ├── layout.tsx                # fonts, metadata
│   ├── page.tsx                  # homepage
│   ├── globals.css
│   ├── login/                    # phase 2
│   ├── auth/callback/            # phase 2
│   ├── account/                  # phase 2 — customer dashboard
│   └── admin/                    # phase 2 — admin dashboard
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Marquee.tsx
│   ├── FairTracker.tsx
│   ├── HowItWorks.tsx
│   ├── OrderCTA.tsx
│   ├── FAQ.tsx
│   ├── Footer.tsx
│   └── dashboard/                # phase 2
└── lib/
    ├── fairs.ts                  # phase 1 — static; phase 2 — Supabase fetcher
    ├── types.ts
    ├── supabase/                 # phase 2
    └── auth.ts                   # phase 2
```

---

## Page structure (strict order, matches reference.html)

1. **Nav** (fixed, transparent → backdrop-blur on scroll)
2. **Hero** — proxy-first headline, trust stats, active orders preview
3. **Services** — proxy buying (01) → fair hauls (02) → personal requests (03) → service fee note
4. **Marquee** — scrolling fair names (transition, not primary content)
5. **Fair Tracker** — reframed as "Why you can trust us" with live fair list + email alerts signup
6. **How it works** — 3 steps (send link → confirm invoice → ship)
7. **Order CTA** — dark blue section, "Send us a link"
8. **FAQ** — 4 categories: Ordering, Shipping & Delivery, Returns & Refunds, Privacy
9. **Footer** — brand + 3 columns (Explore, Connect, Based in)

---

## Non-negotiable rules

1. **Every word of copy in `reference.html` must be preserved exactly.** Do not rewrite, paraphrase, or "improve" headlines, body copy, service descriptions, FAQ answers, or button labels. Copy is carefully tuned.
2. **Fonts must render exactly like the reference.** Fraunces for serif/display (including italics used for emphasis); Inter for all body/UI text.
3. **Colors are strict — only use the palette defined in DESIGN.md.** No new colors, no off-palette additions.
4. **Do not add a logo image.** The "Studio2J" wordmark is pure typography — Fraunces regular "Studio" + Fraunces italic "2J" with dark blue color.
5. **The fair tracker must save favorites to localStorage** and persist across reloads (`s2j-saved` key, JSON array of fair IDs).
6. **Email signup writes to localStorage** (`s2j-subs` key) for now. A TODO comment should mark it for migration to Beehiiv/Resend later.

---

## How to work

1. Read `reference.html` first — it's the working spec for the homepage.
2. Read `DESIGN.md` for the design system (colors, fonts, spacing, component styles).
3. Read `DATA.md` for fairs data + TypeScript types.
4. Read `BUILD.md` for step-by-step homepage build instructions.
5. **Read `DASHBOARDS.md`** for the optional admin + customer dashboards (build this AFTER the homepage works).
6. Run `npm run dev` after each component to verify visually against `reference.html`.

The goal is pixel-similar fidelity to the reference, not a reinterpretation.

---

## Project phases

**Phase 1 — Homepage (start here)**
Build the public site per `BUILD.md`. Static fairs data, localStorage favorites and email signup. Deploy to Vercel.

**Phase 2 — Dashboards (DASHBOARDS.md)**
Add Supabase, magic link auth, customer order tracking, admin content management. Customer accounts are **optional** — the DM-based ordering flow stays the same.
