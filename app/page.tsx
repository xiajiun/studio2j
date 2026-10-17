export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import FairTracker from '@/components/FairTracker'

import OrderCTA from '@/components/OrderCTA'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { FAIRS } from '@/lib/fairs'
import type { FairRow, TwentyMarket } from '@/lib/database.types'
import { AuthRedirect } from '@/components/AuthRedirect'
import TrustStrip from '@/components/TrustStrip'
import PlannersFeature, { type PlannerTeaser } from '@/components/PlannersFeature'
import FeeEstimator from '@/components/FeeEstimator'
import SocialProof from '@/components/SocialProof'
import { PLANNERS_2027 } from '@/lib/planners-2027'
import { fetchFurukawashikoNewArrivals } from '@/lib/furukawashiko'

// Homepage "Planner season" teaser: these four first, then other picks alternating Korea / Japan.
// JA mode keeps only Korean ones (PlannersFeature filters), so it shows the Korean pins + next Korean picks.
const TEASER_IDS = ['kr-analoguekeeper-space-diary', 'jp-hobonichi-original', 'kr-beesket-the-present-diary', 'jp-midori-md-notebook-diary']
const TEASER_SKIP = ['kr-ardium-planner-m']

function plannerTeasers(): PlannerTeaser[] {
  const bound = PLANNERS_2027.filter(p => p.pick && !p.binder && !TEASER_SKIP.includes(p.id))
  const pinned = TEASER_IDS.map(id => PLANNERS_2027.find(p => p.id === id)).filter(Boolean) as typeof bound
  const rest = bound.filter(p => !TEASER_IDS.includes(p.id))
  const kr = rest.filter(p => p.country === 'KR')
  const jp = rest.filter(p => p.country === 'JP')
  const ordered = [...pinned]
  for (let i = 0; i < Math.max(kr.length, jp.length); i++) {
    for (const p of [kr[i], jp[i]]) if (p) ordered.push(p)
  }
  return ordered.map(p => ({ id: p.id, brand: p.brand, name: p.name, country: p.country, image: p.image, url: p.url, price: p.price, dated: p.dated }))
}


export default async function Home() {
  // Fetch from Supabase; fall back to static data if DB not seeded yet
  let fairs: FairRow[] = []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('fairs')
      .select('*')
      .order('date', { ascending: true })
    if (data && data.length > 0) {
      fairs = data
    }
  } catch {}

  // Fall back to static lib/fairs.ts if Supabase returns nothing
  if (fairs.length === 0) {
    fairs = FAIRS.map(f => ({
      ...f,
      kind:          null,
      url:           null,
      image_url:     null,
      catalogue_url: null,
      notes:         f.notes ?? null,
      created_at:    new Date().toISOString(),
      updated_at:    new Date().toISOString(),
    }))
  }

  // Fetch Twenty Style online markets (cached 1 hour)
  let twentyMarkets: TwentyMarket[] = []
  try {
    const res = await fetch('https://twenty.style/api/common/v2/market?category=open&limit=100', {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      twentyMarkets = Array.isArray(data) ? data : (data.items ?? [])
    }
  } catch {}

  // Furukawashiko new arrivals carousel (cached 1 hour, same as Twenty)
  const furukawashikoNew = await fetchFurukawashikoNewArrivals()

  return (
    <>
      <AuthRedirect />
      <Nav />
      <Hero
        markets={twentyMarkets}
        fairCount={fairs.length}
        marketCount={twentyMarkets.filter(m => !m.market_name.includes('테스트')).length}
        shopSlides={furukawashikoNew}
      />
      <TrustStrip />
      <PlannersFeature picks={plannerTeasers()} />
      <Services />
      <FeeEstimator />
      <FairTracker fairs={fairs} />
      <SocialProof />
      <FAQ />
      <OrderCTA />
      <Footer />
    </>
  )
}
