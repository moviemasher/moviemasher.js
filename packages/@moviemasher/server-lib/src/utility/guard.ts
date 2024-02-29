import type { AbsolutePath, ProbingOptions, ServerAudibleAsset, ServerAudibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerClip, ServerMashAsset } from '../type/ServerMashTypes.js'

import { errorThrow, isAbsolutePath } from '@moviemasher/shared-lib/runtime.js'
import { isObject } from '@moviemasher/shared-lib/utility/guard.js'
import { isAudibleAsset, isAudibleInstance, isClip, isMashAsset, isServerAsset } from '@moviemasher/shared-lib/utility/guards.js'

export const isServerAudibleAsset = (value: any): value is ServerAudibleAsset => {
  return isServerAsset(value) && isAudibleAsset(value)
}

export const isServerAudibleInstance = (value: any): value is ServerAudibleInstance => {
  return isAudibleInstance(value) && isServerAudibleAsset(value.asset)
}



export function assertServerAudibleInstance(value: any, name?: string): asserts value is ServerAudibleInstance {
  if (!isServerAudibleInstance(value)) errorThrow(value, 'AbsolutePath', name)
}

export const isServerClip = (value: any): value is ServerClip => (
  isClip(value) && 'videoCommandFiles' in value
)

export const isServerMashAsset = (value: any): value is ServerMashAsset => (
  isMashAsset(value) && isServerAsset(value)
)

export function assertAbsolutePath(value: any, name?: string): asserts value is AbsolutePath {
  if (!isAbsolutePath(value)) errorThrow(value, 'AbsolutePath', name)
}

export const isProbingOptions = (value: any): value is ProbingOptions => {
  return isObject(value)
}

export function assertProbingOptions(value: any): asserts value is ProbingOptions {
  if (!isProbingOptions(value)) errorThrow(value, 'ProbingOptions')
}
