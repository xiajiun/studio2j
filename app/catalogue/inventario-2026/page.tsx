export const runtime = 'edge'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const BRANDS: { name: string; korean?: string; instagram?: string; category: string }[] = [
  // SMALL THING
  { name: 'mt × rolledpaint', korean: 'mt × 롤드페인트', category: 'Small Thing' },
  { name: 'LIMPA LIMPA', korean: '겨울엔토스트가좋아', category: 'Small Thing' },
  { name: 'FRUITFRIES', korean: '후르츠후라이', instagram: 'fruitfries_', category: 'Small Thing' },
  { name: 'IWAKO', korean: '이와코', instagram: 'iwako_official', category: 'Small Thing' },
  { name: 'HWF.RISOCLUB', korean: '하우풀리소클럽', category: 'Small Thing' },
  { name: 'GOOBER', korean: '구버', category: 'Small Thing' },
  { name: 'MICIA', korean: '미씨아', instagram: 'micia_official', category: 'Small Thing' },
  { name: 'LYRA', korean: '리라', instagram: 'lyra_art_supplies', category: 'Small Thing' },
  { name: 'LIFE&PIECES', korean: '라이프앤피시스', category: 'Small Thing' },
  { name: 'IROHA', korean: '이로하', category: 'Small Thing' },
  { name: 'FLAGG', korean: '플래그', category: 'Small Thing' },
  { name: 'SOME MOOD DESIGN', korean: '썸무드디자인', category: 'Small Thing' },
  { name: 'BOKI', korean: '보키', category: 'Small Thing' },
  { name: 'SUKIDOKI', korean: '수키도키', instagram: 'sukidoki_official', category: 'Small Thing' },
  { name: 'AHMUGAE_C', korean: '아무개씨', category: 'Small Thing' },
  { name: 'SANBY', korean: '산비', instagram: 'sanby_jp', category: 'Small Thing' },
  { name: '0.1', instagram: '0.1studio_', category: 'Small Thing' },
  { name: 'MINIMONI', korean: '미니모니', category: 'Small Thing' },
  { name: 'HITOTOKI', korean: '히토토키', instagram: 'hitotoki_inc', category: 'Small Thing' },
  { name: 'PRESENT PRESENT', korean: '프레젠트프레젠트', category: 'Small Thing' },
  { name: 'KIOSK KIOSK', korean: '키오스크키오스크', instagram: 'kioskiosk_official', category: 'Small Thing' },
  { name: 'LITTLE TEMPO DESIGN', korean: '리틀템포디자인', category: 'Small Thing' },
  { name: 'ICONIC', korean: '아이코닉', instagram: 'iconic.stationery', category: 'Small Thing' },
  { name: 'PRELUDE STUDIO', korean: '프렐류드스튜디오', category: 'Small Thing' },
  { name: 'NO NOT NEVER', korean: '노낫네버', category: 'Small Thing' },
  { name: 'PULPUL', korean: '풀풀', category: 'Small Thing' },
  { name: 'RIFLE PAPER CO.', korean: '라이플페이퍼', instagram: 'riflepaperco', category: 'Small Thing' },
  { name: 'GEEHEY', korean: '지헤이', instagram: 'geehey_official', category: 'Small Thing' },
  { name: 'SUATELIER', korean: '슈아뜰리에', instagram: 'suatelier', category: 'Small Thing' },
  // WRITING & DRAWING
  { name: 'FABER-CASTELL', korean: '파버카스텔', instagram: 'fabercastell', category: 'Writing & Drawing' },
  { name: 'KAKIMORI', korean: '카키모리', instagram: 'kakimori', category: 'Writing & Drawing' },
  { name: 'BLACKHEART', korean: '흑심', category: 'Writing & Drawing' },
  { name: 'CARAN D\'ACHE', korean: '까렌다쉬', instagram: 'carandache', category: 'Writing & Drawing' },
  { name: 'SAILOR', korean: '세일러', instagram: 'sailorpen_official', category: 'Writing & Drawing' },
  { name: 'SHIELDCOLORS', korean: '쉴드물감', category: 'Writing & Drawing' },
  { name: 'COPIC', korean: '코픽', instagram: 'copicmarker', category: 'Writing & Drawing' },
  { name: 'WEARINGEUL', korean: '글입다', instagram: 'wearingeul', category: 'Writing & Drawing' },
  { name: 'DOMINANT INDUSTRY', korean: '도미넌트인더스트리', instagram: 'dominantindustry', category: 'Writing & Drawing' },
  { name: 'KOREA PILOT', korean: '한국파이롯트', category: 'Writing & Drawing' },
  { name: 'ZEBRA', korean: '제브라', instagram: 'zebra_pen', category: 'Writing & Drawing' },
  { name: 'PENTEL', korean: '펜텔', instagram: 'pentel_official', category: 'Writing & Drawing' },
  { name: 'RAYMAY KEPT', korean: '레이메이 켑트', category: 'Writing & Drawing' },
  { name: 'WOODHI', korean: '우디', category: 'Writing & Drawing' },
  { name: 'UNI', korean: '유니', category: 'Writing & Drawing' },
  { name: 'JACQUES HERBIN', korean: '자크 허빈', instagram: 'jacquesherbin', category: 'Writing & Drawing' },
  { name: 'GLOBE CHEMICAL', korean: '지구화학', category: 'Writing & Drawing' },
  { name: 'CLIPEN', korean: '클립펜', category: 'Writing & Drawing' },
  // DAILY FINDS
  { name: 'POV', korean: '포인트오브뷰', category: 'Daily Finds' },
  { name: 'POV × HELLO KITTY', korean: '포인트오브뷰 × 헬로키티', category: 'Daily Finds' },
  { name: 'THENCE', korean: '덴스', category: 'Daily Finds' },
  { name: 'MEET ME', korean: '밑미', instagram: 'meetme_official', category: 'Daily Finds' },
  { name: 'NOBIGDEAL', korean: '노빅딜', category: 'Daily Finds' },
  { name: 'GONGYEGA', korean: '공예가', category: 'Daily Finds' },
  { name: 'TIETOA', korean: '티에토아', category: 'Daily Finds' },
  { name: 'KITTY BUNNY PONY', korean: '키티버니포니', instagram: 'kittybunnypony', category: 'Daily Finds' },
  { name: 'OH, LOLLY DAY!', korean: '오롤리데이', instagram: 'ohlollyday', category: 'Daily Finds' },
  { name: 'YOUR-MIND', korean: '유어마인드', instagram: 'your_mind_store', category: 'Daily Finds' },
  { name: 'onemorebag', korean: '원모어백', instagram: 'onemorebag_official', category: 'Daily Finds' },
  { name: 'SAILORS', korean: '세일러즈', category: 'Daily Finds' },
  { name: 'OIMU', korean: '오이뮤', instagram: 'oimu_official', category: 'Daily Finds' },
  { name: 'HOWkidsFUL', korean: '하우키즈풀', category: 'Daily Finds' },
  { name: 'FRANZ', korean: '프란츠', category: 'Daily Finds' },
  { name: 'CIRCUS BOY BAND', korean: '서커스보이밴드', instagram: 'circusboyband', category: 'Daily Finds' },
  { name: 'TRAVELER\'S COMPANY', korean: '트래블러스컴퍼니', instagram: 'travelerscompany', category: 'Daily Finds' },
  // PAPER
  { name: 'DOOSUNG PAPER', korean: '두성종이', instagram: 'doosungpaper', category: 'Paper' },
  { name: 'PAPER TAILOR', korean: '페이퍼테일러', category: 'Paper' },
  { name: 'GONGJANG', korean: '그린디자인웍스 공장', category: 'Paper' },
  { name: 'MOHS', korean: '모스', category: 'Paper' },
  { name: 'O-CHECK', korean: '오첵', instagram: 'ocheckdesign', category: 'Paper' },
  { name: 'HANSOL PAPER × URBANBOOKS', korean: '한솔제지 × 어반북스', category: 'Paper' },
  { name: 'SAMWON PAPER', korean: '삼원페이퍼', category: 'Paper' },
  { name: 'BE ON D', korean: '비온뒤', instagram: 'be_on_d', category: 'Paper' },
  { name: 'WHENIWASYOUNG', korean: '웬아이워즈영', instagram: 'wheniwasyoung_official', category: 'Paper' },
  { name: 'KAWI', korean: '가위', category: 'Paper' },
  { name: 'TROLLS PAPER', korean: '트롤스페이퍼', instagram: 'trollspaper', category: 'Paper' },
  { name: 'YANGJISA', korean: '양지사', category: 'Paper' },
  { name: 'SOSOMOONGOO', korean: '소소문구', instagram: 'sosomoongoo', category: 'Paper' },
  { name: 'PAPER PLATE', korean: '페이퍼플레이트', category: 'Paper' },
  { name: 'GEULWOL', korean: '글월', category: 'Paper' },
  { name: 'COMPOSITION STUDIO', korean: '컴포지션 스튜디오', instagram: 'composition_studio', category: 'Paper' },
  { name: 'MOLESKINE', korean: '몰스킨', instagram: 'moleskine', category: 'Paper' },
  { name: 'RHODIA', korean: '로디아', instagram: 'rhodiafrance', category: 'Paper' },
  { name: 'PAPERIAN', korean: '페이퍼리안', instagram: 'paperian_official', category: 'Paper' },
  { name: 'THE COMPLETIST', korean: '더컴플리티스트', instagram: 'thecompletist', category: 'Paper' },
  // OFFICE & DESK
  { name: 'PENCO®', korean: '펜코', instagram: 'penco_official', category: 'Office & Desk' },
  { name: 'LOGITECH', korean: '로지텍', instagram: 'logitech', category: 'Office & Desk' },
  { name: 'KOKUYO', korean: '고쿠요', instagram: 'kokuyo_jp', category: 'Office & Desk' },
  { name: 'ILOOM', korean: '일룸', instagram: 'iloom_official', category: 'Office & Desk' },
  { name: 'WIP', korean: '워크인프로그래스', category: 'Office & Desk' },
  { name: 'BUYHEARTS', korean: '바이하츠', instagram: 'buyhearts_official', category: 'Office & Desk' },
  { name: 'MAGAZINE C', korean: '매거진C', instagram: 'magazinec_official', category: 'Office & Desk' },
  { name: 'NELNA', korean: '낼나', category: 'Office & Desk' },
  { name: 'MOTEMOTE', korean: '모트모트', instagram: 'motemote_official', category: 'Office & Desk' },
  { name: 'PLUS', korean: '프러스', category: 'Office & Desk' },
  { name: 'CRAFT DESIGN TECHNOLOGY', korean: '크래프트디자인테크놀로지', instagram: 'craftdesigntechnology', category: 'Office & Desk' },
  { name: 'SANRO', korean: '산로', category: 'Office & Desk' },
  // KIOSK
  { name: 'MARK\'S', korean: '마크스', instagram: 'marks_inc', category: 'Kiosk' },
  { name: 'OUIE', korean: '우이', category: 'Kiosk' },
  { name: 'MINDOBITTO', korean: '민도비또', category: 'Kiosk' },
  { name: 'HWARANG', korean: '화랑', category: 'Kiosk' },
  { name: 'DONKY CONTÉ', korean: '동키콩테', category: 'Kiosk' },
  { name: 'ANTERIQUE', korean: '안테리크', instagram: 'anterique', category: 'Kiosk' },
  { name: 'SUI GOUACHE', korean: '수이과슈', category: 'Kiosk' },
  { name: 'MEWMEWBEAM', korean: '냥냥빔', category: 'Kiosk' },
  { name: 'NOH YONG-WON', korean: '노용원 혁필화', category: 'Kiosk' },
]

