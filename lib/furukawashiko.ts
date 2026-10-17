// Furukawashiko "新着商品 / New Arrivals" carousel, shown as a row in the homepage hero mosaic.
//
// Furukawashiko's shop doesn't answer requests from Cloudflare's servers, so the live site can't
// fetch it at request time. Instead a GitHub Action (.github/workflows/furukawashiko-weekly.yml)
// runs scripts/update-furukawashiko.ts every Friday 21:00 JST, saves the slides to
// data/furukawashiko-new.json and pushes — which redeploys the site with the new items.

import snapshot from '../data/furukawashiko-new.json'

export interface ShopSlide {
  title: string   // slide alt text from the shop (Japanese)
  image: string   // official slide image (1000×1000)
  url: string     // official category / product page
}

export const FURUKAWASHIKO_SHOP = 'https://www.furukawashiko-online.shop'

const decode = (s: string) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

// Extract the new-items carousel slides from the shop's homepage HTML
export function parseFurukawashikoNewArrivals(page: string): ShopSlide[] {
  const start = page.indexOf('t-newitemList')
  if (start === -1) return []
  const end = page.indexOf('</section>', start)
  const block = page.slice(start, end === -1 ? undefined : end)

  const slides: ShopSlide[] = []
  const re = /<figure class="fs-pt-carousel__slide">\s*<a href="([^"]+)"[^>]*>\s*<img src="([^"]+)"(?:[^>]*?alt="([^"]*)")?/g
  for (let m = re.exec(block); m; m = re.exec(block)) {
    const url = new URL(decode(m[1]), FURUKAWASHIKO_SHOP).toString()
    const img = new URL(decode(m[2]), FURUKAWASHIKO_SHOP)
    img.searchParams.delete('t')          // shop-wide cache-buster; dropping it keeps weekly diffs meaningful
    const image = img.toString()
    if (!/^https:\/\//.test(image)) continue
    slides.push({ url, image, title: decode(m[3] ?? '') })
  }
  return slides.slice(0, 24)
}

// Latest weekly snapshot (updated by the GitHub Action)
export function furukawashikoNewArrivals(): ShopSlide[] {
  return (snapshot.slides ?? []) as ShopSlide[]
}
