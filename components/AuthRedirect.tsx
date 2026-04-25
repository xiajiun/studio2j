'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'studio2j25@gmail.com'

export function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash.includes('access_token')) return

    const params = new URLSearchParams(hash.substring(1))
    const access_token  = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    if (!access_token || !refresh_token) return

    const supabase = createClient()
    supabase.auth.setSession({ access_token, refresh_token }).then(({ data: { session } }) => {
      if (!session) return
      window.history.replaceState(null, '', window.location.pathname)
      router.push(session.user.email === ADMIN_EMAIL ? '/admin' : '/account')
    })
  }, [router])

  return null
}
