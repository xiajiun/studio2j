export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'going_to_fair'
  | 'purchased'
  | 'packing'
  | 'awaiting_payment_2'
  | 'paid_2'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderKind = 'proxy' | 'fair' | 'personal'

export interface OrderItem {
  name: string
  url?: string
  color?: string
  item_ccy?: 'KRW' | 'JPY'
  qty: number
  price: number
  dom_del?: number
  total?: number
}

export interface ShippingAddress {
  name: string
  address: string
  city: string
  country: string
  postal_code: string
  phone?: string
  instagram?: string
  payment_method?: 'wise' | 'korea' | 'malaysia' | 'japan'
}

export interface FairRow {
  id: number
  name: string
  city: string
  country: string
  region: string
  date: string
  deadline: string
  types: string[]
  featured: boolean
  going: boolean
  url: string | null
  image_url: string | null
  catalogue_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  email: string
  display_name: string | null
  instagram: string | null
  notes: string | null
  created_at: string
}

export interface Order {
  id: number
  order_number: string
  customer_id: string | null
  customer_email: string
  customer_name: string | null
  kind: OrderKind
  fair_id: number | null
  source_url: string | null
  title: string
  description: string | null
  items: OrderItem[] | null
  goods_total: number | null
  service_fee: number | null
  shipping_cost: number | null
  currency: string
  status: OrderStatus
  tracking_number: string | null
  shipping_address: ShippingAddress | null
  notes: string | null
  customer_notes: string | null
  // Payment tracking
  paid_1_amount: number | null
  paid_1_date: string | null
  paid_1_via: 'jin' | 'jo' | null
  paid_1_transfer_fee: number | null
  paid_2_amount: number | null
  paid_2_date: string | null
  paid_2_via: 'jin' | 'jo' | null
  paid_2_transfer_fee: number | null
  actual_goods_cost: number | null
  created_at: string
  updated_at: string
}

export interface OrderEvent {
  id: number
  order_id: number
  status: OrderStatus
  note: string | null
  photo_url: string | null
  created_at: string
}

export interface TwentyMarket {
  marketUID: string
  marketTitle: string
  marketCover: string
  marketST: number   // ms timestamp
  marketED: number   // ms timestamp
  marketPublicId: number
  sellerPublicId: string
  sellerInfoName: string
  sellerCategory: string
}

export interface Subscriber {
  id: number
  email: string
  source: string | null
  active: boolean
  created_at: string
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment:   'Awaiting payment',
  paid:               'Paid',
  going_to_fair:      'Going to fair',
  purchased:          'Purchased',
  packing:            'Packing',
  awaiting_payment_2: 'Awaiting final payment',
  paid_2:             'Final payment confirmed',
  shipped:            'Shipped',
  delivered:          'Delivered',
  cancelled:          'Cancelled',
}

export const STATUS_ORDER: OrderStatus[] = [
  'awaiting_payment',
  'paid',
  'going_to_fair',
  'purchased',
  'packing',
  'awaiting_payment_2',
  'paid_2',
  'shipped',
  'delivered',
]
