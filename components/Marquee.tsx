const FAIR_NAMES = [
  'Illustration Korea',
  'Tokyo Gift Show',
  'Washi & Paper Expo',
  'Seoul Illustration Fair',
  'Hyper Japan London',
  'Grafik Fiera Milan',
  'Paper & Pen Tokyo',
  'Illustrative Berlin',
]

export default function Marquee() {
  const doubled = [...FAIR_NAMES, ...FAIR_NAMES]

  return (
    <div style={{
      background: 'var(--dark-brown)',
      padding: '22px 0',
      overflow: 'hidden',
      borderTop: '0.5px solid rgba(245,239,230,0.08)',
      borderBottom: '0.5px solid rgba(245,239,230,0.08)',
    }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 40s linear infinite' }}>
        {doubled.map((name, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
            fontSize: '18px',
            fontWeight: 300,
            letterSpacing: '0.02em',
            color: 'rgba(245,239,230,0.7)',
            marginRight: '64px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '64px',
          }}>
            {name}
            <span style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: 'var(--tan)',
              opacity: 0.5,
              display: 'inline-block',
            }} />
          </span>
        ))}
      </div>
    </div>
  )
}
