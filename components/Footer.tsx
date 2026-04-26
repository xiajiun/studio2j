export default function Footer() {
  return (
    <footer style={{
      background: 'var(--dark-brown)',
      padding: '80px 0 40px',
      borderTop: '0.5px solid rgba(245,239,230,0.05)',
    }}>
      <div className="container">
        <div
          className="footer-top"
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '64px',
            paddingBottom: '56px',
            borderBottom: '0.5px solid rgba(245,239,230,0.08)',
            marginBottom: '36px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 500,
              fontSize: '32px',
              color: 'var(--cream)',
              marginBottom: '16px',
              letterSpacing: '-0.02em',
            }}>
              Studio<em style={{ fontStyle: 'italic', color: 'var(--tan)', fontWeight: 400 }}>2J</em>
            </div>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              lineHeight: '1.8',
              color: 'rgba(245,239,230,0.45)',
              maxWidth: '280px',
            }}>
              Personal shopping for illustration and stationery fairs in Korea
              and Japan. Based in Seoul and Tokyo. Founded 2025.
            </p>
          </div>

          <FooterCol title="Explore" links={[
            { href: '#services', label: 'Services' },
            { href: '#tracker',  label: 'Fair Tracker' },
            { href: '#how',      label: 'How it works' },
            { href: '#faq',      label: 'FAQ' },
          ]} />

          <FooterCol title="Connect" links={[
            { href: 'https://www.instagram.com/studio2j25/', label: 'Instagram', external: true },
            { href: 'https://www.threads.com/@studio2j25',  label: 'Threads',   external: true },
            { href: 'mailto:studio2j25@gmail.com',            label: 'Email us' },
          ]} />

          <FooterCol title="Based in" links={[
            { href: '#', label: 'Seoul · 서울' },
            { href: '#', label: 'Tokyo · 東京' },
            { href: '#', label: 'Shipping worldwide', muted: true },
          ]} />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-inter), sans-serif',
          fontSize: '11px',
          fontWeight: 300,
          color: 'rgba(245,239,230,0.3)',
          letterSpacing: '0.04em',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          <span>
            © Studio2J 2026 ·{' '}
            <em style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'rgba(245,239,230,0.45)' }}>
              From Seoul and Tokyo, with care
            </em>
          </span>
          <span>Est. 2025 · 서울과 도쿄에서 세계로 · Seoul and Tokyo to the world</span>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: {
  title: string
  links: { href: string; label: string; external?: boolean; muted?: boolean }[]
}) {
  return (
    <div>
      <div style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '10px',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(245,239,230,0.4)',
        marginBottom: '18px',
      }}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '11px' }}>
        {links.map(({ href, label, external, muted }) => (
          <li key={label}>
            <a
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="footer-link"
              style={{
                fontFamily: 'var(--font-inter), sans-serif',
                fontSize: '13px',
                fontWeight: 300,
                color: muted ? 'rgba(245,239,230,0.35)' : 'rgba(245,239,230,0.55)',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
