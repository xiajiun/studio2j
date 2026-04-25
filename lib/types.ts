export type FairType = 'illustration' | 'stationery' | 'zine' | 'art' | 'craft'
export type Region = 'Asia' | 'Europe' | 'North America' | 'Oceania'
export type DeadlineStatus = 'urgent' | 'soon' | 'open' | 'closed'

export interface Fair {
  id: number
  name: string
  city: string
  country: string
  region: Region
  date: string
  deadline: string
  types: FairType[]
  featured: boolean
  going: boolean
  notes?: string
}
