'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? 'studio2j25@gmail.com'

export function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (!window.location.hash.includes('access_token')) return

    const supabase = createClient()

    // @supabase/ssr detects the hash token automatically on getSession
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      const dest = session.user.email === ADMIN_EMAIL ? '/admin' : '/account'
      // Clean the hash from the URL then redirect
      window.history.replaceState(null, '', window.location.pathname)
      router.push(dest)
    })
  }, [router])

  return null
}
