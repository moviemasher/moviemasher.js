import type { AudibleInstance, ImageElement } from '@moviemasher/shared-lib/types.js'
import type { ClientAudibleInstance, ClientInstance, ClientVideo, ClientVisibleInstance } from '../types.js'

import { errorThrow, isObject } from '@moviemasher/shared-lib/runtime.js'
import { isAudibleAsset, isInstance, isVisibleInstance } from '@moviemasher/shared-lib/utility/guards.js'
import { isClientAsset } from '../runtime.js'


const isAudibleInstance = (value: any): value is AudibleInstance => {
  return isInstance(value) && 'asset' in value && isAudibleAsset(value.asset) 
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

export const isClientAudibleInstance = (value: any): value is ClientAudibleInstance => {
  return isClientInstance(value) && isAudibleInstance(value) 
}

export function assertClientVisibleInstance(value: any, name?: string): asserts value is ClientVisibleInstance {
  if (!isClientVisibleInstance(value)) errorThrow(value, 'ClientVisibleInstance', name)
}

export function assertClientAudibleInstance(value: any, name?: string): asserts value is ClientAudibleInstance {
  if (!isClientAudibleInstance(value)) errorThrow(value, 'ClientAudibleInstance', name)
}

export const isClientAudio = (value: any): value is AudioBuffer => {
  return isObject(value) && value instanceof AudioBuffer
}

export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export const isClientImage = (value: any): value is ImageElement => {
  return isObject(value) && value instanceof HTMLImageElement
}

