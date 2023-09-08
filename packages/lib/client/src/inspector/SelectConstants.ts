import { TypesTarget, type SelectorType, type Strings, TypeMash } from '@moviemasher/runtime-shared'

import { arrayReversed } from '@moviemasher/lib-shared'

export const selectorTypeBest = (selectorType: string, selectorTypes: Strings): SelectorType => {
  if (selectorTypes.includes(selectorType)) return selectorType as SelectorType

  const found = arrayReversed(TypesTarget).find(type => selectorTypes.includes(type))
  return found || TypeMash
}
