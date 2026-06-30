'use client'

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/fairs'
import type { FairRow } from '@/lib/database.types'
import { useLang } from '@/components/LangProvider'

type View = 'all' | 'upcoming' | 'going' | 'deadline' | 'saved'

function dlInfo(deadline: string, today: Date): { cls: string; label: string } {
  const diff = (new Date(deadline).getTime() - today.getTime()) / 86400000
  if (diff < 0) return { cls: 'dl-closed', label: 'Passed' }
  if (diff <= 7) return { cls: 'dl-urgent', label: `${Math.ceil(diff)}d left` }
  if (diff <= 30) return { cls: 'dl-soon', label: `${Math.ceil(diff)} days` }
  return { cls: 'dl-open', label: 'Open' }
}

export default function FairTracker({ fairs: FAIRS }: { fairs: FairRow[] }) {
  const today = new Date()
  const { t, lang } = useLang()
  const tr = t.tracker
  const [view, setView] = useState<View>('upcoming')
  const [search, setSearch] = useState('')
  const [saved, setSaved] = useState<Set<number>>(new Set())

  useEffect(() => {
    try {
      const raw = localStorage.getItem('s2j-saved')
      if (raw) setSaved(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  function toggleSave(id: number) {
    setSaved(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      try { localStorage.setItem('s2j-saved', JSON.stringify(Array.from(next))) } catch {}
      return next
    })
  }

  const q = search.toLowerCase()
  const filtered = FAIRS.filter(f => {
    if (lang === 'ja' && f.country === 'Japan') return false
    if (view === 'upcoming' && new Date(f.date) < today) return false
    if (view === 'going' && !f.going) return false
    if (view === 'deadline' && (new Date(f.deadline).getTime() - today.getTime()) / 86400000 < 0) return false
    if (view === 'saved' && !saved.has(f.id)) return false
    if (q && !f.name.toLowerCase().includes(q) && !f.city.toLowerCase().includes(q) && !f.country.toLowerCase().includes(q)) return false
    return true
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Group by month
  const groups: { month: string; fairs: FairRow[] }[] = []
  filtered.forEach(f => {
    const mo = new Date(f.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const last = groups[groups.length - 1]
    if (last && last.month === mo) last.fairs.push(f)
    else groups.push({ month: mo, fairs: [f] })
  })

  const views: { key: View; label: string }[] = [
    { key: 'upcoming', label: tr.pUpcoming },
    { key: 'going',    label: tr.pGoing },
    { key: 'deadline', label: tr.pDeadline },
    { key: 'saved',    label: tr.pSaved },
    { key: 'all',      label: 'All' },
  ]

  return (
    <section id="tracker" style={{ padding: '140px 0', background: '#FEFAF0' }} className="tracker-section">
      <div className="container">
        {/* Head */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.3fr 1fr',
          gap: '80px',
          alignItems: 'end',
          marginBottom: '48px',
        }} className="tracker-head">
          <div>
            <div style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--brown)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
              <span className="live-dot" />{tr.eyebrow}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 300,
              fontSize: 'clamp(42px, 4.5vw, 64px)',
              lineHeight: '1.04',
              letterSpacing: '-0.03em',
              color: 'var(--dark-brown)',
            }}>
              {tr.title1}<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>{tr.titleEm}</em>{tr.title2}
            </h2>
          </div>
        </div>

        <p style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '15px',
          fontWeight: 300,
          lineHeight: '1.75',
          color: 'var(--brown)',
          maxWidth: '680px',
          marginBottom: '40px',
        }}>
          {tr.body}
        </p>

        {/* Filters */}
        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px 0',
          borderTop: '0.5px solid rgba(107,163,200,0.15)',
          borderBottom: '0.5px solid rgba(107,163,200,0.15)',
        }}>
          <span style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
            fontSize: '14px',
            color: 'var(--tan)',
            marginRight: '12px',
          }}>{tr.filterLabel}</span>
          <input
            type="text"
            placeholder={tr.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              maxWidth: '280px',
              padding: '9px 18px',
              borderRadius: '99px',
              border: '0.5px solid rgba(107,163,200,0.2)',
              background: 'rgba(255,255,255,0.7)',
              color: 'var(--dark-brown)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              outline: 'none',
            }}
          />
          {views.map(v => (
            <button
              key={v.key}
              className={`pill${view === v.key ? ' active' : ''}`}
              onClick={() => setView(v.key)}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Fair list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px',
              fontFamily: 'var(--font-fraunces), serif',
              fontStyle: 'italic',
              fontSize: '18px',
              color: 'var(--tan)',
            }}>{tr.noFairs}</div>
          ) : groups.map(({ month, fairs }) => (
            <div key={month}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                margin: '28px 0 16px',
              }}>
                <span style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '20px',
                  color: 'var(--brown)',
                  letterSpacing: '0.01em',
                }}>{month}</span>
                <span style={{ flex: 1, height: '0.5px', background: 'rgba(107,163,200,0.2)' }} />
              </div>
              {fairs.map(f => (
                <FairCard key={f.id} fair={f} today={today} saved={saved} onSave={toggleSave} />
              ))}
            </div>
          ))}
        </div>

        {/* Email alerts */}
        <EmailAlerts />
      </div>

      <style jsx>{`
        @media (max-width: 1000px) {
          .tracker-section { padding: 80px 0 !important; }
          .tracker-head { grid-template-columns: 1fr !important; gap: 32px !important; }
          .tracker-stats { gap: 16px !important; }
        }
      `}</style>
    </section>
  )
}

