// Refresh data/furukawashiko-new.json from Furukawashiko's homepage carousel.
// Run: npx --yes tsx scripts/update-furukawashiko.ts   (the weekly GitHub Action does this every Friday 21:00 JST)
// Leaves the file untouched if the shop can't be reached or the carousel can't be found.

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { FURUKAWASHIKO_SHOP, parseFurukawashikoNewArrivals, type ShopSlide } from '../lib/furukawashiko'

const FILE = join(__dirname, '..', 'data', 'furukawashiko-new.json')

async function main() {
  const res = await fetch(`${FURUKAWASHIKO_SHOP}/`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Studio2J/1.0; +https://studio2j.pages.dev)' },
  })
  if (!res.ok) throw new Error(`Furukawashiko returned ${res.status}`)
  const slides = parseFurukawashikoNewArrivals(await res.text())
  if (slides.length === 0) throw new Error('No new-arrival slides found — page layout may have changed')

  const current = JSON.parse(readFileSync(FILE, 'utf8')) as { slides: ShopSlide[] }
  if (JSON.stringify(current.slides) === JSON.stringify(slides)) {
    console.log(`No change (${slides.length} slides)`)
    return
  }
  writeFileSync(FILE, JSON.stringify({ updatedAt: new Date().toISOString(), source: `${FURUKAWASHIKO_SHOP}/`, slides }, null, 2) + '\n')
  console.log(`Updated: ${slides.length} slides`)
}

main().catch(err => { console.error(err); process.exit(1) })
