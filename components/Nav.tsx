'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="#top" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
          <span style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontSize: '26px',
            fontWeight: 500,
            color: 'var(--dark-brown)',
            letterSpacing: '-0.02em',
          }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 400 }}>2J</em>
          </span>
        </Link>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          {[
            { href: '#services', label: 'Services' },
            { href: '#tracker',  label: 'Fairs' },
            { href: '#how',      label: 'How it works' },
            { href: '#faq',      label: 'FAQ' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="nav-link-item"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: 400,
                letterSpacing: '0.02em',
                color: 'var(--brown)',
                textDecoration: 'none',
                position: 'relative',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="/order/new"
          className="nav-cta-btn"
          style={{
            background: 'var(--dark-blue)',
            color: 'var(--cream)',
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            padding: '10px 22px',
            borderRadius: '99px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}
        >
          Place an order
        </a>
      </div>
    </nav>
  )
}
