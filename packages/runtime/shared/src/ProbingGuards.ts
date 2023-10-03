import type { Probing } from './ProbingTypes.js'

import { PROBE } from './DecodingConstants.js'
import { isDecoding } from './DecodingGuards.js'
import { errorThrow } from './ErrorFunctions.js'

export const isProbing = (value: any): value is Probing => {
  return isDecoding(value) && value.type === PROBE
}
export function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}
