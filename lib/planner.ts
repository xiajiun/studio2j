export interface PlannerPick {
  name: string
  subtitle: string
  bestFor: string
  description: string
  photo: string        // Supabase Storage public URL — replace placeholders
  url: string          // Brand website
  region: 'Korea' | 'Japan'
  tags: string[]
  curatedBy: 'Jin' | 'Jo'
}

// Replace photo URLs with Supabase Storage public URLs
// Example: https://hclclmdfcswdrdpqtyyl.supabase.co/storage/v1/object/public/photos/rollbahn.jpg
const SUPABASE_PHOTOS = 'https://hclclmdfcswdrdpqtyyl.supabase.co/storage/v1/object/public/photos'

export const STAFF_PICKS: PlannerPick[] = [
  {
    name:        'Rollbahn Diary',
    subtitle:    'Delfonics, Japan',
    bestFor:     'Scrapbooking, ticket collecting, and visual thinkers.',
    description: 'An iconic Japanese classic. Features unmatched cream-colored grid paper that is easy on the eyes, plus clear storage pockets in the back for all your stickers and receipts. The elastic band keeps your memories safe.',
    photo:       `${SUPABASE_PHOTOS}/rollbahn.jpg`,
    url:         'https://shop.delfonics.com',
    region:      'Japan',
    tags:        ['grid paper', 'pockets', 'scrapbook'],
    curatedBy:   'Jo',
  },
  {
    name:        'Hobonichi Techo',
    subtitle:    'Hobonichi, Japan',
    bestFor:     'Daily journaling, watercolor, fountain pen users.',
    description: 'The world\'s most loved life book. Famous for its ultra-thin yet durable Tomoe River paper that opens completely flat. Whether you draw, write, or paste, this planner handles it all without the bulk.',
    photo:       `${SUPABASE_PHOTOS}/hobonichi.jpg`,
    url:         'https://1101.com',
    region:      'Japan',
    tags:        ['Tomoe River', 'daily', 'fountain pen'],
    curatedBy:   'Jo',
  },
]

export const BY_CATEGORY = {
  japan: {
    planners:   ['Rollbahn', 'Laconic Tokyo', 'Torinco', 'Ryu Ryu'],
    calendars:  ['Ryu Ryu Zakka', 'Midori', 'Afternoon Tea'],
    stationery: ['Loft', 'Sekaido'],
  },
  korea: {
    planners:   ['Analogue Keeper', 'Point Of View', 'B on D', 'Trust My Vibe'],
    calendars:  ['LUCALAB', 'oh, lolly day!', 'Beesket Studio'],
    stationery: ['10×10', 'Artbox'],
  },
}
