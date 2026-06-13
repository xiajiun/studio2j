'use client'

import { useLang } from '@/components/LangProvider'

export default function Footer() {
  const { t } = useLang()
  const f = t.footer
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
              {f.desc}
            </p>
          </div>

          <FooterCol title={f.explore} links={[
            { href: '/#tracker',  label: f.linkTracker },
            { href: '/markets',   label: f.linkMarkets },
            { href: '/brands',    label: f.linkBrands },
            { href: '/#how',      label: f.linkHow },
            { href: '/about',     label: f.linkAbout },
            { href: '/#faq',      label: f.linkFaq },
            { href: '/policy',    label: 'Policies' },
          ]} />

          <div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(245,239,230,0.4)', marginBottom: '18px' }}>
              {f.connect}
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <SocialIcon href="https://www.instagram.com/studio2j25/" label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.threads.net/@studio2j25" label="Threads">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.18 4.5c-3.63 0-6.3 2.48-6.3 6.5 0 4.54 2.86 7 6.3 7 1.58 0 2.88-.42 3.88-1.28l-.88-1.1c-.74.63-1.74 1-3 1-2.62 0-4.3-1.86-4.3-5.12 0-3.08 1.86-5.12 4.3-5.12 2.9 0 4.62 1.94 4.62 4.62 0 1.56-.76 2.5-1.76 2.5-.84 0-1.22-.5-1.08-1.42l.4-2.88H13l-.06.42c-.32-.36-.82-.6-1.5-.6-1.5 0-2.64 1.22-2.64 2.9 0 1.4.8 2.3 2.04 2.3.74 0 1.42-.4 1.78-1.06.2.68.84 1.06 1.76 1.06 1.6 0 2.76-1.26 2.76-3.34C17.14 7.08 15.04 4.5 12.18 4.5zm-.9 7.74c-.6 0-.98-.44-.98-1.14 0-.9.56-1.6 1.38-1.6.6 0 .98.44.98 1.14 0 .9-.56 1.6-1.38 1.6z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/@Studio2J" label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.53C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="mailto:studio2j25@gmail.com" label="Email" external={false}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          <FooterCol title={f.basedIn} links={[
            { label: 'Seoul · 서울' },
            { label: 'Tokyo · 東京' },
            { label: 'Shipping worldwide', muted: true },
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
              {f.copyright}
            </em>
          </span>
          <span>Est. 2025 · 서울과 도쿄에서 세계로 · Seoul and Tokyo to the world</span>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ href, label, children, external = true }: {
  href: string; label: string; children: React.ReactNode; external?: boolean
}) {
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
      aria-label={label}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', border: '0.5px solid rgba(245,239,230,0.15)', color: 'rgba(245,239,230,0.55)', textDecoration: 'none', flexShrink: 0, transition: 'border-color 0.2s, color 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(245,239,230,0.4)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,239,230,0.9)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(245,239,230,0.15)'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(245,239,230,0.55)' }}
    >
      {children}
    </a>
  )
}

function FooterCol({ title, links }: {
  title: string
  links: { href?: string; label: string; external?: boolean; muted?: boolean }[]
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
            {href ? (
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
            ) : (
            <span style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '13px',
              fontWeight: 300,
              color: muted ? 'rgba(245,239,230,0.35)' : 'rgba(245,239,230,0.55)',
            }}>{label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
