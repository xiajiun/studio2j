'use client'

export const runtime = 'edge'

import { useState } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Link from 'next/link'

const BRANDS: { name: string; korean?: string; instagram?: string; image?: string; url?: string; country?: string; booth?: string; post?: string; category: string }[] = [
  // Page 1
  { name: '스워츠샵', category: 'All brands' },
  { name: '스워트리리', category: 'All brands' },
  { name: '스튜디오 다다다', instagram: 'damy0w0', booth: 'F18', post: 'https://www.instagram.com/p/DXxHko0EkS5/', category: 'All brands' },
  { name: '스튜디오 후애', category: 'All brands' },
  { name: '스티커스', instagram: 'st2krs', post: 'https://www.instagram.com/p/DXt88fzAfFV/', category: 'All brands' },
  { name: '슬로우스터프', instagram: 'slow.stuff', booth: 'F05', post: 'https://www.instagram.com/p/DX3dMXeme04/', category: 'All brands' },
  { name: '시네샵', category: 'All brands' },
  { name: '썸딩비러브드', category: 'All brands' },
  { name: '아델리드로우', category: 'All brands' },
  { name: '아무스투', category: 'All brands' },
  { name: '아춧코코', instagram: 'ahchuucoco', booth: 'G01', post: 'https://www.instagram.com/p/DX8aMoWmVsI/', category: 'All brands' },
  { name: '아코. 아이콩', instagram: 'xas2ko', booth: 'G04', post: 'https://www.instagram.com/p/DX3fa_2iZdT/', category: 'All brands' },
  { name: '아롱문구', category: 'All brands' },
  { name: '어쩔문구', instagram: 'sowhatmungu', booth: 'G02', post: 'https://www.instagram.com/p/DX09PLMiZ4h/', category: 'All brands' },
  { name: '에이투지클럽', category: 'All brands' },
  { name: '엔젤버스데이', category: 'All brands' },
  { name: '연포포', instagram: 'yeonpopo_', booth: 'H13', post: 'https://www.instagram.com/p/DX6zkeIk3mJ/', category: 'All brands' },
  { name: '열새', category: 'All brands' },
  { name: '와이오클럽', category: 'All brands' },
  { name: '요인', category: 'All brands' },
  { name: '웨스티즈', instagram: 'westiez_', booth: 'F20', post: 'https://www.instagram.com/p/DX6zfZGlLDA/', category: 'All brands' },
  { name: '웨이투페치', instagram: 'waytoofetch_', booth: 'A01', post: 'https://www.instagram.com/p/DXy0FfNGeOU/', category: 'All brands' },
  { name: '유리', category: 'All brands' },
  { name: '유리카', category: 'All brands' },
  { name: '유메', instagram: 'baby___yume_', booth: 'G06', post: 'https://www.instagram.com/p/DX0rTQXGgik/', category: 'All brands' },
  { name: '은새상점', instagram: 'little.bird_market', booth: 'J08', post: 'https://www.instagram.com/p/DXy-NJ-oLzx/', category: 'All brands' },
  { name: '이브포유', instagram: 'byyourside_eve', booth: 'H06', post: 'https://www.instagram.com/p/DX12_DGmCYi/', category: 'All brands' },
  { name: '임퍼펙트차일드', instagram: 'imperfectchiiild_', booth: 'D10', post: 'https://www.instagram.com/p/DXyhJ8Pmjmf/', category: 'All brands' },
  { name: '짜꾸짜꾸', category: 'All brands' },
  { name: '잘사라', category: 'All brands' },
  { name: '재이하우스', category: 'All brands' },
  { name: '점프점프하트', instagram: 'jumpjumpheart', post: 'https://www.instagram.com/p/DXwNHxbiR4_/', category: 'All brands' },
  { name: '정배', instagram: 'jbeagoop', category: 'All brands' },
  { name: '제니빌리지', instagram: 'jennyvillage', booth: 'H05', post: 'https://www.instagram.com/p/DX4XBFSkvpq/', category: 'All brands' },
  { name: '제리', category: 'All brands' },
  { name: '제제유니버스', category: 'All brands' },
  { name: '제키베어', instagram: 'zekibear', booth: 'A07', post: 'https://www.instagram.com/p/DX885BvE-Ie/', category: 'All brands' },
  { name: '죠빔이', category: 'All brands' },
  { name: '지구침략', category: 'All brands' },
  { name: '지옴', category: 'All brands' },
  { name: '쪼꼬지 패밀리', category: 'All brands' },
  { name: '쭈', category: 'All brands' },
  { name: '청록', instagram: '_cheongnok', category: 'All brands' },
  { name: '초코메로', category: 'All brands' },
  { name: '치리클럽', category: 'All brands' },
  { name: '칠영칠', instagram: '707.site', post: 'https://www.instagram.com/p/DRlpvRokRI6/', category: 'All brands' },
  { name: '케이와이아이', category: 'All brands' },
  { name: '케짐 빌리지', instagram: 'kezim_com', booth: 'F01', post: 'https://www.instagram.com/p/DX6hz_9FAc9/', category: 'All brands' },
  { name: '코마메링고', category: 'All brands' },
  { name: '코스모 익스프레스', category: 'All brands' },
  { name: '코코벤네', category: 'All brands' },
  { name: '코튼월드', instagram: 'cottonworld__', booth: 'J01', post: 'https://www.instagram.com/p/DX9LLdCAVUW/', category: 'All brands' },
  { name: '쿠마쿠마클럽', category: 'All brands' },
  { name: '쿠만만', instagram: 'quu.manman', booth: 'D12', post: 'https://www.instagram.com/p/DXzALUxEd4O/', category: 'All brands' },
  { name: '쿠킹쿠키', category: 'All brands' },
  { name: '크래커드크랙', category: 'All brands' },
  { name: '크리미크럼즈', category: 'All brands' },
  { name: '클론연구소', category: 'All brands' },
  { name: '키노코', category: 'All brands' },
  { name: '탁짜밀문방구', category: 'All brands' },
  { name: '테트라포트멜론티', instagram: 'tetrapod.melontea', booth: 'B16', post: 'https://www.instagram.com/p/DX1ZKEfkU4B/', category: 'All brands' },
  { name: '티티포레스트', instagram: 'titi_forest', booth: 'H04', post: 'https://www.instagram.com/p/DUjKAtHE5kS/', category: 'All brands' },
  { name: '파나모나걸스', instagram: 'panamona_girls', booth: 'B18', post: 'https://www.instagram.com/p/DX0-hPDEmoC/', category: 'All brands' },
  { name: '파사', category: 'All brands' },
  { name: '퍼지랜드', category: 'All brands' },
  { name: '펄리버튼', instagram: 'pearly_button', post: 'https://www.instagram.com/p/DX1f-8wiXDO/', category: 'All brands' },
  { name: '평화조각', instagram: 'pyunghwa_jogak', post: 'https://www.instagram.com/p/DX4CdjvEjPv/', category: 'All brands' },
  { name: '포랑', instagram: 'forang.kr', booth: 'D01', post: 'https://www.instagram.com/p/DX11NNDkle9/', category: 'All brands' },
  { name: '포베', category: 'All brands' },
  { name: '포에티코', category: 'All brands' },
  { name: '포포', category: 'All brands' },
  { name: '폴랑폴랑', instagram: 'pollang2', post: 'https://www.instagram.com/p/DX10alzERKD/', category: 'All brands' },
  { name: '푸름핑클럽', instagram: 'pureum.thing.club', booth: 'H20', post: 'https://www.instagram.com/p/DXoYG1QgBsH/', category: 'All brands' },
  { name: '프롬투스튜디오', instagram: 'fromtostudio', booth: 'E06', post: 'https://www.instagram.com/p/DX39IybEmJe/', category: 'All brands' },
  { name: '프리즐프렌즈', category: 'All brands' },
  { name: '핑루', category: 'All brands' },
  { name: '하기노러브', category: 'All brands' },
  { name: '하트쉽 스튜디오', category: 'All brands' },
  { name: '해니마니', instagram: 'henimani_store', booth: 'B19', post: 'https://www.instagram.com/p/DXzLmZUjwiF/', category: 'All brands' },
  { name: '해피낭데이', instagram: 'happy_nyang_day', booth: 'I09', post: 'https://www.instagram.com/p/DX1Q4_Fkya3/', category: 'All brands' },
  { name: '해피스트플러피샵', category: 'All brands' },
  { name: '허니올스튜디오', category: 'All brands' },
  { name: '헤이오오스튜디오', category: 'All brands' },
  { name: '훈찌마켓', category: 'All brands' },
  { name: '히밍', category: 'All brands' },
  { name: '히즈', category: 'All brands' },
  { name: 'FLUFFYS', category: 'All brands' },
  { name: 'Gla:ssy', instagram: 'glassy_xyz', booth: 'H17', post: 'https://www.instagram.com/p/DX9FeY8E4Bz/', category: 'All brands' },
  { name: 'MODABI', instagram: 'modabi_sea', booth: 'K07', post: 'https://www.instagram.com/p/DX7AyrPD6bt/', category: 'All brands' },
  { name: 'Rocoa', category: 'All brands' },
  { name: 'sweets sh☆p', instagram: 'sweeetsshop_', booth: 'K15', post: 'https://www.instagram.com/p/DX00-Uekwbq/', category: 'All brands' },
  { name: 'Labyss', instagram: 'labyss_archive', booth: 'A14', post: 'https://www.instagram.com/p/DX1ZFImE90B/', category: 'All brands' },
  // Page 2
  { name: '갱갱', instagram: 'gaengxgaeng', booth: 'J06', post: 'https://www.instagram.com/p/DXy791wCbi4/', category: 'All brands' },
  { name: '검은 새벽-김래곤', instagram: 'kimlaegon911', post: 'https://www.instagram.com/p/DXtoqcVj9NC/', category: 'All brands' },
  { name: '고양이방앗간', category: 'All brands' },
  { name: '고요', category: 'All brands' },
  { name: '고운그림', category: 'All brands' },
  { name: '구미리', category: 'All brands' },
  { name: '귀여워핑크클럽', category: 'All brands' },
  { name: '그렁그렁단', instagram: 'grgr_dan', booth: 'D05', post: 'https://www.instagram.com/p/DX38S9yCeL9/', category: 'All brands' },
  { name: '그림자 행성', instagram: 'leena_176', post: 'https://www.instagram.com/p/DXvgGilkdmS/', category: 'All brands' },
  { name: '김모양군', category: 'All brands' },
  { name: '김부록씨', instagram: 'pxxulockssi', booth: 'C01', post: 'https://www.instagram.com/p/DXwK8-TEYOR/', category: 'All brands' },
  { name: '꾸모꾸모', category: 'All brands' },
  { name: '나나스무드', instagram: 'nanasmood', category: 'All brands' },
  { name: '나로메로 캔디', category: 'All brands' },
  { name: '나모쿠', category: 'All brands' },
  { name: '나제', category: 'All brands' },
  { name: '나조나조', category: 'All brands' },
  { name: '나츠나', category: 'All brands' },
  { name: '낭만', category: 'All brands' },
  { name: '남남', category: 'All brands' },
  { name: '넛코코', instagram: 'nutcoco_s', booth: 'E02', post: 'https://www.instagram.com/p/DX4JvOXE-yb/', category: 'All brands' },
  { name: '네버더레스', instagram: 'wwwneverthelesscom', post: 'https://www.instagram.com/p/DXygPiLk6Bs/', category: 'All brands' },
  { name: '단팥', instagram: 'danpat_s', post: 'https://www.instagram.com/p/DX1p9QJk7qI/', category: 'All brands' },
  { name: '더프린티드걸', category: 'All brands' },
  { name: '덩이나라', instagram: 'dung2nara', post: 'https://www.instagram.com/p/DXynhZ6kYku/', category: 'All brands' },
  { name: '도꾸마리', category: 'All brands' },
  { name: '도르', category: 'All brands' },
  { name: '도리', category: 'All brands' },
  { name: '도미월드', category: 'All brands' },
  { name: '도시오브드림', instagram: 'dociofdreams', booth: 'C05', post: 'https://www.instagram.com/p/DX8ofLkEYEP/', category: 'All brands' },
  { name: '동식물원', category: 'All brands' },
  { name: '라리데이즈', instagram: '0_0_yurari', booth: 'K10', post: 'https://www.instagram.com/p/DX0mxSsEZUl/', category: 'All brands' },
  { name: '라비스', category: 'All brands' },
  { name: '라연팬시', instagram: 'rayeonfancy', booth: 'D07', post: 'https://www.instagram.com/p/DX3oVRnkfpg/', category: 'All brands' },
  { name: '랄랑', instagram: 'lalangheej', booth: 'F16', post: 'https://www.instagram.com/p/DX1BXivE81a/', category: 'All brands' },
  { name: '러버스픽미', category: 'All brands' },
  { name: '럽피클럽', category: 'All brands' },
  { name: '레로카', instagram: '_reroca_', booth: 'C14', post: 'https://www.instagram.com/p/DX6qYB0lEGx/', category: 'All brands' },
  { name: '로지스티커', category: 'All brands' },
  { name: '로튼캔들', instagram: 'rottencandle.x_x', booth: 'D04', post: 'https://www.instagram.com/p/DX0zGReAaQ_/', category: 'All brands' },
  { name: '루아', category: 'All brands' },
  { name: '룬튜디오', category: 'All brands' },
  { name: '룹비긴즈', instagram: 'fromlooptobegins', booth: 'C03', post: 'https://www.instagram.com/p/DXytGy3Ec6K/', category: 'All brands' },
  { name: '르미', category: 'All brands' },
  { name: '리코마루', category: 'All brands' },
  { name: '리틀타이니룸', category: 'All brands' },
  { name: '마고즈', category: 'All brands' },
  { name: '마고행수', category: 'All brands' },
  { name: '마법사고양상점', category: 'All brands' },
  { name: '마시랜드', category: 'All brands' },
  { name: '마요씨', category: 'All brands' },
  { name: '마이모이', category: 'All brands' },
  { name: '만짱상점', category: 'All brands' },
  { name: '맹글도어', category: 'All brands' },
  { name: '멜로우 아라모드', instagram: 'ddamma_o3o', booth: 'A06', post: 'https://www.instagram.com/p/DXrCB96k43V/', category: 'All brands' },
  { name: '모루', category: 'All brands' },
  { name: '모리마', category: 'All brands' },
  { name: '모모이하우스', instagram: 'momoi_house', post: 'https://www.instagram.com/p/DXygvzlE-Zb/', category: 'All brands' },
  { name: '모셔리 스튜디오', category: 'All brands' },
  { name: '모이도이', instagram: 'moii_ttoi', booth: 'F09', post: 'https://www.instagram.com/p/DX1dOdsEzSg/', category: 'All brands' },
  { name: '몽몽스베쥬', category: 'All brands' },
  { name: '무디클럽', instagram: 'moodyclu_b', booth: 'J08', post: 'https://www.instagram.com/p/DX6r-KXj5bu/', category: 'All brands' },
  { name: '믈뇨', category: 'All brands' },
  { name: '미나', category: 'All brands' },
  { name: '미나냥마켓', category: 'All brands' },
  { name: '미료코', category: 'All brands' },
  { name: '미타코어', category: 'All brands' },
  { name: '미히', category: 'All brands' },
  { name: '밋츠유', instagram: 'meets2_u', booth: 'K11', post: 'https://www.instagram.com/p/DX3hvr5D6Iw/', category: 'All brands' },
  { name: '박남', category: 'All brands' },
  { name: '반곱실', category: 'All brands' },
  { name: '백구삼스튜디오', instagram: '193studio', booth: 'D02', post: 'https://www.instagram.com/p/DX1OUsQidJs/', category: 'All brands' },
  { name: '베베', category: 'All brands' },
  { name: '베비마루', category: 'All brands' },
  { name: '별사세', instagram: 'byeolsase', post: 'https://www.instagram.com/p/DXwX72ZkQa9/', category: 'All brands' },
  { name: '보링보링', instagram: 'shop.boringboring', post: 'https://www.instagram.com/p/DX1oLLqkyQ6/', category: 'All brands' },
  { name: '블랙레터', instagram: 'blackletter_kr', booth: 'B04', post: 'https://www.instagram.com/p/DX9S9iVEZVK/', category: 'All brands' },
  { name: '빙빙문구', instagram: 'bingbing_mungu', booth: 'F19', category: 'All brands' },
  { name: '보레월드', instagram: 'tawac3po', booth: 'E17', post: 'https://www.instagram.com/p/DX3tPWpkTjC/', category: 'All brands' },
  { name: '뽁뽁즈', category: 'All brands' },
  { name: '싸나다', category: 'All brands' },
  { name: '싸무국', instagram: '3123report_', booth: 'K16', post: 'https://www.instagram.com/p/DX9Jq03D96G/', category: 'All brands' },
  { name: '싸오코', category: 'All brands' },
  { name: '서리꽃', category: 'All brands' },
  { name: '셔티', category: 'All brands' },
  { name: '소녀교실', instagram: 'sonyeokyosil', booth: 'F05', post: 'https://www.instagram.com/p/DJyUashR4Fz/', category: 'All brands' },
  { name: '소누', instagram: 'sonu_choi_', booth: 'K01', post: 'https://www.instagram.com/p/DX2BLT9k6k-/', category: 'All brands' },
  { name: '소랏', instagram: 'sorat_illust', post: 'https://www.instagram.com/p/DX9ODPuk65H/', category: 'All brands' },
  { name: '소소히히', instagram: '_soso_hehe', booth: 'A10', post: 'https://www.instagram.com/p/DXyyKOFEleN/', category: 'All brands' },
  { name: '소푸', category: 'All brands' },
  { name: '수아로로', category: 'All brands' },
  { name: '수중', instagram: 's0ojoong', booth: 'A05', post: 'https://www.instagram.com/p/DX1TYVPkutR/', category: 'All brands' },
  { name: '수프효과', category: 'All brands' },
  { name: '슈가티', category: 'All brands' },
  { name: '스닙스니페티스닙', category: 'All brands' },
  { name: '스우', instagram: 'sw_o.ov', booth: 'J09', post: 'https://www.instagram.com/p/DX04RecDwnk/', category: 'All brands' },
]

