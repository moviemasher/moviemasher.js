import type { ServerAudibleAsset, ServerVisibleAsset } from '../type/ServerAssetTypes.js'

import { isAudibleAsset, isInstance, isVideoAsset, isVisibleAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { isServerAsset } from '../runtime.js'
import { ServerAudibleInstance, ServerContainerInstance, ServerContentInstance, ServerVisibleInstance } from '../types.js'
import { RAW, errorThrow, isAsset } from '@moviemasher/shared-lib/runtime.js'
import { RawAsset, VideoInstance } from '@moviemasher/shared-lib/types.js'
import { ServerRawVideoInstance } from '../type/ServerTypes.js'

export const isServerAudibleAsset = (value: any): value is ServerAudibleAsset => {
  return isServerAsset(value) && isAudibleAsset(value)
}

export const isServerVisibleAsset = (value: any): value is ServerVisibleAsset => {
  return isServerAsset(value) && isVisibleAsset(value)
}

export const isServerAudibleInstance = (value: any): value is ServerAudibleInstance => {
  return isInstance(value) && isServerAudibleAsset(value.asset)
}

export const isServerVisibleInstance = (value: any): value is ServerVisibleInstance => {
  return isInstance(value) && isServerVisibleAsset(value.asset)
}

export function assertServerAudibleInstance(value: any, name?: string): asserts value is ServerAudibleInstance {
  if (!isServerAudibleInstance(value)) errorThrow(value, 'AbsolutePath', name)
}

export function assertServerVisibleInstance(value: any, name?: string): asserts value is ServerVisibleInstance {
  if (!isServerVisibleInstance(value)) errorThrow(value, 'AbsolutePath', name)
}

export const isServerContainerInstance = (value: any): value is ServerContainerInstance => {
  return isServerVisibleInstance(value) && value.container
}
export const isServerContentInstance = (value: any): value is ServerContentInstance => {
  return isServerVisibleInstance(value) && !value.container
}

export function assertServerContainerInstance(value: any, name?: string): asserts value is ServerContainerInstance {
  if (!isServerContainerInstance(value)) errorThrow(value, 'ServerContainerInstance', name)
}
export function assertServerContentInstance(value: any, name?: string): asserts value is ServerContentInstance {
  if (!isServerContentInstance(value)) errorThrow(value, 'ServerContentInstance', name)
}

export const isVideoInstance = (value: any): value is VideoInstance => {
  return isInstance(value) && isVideoAsset(value.asset)
}

export const isRawAsset = (value: any): value is RawAsset => {
  return isAsset(value) && value.source === RAW
}

export const isServerRawVideoInstance = (value: any): value is ServerRawVideoInstance => {
  return isVideoInstance(value) && isRawAsset(value.asset)
}

