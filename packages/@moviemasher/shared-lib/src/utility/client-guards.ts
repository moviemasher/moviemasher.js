import type { ClientInstance, ClientAsset, ClientAudibleInstance, ClientTrack, ClientVisibleInstance, Track } from '../types.js'

import { errorThrow, isAsset } from '../runtime.js'
import { isAudibleInstance, isInstance, isVisibleInstance } from '../utility/guards.js'
import { isObject } from './guard.js'

export const isClientAsset = (value: any): value is ClientAsset => {
  return isAsset(value) && 'assetIcon' in value
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
const isTrack = (value?: any): value is Track => {
  return isObject(value) && 'assureFrames' in value
}

export const isClientTrack = (value: any): value is ClientTrack => (
  isTrack(value) && 'addClips' in value
)

export function assertClientTrack(value: any, name?: string): asserts value is ClientTrack {
  if (!isClientTrack(value)) errorThrow(value, 'ClientTrack', name)
}

export const isDatasetElement = (value: any): value is HTMLElement | SVGElement => (
  value instanceof HTMLElement || value instanceof SVGElement
)

export function assertDatasetElement(value: any, name?: string): asserts value is HTMLElement | SVGElement {
  if (!isDatasetElement(value)) errorThrow(value, 'DatasetElement', name)
}
