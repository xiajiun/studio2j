export const runtime = 'edge'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const LAST_UPDATED = 'June 2026'

export default function PolicyPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '12px' }}>
              Legal
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '48px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
              Policies
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--tan)', lineHeight: 1.7, margin: 0 }}>
              Last updated: {LAST_UPDATED} · Questions? Email <a href="mailto:studio2j25@gmail.com" style={{ color: 'var(--dark-blue)', textDecoration: 'none' }}>studio2j25@gmail.com</a>
            </p>
          </div>

          {/* Jump links */}
          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '64px' }}>
            {[
              { href: '#privacy',  label: 'Privacy Policy' },
              { href: '#terms',    label: 'Terms of Service' },
              { href: '#refunds',  label: 'Refund Policy' },
            ].map(({ href, label }) => (
              <a key={href} href={href} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)', textDecoration: 'none', padding: '8px 18px', borderRadius: '99px', border: '0.5px solid rgba(122,92,69,0.2)', background: 'white' }}>
                {label}
              </a>
            ))}
          </nav>

          {/* Privacy Policy */}
          <Section id="privacy" title="Privacy Policy">
            <P>Studio2J ("we", "us") operates the personal shopping service at studio2j.pages.dev. This policy explains what personal data we collect and how we use it.</P>

            <H3>What we collect</H3>
            <ul style={ulStyle}>
              <li>Name and email address provided when placing an order or signing up for fair reminders</li>
              <li>Shipping address for orders that include international delivery</li>
              <li>Order details: items requested, payment records, and order status history</li>
              <li>Language preference stored locally in your browser</li>
            </ul>

            <H3>How we use it</H3>
            <ul style={ulStyle}>
              <li>To process and fulfil your order, and to send you shipping updates</li>
              <li>To contact you about upcoming fairs you have requested reminders for</li>
              <li>To send our newsletter if you have subscribed (you can unsubscribe at any time by emailing us)</li>
            </ul>

            <H3>Who we share it with</H3>
            <P>We do not sell or share your personal data with third parties for marketing. Your data is stored securely in our database (Supabase) and served via Cloudflare Pages. Shipping address is shared with the relevant carrier when your order is dispatched.</P>

            <H3>How long we keep it</H3>
            <P>Order records are kept for a minimum of 3 years for accounting purposes. You may request deletion of your data at any time by emailing us, subject to any legal retention requirements.</P>

            <H3>Your rights</H3>
            <P>You have the right to access, correct, or request deletion of your personal data. Contact us at <a href="mailto:studio2j25@gmail.com" style={linkStyle}>studio2j25@gmail.com</a> and we will respond within 30 days.</P>
          </Section>

          <Divider />

          {/* Terms of Service */}
          <Section id="terms" title="Terms of Service">
            <P>By placing an order with Studio2J you agree to the following terms. Please read them carefully before submitting a request.</P>

            <H3>What we do</H3>
            <P>Studio2J is a personal shopping proxy service. We purchase items on your behalf from Korean and Japanese markets, fairs, and retailers, and ship them to your address internationally. We are not the seller of the goods — we act as your agent.</P>

            <H3>Pricing and fees</H3>
            <ul style={ulStyle}>
              <li><strong>Service fee:</strong> 15% of the total goods value, with a minimum of ₩25,000 (KRW orders) or ¥2,500 (JPY orders), rounded up to the nearest ₩1,000 / ¥100.</li>
              <li><strong>Runner / transportation fee:</strong> Applies to fair haul orders and in-store personal requests where we travel specifically to purchase on your behalf. The fee is confirmed per order before payment and is split across all customers attending the same fair where applicable. It is charged in addition to the service fee.</li>
              <li><strong>International shipping:</strong> Quoted and confirmed per order based on weight and destination.</li>
            </ul>

            <H3>Payment</H3>
            <P>All orders are covered by a single invoice (goods + service fee + runner fee if applicable + international shipping). Full payment is required before we purchase any items. We do not hold stock — purchases are made only after payment is received.</P>

            <H3>Item availability</H3>
            <P>We cannot guarantee that items will be available at the time of purchase. If an item sells out before we can secure it, we will notify you and arrange a refund for that item. The service fee on unavailable items is not charged.</P>

            <H3>Currency and exchange rates</H3>
            <P>Invoices are issued in either KRW or JPY depending on the order. If you pay in another currency, exchange rate fluctuations between invoice issue and payment receipt are not our responsibility.</P>

            <H3>Cancellation</H3>
            <ul style={ulStyle}>
              <li><strong>Before purchase:</strong> You may cancel at any time before we have purchased your items. A full refund will be issued.</li>
              <li><strong>After purchase:</strong> Once items have been purchased on your behalf, the order cannot be cancelled. Items cannot be returned to the original seller on your behalf.</li>
            </ul>

            <H3>Liability</H3>
            <P>Studio2J is not liable for damage caused by carriers during international shipping, customs delays, duties or taxes charged by your country's customs authority, or items being discontinued or unavailable after your order is placed.</P>
          </Section>

          <Divider />

          {/* Refund Policy */}
          <Section id="refunds" title="Refund Policy">
            <P>Because we purchase items specifically on your behalf, our ability to offer returns or refunds is limited by the policies of the original seller. Please read this section before placing an order.</P>

            <H3>Item not available</H3>
            <P>If an item sells out or is unavailable when we attempt to purchase it, we will refund the cost of that item in full, and no service fee is charged for it.</P>

            <H3>Damaged in transit</H3>
            <P>If your order arrives damaged due to a shipping issue, please email us with photos within 7 days of receipt. We will assess each case individually and work with the carrier to resolve it.</P>

            <H3>Wrong or missing item</H3>
            <P>If you receive the wrong item or an item is missing from your package, contact us immediately. We will do our best to resolve the issue, which may include a partial refund or a credit toward a future order.</P>

            <H3>Change of mind</H3>
            <P>We are unable to accept returns or issue refunds for change of mind once items have been purchased. Please make sure you are certain about your order before payment.</P>

            <H3>How to request a refund</H3>
            <P>Email <a href="mailto:studio2j25@gmail.com" style={linkStyle}>studio2j25@gmail.com</a> with your order number and a description of the issue. We aim to respond within 2 business days.</P>
          </Section>

        </div>
      </main>
      <Footer />
    </>
  )
}

const ulStyle: React.CSSProperties = {
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '14px',
  fontWeight: 300,
  color: 'var(--dark-brown)',
  lineHeight: 1.8,
  paddingLeft: '20px',
  margin: '0 0 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--dark-blue)',
  textDecoration: 'none',
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ marginBottom: '64px', scrollMarginTop: '100px' }}>
      <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '32px', color: 'var(--dark-brown)', letterSpacing: '-0.02em', margin: '0 0 28px' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--tan)', margin: '28px 0 10px' }}>
      {children}
    </h3>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--dark-brown)', lineHeight: 1.8, margin: '0 0 16px' }}>
      {children}
    </p>
  )
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: '0.5px solid rgba(122,92,69,0.15)', margin: '0 0 64px' }} />
}
