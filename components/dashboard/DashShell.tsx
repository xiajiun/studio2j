import { DashNav } from './DashNav'

export function DashShell({ variant, children }: {
  variant: 'admin' | 'account'
  children: React.ReactNode
}) {
  return (
    <div className="dash-shell" style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--cream)',
    }}>
      <div className="dash-sidebar">
        <DashNav variant={variant} />
      </div>
      <main className="dash-main" style={{
        flex: 1,
        overflowY: 'auto',
        padding: '48px',
      }}>
        {children}
      </main>
    </div>
  )
}