const CATEGORIES = [...new Set(BRANDS.map(b => b.category))]

export default function InventarioCataloguePage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', background: 'var(--cream)', paddingTop: '120px', paddingBottom: '100px' }}>
        <div className="container">

          {/* Header */}
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link href="/#tracker" style={{ color: 'var(--tan)', textDecoration: 'none' }}>← Fairs</Link>
              <span style={{ color: 'rgba(200,169,141,0.3)' }}>·</span>
              <span>Seoul Illustration Fair</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              INVENTARIO <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>2026</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
              April 23–26, 2026 · COEX, Seoul · Illustration &amp; stationery fair
            </p>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
              {BRANDS.length} participating brands
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Order from this fair →
              </a>
              <a href="https://inventario.kr" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
                Official site ↗
              </a>
            </div>
          </div>

          {/* Brands by category */}
          {CATEGORIES.map(cat => (
            <div key={cat} style={{ marginBottom: '56px' }}>
              <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                {cat}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                {BRANDS.filter(b => b.category === cat).map(b => (
                  <div key={b.name} style={{ background: 'white', borderRadius: '14px', padding: '18px', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ fontFamily: 'var(--font-fraunces), serif', fontSize: '15px', fontWeight: 400, color: 'var(--dark-brown)', letterSpacing: '-0.01em', lineHeight: 1.3 }}>
                      {b.name}
                    </div>
                    {b.korean && (
                      <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '11px', fontWeight: 300, color: 'var(--tan)' }}>
                        {b.korean}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                      {b.instagram && (
                        <a href={`https://www.instagram.com/${b.instagram}/`} target="_blank" rel="noreferrer"
                          style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(31,58,95,0.06)', padding: '3px 8px', borderRadius: '99px' }}>
                          Instagram ↗
                        </a>
                      )}
                      <a href="/order/new" style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 400, color: 'var(--brown)', textDecoration: 'none', background: 'rgba(122,92,69,0.06)', padding: '3px 8px', borderRadius: '99px' }}>
                        Order →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </main>
      <Footer />
    </>
  )
}
