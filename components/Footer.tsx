'use client'

import { useLang } from '@/components/LangProvider'

const inter = 'var(--font-inter), sans-serif'
const LABEL: React.CSSProperties = { fontFamily: inter, fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px' }
const TEXT = 'rgba(45,55,72,0.7)'

// Light footer on the page background — matches the rest of the site (DESIGN.md "Surfaces & text")
export default function Footer() {
  const { lang, t } = useLang()
  const f = t.footer
  return (
    <footer style={{ background: 'var(--cream)', padding: '64px 0 32px', borderTop: '0.5px solid rgba(107,163,200,0.2)' }}>
      <div className="container">
        <div
          className="footer-top"
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '56px', paddingBottom: '44px', borderBottom: '0.5px solid rgba(107,163,200,0.15)', marginBottom: '24px' }}
        >
          {/* Brand */}
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 500, fontSize: '28px', color: 'var(--dark-brown)', marginBottom: '12px', letterSpacing: '-0.02em' }}>
              Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 400 }}>2J</em>
            </div>
            <p style={{ fontFamily: inter, fontSize: '13px', fontWeight: 300, lineHeight: '1.8', color: TEXT, maxWidth: '300px' }}>
              {f.desc}
            </p>
          </div>

          <FooterCol title={f.explore} links={[
            { href: '/#tracker', label: f.linkTracker },
            { href: '/markets', label: f.linkMarkets },
            { href: '/brands', label: f.linkBrands },
            { href: '/catalogue/planners-2027', label: f.linkPlanners },
            { href: '/about', label: f.linkAbout },
            { href: '/#faq', label: f.linkFaq },
            { href: '/policy', label: f.linkPolicies },
          ]} />

          <div>
            <div style={LABEL}>{f.connect}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <SocialIcon href="https://www.instagram.com/studio2j25/" label="Instagram">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.threads.net/@studio2j25" label="Threads">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.18 4.5c-3.63 0-6.3 2.48-6.3 6.5 0 4.54 2.86 7 6.3 7 1.58 0 2.88-.42 3.88-1.28l-.88-1.1c-.74.63-1.74 1-3 1-2.62 0-4.3-1.86-4.3-5.12 0-3.08 1.86-5.12 4.3-5.12 2.9 0 4.62 1.94 4.62 4.62 0 1.56-.76 2.5-1.76 2.5-.84 0-1.22-.5-1.08-1.42l.4-2.88H13l-.06.42c-.32-.36-.82-.6-1.5-.6-1.5 0-2.64 1.22-2.64 2.9 0 1.4.8 2.3 2.04 2.3.74 0 1.42-.4 1.78-1.06.2.68.84 1.06 1.76 1.06 1.6 0 2.76-1.26 2.76-3.34C17.14 7.08 15.04 4.5 12.18 4.5zm-.9 7.74c-.6 0-.98-.44-.98-1.14 0-.9.56-1.6 1.38-1.6.6 0 .98.44.98 1.14 0 .9-.56 1.6-1.38 1.6z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/@Studio2J" label="YouTube">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.53C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                </svg>
              </SocialIcon>
              <SocialIcon href="mailto:studio2j25@gmail.com" label="Email" external={false}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Japanese copy is Korea-only (CLAUDE.md rule 10) */}
          <FooterCol title={f.basedIn} links={[
            { label: f.citySeoul },
            ...(lang !== 'ja' && f.cityTokyo ? [{ label: f.cityTokyo }] : []),
            { label: f.shipWorldwide, muted: true },
          ]} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: inter, fontSize: '11px', fontWeight: 300, color: 'var(--tan)', letterSpacing: '0.04em', flexWrap: 'wrap', gap: '12px' }}>
          <span>
            © Studio2J 2026 ·{' '}
            <em style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', color: 'var(--brown)' }}>{f.copyright}</em>
          </span>
          <span>Est. 2025 · {f.tagline}</span>
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
      aria-label={label} className="footer-social"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '0.5px solid rgba(107,163,200,0.35)', color: 'var(--brown)', textDecoration: 'none', flexShrink: 0, transition: 'border-color 0.2s, color 0.2s, background 0.2s' }}
    >
      {children}
    </a>
  )
}

function FooterCol({ title, links }: {
  title: string
  links: { href?: string; label: string; muted?: boolean }[]
}) {
  const style: React.CSSProperties = { fontFamily: inter, fontSize: '13px', fontWeight: 300, textDecoration: 'none', transition: 'color 0.2s' }
  return (
    <div>
      <div style={LABEL}>{title}</div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {links.map(({ href, label, muted }) => (
          <li key={label}>
            {href
              ? <a href={href} className="footer-link" style={{ ...style, color: TEXT }}>{label}</a>
              : <span style={{ ...style, color: muted ? 'var(--tan)' : TEXT }}>{label}</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}
