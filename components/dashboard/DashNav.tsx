'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_LINKS = [
  { href: '/admin',                label: 'Overview' },
  { href: '/admin/todos',          label: 'To-do' },
  { href: '/admin/orders',         label: 'Orders' },
  { href: '/admin/finance',        label: 'Finance' },
  { href: '/admin/fairs',          label: 'Fairs' },
  { href: '/admin/customers',      label: 'Customers' },
  { href: '/admin/fair-reminders', label: 'Fair reminders' },
  { href: '/admin/subscribers',    label: 'Subscribers' },
  { href: '/admin/catalogue', label: 'Catalogue' },
  { href: '/admin/shopping',  label: 'Shopping list' },
]

const ACCOUNT_LINKS = [
  { href: '/account', label: 'My orders' },
]

const linkStyle: React.CSSProperties = {
  display: 'block',
  padding: '8px 12px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '13px',
  fontWeight: 300,
  color: 'var(--brown)',
}

export function DashNav({ variant }: { variant: 'admin' | 'account' }) {
  const router = useRouter()
  const links  = variant === 'admin' ? ADMIN_LINKS : ACCOUNT_LINKS
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const wordmark = (
    <Link href="/" style={{ textDecoration: 'none' }}>
      <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
        Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
      </span>
    </Link>
  )

  const navLinks = (
    <>
      {links.map(({ href, label }) => (
        <Link key={href} href={href} style={linkStyle} onClick={() => setMenuOpen(false)}>{label}</Link>
      ))}
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <div className="dash-nav-desktop" style={{
        width: '200px', minWidth: '200px', height: '100vh',
        borderRight: '0.5px solid rgba(122,92,69,0.12)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '0.5px solid rgba(122,92,69,0.08)', flexShrink: 0 }}>
          {wordmark}
        </div>
        <div style={{ padding: '16px 10px', flexShrink: 0 }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', padding: '0 12px', marginBottom: '8px' }}>
            {variant === 'admin' ? 'Admin' : 'Account'}
          </div>
          {navLinks}
        </div>
        {variant === 'admin' && (
          <div style={{ padding: '0 10px', flexShrink: 0, borderTop: '0.5px solid rgba(122,92,69,0.08)', paddingTop: '12px', marginTop: '4px' }}>
            <Link href="/" style={linkStyle}>← Homepage</Link>
          </div>
        )}
        <div style={{ flex: 1 }} />
        <div style={{ padding: '16px 20px', borderTop: '0.5px solid rgba(122,92,69,0.08)', flexShrink: 0 }}>
          <button onClick={signOut} style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Sign out
          </button>
        </div>
      </div>

      {/* ── Mobile top bar ── */}
      <div className="dash-nav-mobile" style={{ display: 'none' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 20px',
          borderBottom: '0.5px solid rgba(122,92,69,0.12)',
          background: 'var(--cream)',
          position: 'sticky', top: 0, zIndex: 50,
        }}>
          {wordmark}
          <button
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', color: 'var(--dark-brown)', padding: '4px', lineHeight: 1 }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <div style={{
            background: 'var(--cream)', borderBottom: '0.5px solid rgba(122,92,69,0.12)',
            padding: '8px 10px',
            position: 'sticky', top: '53px', zIndex: 49,
          }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', padding: '4px 12px 8px' }}>
              {variant === 'admin' ? 'Admin' : 'Account'}
            </div>
            {navLinks}
            <div style={{ borderTop: '0.5px solid rgba(122,92,69,0.08)', marginTop: '8px', paddingTop: '8px' }}>
              <button onClick={signOut} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}>
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
