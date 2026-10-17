// Real customer reviews and Instagram posts shown on the homepage.
// Only add genuine reviews (with the customer's OK) and our own @studio2j25 posts.
// Sections stay hidden while these lists are empty.
// region: which side the order/post is about — 'JP' items are hidden in Japanese mode (CLAUDE.md rule 10).

export interface Review {
  quote: string              // customer's own words, in their original language
  name: string               // first name or @handle, as the customer agreed
  from?: string              // customer's country, e.g. 'Singapore'
  item?: string              // what they ordered, e.g. 'Hobonichi Cousin'
  region: 'KR' | 'JP'
  url?: string               // link to the original post/comment, if public
}

export interface HaulPost {
  url: string                // https://www.instagram.com/p/<code>/
  region: 'KR' | 'JP'
}

export const REVIEWS: Review[] = []

export const HAUL_POSTS: HaulPost[] = []
