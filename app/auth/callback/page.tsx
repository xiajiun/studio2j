'use client'

export const runtime = 'edge'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'studio2j25@gmail.com'

export default function AuthCallback() {
  const router      = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()
    const hash     = window.location.hash
    const order    = searchParams.get('order')

    async function handle() {
      // Implicit flow: token in URL hash (#access_token=...)
      if (hash.includes('access_token')) {
        const params        = new URLSearchParams(hash.substring(1))
        const access_token  = params.get('access_token')
        const refresh_token = params.get('refresh_token')
        if (access_token && refresh_token) {
          const { data: { session } } = await supabase.auth.setSession({ access_token, refresh_token })
          if (session) return redirect(session.user.email, order)
        }
      }

      // PKCE flow: code in query string (?code=...)
      const code = searchParams.get('code')
      if (code) {
        const { data: { session } } = await supabase.auth.exchangeCodeForSession(code)
        if (session) return redirect(session.user.email, order)
      }

      // Fallback: already have a session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) return redirect(session.user.email, order)

      router.push('/login')
    }

    function redirect(email: string | undefined, order: string | null) {
      if (email === ADMIN_EMAIL) return router.push('/admin')
      if (order) return router.push(`/account/orders/${order}`)
      return router.push('/account')
    }

    handle()
  }, [router, searchParams])

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontStyle: 'italic',
        fontSize: '20px',
        color: 'var(--tan)',
      }}>
        Signing you in…
      </div>
    </main>
  )
}