const CATEGORIES = [...new Set(BRANDS.map(b => b.category))]

function BrandIcon({ brand }: { brand: typeof BRANDS[0] }) {
  const [ok, setOk] = useState(true)
  const src = brand.image ?? (brand.url ? `https://www.google.com/s2/favicons?domain=${brand.url}&sz=128` : null)
  return (
    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--beige)', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
      {src && ok ? (
        <img src={src} alt={brand.name} onError={() => setOk(false)} style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
      ) : (
        <span style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '18px', fontWeight: 300, color: 'var(--tan)' }}>
          {brand.name.charAt(0)}
        </span>
      )}
    </div>
  )
}

export default function DotDotExpressCataloguePage() {
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
              <span>Seoul Illustration Market</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 300, fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.04, letterSpacing: '-0.03em', color: 'var(--dark-brown)', marginBottom: '16px' }}>
              DOTDOTDOT <em style={{ fontStyle: 'italic', color: 'var(--dark-blue)' }}>v.7</em>
            </h1>
            <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '15px', fontWeight: 300, color: 'var(--brown)', lineHeight: 1.8, maxWidth: '560px', marginBottom: '8px' }}>
              Seoul · Korean illustrator &amp; stationery market
            </p>
            {BRANDS.length > 0 && (
              <p style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 300, color: 'var(--tan)', marginBottom: '32px' }}>
                {BRANDS.length} participating brands
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
              <a href="/order/new" style={{ background: 'var(--dark-blue)', color: 'var(--cream)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 500, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none', letterSpacing: '0.02em' }}>
                Order from this fair →
              </a>
              <a href="https://www.instagram.com/dot.dot.dot.express/" target="_blank" rel="noreferrer" style={{ border: '0.5px solid rgba(122,92,69,0.25)', color: 'var(--brown)', fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, padding: '12px 24px', borderRadius: '99px', textDecoration: 'none' }}>
                @dot.dot.dot.express ↗
              </a>
            </div>
          </div>

          {/* Brands */}
          {BRANDS.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', borderTop: '0.5px solid rgba(122,92,69,0.1)' }}>
              <p style={{ fontFamily: 'var(--font-fraunces), serif', fontStyle: 'italic', fontSize: '20px', color: 'var(--tan)' }}>
                Brand list coming soon.
              </p>
            </div>
          ) : (
            CATEGORIES.map(cat => (
              <div key={cat} style={{ marginBottom: '56px' }}>
                <div style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--tan)', marginBottom: '20px', paddingBottom: '10px', borderBottom: '0.5px solid rgba(122,92,69,0.1)' }}>
                  {cat}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px' }}>
                  {BRANDS.filter(b => b.category === cat).map(b => (
                    <div key={b.name} style={{ background: 'white', borderRadius: '14px', padding: '14px 16px', border: '0.5px solid rgba(122,92,69,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <BrandIcon brand={b} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '13px', fontWeight: 400, color: 'var(--dark-brown)', lineHeight: 1.3 }}>
                            {b.name}
                          </span>
                          {b.booth && (
                            <span style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 600, color: 'var(--dark-blue)', background: 'rgba(31,58,95,0.08)', padding: '1px 7px', borderRadius: '99px', flexShrink: 0 }}>
                              {b.booth}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {b.instagram && (
                            <a href={`https://www.instagram.com/${b.instagram}/`} target="_blank" rel="noreferrer"
                              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 300, color: 'var(--tan)', textDecoration: 'none' }}>
                              @{b.instagram}
                            </a>
                          )}
                          {b.post && (
                            <a href={b.post} target="_blank" rel="noreferrer"
                              style={{ fontFamily: 'var(--font-inter), sans-serif', fontSize: '10px', fontWeight: 500, color: 'var(--dark-blue)', textDecoration: 'none', background: 'rgba(31,58,95,0.06)', padding: '2px 8px', borderRadius: '99px' }}>
                              Catalogue ↗
                            </a>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: '14px', flexShrink: 0 }}>🇰🇷</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
