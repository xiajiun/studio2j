export default function OrderCTA() {
  return (
    <section id="order" className="order-section" style={{ background: 'var(--dark-blue)', padding: '140px 0' }}>
      <div className="container">
        <div
          className="order-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '72px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--tan)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}>
              <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
              Place an order
            </div>
            <h2 style={{
              fontFamily: 'var(--font-fraunces), serif',
              fontWeight: 300,
              fontSize: 'clamp(40px, 4.5vw, 64px)',
              lineHeight: '1.04',
              color: 'var(--cream)',
              marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}>
              Send us<br />a <em style={{ fontStyle: 'italic', color: 'var(--tan)' }}>link</em>.
            </h2>
            <p style={{
              fontFamily: 'var(--font-inter), sans-serif',
              fontSize: '15px',
              fontWeight: 300,
              lineHeight: '1.75',
              color: 'rgba(245,239,230,0.65)',
              marginBottom: '36px',
              maxWidth: '440px',
            }}>
              Every order is handled personally. We confirm, source, pack, and
              ship from Seoul or Tokyo. Your only job is to tell us what you love.
            </p>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <a
                href="https://www.instagram.com/studio2j25/"
                target="_blank"
                rel="noreferrer"
                className="btn-gold-order"
              >
                DM on Instagram →
              </a>
              <a href="#how" className="btn-ghost-order">
                How to order
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              {
                num: '01',
                title: 'Send a link or a list',
                body: "A Korean or Japanese website URL, an artist name, or pick a fair from our tracker — whatever you're after.",
              },
              {
                num: '02',
                title: 'Confirm & pay upfront',
                body: 'We confirm availability, send an invoice (item cost + service fee + shipping), and you pay before we purchase.',
              },
              {
                num: '03',
                title: 'Wait for your haul',
                body: 'We source, photograph, pack carefully, and ship worldwide with tracking. Updates every step.',
              },
            ].map(({ num, title, body }) => (
              <div
                key={num}
                className="ostep-card"
                style={{
                  background: 'rgba(245,239,230,0.04)',
                  border: '0.5px solid rgba(245,239,230,0.1)',
                  borderRadius: '16px',
                  padding: '24px 28px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '24px',
                  alignItems: 'start',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-fraunces), serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '36px',
                  lineHeight: '1',
                  color: 'var(--tan)',
                  letterSpacing: '-0.02em',
                }}>{num}</div>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-fraunces), serif',
                    fontWeight: 400,
                    fontSize: '18px',
                    color: 'var(--cream)',
                    marginBottom: '6px',
                    letterSpacing: '-0.01em',
                  }}>{title}</div>
                  <div style={{
                    fontFamily: 'var(--font-inter), sans-serif',
                    fontSize: '13px',
                    fontWeight: 300,
                    lineHeight: '1.7',
                    color: 'rgba(245,239,230,0.55)',
                  }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
