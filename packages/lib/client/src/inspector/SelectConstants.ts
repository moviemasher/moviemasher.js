import type { SelectorType, Strings } from '@moviemasher/runtime-shared'

import { arrayReversed } from '@moviemasher/lib-shared'
import { TARGET_IDS, MASH } from '@moviemasher/runtime-shared'

export const selectorTypeBest = (selectorType: string, selectorTypes: Strings): SelectorType => {
  if (selectorTypes.includes(selectorType)) return selectorType as SelectorType
TARGET_IDS
  const found = arrayReversed(TARGET_IDS).find(type => selectorTypes.includes(type))
  return found || MASH
}
