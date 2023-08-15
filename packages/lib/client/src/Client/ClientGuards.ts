import type { ClientAudio, ClientImage, ClientInstance, ClientVideo, ClientVisibleInstance } from '@moviemasher/runtime-client'

import { isInstance, isVisibleInstance } from '@moviemasher/lib-shared'
import { isClientAsset } from '@moviemasher/runtime-client'
import { errorThrow, isObject } from '@moviemasher/runtime-shared'



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

export const isClientAudio = (value: any): value is ClientAudio => {
  return isObject(value) && value instanceof AudioBuffer
}

export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export const isClientImage = (value: any): value is ClientImage => {
  return isObject(value) && value instanceof HTMLImageElement
}
