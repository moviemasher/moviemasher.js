import type { ProbingOptions } from '@moviemasher/shared-lib/types.js'

import { errorThrow, isObject } from '@moviemasher/shared-lib/runtime.js'

export const isProbingOptions = (value: any): value is ProbingOptions => {
  return isObject(value) 
}
export function assertProbingOptions(value: any): asserts value is ProbingOptions {
  if (!isProbingOptions(value)) errorThrow(value, 'ProbingOptions')
}
