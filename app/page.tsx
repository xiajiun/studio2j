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
import type { FairRow } from '@/lib/database.types'
import { AuthRedirect } from '@/components/AuthRedirect'

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
      notes: f.notes ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }

  return (
    <>
      <AuthRedirect />
      <Nav />
      <Hero
        fairCount={fairs.length}
        countryCount={new Set(fairs.map(f => f.country)).size}
      />
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
