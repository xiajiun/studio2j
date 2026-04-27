export const runtime = 'edge'

import Link from 'next/link'

export const metadata = { title: 'About Us — Studio2J' }

const PHOTOS = 'https://hclclmdfcswdrdpqtyyl.supabase.co/storage/v1/object/public/photos'

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
        <Link href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '12px', fontWeight: 500, padding: '10px 22px', borderRadius: '99px', textDecoration: 'none' }}>
          Place an order
        </Link>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '80px 48px 100px' }}>

        {/* Header */}
        <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--brown)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ width: '40px', height: '0.5px', background: 'var(--tan)', display: 'inline-block' }} />
          About us
        </div>
        <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 64px)', color: 'var(--dark-brown)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '28px' }}>
          Two friends,<br />one <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>studio</em>.
        </h1>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '16px', maxWidth: '620px' }}>
          Studio2J started with late-night voice notes between Seoul and Tokyo. We kept sending each other photos of stationery we&apos;d found — things the other couldn&apos;t get to — and eventually realised we weren&apos;t the only ones who wanted this.
        </p>
        <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '16px', fontWeight: 300, lineHeight: 1.8, color: 'var(--brown)', marginBottom: '72px', maxWidth: '620px' }}>
          We see stationery as a vehicle for memory keeping. Writing with something beautiful, in a notebook that opens flat — it&apos;s a small act of care in a world that moves too fast.
        </p>

        {/* Founders — photo cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="about-grid">

          {/* Jin */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4' }}>
            <img
              src={`${PHOTOS}/jin-room.jpg`}
              alt="Jin's workspace in Seoul"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(31,20,12,0.85) 0%, rgba(31,20,12,0.1) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,169,141,0.7)', marginBottom: '8px' }}>
                Co-founder · Seoul 🇰🇷
              </div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 400, color: 'white', letterSpacing: '-0.02em', marginBottom: '8px' }}>Jin</div>
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(245,239,230,0.75)', marginBottom: '14px' }}>
                Finds the hidden gems in Hongdae and Yeonnam. Specialises in Korean character illustration markets and indie brands.
              </p>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
                &ldquo;Stationery is my luxury.&rdquo;
              </div>
            </div>
          </div>

          {/* Jo */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', aspectRatio: '3/4' }}>
            <img
              src={`${PHOTOS}/jo-desk.jpg`}
              alt="Jo's workspace in Tokyo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,20,40,0.88) 0%, rgba(10,20,40,0.1) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 28px 32px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(200,169,141,0.7)', marginBottom: '8px' }}>
                Co-founder · Tokyo 🇯🇵
              </div>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '28px', fontWeight: 400, color: 'white', letterSpacing: '-0.02em', marginBottom: '8px' }}>Jo</div>
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, lineHeight: 1.7, color: 'rgba(245,239,230,0.75)', marginBottom: '14px' }}>
                Obsessed with paper quality, texture, and the Japanese zakka spirit. Sources from Loft, Hobonichi, and the small shops that don&apos;t have English sites.
              </p>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '14px', fontWeight: 300, color: 'var(--tan)' }}>
                &ldquo;Journaling is my daily ritual.&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* Planner spreads */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '72px' }} className="about-grid">
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src={`${PHOTOS}/rollbahn.jpg`}
              alt="Rollbahn Diary spread with stickers and handwriting"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(1.06) contrast(1.03)' }}
            />
          </div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src={`${PHOTOS}/hobonichi.jpg`}
              alt="Hobonichi Techo weekly spread with drawings and plans"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(1.06) contrast(1.03)' }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', padding: '4px 4px 0' }}>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 300, color: 'var(--tan)' }}>Rollbahn Diary — Jo&apos;s scrapbooking</span>
            <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '13px', fontWeight: 300, color: 'var(--tan)' }}>Hobonichi Techo — weekly pages</span>
          </div>
        </div>

        {/* Values */}
        <div style={{ marginBottom: '64px' }}>
          <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '24px' }}>What we believe</div>
          {[
            { num: '01', text: 'Writing with beautiful tools is a radical act of self-care in a digital world.' },
            { num: '02', text: 'A well-made notebook opens flat, feels right in the hand, and changes how you think on the page.' },
            { num: '03', text: 'Korean and Japanese makers produce some of the finest paper goods in the world. More people should have access to them.' },
            { num: '04', text: 'Every order is handled personally. Every parcel leaves with a handwritten note. Care, not corporate.' },
          ].map(({ num, text }) => (
            <div key={num} style={{ display: 'flex', gap: '24px', padding: '20px 0', borderBottom: '0.5px solid rgba(122,92,69,0.1)', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontWeight: 300, fontSize: '18px', color: 'var(--tan)', flexShrink: 0, width: '28px' }}>{num}</div>
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, lineHeight: 1.75, color: 'var(--brown)' }}>{text}</p>
            </div>
          ))}
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
    </main>
  )
}
