# Studio2J — Design System

## Color palette (strict — no additions)

```css
:root {
  --cream:      #F8F8F6;   /* cool off-white background */
  --brown:      #6BA3C8;   /* medium sky blue — secondary text, borders */
  --dark-blue:  #4A8AB5;   /* deep sky blue — "2J" italic, links, accent text */
  --beige:      #E8F4FA;   /* pastel sky tint — card surfaces */
  --tan:        #A8CBE0;   /* soft sky — labels, captions */
  --muted-blue: #3D7AA6;   /* deeper sky — hover states */
  --dark-brown: #2D3748;   /* dark slate — headings, body text, footer, buttons */
  --soft-tan:   #EEF6FB;   /* faintest sky — dividers */
}
```

### Accent palette (badges, highlights)
- Pastel pink:   `#EFB7BE` / tint `#FCE8EA` — urgent / alert
- Butter yellow: `#F3E3A1` / tint `#FBF6DC` — soon / CTA on dark bg
- Mint green:    `#BFDCCF` — live dot, success
- Sky blue:      `#9FC6E5` — open / primary accent

### Deadline chips

```css
.dl-urgent { background: #FCE8EA; color: #8B3A42; border: 0.5px solid rgba(239,183,190,0.5); }
.dl-soon   { background: #FBF6DC; color: #7A6010; border: 0.5px solid rgba(243,227,161,0.7); }
.dl-open   { background: #E8F4FA; color: #2A5070; border: 0.5px solid rgba(159,198,229,0.5); }
.dl-closed { background: var(--beige); color: var(--tan); border: 0.5px solid rgba(207,227,242,0.4); }
```

---

## Typography

Import from Google Fonts via `next/font`:

```tsx
import { Fraunces, Inter } from 'next/font/google'

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
```

### Type scale

| Role        | Font     | Size        | Weight    | Usage                             |
|-------------|----------|-------------|-----------|-----------------------------------|
| Hero title  | Fraunces | clamp(54,6.5vw,92) | 300 | Hero headline (with italic em tag)|
| Section ttl | Fraunces | clamp(42,4.5vw,64) | 300 | Section titles                    |
| H2          | Fraunces | 24–28px     | 400       | Card titles                       |
| Eyebrow     | Fraunces | 18px italic | 300       | Section eyebrows (italic label)   |
| Nav logo    | Fraunces | 26px        | 500       | "Studio" + italic "2J"            |
| Body        | Inter    | 14–16px     | 300       | Paragraphs, descriptions          |
| UI label    | Inter    | 11–13px     | 400–500   | Buttons, pills, tags              |
| Tiny label  | Inter    | 10px        | 500       | Uppercase labels (letter-spacing: 0.08–0.2em, uppercase) |

**The wordmark:** Always render as `<span>Studio<em>2J</em></span>` — the `<em>` gets `font-style: italic` and `color: var(--dark-blue)`. No SVG, no image.

---

## Layout tokens

- Container: `max-width: 1240px; margin: 0 auto; padding: 0 48px`
- Section padding: `140px 0` (desktop), `80px 0` (<1000px)
- Border radius: `18px` fair cards, `20–24px` major cards, `99px` buttons/pills
- Border weight: `0.5px` everywhere (hairlines)

---

## Component patterns

### Primary button
```tsx
className="bg-[var(--dark-blue)] text-[var(--cream)] font-inter text-[13px] font-medium
           tracking-[0.03em] px-8 py-[15px] rounded-full
           hover:bg-[var(--muted-blue)] hover:-translate-y-0.5
           hover:shadow-[0_8px_24px_rgba(31,58,95,0.2)] transition-all"
```

### Secondary button
```tsx
className="border border-[var(--brown)] text-[var(--brown)] font-inter text-[13px]
           font-normal px-7 py-[14px] rounded-full
           hover:bg-[var(--beige)] transition-all"
```

### Gold button (used on dark backgrounds)
```tsx
className="bg-[var(--tan)] text-[var(--dark-brown)] font-inter text-[13px] font-medium
           tracking-[0.03em] px-8 py-[15px] rounded-full
           hover:bg-[var(--cream)] hover:-translate-y-0.5 transition-all"
```

### Section eyebrow (with hairline)
```tsx
<div className="font-fraunces italic font-light text-lg text-[var(--brown)]
                mb-5 flex items-center gap-3.5
                before:content-[''] before:w-10 before:h-px before:bg-[var(--tan)]">
  Our services
</div>
```

### Fair card (default vs featured)
Featured fairs have `border-color: rgba(31,58,95,0.25)` and a soft shadow; default cards have `border: 0.5px solid rgba(122,92,69,0.15)`. Hover translates up 2px.

### Animations
```css
@keyframes fadeUp { from { opacity:0; transform:translateY(24px);} to {opacity:1; transform:translateY(0);} }
@keyframes fadeIn { from { opacity:0;} to {opacity:1;} }
@keyframes marquee { from { transform:translateX(0);} to { transform:translateX(-50%);} }
```

Marquee animation duration: `40s linear infinite`.

---

## Tailwind config additions

```ts
theme: {
  extend: {
    fontFamily: {
      fraunces: ['var(--font-fraunces)', 'serif'],
      inter:    ['var(--font-inter)', 'sans-serif'],
    },
    colors: {
      cream:      '#F5EFE6',
      brown:      '#7A5C45',
      'dark-blue':'#1F3A5F',
      beige:      '#E8DFD1',
      tan:        '#C8A98D',
      'muted-blue':'#4A6A8A',
      'dark-brown':'#4B372A',
    },
  },
}
```

---

## Responsive behavior

Breakpoint at `1000px`:
- Nav links hide (keep logo + CTA)
- Hero goes from 2-col to 1-col
- Services, How, Footer grids collapse to single column
- Section padding shrinks from 140px → 80px

See `reference.html` media queries for exact rules.
