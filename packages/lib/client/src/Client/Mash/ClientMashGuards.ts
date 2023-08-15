import type { ClientClip, ClientTrack, ClientMashAsset, ClientMashInstance } from '@moviemasher/runtime-client'

import { errorThrow } from '@moviemasher/runtime-shared'
import { isMashAsset, isInstance, isClip, isTrack } from '@moviemasher/lib-shared'

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
  return isClip(value) && 'clipIcon' in value;
}
export function assertClientClip(value: any, name?: string): asserts value is ClientClip {
  if (!isClientClip(value)) errorThrow(value, 'ClientClip', name)
}

export const isClientTrack = (value: any): value is ClientTrack => {
  return isTrack(value) && 'addClips' in value;
}