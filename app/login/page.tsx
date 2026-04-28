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
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const ADMIN_EMAILS = ['studio2j25@gmail.com', 'xiajiun21@gmail.com', 'jovynkw@gmail.com']

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }
    router.push(ADMIN_EMAILS.includes(email) ? '/admin' : '/account')
    router.refresh()
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

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={inputStyle}
            />
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
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
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
      </div>
    </main>
  )
}
