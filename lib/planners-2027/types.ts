// 2027 planner catalogue — shared types for /catalogue/planners-2027

export type PlannerFormat =
  | 'daily' | 'weekly-vertical' | 'weekly-horizontal' | 'weekly-memo'
  | 'monthly' | 'multi-year' | 'calendar'

// large = A4/B5/A5 · medium = B6/A6/TN Regular · pocket = A7/Passport/slim pocket
export type SizeGroup = 'large' | 'medium' | 'pocket'

// Each key is translated in i18n.ts → planners.features
export type FeatureKey =
  | 'tomoeRiver' | 'mdPaper' | 'thinPaper' | 'fountainPen' | 'hourly' | 'gantt' | 'monthTabs' | 'layFlat'
  | 'hardcover' | 'softcover' | 'clothCover' | 'coverIncluded' | 'pockets' | 'stickers' | 'english' | 'refill' | 'halfYear'
  | 'illustrated' | 'collab' | 'lightweight' | 'spiral' | 'habitTracker' | 'standing' | 'gridPages'

// Ring-binder sizes for system binder refills (filter: "Ring size")
// micro5 = M5 (62×105) · mini5 = Mini 5 · mini6 = M6 / Pocket (80×126) · bible = Personal (95×170)
// narrow = Narrow / Slim Bible · a7/a6/a5 = ISO-size 6-hole (A6/A5 are common in Korea) · b6 = B6 slim
export type BinderSize = 'micro5' | 'mini5' | 'mini6' | 'bible' | 'narrow' | 'a7' | 'a6' | 'a5' | 'b6'

// One size of a product, each with its own official product page
export interface PlannerVariant {
  size: string               // display label as the brand names it, e.g. 'Mini6', 'Bible', 'A5'
  binderSize?: BinderSize    // required for binder refills
  url: string                // official product page for this size
  price?: { amount: number; currency: 'JPY' | 'KRW' }
  image?: string             // size-specific photo, if the brand has one
}

export interface Planner2027 {
  id: string                // unique slug, 'jp-…' / 'kr-…'
  brand: string             // English brand name
  name: string              // English product name, without brand
  localName?: string        // Japanese / Korean product name from the official site
  country: 'JP' | 'KR'
  formats: PlannerFormat[]  // primary first
  sizes: string[]           // display strings, e.g. ['A5', 'A6']
  sizeGroup: SizeGroup
  dated: boolean
  starts?: string           // first dated month, 'YYYY-MM'
  price?: { amount: number; currency: 'JPY' | 'KRW' }  // official retail incl. tax, lowest variant
  features: FeatureKey[]    // 2–4 chips
  image: string             // hotlinked official product photo
  url: string               // official brand store product page
  pick?: boolean            // Studio2J pick
  binder?: boolean          // system binder refill (loose-leaf for ring binders)
  variants?: PlannerVariant[] // every size, each linked; first one is the default
  variantKind?: 'size' | 'option' // chip heading: "4 sizes" (default) or "4 options" when variants mix types/designs
}
