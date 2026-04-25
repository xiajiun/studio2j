export const runtime = 'edge'

import { requireAuth } from '@/lib/auth'
import { DashShell } from '@/components/dashboard/DashShell'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  await requireAuth()
  return <DashShell variant="account">{children}</DashShell>
}
