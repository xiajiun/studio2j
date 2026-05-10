'use client'

import { useEffect } from 'react'

export function PrintButton({ printUrl }: { printUrl?: string }) {
  return (
    <button
      onClick={() => {
        if (printUrl) {
          window.open(printUrl, '_blank')
        } else {
          window.print()
        }
      }}
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
      Save as PDF
    </button>
  )
}

export function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 600)
    return () => clearTimeout(t)
  }, [])
  return null
}
