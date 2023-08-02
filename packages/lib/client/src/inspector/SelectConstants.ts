import type { SelectorType, Strings } from '@moviemasher/runtime-shared'

import { TypeMash, TypesTarget } from '@moviemasher/runtime-client'
import { arrayReversed } from '@moviemasher/lib-shared'

export const selectorTypeBest = (selectorType: string, selectorTypes: Strings): SelectorType => {
  if (selectorTypes.includes(selectorType)) return selectorType as SelectorType

  const found = arrayReversed(TypesTarget).find(type => selectorTypes.includes(type))
  return found || TypeMash
}
