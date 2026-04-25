# Studio2J — Data

## lib/types.ts

```ts
export type FairType = 'illustration' | 'stationery' | 'zine' | 'art' | 'craft'
export type Region = 'Asia' | 'Europe' | 'North America' | 'Oceania'
export type DeadlineStatus = 'urgent' | 'soon' | 'open' | 'closed'

export interface Fair {
  id: number
  name: string
  city: string
  country: string
  region: Region
  date: string          // ISO YYYY-MM-DD
  deadline: string      // vendor application / Studio2J order deadline
  types: FairType[]
  featured: boolean
  going: boolean        // Studio2J personally attending
  notes?: string        // short italic note ("One of our favourite fairs")
}
```

## lib/fairs.ts

```ts
import { Fair } from './types'

export const FAIRS: Fair[] = [
  { id: 1,  name: 'Illustration Korea COEX',    city: 'Seoul',       country: 'Korea',     region: 'Asia',          date: '2026-04-25', deadline: '2026-04-22', types: ['illustration','stationery'], featured: true,  going: true,  notes: "We're there this week — order window open" },
  { id: 2,  name: 'Stationery Fest',             city: 'Austin',      country: 'USA',       region: 'North America', date: '2026-05-02', deadline: '2026-04-25', types: ['stationery','illustration'], featured: true,  going: false },
  { id: 3,  name: 'BCN Pen & Paper Fest',        city: 'Barcelona',   country: 'Spain',     region: 'Europe',        date: '2026-04-26', deadline: '2026-04-21', types: ['stationery'], featured: false, going: false },
  { id: 4,  name: 'LA Zine Fest',                city: 'Los Angeles', country: 'USA',       region: 'North America', date: '2026-06-06', deadline: '2026-04-26', types: ['zine'], featured: false, going: false },
  { id: 5,  name: 'Printfair Melbourne',         city: 'Melbourne',   country: 'Australia', region: 'Oceania',       date: '2026-06-14', deadline: '2026-04-30', types: ['zine','illustration'], featured: false, going: false },
  { id: 6,  name: 'Hyper Japan Market',          city: 'London',      country: 'UK',        region: 'Europe',        date: '2026-07-10', deadline: '2026-05-01', types: ['illustration','craft'], featured: false, going: false },
  { id: 7,  name: 'SNAP! Edinburgh',             city: 'Edinburgh',   country: 'UK',        region: 'Europe',        date: '2026-07-04', deadline: '2026-05-15', types: ['zine','illustration'], featured: false, going: false },
  { id: 8,  name: 'Washi & Paper Expo',          city: 'Osaka',       country: 'Japan',     region: 'Asia',          date: '2026-08-08', deadline: '2026-06-01', types: ['stationery'], featured: true,  going: true,  notes: 'One of our favourite Japan fairs' },
  { id: 9,  name: "Tokyo Int'l Gift Show",       city: 'Tokyo',       country: 'Japan',     region: 'Asia',          date: '2026-09-02', deadline: '2026-06-15', types: ['stationery','craft'], featured: false, going: true },
  { id: 10, name: 'Illustrative Berlin',         city: 'Berlin',      country: 'Germany',   region: 'Europe',        date: '2026-09-18', deadline: '2026-06-30', types: ['illustration','art'], featured: false, going: false },
  { id: 11, name: 'NY Art Book Fair',            city: 'New York',    country: 'USA',       region: 'North America', date: '2026-10-17', deadline: '2026-07-01', types: ['zine','art'], featured: false, going: false },
  { id: 12, name: 'Grafik Fiera',                city: 'Milan',       country: 'Italy',     region: 'Europe',        date: '2026-10-03', deadline: '2026-07-20', types: ['illustration','art'], featured: false, going: false },
  { id: 13, name: 'Seoul Illustration Fair',     city: 'Seoul',       country: 'Korea',     region: 'Asia',          date: '2026-11-20', deadline: '2026-08-31', types: ['illustration'], featured: true,  going: true,  notes: 'Our biggest haul event of the year' },
  { id: 14, name: 'Paper & Pen Tokyo',           city: 'Tokyo',       country: 'Japan',     region: 'Asia',          date: '2026-11-05', deadline: '2026-09-01', types: ['stationery'], featured: false, going: true },
]

export function getDeadlineStatus(deadline: string, today = new Date()): DeadlineStatus {
  const diff = (new Date(deadline).getTime() - today.getTime()) / 86400000
  if (diff < 0) return 'closed'
  if (diff <= 7) return 'urgent'
  if (diff <= 30) return 'soon'
  return 'open'
}

export function getDeadlineLabel(deadline: string, today = new Date()): string {
  const diff = (new Date(deadline).getTime() - today.getTime()) / 86400000
  if (diff < 0) return 'Passed'
  if (diff <= 7) return `${Math.ceil(diff)}d left`
  if (diff <= 30) return `${Math.ceil(diff)} days`
  return 'Open'
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
```

---

## Filter logic (for FairTracker component)

The tracker supports 6 views (pill buttons):

| View        | Filter                                            |
|-------------|---------------------------------------------------|
| `upcoming`  | Fair date >= today                                |
| `going`     | `fair.going === true`                             |
| `deadline`  | Deadline in future (diff >= 0)                    |
| `saved`     | ID in localStorage `s2j-saved` array              |
| `asia`      | `fair.region === 'Asia'`                          |
| `europe`    | `fair.region === 'Europe'`                        |

Plus a free-text search (matches `name`, `city`, or `country` case-insensitively).

After filtering, fairs are sorted by date ascending and grouped by month using a "Month YYYY" header with a hairline divider.

---

## Stats computed above tracker

```ts
const totalFairs = FAIRS.length
const countries  = new Set(FAIRS.map(f => f.country)).size
const deadlinesSoon = FAIRS.filter(f => {
  const diff = (new Date(f.deadline).getTime() - Date.now()) / 86400000
  return diff >= 0 && diff <= 30
}).length
```

These display as three stats above the tracker with Fraunces 48px numbers.

---

## Email subscription (temporary localStorage)

```ts
// TODO: migrate to Beehiiv or Resend in production
function subscribe(email: string) {
  try {
    const subs = JSON.parse(localStorage.getItem('s2j-subs') || '[]')
    if (!subs.includes(email)) subs.push(email)
    localStorage.setItem('s2j-subs', JSON.stringify(subs))
  } catch {}
}
```

Button flashes "Subscribed ✓" for 3 seconds, then resets.
