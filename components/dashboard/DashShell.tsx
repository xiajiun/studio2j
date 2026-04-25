import { DashNav } from './DashNav'

export function DashShell({ variant, children }: {
  variant: 'admin' | 'account'
  children: React.ReactNode
}) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--cream)',
    }}>
      <DashNav variant={variant} />
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '48px',
      }}>
        {children}
      </main>
    </div>
  )
}
