import type { Planner2027 } from './types'
import { JAPAN_PLANNERS } from './japan'
import { KOREA_PLANNERS } from './korea'
import { KOREA_BINDER_REFILLS } from './binders-kr'
import { JAPAN_BINDER_REFILLS } from './binders-jp'
import { JAPAN_CALENDARS } from './calendars-jp'
import { HIGHTIDE_PLANNERS } from './hightide-jp'
import { HOBONICHI_COVERS } from './covers-jp'
import { FURUKAWASHIKO_CALENDARS } from './furukawashiko-jp'

export * from './types'

// Picks first, then Korea before Japan, then brand order as listed in each data file.
// System binder refills come last so bound planners lead the default view.
export const PLANNERS_2027: Planner2027[] = [
  ...KOREA_PLANNERS.filter(p => p.pick),
  ...JAPAN_PLANNERS.filter(p => p.pick),
  ...KOREA_PLANNERS.filter(p => !p.pick),
  ...JAPAN_PLANNERS.filter(p => !p.pick),
  ...HIGHTIDE_PLANNERS,
  ...JAPAN_CALENDARS,
  ...FURUKAWASHIKO_CALENDARS,
  ...HOBONICHI_COVERS,
  ...KOREA_BINDER_REFILLS,
  ...JAPAN_BINDER_REFILLS,
]
