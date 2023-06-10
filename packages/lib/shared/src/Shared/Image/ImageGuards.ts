import type { ImageAsset } from "./ImageAsset.js"
import type { ImageInstance } from "./ImageInstance.js"

import { TypeImage } from '@moviemasher/runtime-shared'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { isAsset, isAssetObject } from '../Asset/AssetGuards.js'
import { isInstance } from '../Instance/InstanceGuards.js'

export const isImageAsset = (value: any): value is ImageAsset => {
  return isAsset(value) && value.type === TypeImage
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
  isAssetObject(value) && value.type === TypeImage
)