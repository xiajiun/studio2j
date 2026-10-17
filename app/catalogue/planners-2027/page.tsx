export const runtime = 'edge'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { PlannersCatalogue } from './PlannersCatalogue'

export const metadata = {
  title: '2027 Planners & Diaries from Korea and Japan — Studio2J',
  description: 'Hobonichi, Jibun Techo, Midori, NOLTY and Korean diary brands for 2027 — browse by layout and size, then let Studio2J buy and ship your planner worldwide.',
  openGraph: {
    title: '2027 Planners & Diaries from Seoul & Tokyo — Studio2J',
    description: 'Planners that only ship within Korea or Japan. Pick one — we buy it and ship it to you.',
  },
}

export default function Planners2027Page() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">
          <PlannersCatalogue />
        </div>
      </main>
      <Footer />
    </>
  )
}
