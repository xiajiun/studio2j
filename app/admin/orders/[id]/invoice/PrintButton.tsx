'use client'

export const runtime = 'edge'

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        background: 'var(--dark-blue)',
        color: 'var(--cream)',
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '13px',
        fontWeight: 500,
        padding: '10px 22px',
        borderRadius: '99px',
        border: 'none',
        cursor: 'pointer',
        letterSpacing: '0.02em',
      }}
    >
      Print / Save as PDF
    </button>
  )
}
