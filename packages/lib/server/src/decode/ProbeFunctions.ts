import type { ProbeOptions } from '@moviemasher/lib-shared'

import { errorThrow, isObject } from '@moviemasher/runtime-shared'

export const isProbeOptions = (value: any): value is ProbeOptions => {
  return isObject(value) 
}
export function assertProbeOptions(value: any): asserts value is ProbeOptions {
  if (!isProbeOptions(value)) errorThrow(value, 'ProbeOptions')
}
