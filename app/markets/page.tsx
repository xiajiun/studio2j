export const runtime = 'edge'

import type { TwentyMarket } from '@/lib/database.types'
import TwentyMarketsSection from '@/components/TwentyMarketsSection'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { LangProvider } from '@/components/LangProvider'

export default async function MarketsPage() {
  let markets: TwentyMarket[] = []
  try {
    const res = await fetch('https://api.twenty.style/common/v2/opened-market', {
      next: { revalidate: 3600 },
    })
    if (res.ok) markets = await res.json()
  } catch {}

  return (
    <LangProvider>
      <Nav />
      <TwentyMarketsSection markets={markets} standalone />
      <Footer />
    </LangProvider>
  )
}
