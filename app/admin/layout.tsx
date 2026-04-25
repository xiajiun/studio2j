export const runtime = 'edge'

import { requireAdmin } from '@/lib/auth'
import { DashShell } from '@/components/dashboard/DashShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return <DashShell variant="admin">{children}</DashShell>
}
