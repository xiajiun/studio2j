import type { Planner2027 } from './types'
import { JAPAN_PLANNERS } from './japan'
import { KOREA_PLANNERS } from './korea'
import { KOREA_BINDER_REFILLS } from './binders-kr'
import { JAPAN_BINDER_REFILLS } from './binders-jp'
import { JAPAN_CALENDARS } from './calendars-jp'

export * from './types'

// Picks first, then Korea before Japan, then brand order as listed in each data file.
// System binder refills come last so bound planners lead the default view.
export const PLANNERS_2027: Planner2027[] = [
  ...KOREA_PLANNERS.filter(p => p.pick),
  ...JAPAN_PLANNERS.filter(p => p.pick),
  ...KOREA_PLANNERS.filter(p => !p.pick),
  ...JAPAN_PLANNERS.filter(p => !p.pick),
  ...JAPAN_CALENDARS,
  ...KOREA_BINDER_REFILLS,
  ...JAPAN_BINDER_REFILLS,
]
