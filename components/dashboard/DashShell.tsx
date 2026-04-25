import { DashNav } from './DashNav'

export function DashShell({ variant, children }: {
  variant: 'admin' | 'account'
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--cream)' }}>
      <DashNav variant={variant} />
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto', maxWidth: '1000px' }}>
        {children}
      </main>
    </div>
  )
}
