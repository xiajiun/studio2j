export const runtime = 'edge'

import type { TwentyMarket } from '@/lib/database.types'
import TwentyMarketsSection from '@/components/TwentyMarketsSection'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default async function MarketsPage() {
  let markets: TwentyMarket[] = []
  try {
    const res = await fetch('https://twenty.style/api/common/v2/market?category=open&limit=100', {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      markets = Array.isArray(data) ? data : (data.items ?? [])
    }
  } catch {}

  return (
    <>
      <Nav />
      <TwentyMarketsSection markets={markets} standalone />
      <Footer />
    </>
  )
}