function FairCard({ fair: f, today, saved, onSave }: {
  fair: FairRow
  today: Date
  saved: Set<number>
  onSave: (id: number) => void
}) {
  const { lang } = useLang()
  const dl = dlInfo(f.deadline, today)
  const isSaved = saved.has(f.id)
  const [mode, setMode] = useState<'idle' | 'input' | 'saving' | 'done'>('idle')
  const [emailVal, setEmailVal] = useState('')
  const [err, setErr] = useState('')

  async function handleSaveClick(e: React.MouseEvent) {
    e.stopPropagation()
    if (isSaved) { onSave(f.id); setMode('idle'); return }
    setMode('input')
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault()
    setMode('saving')
    setErr('')
    try {
      const res  = await fetch('/api/fair-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:         emailVal,
          fair_id:       f.id,
          fair_name:     f.name,
          fair_date:     f.date,
          fair_deadline: f.deadline,
          fair_city:     f.city,
          fair_country:  f.country,
          going:         f.going,
          lang,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Unknown error')
      onSave(f.id)
      setMode('done')
    } catch (e: any) {
      setErr(e.message ?? 'Something went wrong — try again.')
      setMode('input')
    }
  }

  return (
    <div className={`fair-card-item${f.featured ? ' fair-featured' : ''}`} style={{
      background: 'white',
      border: f.featured ? '0.5px solid rgba(74,138,181,0.3)' : '0.5px solid rgba(107,163,200,0.2)',
      boxShadow: f.featured ? '0 4px 16px rgba(31,58,95,0.04)' : 'none',
      borderRadius: '18px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        {f.image_url && (
          <div style={{ width: '140px', flexShrink: 0, background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <img src={f.image_url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
          </div>
        )}
        <div style={{
          flex: 1,
          padding: '24px 28px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '24px',
          alignItems: 'start',
        }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 400,
            fontSize: '20px',
            color: 'var(--dark-brown)',
            letterSpacing: '-0.01em',
          }}>{f.name}</span>
          <span style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '9px',
            fontWeight: 500,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: '99px',
            background: f.kind === 'popup' ? 'rgba(243,227,161,0.5)' : 'rgba(107,163,200,0.08)',
            color: f.kind === 'popup' ? '#7A6010' : 'var(--brown)',
          }}>{f.kind === 'popup' ? 'Popup' : 'Fair'}</span>
          {f.going
            ? <span style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '9px',
                fontWeight: 500,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: '99px',
                background: 'var(--dark-blue)',
                color: 'var(--cream)',
              }}>We&apos;re attending</span>
            : f.featured
              ? <span style={{
                  fontFamily: 'var(--font-inter), sans-serif',
                  fontSize: '9px',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: '99px',
                  background: 'rgba(107,163,200,0.1)',
                  color: 'var(--brown)',
                }}>Featured</span>
              : null
          }
        </div>
        <div style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '13px',
          fontWeight: 300,
          color: 'var(--tan)',
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '14px',
        }}>
          <span>{f.city}</span>
          <span style={{ color: 'rgba(168,203,224,0.5)' }}>·</span>
          <span>{f.country}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {f.types.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '10px',
              fontWeight: 400,
              padding: '4px 11px',
              borderRadius: '99px',
              letterSpacing: '0.02em',
              background: 'rgba(107,163,200,0.08)',
              color: 'var(--brown)',
            }}>{t}</span>
          ))}
        </div>
        {f.notes && (
          <div style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '13px',
            color: 'var(--tan)',
            marginTop: '10px',
          }}>&quot;{f.notes}&quot;</div>
        )}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
          {f.url && (
            <a href={f.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(74,138,181,0.08)', padding: '4px 10px', borderRadius: '99px' }}>
              {f.url.includes('instagram') ? 'Instagram ↗︎' : 'Website ↗︎'}
            </a>
          )}
          {(f.catalogue_url || f.name.toLowerCase().includes('inventario') || f.name.toLowerCase().includes('dotdot') || f.name.toLowerCase().includes('seoul illustration fair')) && (
            <a href={f.catalogue_url ?? (f.name.toLowerCase().includes('dotdot') ? '/catalogue/dotdotexpress' : f.name.toLowerCase().includes('inventario') ? '/catalogue/inventario-2026' : f.name.toLowerCase().includes('seoul illustration fair') ? '/catalogue/sif-v21' : '#')} onClick={e => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(74,138,181,0.1)', padding: '4px 10px', borderRadius: '99px' }}>
              See catalogue ↗︎
            </a>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 400,
            fontSize: '18px',
            color: 'var(--dark-brown)',
            letterSpacing: '-0.01em',
          }}>{formatDate(f.date)}</div>
          <div style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '11px',
            color: 'var(--tan)',
            marginTop: '2px',
            letterSpacing: '0.05em',
          }}>2026</div>
        </div>
        <span className={`dl-chip ${dl.cls}`} style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          fontWeight: 500,
          padding: '5px 12px',
          borderRadius: '7px',
          letterSpacing: '0.02em',
        }}>{dl.label}</span>
        <button
          className={`fc-save-btn${isSaved ? ' saved' : ''}`}
          onClick={handleSaveClick}
          style={{
            fontFamily: 'var(--font-inter), sans-serif',
            fontSize: '11px',
            fontWeight: 400,
            padding: '5px 12px',
            borderRadius: '7px',
            border: isSaved ? '0.5px solid rgba(74,138,181,0.3)' : '0.5px solid rgba(107,163,200,0.2)',
            background: isSaved ? 'rgba(107,163,200,0.1)' : 'transparent',
            color: isSaved ? 'var(--dark-blue)' : 'var(--brown)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >{isSaved ? 'Saved ✓' : 'Save'}</button>
      </div>
      </div> {/* end flex row */}

      {/* Inline email input */}
      {(mode === 'input' || mode === 'saving') && (
        <form
          onSubmit={submitEmail}
          onClick={e => e.stopPropagation()}
          style={{ gridColumn: '1 / -1', borderTop: '0.5px solid rgba(107,163,200,0.15)', paddingTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)', flexShrink: 0 }}>
            Get a reminder email:
          </span>
          <input
            type="email"
            required
            autoFocus
            placeholder="your@email.com"
            value={emailVal}
            onChange={e => setEmailVal(e.target.value)}
            style={{
              flex: 1, minWidth: '180px', padding: '8px 16px', borderRadius: '99px',
              border: '0.5px solid rgba(107,163,200,0.25)', background: 'var(--cream)',
              fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
              color: 'var(--dark-brown)', outline: 'none',
            }}
          />
          <button type="submit" disabled={mode === 'saving'} style={{
            background: 'var(--dark-blue)', color: 'var(--cream)', border: 'none',
            padding: '8px 18px', borderRadius: '99px', cursor: mode === 'saving' ? 'wait' : 'pointer',
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500,
            opacity: mode === 'saving' ? 0.7 : 1,
          }}>
            {mode === 'saving' ? '…' : 'Notify me →'}
          </button>
          <button type="button" onClick={e => { e.stopPropagation(); setMode('idle') }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 300, color: 'var(--tan)',
          }}>Cancel</button>
          {err && <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', color: '#8A3A20', width: '100%' }}>{err}</span>}
        </form>
      )}
      </div>

      <style jsx>{`
        .fair-card-item:hover {
          border-color: var(--brown) !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(31,58,95,0.06) !important;
        }
        .fc-save-btn:hover {
          border-color: var(--brown) !important;
          background: rgba(107,163,200,0.1) !important;
        }
        @media (max-width: 1000px) {
          .fair-card-item { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  )
}

function EmailAlerts() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const { t } = useLang()
  const tr = t.tracker

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const json = await res.json()
    setLoading(false)
    if (!res.ok) { setErr(json.error ?? 'Something went wrong'); return }
    setSubscribed(true)
    setEmail('')
  }

  return (
    <div style={{
      background: 'var(--dark-brown)',
      color: 'var(--cream)',
      borderRadius: '20px',
      padding: '40px 48px',
      marginTop: '32px',
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: '48px',
      alignItems: 'center',
    }} className="alerts-box">
      <div>
        <h3 style={{
          fontFamily: 'var(--font-fraunces), serif',
          fontWeight: 400,
          fontSize: '28px',
          color: 'var(--cream)',
          marginBottom: '10px',
          letterSpacing: '-0.01em',
          lineHeight: '1.2',
        }}>
          {tr.emailTitle} <em style={{ fontStyle: 'italic', color: 'var(--tan)' }}>{tr.emailTitleEm}</em>
        </h3>
        <p style={{
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '13px',
          fontWeight: 300,
          color: 'rgba(245,239,230,0.6)',
          lineHeight: '1.7',
        }}>
          {tr.emailBody}
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            required
            placeholder={tr.emailPlaceholder}
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={subscribed}
            style={{
              flex: 1,
              padding: '13px 20px',
              borderRadius: '99px',
              border: '0.5px solid rgba(245,239,230,0.15)',
              background: 'rgba(245,239,230,0.05)',
              color: 'var(--cream)',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading || subscribed}
            style={{
              background: subscribed ? 'var(--cream)' : 'var(--tan)',
              color: 'var(--dark-brown)',
              border: 'none',
              padding: '13px 24px',
              borderRadius: '99px',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              opacity: loading ? 0.7 : 1,
            }}
          >{subscribed ? tr.emailDone : loading ? '…' : tr.emailBtn}</button>
        </div>
        {err && <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', color: '#F5DDD5', margin: 0, paddingLeft: '8px' }}>{err}</p>}
      </form>

      <style jsx>{`
        @media (max-width: 1000px) {
          .alerts-box { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </div>
  )
}
