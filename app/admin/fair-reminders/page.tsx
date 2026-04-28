export const runtime = 'edge'

import { createClient } from '@/lib/supabase/server'

interface ReminderRow {
  id: number
  email: string
  fair_id: number
  fair_name: string
  fair_date: string
  fair_deadline: string | null
  created_at: string
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function FairRemindersPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('fair_reminders')
    .select('*')
    .order('fair_date', { ascending: true })

  const rows = (data ?? []) as ReminderRow[]

  // Group by fair
  const fairMap = new Map<string, { name: string; date: string; deadline: string | null; signups: ReminderRow[] }>()
  for (const r of rows) {
    const key = String(r.fair_id)
    if (!fairMap.has(key)) fairMap.set(key, { name: r.fair_name, date: r.fair_date, deadline: r.fair_deadline, signups: [] })
    fairMap.get(key)!.signups.push(r)
  }
  const fairs = Array.from(fairMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const th: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '10px', fontWeight: 500,
    letterSpacing: '0.1em', textTransform: 'uppercase',
    color: 'var(--tan)', padding: '8px 12px',
    borderBottom: '0.5px solid rgba(122,92,69,0.15)',
    textAlign: 'left',
  }
  const td: React.CSSProperties = {
    fontFamily: 'var(--font-inter), sans-serif',
    fontSize: '13px', fontWeight: 300,
    color: 'var(--dark-brown)', padding: '11px 12px',
    borderBottom: '0.5px solid rgba(122,92,69,0.06)',
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: '36px', color: 'var(--dark-brown)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
        Fair reminders
      </h1>
      <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '40px' }}>
        {rows.length} signup{rows.length !== 1 ? 's' : ''} across {fairs.length} fair{fairs.length !== 1 ? 's' : ''}
      </p>

      {fairs.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', color: 'var(--tan)', textAlign: 'center', padding: '60px 0' }}>
          No signups yet.
        </p>
      ) : fairs.map(fair => (
        <div key={fair.name} style={{ marginBottom: '40px' }}>
          {/* Fair header */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '20px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em' }}>
              {fair.name}
            </span>
            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)' }}>
              {fmtDate(fair.date)}
              {fair.deadline && ` · order by ${fmtDate(fair.deadline)}`}
            </span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.06)', padding: '4px 12px', borderRadius: '99px' }}>
              {fair.signups.length} interested
            </span>
          </div>

          {/* Emails table */}
          <div style={{ background: 'white', borderRadius: '12px', border: '0.5px solid rgba(122,92,69,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={th}>Email</th>
                  <th style={{ ...th, textAlign: 'right' }}>Signed up</th>
                </tr>
              </thead>
              <tbody>
                {fair.signups.map(r => (
                  <tr key={r.id}>
                    <td style={td}>
                      <a href={`mailto:${r.email}`} style={{ color: 'var(--dark-blue)', textDecoration: 'none' }}>
                        {r.email}
                      </a>
                    </td>
                    <td style={{ ...td, textAlign: 'right', color: 'var(--tan)', fontSize: '12px' }}>
                      {fmtDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Copy all emails */}
          <div style={{ marginTop: '8px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
            All emails: <span style={{ userSelect: 'all', color: 'var(--brown)' }}>{fair.signups.map(r => r.email).join(', ')}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
