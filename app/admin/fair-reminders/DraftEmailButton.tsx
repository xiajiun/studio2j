'use client'

import { useState } from 'react'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export function DraftEmailButton({ fairName, fairDate, fairDeadline, emails }: {
  fairName: string
  fairDate: string
  fairDeadline: string | null
  emails: string[]
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const subject = `${fairName} is coming up — order with Studio2J`

  const body = `Hi there,

You saved ${fairName} on Studio2J's fair tracker.

📅 ${fmtDate(fairDate)}${fairDeadline ? `\n🗓 Order deadline: ${fmtDate(fairDeadline)}` : ''}

We'll be picking up items at the fair! If you'd like us to get something for you, place your order before the deadline.

→ Place an order

Questions? DM us @studio2j25 on Instagram or reply to this email.`

  const bcc = emails.join(', ')
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(bcc)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  function copyEmails() {
    navigator.clipboard.writeText(bcc)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '0.5px solid rgba(122,92,69,0.2)', background: 'var(--beige)',
    fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px',
    fontWeight: 300, color: 'var(--dark-brown)', outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500,
          padding: '6px 16px', borderRadius: '99px', cursor: 'pointer',
          background: 'var(--dark-blue)', color: 'var(--cream)', border: 'none',
        }}
      >
        Draft email
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(31,20,12,0.4)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--cream)', borderRadius: '20px', padding: '36px 40px',
              width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto',
              boxShadow: '0 24px 64px rgba(31,58,95,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 300, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
                Draft email — <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{fairName}</em>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--tan)', cursor: 'pointer', padding: '4px' }}>×</button>
            </div>

            {/* Recipients */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>
                BCC ({emails.length} recipients)
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ ...inp, flex: 1, minHeight: '40px', wordBreak: 'break-all', lineHeight: 1.6 }}>
                  {bcc}
                </div>
                <button onClick={copyEmails} style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500,
                  padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap',
                  background: copied ? '#D5E8D8' : 'var(--beige)',
                  color: copied ? '#2A5C35' : 'var(--brown)',
                  border: '0.5px solid rgba(122,92,69,0.2)',
                }}>
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>Subject</div>
              <input readOnly value={subject} style={{ ...inp, width: '100%' }} onFocus={e => e.target.select()} />
            </div>

            {/* Body */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '6px' }}>Body</div>
              <textarea
                readOnly
                value={body}
                rows={14}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.7 }}
                onFocus={e => e.target.select()}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href={gmailHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500,
                  padding: '12px 24px', borderRadius: '99px', textDecoration: 'none',
                  background: 'var(--dark-blue)', color: 'var(--cream)',
                }}
              >
                Open in Gmail →
              </a>
              <button onClick={() => setOpen(false)} style={{
                fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300,
                padding: '12px 24px', borderRadius: '99px', cursor: 'pointer',
                background: 'transparent', color: 'var(--brown)',
                border: '0.5px solid rgba(122,92,69,0.2)',
              }}>
                Close
              </button>
            </div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', marginTop: '12px' }}>
              Tip: paste the emails into BCC so recipients don't see each other.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
