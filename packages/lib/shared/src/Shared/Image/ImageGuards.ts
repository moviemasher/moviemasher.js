import type { ImageAsset } from "@moviemasher/runtime-shared"
import type { ImageInstance } from "@moviemasher/runtime-shared"

import { IMAGE } from '@moviemasher/runtime-shared'
import { errorThrow } from '@moviemasher/runtime-shared'
import { isAsset, isAssetObject } from '@moviemasher/runtime-shared'
import { isInstance } from '../Instance/InstanceGuards.js'

export const isImageAsset = (value: any): value is ImageAsset => {
  return isAsset(value) && value.type === IMAGE
}
export function assertImageAsset(value: any, name?: string): asserts value is ImageAsset {
  if (!isImageAsset(value)) errorThrow(value, 'ImageAsset', name)
}

export const isImageInstance = (value: any): value is ImageInstance => {
  return isInstance(value) && 'asset' in value && isImageAsset(value.asset) 
}
export function assertImageInstance(value: any, name?: string): asserts value is ImageInstance {
  if (!isImageInstance(value)) errorThrow(value, 'ImageInstance', name)
}

export const isImageAssetObject = (value: any): value is ImageAsset => (
  isAssetObject(value) && value.type === IMAGE
)