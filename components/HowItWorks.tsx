export default function HowItWorks() {
  return (
    <section id="how" className="how-section" style={{ background: 'var(--beige)', padding: '140px 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <div style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '18px',
            color: 'var(--brown)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
          }}>
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginLeft: 'auto' }} />
            How it works
            <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block', marginRight: 'auto' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-fraunces), serif',
            fontWeight: 300,
            fontSize: 'clamp(42px, 4.5vw, 64px)',
            lineHeight: '1.04',
            letterSpacing: '-0.03em',
            color: 'var(--dark-brown)',
          }}>
            We&apos;re your person<br />on the <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)', fontWeight: 300 }}>ground</em>.
          </h2>
        </div>

        <div className="how-grid">
          <HowCard
            num="01"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            }
            title="Submit your order"
            body="Send us your wishlist — website links, artist names, or a fair from our tracker. Use the order form on this site or DM us on Instagram."
          />
          <HowCard
            num="02"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            }
            title="Two invoices, two payments"
            body="Invoice 1 covers item costs — you pay upfront so we can buy. Invoice 2 covers our service fee and international shipping — sent after items are confirmed."
          />
          <HowCard
            num="03"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A5C45" strokeWidth="1.5">
                <path d="M16 16h6v-5h-6z"/>
                <path d="M8 16H2v-5h6z"/>
                <path d="M8 11V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v5"/>
                <line x1="12" y1="16" x2="12" y2="20"/>
              </svg>
            }
            title="We ship to your door"
            body="We source, photograph, pack carefully, and ship worldwide with tracking from Seoul or Tokyo. Every parcel leaves with a handwritten note."
          />
        </div>
      </div>
    </section>
  )
}

function HowCard({ num, icon, title, body }: {
  num: string
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div style={{ background: 'var(--cream)', padding: '56px 44px', position: 'relative' }}>
      <div style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: '80px',
        color: 'var(--beige)',
        lineHeight: '1',
        marginBottom: '20px',
        letterSpacing: '-0.03em',
      }}>{num}</div>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: 'var(--beige)',
        marginBottom: '24px',
        border: '0.5px solid rgba(122,92,69,0.1)',
      }}>{icon}</div>
      <h3 style={{
        fontFamily: 'var(--font-fraunces), serif',
        fontWeight: 400,
        fontSize: '24px',
        color: 'var(--dark-brown)',
        marginBottom: '14px',
        letterSpacing: '-0.01em',
      }}>{title}</h3>
      <p style={{
        fontFamily: 'var(--font-inter), sans-serif',
        fontSize: '14px',
        fontWeight: 300,
        lineHeight: '1.75',
        color: 'var(--brown)',
      }}>{body}</p>
    </div>
  )
}
