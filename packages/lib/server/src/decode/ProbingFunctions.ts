import type { Probing } from '@moviemasher/lib-shared'

import { PROBE, errorThrow } from '@moviemasher/runtime-shared'
import { isDecoding } from './DecodingFunctions.js'

export const isProbing = (value: any): value is Probing => {
  return isDecoding(value) && value.type === PROBE
}
export  function assertProbing(value: any): asserts value is Probing {
  if (!isProbing(value)) errorThrow(value, 'Probing') 
}