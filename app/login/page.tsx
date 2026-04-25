'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
    setLoading(false)
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
          Welcome <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>back</em>.
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, color: 'var(--brown)', marginBottom: '36px', lineHeight: 1.7 }}>
          Enter your email — we&apos;ll send you a magic link. No password needed.
        </p>

        {sent ? (
          <div style={{ padding: '20px 24px', background: 'var(--beige)', borderRadius: '14px', border: '0.5px solid rgba(122,92,69,0.15)' }}>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '18px', color: 'var(--dark-brown)', marginBottom: '6px' }}>Check your inbox ✓</div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.7 }}>
              We sent a magic link to <strong style={{ fontWeight: 500 }}>{email}</strong>. The link expires in 1 hour.
            </p>
          </div>
        ) : (
          <form onSubmit={send} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                padding: '14px 20px',
                borderRadius: '99px',
                border: '0.5px solid rgba(122,92,69,0.2)',
                background: 'white',
                color: 'var(--dark-brown)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '14px',
                fontWeight: 300,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--dark-blue)',
                color: 'var(--cream)',
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                letterSpacing: '0.03em',
                padding: '15px 32px',
                borderRadius: '99px',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Sending…' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
