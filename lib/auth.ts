import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL ?? 'studio2j25@gmail.com',
  'xiajiun21@gmail.com',
  'jovynkw@gmail.com',
]

export function adminWelcomeName(email: string): string {
  if (email === 'jovynkw@gmail.com')   return 'Jo'
  if (email === 'xiajiun21@gmail.com') return 'Jin'
  return 'Jin and Jo'
}

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  const user = await getUser()
  return !!user?.email && ADMIN_EMAILS.includes(user.email)
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await getUser()
  if (!user?.email || !ADMIN_EMAILS.includes(user.email)) redirect('/login')
  return user
}
