import type { SelectorType, TargetId } from '@moviemasher/shared-lib/types.js'

import { isPropertyId } from '@moviemasher/shared-lib/utility/guards.js'
import { TARGET_IDS, isPopulatedString } from '@moviemasher/shared-lib/runtime.js'

export const isTargetId = (value: any): value is TargetId => (
  isPopulatedString(value) && TARGET_IDS.includes(value as TargetId)
)

export const isSelectorType = (value: any): value is SelectorType => (
  isTargetId(value) || isPropertyId(value) 
)
