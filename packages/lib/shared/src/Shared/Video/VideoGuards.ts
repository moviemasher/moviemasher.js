import type { VideoAsset } from "@moviemasher/runtime-shared"
import type { VideoInstance } from "@moviemasher/runtime-shared"

import { TypeVideo } from '@moviemasher/runtime-shared'
import { errorThrow } from '@moviemasher/runtime-shared'
import { isAsset, isAssetObject } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'

export const isVideoAsset = (value: any): value is VideoAsset => {
  return isAsset(value) && value.type === TypeVideo
}
export function assertVideoAsset(value: any, name?: string): asserts value is VideoAsset {
  if (!isVideoAsset(value)) errorThrow(value, 'VideoAsset', name)
}

export const isVideoInstance = (value: any): value is VideoInstance => {
  return isInstance(value) && 'asset' in value && isVideoAsset(value.asset) 
}
export function assertVideoInstance(value: any, name?: string): asserts value is VideoInstance {
  if (!isVideoInstance(value)) errorThrow(value, 'VideoInstance', name)
}


export const isVideoAssetObject = (value: any): value is VideoAsset => (
  isAssetObject(value) && value.type === TypeVideo
)