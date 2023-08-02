import type { PropertyId, SelectorType, TargetId } from '@moviemasher/runtime-shared'

import { isPopulatedString } from '@moviemasher/runtime-shared'
import { TypesTarget } from './TypeConstants.js'


export const isTargetId = (value: any): value is TargetId => (
  isPopulatedString(value) && TypesTarget.includes(value as TargetId)
)

export const isPropertyId = (value: any): value is PropertyId => (
  isPopulatedString(value) 
    && TypesTarget.some(type => value.startsWith(type))
    && value.split('.').length === 2
)

export const isSelectorType = (value: any): value is SelectorType => (
  isTargetId(value) || isPropertyId(value) 
)
