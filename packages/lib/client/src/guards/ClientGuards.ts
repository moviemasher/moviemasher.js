import type { ClientImage, ClientInstance, ClientVideo, ClientVisibleInstance } from '@moviemasher/runtime-client'
import type { VisibleInstance } from '@moviemasher/runtime-shared'

import { isInstance, isVisibleAsset } from '@moviemasher/lib-shared/utility/guards.js'
import { isClientAsset } from '@moviemasher/runtime-client'
import { errorThrow, isObject } from '@moviemasher/runtime-shared'

const isVisibleInstance = (value: any): value is VisibleInstance => {
  return isInstance(value) && 'asset' in value && isVisibleAsset(value.asset) 
}

export const isClientInstance = (value: any): value is ClientInstance => {
  return isInstance(value) && 'asset' in value && isClientAsset(value.asset) 
}

export function assertClientInstance(value: any, name?: string): asserts value is ClientInstance {
  if (!isClientInstance(value)) errorThrow(value, 'ClientInstance', name)
}

export const isClientVisibleInstance = (value: any): value is ClientVisibleInstance => {
  return isClientInstance(value) && isVisibleInstance(value) 
}

export function assertClientVisibleInstance(value: any, name?: string): asserts value is ClientVisibleInstance {
  if (!isClientVisibleInstance(value)) errorThrow(value, 'ClientVisibleInstance', name)
}

export const isClientAudio = (value: any): value is AudioBuffer => {
  return isObject(value) && value instanceof AudioBuffer
}

export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export const isClientImage = (value: any): value is ClientImage => {
  return isObject(value) && value instanceof HTMLImageElement
}
