// Live "新着商品 / New Arrivals" carousel from Furukawashiko's official shop (futureshop).
// Fetched server-side on the homepage and refreshed once a week, every Friday 21:00 JST/KST
// (Furukawashiko releases new items on Fridays). The week key in the URL makes the cached
// response expire exactly at that cutoff instead of on a rolling timer.

export interface ShopSlide {
  title: string   // slide alt text from the shop (Japanese)
  image: string   // official slide image (1000×1000)
  url: string     // official category / product page
}

const SHOP = 'https://www.furukawashiko-online.shop'

const WEEK = 7 * 24 * 3600

// Date (YYYY-MM-DD, JST) of the most recent Friday 21:00 JST at or before `now`
export function fridayNightKey(now = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 3600 * 1000)          // JST wall clock in UTC fields
  const daysSinceFriday = (jst.getUTCDay() - 5 + 7) % 7
  const cutoff = new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate() - daysSinceFriday, 21))
  if (jst.getTime() < cutoff.getTime()) cutoff.setUTCDate(cutoff.getUTCDate() - 7)
  return cutoff.toISOString().slice(0, 10)
}

const decode = (s: string) => s
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')

export async function fetchFurukawashikoNewArrivals(): Promise<ShopSlide[]> {
  try {
    const res = await fetch(`${SHOP}/?s2j_week=${fridayNightKey()}`, {
      next: { revalidate: WEEK },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Studio2J/1.0; +https://studio2j.pages.dev)' },
    })
    if (!res.ok) return []
    const page = await res.text()

    // Only the new-items carousel section
    const start = page.indexOf('t-newitemList')
    if (start === -1) return []
    const end = page.indexOf('</section>', start)
    const block = page.slice(start, end === -1 ? undefined : end)

    const slides: ShopSlide[] = []
    const re = /<figure class="fs-pt-carousel__slide">\s*<a href="([^"]+)"[^>]*>\s*<img src="([^"]+)"(?:[^>]*?alt="([^"]*)")?/g
    for (let m = re.exec(block); m; m = re.exec(block)) {
      const url = new URL(decode(m[1]), SHOP).toString()
      const image = new URL(decode(m[2]), SHOP).toString()
      if (!/^https:\/\//.test(image)) continue
      slides.push({ url, image, title: decode(m[3] ?? '') })
    }
    return slides.slice(0, 24)
  } catch {
    return []
  }
}
