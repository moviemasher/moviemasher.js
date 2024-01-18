import type { ClientClip, ClientMashAsset, ClientMashInstance, ClientTrack } from '../types.js'
import type { Track } from '@moviemasher/shared-lib/types.js'

import { isClip, isInstance, isMashAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { errorThrow, isObject } from '@moviemasher/shared-lib/runtime.js'

export const isClientMashAsset = (value: any): value is ClientMashAsset => {
  return isMashAsset(value) && 'addClipToTrack' in value
}

export function assertClientMashAsset(value: any, name?: string): asserts value is ClientMashAsset {
  if (!isClientMashAsset(value)) errorThrow(value, 'ClientMashAsset', name)
}

export const isClientMashInstance = (value: any): value is ClientMashInstance => {
  return isInstance(value) && 'asset' in value && isClientMashAsset(value.asset) 
}

export function assertClientMashInstance(value: any, name?: string): asserts value is ClientMashInstance {
  if (!isClientMashInstance(value)) errorThrow(value, 'ClientMashInstance', name)
}

export const isClientClip = (value: any): value is ClientClip => {
  return isClip(value) && 'svgItemPromise' in value;
}
export function assertClientClip(value: any, name?: string): asserts value is ClientClip {
  if (!isClientClip(value)) errorThrow(value, 'ClientClip', name)
}

const isTrack = (value?: any): value is Track => {
  return isObject(value) && 'assureFrames' in value
}

export const isClientTrack = (value: any): value is ClientTrack => {
  return isTrack(value) && 'addClips' in value;
}
