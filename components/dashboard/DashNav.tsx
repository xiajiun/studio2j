'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ADMIN_NAV = [
  { href: '/admin',             label: 'Overview' },
  { href: '/admin/orders',      label: 'Orders' },
  { href: '/admin/fairs',       label: 'Fairs' },
  { href: '/admin/customers',   label: 'Customers' },
  { href: '/admin/subscribers', label: 'Subscribers' },
]

const ACCOUNT_NAV = [
  { href: '/account', label: 'My orders' },
]

export function DashNav({ variant }: { variant: 'admin' | 'account' }) {
  const pathname = usePathname()
  const router   = useRouter()
  const nav      = variant === 'admin' ? ADMIN_NAV : ACCOUNT_NAV

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside style={{
      width: '200px',
      flexShrink: 0,
      borderRight: '0.5px solid rgba(122,92,69,0.12)',
      height: '100vh',
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* Wordmark */}
      <div style={{ padding: '28px 20px 24px', borderBottom: '0.5px solid rgba(122,92,69,0.08)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '19px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          </span>
        </Link>
      </div>

      {/* Nav section */}
      <div style={{ flex: 1, padding: '16px 10px', overflowY: 'auto' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', padding: '4px 10px', marginBottom: '6px' }}>
          {variant === 'admin' ? 'Admin' : 'Account'}
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {nav.map(({ href, label }) => {
            const active = href === '/admin' || href === '/account'
              ? pathname === href
              : pathname.startsWith(href)
            return (
              <Link key={href} href={href} style={{
                display: 'block',
                padding: '8px 10px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: active ? 500 : 300,
                color: active ? 'var(--dark-brown)' : 'var(--brown)',
                background: active ? 'var(--beige)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                {label}
              </Link>
            )
          })}
        </nav>

        {variant === 'admin' && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
            <Link href="/" style={{
              display: 'block', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none',
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)',
            }}>
              ← Homepage
            </Link>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div style={{ padding: '16px 20px', borderTop: '0.5px solid rgba(122,92,69,0.08)' }}>
        <button onClick={signOut} style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300,
          color: 'var(--tan)', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        }}>
          Sign out
        </button>
      </div>

    </aside>
  )
}
