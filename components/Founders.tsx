export default function Founders() {
  return (
    <section style={{ padding: '140px 0', background: 'var(--cream)' }} className="founders-section">
      <div className="container">

        {/* Eyebrow */}
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          Who we are
        </div>

        {/* Title */}
        <h2 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(42px, 4.5vw, 64px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '24px' }}>
          Two friends,<br />two <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>cities</em>.
        </h2>

        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)', maxWidth: '560px', marginBottom: '72px' }}>
          Studio2J started with late-night voice notes between Seoul and Tokyo. We wanted a way to share what we were finding — and realised others did too.
        </p>

        {/* Founders grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="founders-grid">

          {/* Jin */}
          <div style={{ background: 'var(--beige)', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden', border: '0.5px solid rgba(122,92,69,0.08)' }}>
            <div style={{ position: 'absolute', top: '32px', right: '32px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '80px', color: 'rgba(122,92,69,0.07)', lineHeight: 1, letterSpacing: '-0.03em', pointerEvents: 'none' }}>Jin</div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '10px' }}>
                Co-founder · Seoul 🇰🇷
              </div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.02em' }}>Jin</div>
            </div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '8px' }}>
              Korea curator
            </div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)', marginBottom: '28px' }}>
              Finds the hidden gems in Hongdae and Yeonnam. Specialises in Korean character illustration markets, indie brands, and stationery that doesn't look like everything else.
            </p>
            <div style={{ borderTop: '0.5px solid rgba(122,92,69,0.15)', paddingTop: '24px' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 300, color: 'var(--dark-blue)', lineHeight: 1.5 }}>
                &ldquo;Stationery is my luxury.&rdquo;
              </div>
            </div>
          </div>

          {/* Jo */}
          <div style={{ background: '#1F3A5F', borderRadius: '24px', padding: '48px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '32px', right: '32px', fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '80px', color: 'rgba(200,169,141,0.07)', lineHeight: 1, letterSpacing: '-0.03em', pointerEvents: 'none' }}>Jo</div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,169,141,0.6)', marginBottom: '10px' }}>
                Co-founder · Tokyo 🇯🇵
              </div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 400, color: 'white', letterSpacing: '-0.02em' }}>Jo</div>
            </div>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(200,169,141,0.6)', marginBottom: '8px' }}>
              Japan curator
            </div>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '14px', fontWeight: 300, lineHeight: 1.75, color: 'rgba(245,239,230,0.65)', marginBottom: '28px' }}>
              Obsessed with paper quality, texture, and the Japanese zakka spirit. Sources from Loft, Hobonichi, and the small shops that don't have English sites.
            </p>
            <div style={{ borderTop: '0.5px solid rgba(200,169,141,0.15)', paddingTop: '24px' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '16px', fontWeight: 300, color: 'var(--tan)', lineHeight: 1.5 }}>
                &ldquo;Journaling is my daily ritual.&rdquo;
              </div>
            </div>
          </div>

        </div>

        {/* About link */}
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/about" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--brown)', textDecoration: 'none', border: '0.5px solid rgba(122,92,69,0.2)', padding: '12px 28px', borderRadius: '99px', display: 'inline-block', transition: 'all 0.2s' }}>
            More about us →
          </a>
        </div>

      </div>

    </section>
  )
}
