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
