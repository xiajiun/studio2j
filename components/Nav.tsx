'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLang } from '@/components/LangProvider'
import type { Lang } from '@/lib/i18n'

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en',    label: 'EN' },
  { code: 'ja',    label: '日本語' },
  { code: 'zh-TW', label: '繁中' },
]

export default function Nav() {
  const [scrolled, setScrolled]       = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const { t, lang, setLang } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/',          label: t.nav.home },
    { href: '/#tracker',  label: t.nav.fairs },
    { href: '/markets',   label: t.nav.markets },
    { href: '/brands',    label: t.nav.brands },
    { href: '/#how',      label: t.nav.howItWorks },
    { href: '/#faq',      label: t.nav.faq },
  ]

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '2px', textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '26px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 400 }}>2J</em>
          </span>
        </Link>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {links.map(({ href, label }) => (
            <a key={href} href={href} className="nav-link-item" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, letterSpacing: '0.02em', color: 'var(--brown)', textDecoration: 'none', position: 'relative', transition: 'color 0.2s' }}>
              {label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMobileOpen(o => !o)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', color: 'var(--dark-brown)', padding: '4px', lineHeight: 1 }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>

        {/* Right side: lang switcher + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {LANGS.map(({ code, label }, i) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '11px',
                  fontWeight: lang === code ? 500 : 300,
                  color: lang === code ? 'var(--dark-brown)' : 'var(--tan)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 6px',
                  borderRight: i < LANGS.length - 1 ? '0.5px solid rgba(122,92,69,0.2)' : 'none',
                  transition: 'color 0.15s',
                  letterSpacing: '0.02em',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <a href="/order/new" className="nav-cta-btn" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em', padding: '10px 22px', borderRadius: '99px', textDecoration: 'none', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
            {t.nav.placeOrder}
          </a>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="nav-mobile-menu" style={{
          position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 998,
          background: 'rgba(245,239,230,0.98)', backdropFilter: 'blur(12px)',
          borderBottom: '0.5px solid rgba(122,92,69,0.12)',
          padding: '12px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: '2px',
        }}>
          {links.map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMobileOpen(false)} style={{
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300,
              color: 'var(--brown)', textDecoration: 'none',
              padding: '10px 0', borderBottom: '0.5px solid rgba(122,92,69,0.06)',
            }}>{label}</a>
          ))}
          <a href="/order/new" onClick={() => setMobileOpen(false)} style={{
            display: 'inline-block', marginTop: '12px',
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
            background: 'var(--dark-blue)', color: 'var(--cream)',
            padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', textAlign: 'center',
          }}>{t.nav.placeOrder}</a>
        </div>
      )}
    </nav>
  )
}
