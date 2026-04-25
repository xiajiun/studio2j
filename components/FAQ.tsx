'use client'

import { useState } from 'react'

interface FAQItem {
  q: string
  a: React.ReactNode
}

interface FAQCategory {
  title: string
  items: FAQItem[]
}

const CATEGORIES: FAQCategory[] = [
  {
    title: 'Ordering',
    items: [
      {
        q: 'How do I place an order?',
        a: <>DM us on Instagram <a href="https://www.instagram.com/studio2j25/" target="_blank" rel="noreferrer" style={{ color: 'var(--dark-blue)' }}>@studio2j25</a> with the fair name, artist, or website link you&apos;re interested in. We&apos;ll reply within 24 hours to confirm availability and send an itemised invoice. Once payment clears, we purchase on your behalf.</>,
      },
      {
        q: "What's the service fee?",
        a: 'Minimum ₩25,000 (or ¥2,500 for Japan-based sourcing), or 15% of the total goods value — whichever is higher. This covers our time, transport to the fair or shop, packing materials, and care.',
      },
      {
        q: 'When do I pay?',
        a: '100% upfront, before we purchase. We send an itemised invoice covering item cost, service fee, and estimated international shipping. Payment via PayPal, bank transfer, or Wise.',
      },
      {
        q: 'What if the item is sold out?',
        a: "If something is unavailable when we arrive at the fair or shop, we refund that portion immediately. For proxy buying, we verify stock before invoicing to avoid this.",
      },
    ],
  },
  {
    title: 'Shipping & delivery',
    items: [
      {
        q: 'Where do you ship?',
        a: 'Worldwide. From Seoul for Korean orders and from Tokyo for Japan-based orders. We use Korea Post EMS and Japan Post EMS — the most reliable international services, with tracking.',
      },
      {
        q: 'How long does shipping take?',
        a: 'Typically 7–14 business days from Seoul or Tokyo, depending on destination. North America and Europe are usually on the faster end, South America and Africa slightly longer. Full tracking provided once shipped.',
      },
      {
        q: 'What about customs and duties?',
        a: "Any customs fees or import duties are the buyer's responsibility. We declare the accurate value on all packages. Most stationery orders under $100 rarely incur duties, but we can't guarantee this varies by country.",
      },
      {
        q: 'Is packaging included?',
        a: 'Yes. Every parcel includes protective packaging, tissue paper, and a handwritten thank-you note. We pack stationery flat to prevent bending and wrap fragile items individually.',
      },
    ],
  },
  {
    title: 'Returns & refunds',
    items: [
      {
        q: 'Can I cancel my order?',
        a: "Cancellations are accepted until we've purchased the items. Once we've bought them at the fair or from the website, full refunds are not possible as we cannot return the goods. We'll offer alternatives where possible.",
      },
      {
        q: 'What if my order arrives damaged?',
        a: "Photograph everything as soon as the package arrives — exterior, interior, and damaged items. DM us within 48 hours of delivery. We'll work with the postal service on a claim and compensate you directly once resolved.",
      },
      {
        q: 'Do you accept returns for change of mind?',
        a: "Because we source items specifically for your order, we cannot accept returns for change of mind. If you're unsure about an item, ask us for more photos before confirming — we're happy to share extra details.",
      },
    ],
  },
  {
    title: 'Privacy',
    items: [
      {
        q: 'What data do you collect?',
        a: "Only what's necessary to fulfil your order — name, shipping address, email for order updates, and payment confirmation. We never share your information with third parties. Newsletter subscribers can unsubscribe at any time.",
      },
      {
        q: 'How are payments handled?',
        a: "Through secure third-party services — PayPal, Wise, or direct bank transfer. We never store your payment details. All transactions are processed by these services with their own security standards.",
      },
    ],
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  function toggle(key: string) {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <section id="faq" className="faq-section" style={{ padding: '140px 0', background: 'var(--cream)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '18px',
            color: 'var(--brown)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
          }}>
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginLeft: 'auto' }} />
            Frequently asked
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginRight: 'auto' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 300,
            fontSize: 'clamp(42px, 4.5vw, 64px)',
            lineHeight: '1.04',
            letterSpacing: '-0.03em',
            color: 'var(--dark-brown)',
          }}>
            Everything you<br />might <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>wonder</em>.
          </h2>
        </div>

        <div id="order-form-modal" style={{ maxWidth: '820px', margin: '0 auto' }}>
          {CATEGORIES.map(cat => (
            <div key={cat.title} style={{ marginBottom: '56px' }}>
              <div style={{
                fontFamily: 'var(--font-fraunces), serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: '20px',
                color: 'var(--dark-blue)',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '0.5px solid rgba(122,92,69,0.15)',
              }}>{cat.title}</div>

              {cat.items.map((item, idx) => {
                const key = `${cat.title}-${idx}`
                const isOpen = !!open[key]
                return (
                  <div
                    key={key}
                    className={`faq-item${isOpen ? ' open' : ''}`}
                    onClick={() => toggle(key)}
                    style={{
                      borderBottom: '0.5px solid rgba(122,92,69,0.12)',
                      padding: '22px 0',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                      <span style={{
                        fontFamily: 'var(--font-fraunces), serif',
                        fontWeight: 400,
                        fontSize: '17px',
                        color: 'var(--dark-brown)',
                        letterSpacing: '-0.01em',
                        flex: 1,
                      }}>{item.q}</span>
                      <span className="faq-icon" style={{
                        fontFamily: 'var(--font-fraunces), serif',
                        fontSize: '22px',
                        fontWeight: 300,
                        color: 'var(--brown)',
                        flexShrink: 0,
                      }}>+</span>
                    </div>
                    <div className="faq-a">
                      <div style={{
                        fontFamily: 'var(--font-inter), sans-serif',
                        fontSize: '14px',
                        fontWeight: 300,
                        lineHeight: '1.8',
                        color: 'var(--brown)',
                      }}>{item.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
