'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface NavItem { href: string; label: string; icon: string }

const ADMIN_NAV: NavItem[] = [
  { href: '/admin',              label: 'Overview',     icon: '◈' },
  { href: '/admin/orders',       label: 'Orders',       icon: '◻' },
  { href: '/admin/fairs',        label: 'Fairs',        icon: '◇' },
  { href: '/admin/customers',    label: 'Customers',    icon: '◯' },
  { href: '/admin/subscribers',  label: 'Subscribers',  icon: '◈' },
]

const ACCOUNT_NAV: NavItem[] = [
  { href: '/account', label: 'My orders', icon: '◻' },
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
      width: '220px',
      flexShrink: 0,
      borderRight: '0.5px solid rgba(122,92,69,0.12)',
      padding: '32px 0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <Link href="/" style={{ textDecoration: 'none', padding: '0 24px', marginBottom: '40px', display: 'block' }}>
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
          Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
        </span>
      </Link>

      <div style={{ padding: '0 12px', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--tan)', padding: '0 12px', marginBottom: '8px' }}>
          {variant === 'admin' ? 'Admin' : 'Account'}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {nav.map(({ href, label }) => {
            const active = pathname === href || (href !== '/admin' && href !== '/account' && pathname.startsWith(href))
            return (
              <Link key={href} href={href} style={{
                display: 'block',
                padding: '9px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: active ? 500 : 300,
                color: active ? 'var(--dark-brown)' : 'var(--brown)',
                background: active ? 'var(--beige)' : 'transparent',
                transition: 'all 0.15s',
              }}>
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {variant === 'admin' && (
        <div style={{ padding: '0 12px', marginTop: '16px', borderTop: '0.5px solid rgba(122,92,69,0.1)', paddingTop: '16px' }}>
          <Link href="/" style={{
            display: 'block',
            padding: '9px 12px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '13px',
            fontWeight: 300,
            color: 'var(--brown)',
          }}>
            ← Homepage
          </Link>
        </div>
      )}

      <div style={{ marginTop: 'auto', padding: '16px 24px', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
        <button
          onClick={signOut}
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '12px',
            fontWeight: 300,
            color: 'var(--tan)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
