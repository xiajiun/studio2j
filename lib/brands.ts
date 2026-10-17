export type BrandCategory = 'stationery' | 'illustration' | 'planner' | 'lifestyle' | 'art supplies'
export type BrandRegion = 'Korea' | 'Japan'

export interface Brand {
  name: string
  url: string
  region: BrandRegion
  description: string
  categories: BrandCategory[]
  featured?: boolean
  image?: string  // custom image URL; falls back to favicon
}

export const BRANDS: Brand[] = [
  // ─── KOREA ────────────────────────────────────────────────────────────────
  {
    name: 'Twenty',
    url: 'twenty.style',
    region: 'Korea',
    description: 'Korean character illustrator market — artists sell limited drops directly to fans.',
    categories: ['illustration', 'stationery'],
    featured: true,
  },
  {
    name: '10×10',
    url: '10x10.co.kr',
    region: 'Korea',
    description: 'One of Korea\'s largest stationery and lifestyle shops. Huge selection of Korean indie brands.',
    categories: ['stationery', 'lifestyle'],
    featured: true,
  },
  {
    name: 'Artbox',
    url: 'poom.co.kr',
    region: 'Korea',
    description: 'Iconic Korean stationery chain known for character goods, planners, and cute office supplies.',
    categories: ['stationery', 'lifestyle'],
    featured: true,
  },
  {
    name: 'Analogue Keeper',
    url: 'brand.naver.com',
    region: 'Korea',
    description: 'Minimalist Korean stationery — notebooks, pens, and planners with a clean aesthetic.',
    categories: ['stationery', 'planner'],
  },
  {
    name: 'Beesket Studio',
    url: 'beesketstudio.com',
    region: 'Korea',
    description: 'Korean illustration studio — cute stickers, masking tape, and character goods.',
    categories: ['illustration', 'stationery'],
  },
  {
    name: 'B on D',
    url: 'aftertherain0.com',
    region: 'Korea',
    description: 'Korean indie brand with distinctive illustration-driven stationery and accessories.',
    categories: ['illustration', 'stationery'],
  },
  {
    name: 'Inside Object',
    url: 'insideobject.com',
    region: 'Korea',
    description: 'Thoughtfully designed Korean stationery — notebooks, pens, and desk accessories.',
    categories: ['stationery', 'lifestyle'],
  },
  {
    name: 'LUCALAB',
    url: 'lucalabonline.cafe24.com',
    region: 'Korea',
    description: 'Korean stationery brand focused on planners, washi tape, and illustration prints.',
    categories: ['stationery', 'planner'],
  },
  {
    name: 'Little Tempo',
    url: 'smartstore.naver.com',
    region: 'Korea',
    description: 'Korean indie stationery brand — seasonal collections of stickers and journals.',
    categories: ['stationery', 'illustration'],
  },
  {
    name: 'MUNGLEE',
    url: 'linktr.ee/munglee',
    region: 'Korea',
    description: 'Adorable Korean character brand with stickers, stationery, and small goods.',
    categories: ['illustration', 'stationery'],
  },
  {
    name: 'oh, lolly day!',
    url: 'oh-lolly-day.com',
    region: 'Korea',
    description: 'Whimsical Korean illustration brand known for charming stickers and paper goods.',
    categories: ['illustration', 'stationery'],
  },
  {
    name: 'Point Of View',
    url: 'pointofview.kr',
    region: 'Korea',
    description: 'Korean design studio — architectural and lifestyle-inspired stationery.',
    categories: ['stationery', 'lifestyle'],
  },
  {
    name: 'Trust My Vibe',
    url: 'trustmyvibe.com',
    region: 'Korea',
    description: 'Korean lifestyle brand with a bold aesthetic — stationery, prints, and accessories.',
    categories: ['lifestyle', 'stationery'],
  },
  {
    name: 'SUSTORE',
    url: 'susstore.co.kr',
    region: 'Korea',
    description: 'Korean stationery and planner brand with clean, modern designs.',
    categories: ['stationery', 'planner'],
  },

  // ─── JAPAN ────────────────────────────────────────────────────────────────
  {
    name: 'Hobonichi Techo',
    url: '1101.com',
    region: 'Japan',
    description: 'Japan\'s most beloved planner brand — the Hobonichi Techo is a cult classic with annual limited editions.',
    categories: ['planner', 'stationery'],
    featured: true,
  },
  {
    name: 'Loft',
    url: 'loft.co.jp',
    region: 'Japan',
    description: 'Japan\'s go-to lifestyle and stationery retailer. The best place for stickers, notebooks, and seasonal collections.',
    categories: ['stationery', 'lifestyle'],
    featured: true,
  },
  {
    name: 'Midori',
    url: 'midori-store.net',
    region: 'Japan',
    description: 'Legendary Japanese paper and stationery brand — Traveler\'s Notebooks, MD paper, and quality pens.',
    categories: ['stationery', 'planner'],
    featured: true,
  },
  {
    name: 'Afternoon Tea',
    url: 'shop.afternoon-tea.net',
    region: 'Japan',
    description: 'Japanese lifestyle brand with charming floral-themed stationery, mugs, and seasonal goods.',
    categories: ['lifestyle', 'stationery'],
  },
  {
    name: 'Laconic Tokyo',
    url: 'laconic-generalstore.jp',
    region: 'Japan',
    description: 'Minimalist Japanese stationery — clean grid planners and elegant desk accessories.',
    categories: ['stationery', 'planner'],
  },
  {
    name: 'Rollbahn',
    url: 'shop.delfonics.com',
    region: 'Japan',
    description: 'Delfonics\' iconic spiral notebook brand — beloved for pocket notebooks and functional diaries.',
    categories: ['stationery', 'planner'],
  },
  {
    name: 'Ryu Ryu',
    url: 'ryuryu-market.jp',
    region: 'Japan',
    description: 'Japanese stationery brand with seasonal collections of washi tape, memo pads, and character stationery.',
    categories: ['stationery', 'illustration'],
  },
  {
    name: 'Sekaido',
    url: 'webshop.sekaido.co.jp',
    region: 'Japan',
    description: 'Tokyo\'s legendary art supply store — professional art materials, paper, and specialist tools.',
    categories: ['art supplies', 'stationery'],
  },
  {
    name: 'Torinco',
    url: 'takahashishoten.co.jp',
    region: 'Japan',
    description: 'Takahashi Shoten\'s Torinco notebooks — beautifully crafted Japanese notebooks with excellent paper.',
    categories: ['stationery', 'planner'],
  },
  {
    name: 'Ashford',
    url: 'ashford-style.com',
    region: 'Japan',
    description: 'Japanese system planner specialist — high-quality binders, refills, and accessories.',
    categories: ['planner', 'stationery'],
  },
  {
    name: 'Knox',
    url: 'knox-japan.jp',
    region: 'Japan',
    description: 'Classic Japanese personal organiser brand with a dedicated following for their system planners.',
    categories: ['planner', 'stationery'],
  },
  {
    name: 'Raymay Da Vinci',
    url: 'raymay-store.jp',
    region: 'Japan',
    description: 'Japanese planner brand — Da Vinci system planners beloved for their quality and customisability.',
    categories: ['planner', 'stationery'],
  },
  {
    name: 'Furukawashiko',
    url: 'furukawashiko-online.shop',
    region: 'Japan',
    description: 'Mino washi paper maker (古川紙工) — washi stickers, letter sets, origami and illustrator-collab planner calendars, with new items every Friday.',
    categories: ['stationery', 'planner', 'illustration'],
  },
  {
    name: 'HIGHTIDE',
    url: 'hightide.co.jp',
    region: 'Japan',
    description: 'Tokyo stationery and lifestyle maker — retro-inspired pens, Nahe pouches, original planners and desk goods.',
    categories: ['stationery', 'planner', 'lifestyle'],
  },
  {
    name: 'Yamada Stationery',
    url: 'yamadastationery.jp',
    region: 'Japan',
    description: 'Mitaka, Tokyo select shop for stationery lovers since 2008 (山田文具店) — nostalgic stationery with a story, from Japan and abroad.',
    categories: ['stationery', 'lifestyle'],
  },
  {
    name: 'Mind Wave',
    url: 'mindwave-store.com',
    region: 'Japan',
    description: 'Character stationery maker (マインドウェイブ) — stickers and goods starring Shibanban, Gorogoro Nyansuke and more, plus store-limited items.',
    categories: ['stationery', 'illustration'],
  },
  {
    name: 'Zakkaya Compus',
    url: 'compus.base.shop',
    region: 'Japan',
    description: 'Zakka shop in Hamamatsu (雑貨屋コンパス) with artist-made stationery and goods. Its online store opens about once a month — dates are announced on Instagram.',
    categories: ['stationery', 'lifestyle', 'illustration'],
  },
  {
    name: 'Fujihatosya',
    url: 'fujihatosya.shop',
    region: 'Japan',
    description: 'System planner refill maker (藤鳩社) — illustrated 24 solar terms (二十四節気) 1-day-1-page Mini6 refills, plus artist collab refills in M5, M6 and Bible sizes.',
    categories: ['planner', 'stationery', 'illustration'],
  },
  {
    name: 'PLOTTER',
    url: 'plotter-japan.net',
    region: 'Japan',
    description: 'Designphil\'s leather system binder brand — Japanese-made binders plus DP Paper diary refills and memo pads in Mini5, Mini, Narrow, Bible and A5.',
    categories: ['planner', 'stationery'],
  },
]

export const CATEGORY_LABELS: Record<BrandCategory, string> = {
  stationery:    'Stationery',
  illustration:  'Illustration',
  planner:       'Planner',
  lifestyle:     'Lifestyle',
  'art supplies': 'Art supplies',
}
