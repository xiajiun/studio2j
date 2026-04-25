'use client'

export const runtime = 'edge'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 20px',
  borderRadius: '99px',
  border: '0.5px solid rgba(122,92,69,0.2)',
  background: 'white',
  color: 'var(--dark-brown)',
  fontFamily: 'var(--font-inter), sans-serif',
  fontSize: '14px',
  fontWeight: 300,
  outline: 'none',
}

export default function Login() {
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [sent,     setSent]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    if (password) {
      // Email + password login (admin)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Incorrect email or password.')
        setLoading(false)
        return
      }
      router.push(email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? '/admin' : '/account')
      router.refresh()
    } else {
      // Magic link (customers)
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      })
      setSent(true)
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ maxWidth: '420px', width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', marginBottom: '48px', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          </div>
        </Link>

        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '40px', color: 'var(--dark-brown)', marginBottom: '12px', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Sign <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>in</em>.
        </h1>

        {sent ? (
          <div style={{ padding: '20px 24px', background: 'var(--beige)', borderRadius: '14px', border: '0.5px solid rgba(122,92,69,0.15)' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', color: 'var(--dark-brown)', marginBottom: '6px' }}>Check your inbox ✓</div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>
              Magic link sent to <strong style={{ fontWeight: 500 }}>{email}</strong>. Expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
            <input
              type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password (admin only — leave empty for magic link)"
              style={inputStyle}
            />

            {error && (
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', color: '#8A3A20', padding: '0 4px' }}>
                {error}
              </p>
            )}

            <button
              type="submit" disabled={loading}
              style={{
                background: 'var(--dark-blue)', color: 'var(--cream)',
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
                letterSpacing: '0.03em', padding: '15px 32px', borderRadius: '99px',
                border: 'none', cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1, transition: 'all 0.2s', marginTop: '4px',
              }}
            >
              {loading ? 'Signing in…' : password ? 'Sign in' : 'Send magic link'}
            </button>

            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', textAlign: 'center', marginTop: '4px' }}>
              Customers: leave the password empty to get a magic link
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
