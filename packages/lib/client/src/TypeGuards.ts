import type { SelectorType, TargetId } from '@moviemasher/runtime-shared'

import { isPropertyId } from '@moviemasher/lib-shared'
import { TARGET_IDS, isPopulatedString } from '@moviemasher/runtime-shared'

export const isTargetId = (value: any): value is TargetId => (
  isPopulatedString(value) && TARGET_IDS.includes(value as TargetId)
)


export const isSelectorType = (value: any): value is SelectorType => (
  isTargetId(value) || isPropertyId(value) 
)
