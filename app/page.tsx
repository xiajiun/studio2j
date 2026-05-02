export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Marquee from '@/components/Marquee'
import FairTracker from '@/components/FairTracker'
import HowItWorks from '@/components/HowItWorks'
import OrderCTA from '@/components/OrderCTA'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { FAIRS } from '@/lib/fairs'
import type { FairRow, TwentyMarket } from '@/lib/database.types'
import { AuthRedirect } from '@/components/AuthRedirect'
import MarketStrip from '@/components/MarketStrip'

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
      url:        null,
      image_url:  null,
      notes:      f.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }

  // Fetch Twenty Style online markets (cached 1 hour)
  let twentyMarkets: TwentyMarket[] = []
  try {
    const res = await fetch('https://api.twenty.style/common/v2/opened-market', {
      next: { revalidate: 3600 },
    })
    if (res.ok) twentyMarkets = await res.json()
  } catch {}

  const today = new Date()
  const nextFair = fairs
    .filter(f => f.going && new Date(f.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null

  return (
    <>
      <AuthRedirect />
      <Nav />
      <Hero
        fairCount={fairs.length}
        countryCount={new Set(fairs.map(f => f.country)).size}
        nextFair={nextFair}
      />
      <MarketStrip markets={twentyMarkets} />
      <Services />
      <Marquee />
      <FairTracker fairs={fairs} />
      <HowItWorks />
      <OrderCTA />
      <FAQ />
      <Footer />
    </>
  )
}
