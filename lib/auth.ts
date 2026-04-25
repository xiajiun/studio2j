import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'studio2j25@gmail.com'

export async function getUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isAdmin() {
  const user = await getUser()
  return user?.email === ADMIN_EMAIL
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) redirect('/login')
  return user
}

export async function requireAdmin() {
  const user = await getUser()
  if (user?.email !== ADMIN_EMAIL) redirect('/login')
  return user
}
