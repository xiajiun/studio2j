// Studio2J service fee: 15% of goods value, minimum ₩25,000 / ¥2,500,
// rounded UP to the nearest ₩1,000 (JPY: ¥100). See CLAUDE.md "Service fee".

export type FeeCurrency = 'KRW' | 'JPY'

const RULES: Record<FeeCurrency, { min: number; step: number }> = {
  KRW: { min: 25000, step: 1000 },
  JPY: { min: 2500, step: 100 },
}

export function serviceFee(goods: number, currency: FeeCurrency): { fee: number; minApplied: boolean } {
  const { min, step } = RULES[currency]
  const pct = Math.ceil((Math.max(0, goods) * 0.15) / step) * step
  return pct > min ? { fee: pct, minApplied: false } : { fee: min, minApplied: true }
}

export function formatMoney(amount: number, currency: FeeCurrency) {
  return `${currency === 'JPY' ? '¥' : '₩'}${Math.round(amount).toLocaleString('en-US')}`
}
