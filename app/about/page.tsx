export const runtime = 'edge'

import Link from 'next/link'

export const metadata = { title: 'About Us — Studio2J' }

export default function AboutPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Nav */}
      <div style={{ padding: '20px 48px', borderBottom: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '22px', fontWeight: 500, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>
            Studio<em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2J</em>
          </span>
        </Link>
        <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '10px 22px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.03em' }}>
          Place an order
        </Link>
      </div>

      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '80px 48px 100px' }}>

        {/* Header */}
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          About us
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--dark-brown)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '32px' }}>
          Two friends,<br />one <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>studio</em>.
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '16px', maxWidth: '620px' }}>
          Studio2J started with late-night voice notes between Seoul and Tokyo. We kept sending each other photos of stationery we'd found — things the other couldn't get to easily — and eventually realised we weren't the only ones who wanted this.
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '64px', maxWidth: '620px' }}>
          We see stationery as a vehicle for memory keeping. Writing with something beautiful, in a notebook that opens flat, on paper that holds ink just right — it's a small act of care in a world that moves too fast. We wanted to make that accessible to anyone, wherever they are.
        </p>

        {/* Founders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '64px' }} className="about-grid">

          {/* Jin */}
          <div style={{ background: 'var(--beige)', borderRadius: '20px', padding: '40px', border: '0.5px solid rgba(122,92,69,0.1)' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>
              Co-founder · Seoul 🇰🇷
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.02em', marginBottom: '6px' }}>Jin</div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)', letterSpacing: '0.04em', marginBottom: '24px' }}>ISTP · Korea curator</div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '20px' }}>
              Jin sources from Seoul — from the big platforms like Twenty and 10×10, to the side-street shops in Hongdae and Yeonnam that no foreign site lists. Specialises in Korean character illustration markets and indie brands.
            </p>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '24px' }}>
              Views stationery as personal luxury — each piece chosen to recharge, not just to organise.
            </p>
            <div style={{ borderTop: '0.5px solid rgba(122,92,69,0.15)', paddingTop: '20px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 300, color: 'var(--dark-blue)' }}>
              &ldquo;Stationery is my luxury.&rdquo;
            </div>
          </div>

          {/* Jo */}
          <div style={{ background: 'var(--dark-blue)', borderRadius: '20px', padding: '40px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,169,141,0.6)', marginBottom: '10px' }}>
              Co-founder · Tokyo 🇯🇵
            </div>
            <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '32px', fontWeight: 400, color: 'white', letterSpacing: '-0.02em', marginBottom: '6px' }}>Jo</div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'rgba(200,169,141,0.5)', letterSpacing: '0.04em', marginBottom: '24px' }}>INFJ · Japan curator</div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(245,239,230,0.65)', marginBottom: '20px' }}>
              Jo curates from Tokyo — Hobonichi's Shibuya store, Loft, Sekaido for art supplies, and the smaller stationery shops that live and die by word of mouth. Obsessed with paper texture, notebook structure, and the quiet ritual of Japanese zakka culture.
            </p>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.8, color: 'rgba(245,239,230,0.65)', marginBottom: '24px' }}>
              Believes daily journaling is not a productivity hack — it's a way of paying attention.
            </p>
            <div style={{ borderTop: '0.5px solid rgba(200,169,141,0.15)', paddingTop: '20px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 300, color: 'var(--tan)' }}>
              &ldquo;Journaling is my daily ritual.&rdquo;
            </div>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '24px' }}>What we believe</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { num: '01', text: 'Writing with beautiful tools is a radical act of self-care in a digital world.' },
              { num: '02', text: 'A well-made notebook opens flat, feels right in the hand, and changes how you think on the page.' },
              { num: '03', text: 'The best stationery doesn\'t announce itself — it just works, beautifully, every day.' },
              { num: '04', text: 'Korean and Japanese makers produce some of the finest paper goods in the world. More people should have access to them.' },
            ].map(({ num, text }) => (
              <div key={num} style={{ display: 'flex', gap: '24px', padding: '24px 0', borderBottom: '0.5px solid rgba(122,92,69,0.1)', alignItems: 'flex-start' }}>
                <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '20px', color: 'var(--tan)', flexShrink: 0, width: '32px' }}>{num}</div>
                <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '14px 28px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
            Place an order →
          </Link>
          <Link href="/brands" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '14px 28px', borderRadius: '99px', textDecoration: 'none' }}>
            Browse brands
          </Link>
        </div>

      </div>

      <style jsx>{`
        @media (max-width: 700px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
