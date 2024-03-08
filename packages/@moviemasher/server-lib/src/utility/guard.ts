import type { ServerClip, ServerMashAsset , ProbingOptions, ServerAudibleAsset, ServerAudibleInstance } from '@moviemasher/shared-lib/types.js'

import { errorThrow } from '@moviemasher/shared-lib/runtime.js'
import { isObject } from '@moviemasher/shared-lib/utility/guard.js'
import { isAudibleAsset, isAudibleInstance, isClip, isMashAsset, isServerAsset } from '@moviemasher/shared-lib/utility/guards.js'


export const isServerClip = (value: any): value is ServerClip => (
  isClip(value) && 'videoCommandFiles' in value
)

export const isServerMashAsset = (value: any): value is ServerMashAsset => (
  isMashAsset(value) && isServerAsset(value)
)



export const isProbingOptions = (value: any): value is ProbingOptions => {
  return isObject(value)
}

export function assertProbingOptions(value: any): asserts value is ProbingOptions {
  if (!isProbingOptions(value)) errorThrow(value, 'ProbingOptions')
}
