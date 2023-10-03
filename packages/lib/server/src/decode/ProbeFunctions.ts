import type { ProbeOptions } from './ProbeTypes.js'

import { errorThrow, isArray, isObject } from '@moviemasher/runtime-shared'

export const isProbeOptions = (value: any): value is ProbeOptions => {
  return isObject(value) && 'types' in value && isArray(value.types)
}
export function assertProbeOptions(value: any): asserts value is ProbeOptions {
  if (!isProbeOptions(value))
    errorThrow(value, 'ProbeOptions')
}
