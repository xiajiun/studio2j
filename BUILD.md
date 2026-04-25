# Studio2J — Build guide

Follow these steps in order. Run `npm run dev` after each step and compare against `reference.html`.

---

## Step 1 — Scaffold

```bash
npx create-next-app@latest studio2j --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd studio2j
```

Choose: TypeScript yes, ESLint yes, Tailwind yes, `src/` directory no, App Router yes, customise import alias yes (`@/*`).

Copy these docs into the project root:
- `CLAUDE.md`
- `DESIGN.md`
- `DATA.md`
- `BUILD.md`
- `reference.html`

---

## Step 2 — Fonts + global styles

Edit `app/layout.tsx`:

```tsx
import { Fraunces, Inter } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300','400','500','600'],
  style: ['normal','italic'],
  variable: '--font-fraunces',
  axes: ['opsz','SOFT'],
})
const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','500','600'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Studio2J — Korean and Japanese shops, delivered',
  description: 'Proxy buying and fair haul service from Seoul and Tokyo. Founded 2025.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

Replace `app/globals.css` with the CSS from `reference.html`'s `<style>` tag — but scope it so Tailwind's `@tailwind base` still applies. Start the file with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --cream:      #F5EFE6;
  --brown:      #7A5C45;
  --dark-blue:  #1F3A5F;
  --beige:      #E8DFD1;
  --tan:        #C8A98D;
  --muted-blue: #4A6A8A;
  --dark-brown: #4B372A;
  --soft-tan:   #D8CFC0;
}

body {
  background: var(--cream);
  color: var(--dark-brown);
  font-family: var(--font-inter), system-ui, sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

/* Paste all keyframes, .serif utility, scrollbar styles, and animation classes from reference.html */
```

---

## Step 3 — Tailwind config

Update `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['var(--font-fraunces)', 'serif'],
        inter:    ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        cream:       '#F5EFE6',
        brown:       '#7A5C45',
        'dark-blue': '#1F3A5F',
        beige:       '#E8DFD1',
        tan:         '#C8A98D',
        'muted-blue':'#4A6A8A',
        'dark-brown':'#4B372A',
      },
    },
  },
  plugins: [],
}
export default config
```

---

## Step 4 — lib files

Create `lib/types.ts` and `lib/fairs.ts` from `DATA.md` (copy exactly).

---

## Step 5 — Build components in this order

Always copy the markup/copy from `reference.html` verbatim — only the wrapper becomes a React component. Use `className` with the same Tailwind/utility classes or inline styles as the reference.

1. **`components/Nav.tsx`** — use `'use client'`; add a scroll listener that toggles a `.scrolled` class on the nav when `window.scrollY > 30`. The logo is a Link with `Studio<em>2J</em>` in Fraunces — no image.
2. **`components/Hero.tsx`** — static server component. Two-column grid: left has eyebrow + headline + body + CTAs + trust stats, right has the dark-blue panel with 3 active-order preview cards.
3. **`components/Services.tsx`** — static. 3 service cards (proxy → fair → personal), then the dark-brown fee note strip.
4. **`components/Marquee.tsx`** — static. Two copies of the fair name list concatenated for seamless loop.
5. **`components/FairTracker.tsx`** — `'use client'`. Imports FAIRS from `lib/fairs.ts`. Useable state: `view` (default 'upcoming'), `search` (string), `saved` (Set<number>). Load saved IDs from localStorage on mount. Render filtered + sorted + month-grouped list. Includes the email alerts box at the bottom.
6. **`components/HowItWorks.tsx`** — static. 3 step cards on beige background.
7. **`components/OrderCTA.tsx`** — static. Dark-blue section with 2-col grid.
8. **`components/FAQ.tsx`** — `'use client'`. Accordion pattern: toggle `.open` class on click. 4 categories with the exact questions and answers from `reference.html`.
9. **`components/Footer.tsx`** — static.

---

## Step 6 — Compose the homepage

`app/page.tsx`:

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Marquee from '@/components/Marquee'
import FairTracker from '@/components/FairTracker'
import HowItWorks from '@/components/HowItWorks'
import OrderCTA from '@/components/OrderCTA'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Services />
      <Marquee />
      <FairTracker />
      <HowItWorks />
      <OrderCTA />
      <FAQ />
      <Footer />
    </>
  )
}
```

**Order is strict — Services before Marquee before FairTracker.**

---

## Step 7 — Verify

Run `npm run dev` and open `http://localhost:3000`. Open `reference.html` side by side. Check:

- [ ] Fonts render as Fraunces (serif) and Inter (sans-serif)
- [ ] Wordmark is pure typography, no logo image
- [ ] Section order: Hero → Services → Marquee → Fair Tracker → How → Order CTA → FAQ → Footer
- [ ] Hero headline reads "Korean and Japanese shops, *delivered.*"
- [ ] Services order: proxy (01) → fair (02) → personal (03)
- [ ] Fair tracker "We're attending" filter works
- [ ] Save button persists across page reloads
- [ ] Email signup shows "Subscribed ✓" on submit
- [ ] FAQ accordions expand/collapse
- [ ] Responsive below 1000px
- [ ] All social links work: @studio2j25 Instagram, Threads, mailto:studio2j25@gmail.com

---

## Step 8 — Deploy

```bash
git init && git add . && git commit -m "Initial Studio2J site"
# Create GitHub repo, push
# Go to vercel.com, import repo, deploy
```

Free on Vercel — live at `studio2j.vercel.app` in under 2 minutes. Buy a domain later (e.g. studio2j.com) and point it via Vercel's domain settings.

---

## Later improvements (post-launch)

1. Replace localStorage email subscription with Beehiiv or Resend API
2. Add OG image for social sharing (`public/og.png`)
3. Add Korean / Japanese language toggle
4. Move fairs data to a CMS (Sanity, Notion API) for non-technical updates
5. Add `/admin` route for managing fairs without editing code
6. Add 3D room feature (separate project — use `three.js`, see earlier spec)
