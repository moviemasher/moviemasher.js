import type { ProbingOptions } from '@moviemasher/runtime-shared'

import { errorThrow, isObject } from '@moviemasher/runtime-shared'

export const isProbingOptions = (value: any): value is ProbingOptions => {
  return isObject(value) 
}
export function assertProbingOptions(value: any): asserts value is ProbingOptions {
  if (!isProbingOptions(value)) errorThrow(value, 'ProbingOptions')
}
