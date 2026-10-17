'use client'

import { useLang } from '@/components/LangProvider'
import { HAUL_POSTS, REVIEWS } from '@/lib/social-proof'

const inter = 'var(--font-inter), sans-serif'
const fraunces = 'var(--font-fraunces), serif'

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: fraunces, fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
      <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />{children}
    </div>
  )
}

// Real reviews + our own Instagram posts. Renders nothing until lib/social-proof.ts has entries.
export default function SocialProof() {
  const { lang, t } = useLang()
  const s = t.proof
  // Japanese copy is Korea-only (CLAUDE.md rule 10)
  const reviews = REVIEWS.filter(r => lang !== 'ja' || r.region === 'KR')
  const posts = HAUL_POSTS.filter(p => lang !== 'ja' || p.region === 'KR')
    .map(p => p.url.match(/instagram\.com\/(?:p|reel)\/([^/?#]+)/)?.[1])
    .filter(Boolean) as string[]

  if (reviews.length === 0 && posts.length === 0) return null

  return (
    <section id="reviews" className="proof-section" style={{ background: 'var(--cream)', padding: '120px 0' }}>
      <div className="container">
        {reviews.length > 0 && (
          <div style={{ marginBottom: posts.length ? '96px' : 0 }}>
            <Eyebrow>{s.reviewsEyebrow}</Eyebrow>
            <h2 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '40px' }}>
              {s.reviewsTitle1} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.reviewsTitleEm}</em>
            </h2>
            <div className="proof-reviews" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {reviews.map((r, i) => (
                <figure key={i} style={{ margin: 0, background: 'white', border: '0.5px solid rgba(107,163,200,0.17)', borderRadius: '18px', padding: '26px 26px 22px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontFamily: fraunces, fontSize: '44px', lineHeight: 0.6, color: 'var(--tan)', marginBottom: '10px' }}>&ldquo;</div>
                  <blockquote style={{ margin: 0, fontFamily: fraunces, fontSize: '17px', fontWeight: 300, lineHeight: 1.6, color: 'var(--dark-brown)', flex: 1 }}>{r.quote}</blockquote>
                  <figcaption style={{ marginTop: '18px', fontFamily: inter, fontSize: '12px', color: 'var(--brown)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--dark-brown)' }}>{r.name}</span>
                    {r.from && <> · {r.from}</>}
                    {r.item && <span style={{ display: 'block', color: 'var(--tan)', marginTop: '2px' }}>{s.ordered} {r.item}</span>}
                    {r.url && <a href={r.url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '6px', color: 'var(--dark-blue)', textDecoration: 'none' }}>{s.seeOriginal}</a>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {posts.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '24px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div>
                <Eyebrow>{s.haulsEyebrow}</Eyebrow>
                <h2 style={{ fontFamily: fraunces, fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--dark-brown)' }}>
                  {s.haulsTitle1} <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>{s.haulsTitleEm}</em>
                </h2>
              </div>
              <a href="https://www.instagram.com/studio2j25/" target="_blank" rel="noreferrer" className="btn-secondary-hero">{s.haulsCta}</a>
            </div>
            <div className="proof-posts" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {posts.slice(0, 6).map(code => (
                <div key={code} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(107,163,200,0.17)' }}>
                  <iframe src={`https://www.instagram.com/p/${code}/embed/`} loading="lazy" title={`Instagram post ${code}`}
                    frameBorder="0" scrolling="no" allow="encrypted-media"
                    style={{ display: 'block', width: '100%', height: '520px', border: 'none' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
