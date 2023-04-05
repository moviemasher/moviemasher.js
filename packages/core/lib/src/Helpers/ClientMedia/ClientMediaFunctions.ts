import type { ClientAudio, ClientFont, ClientImage, ClientMedia, ClientMediaType, ClientVideo } from './ClientMedia.js'
import type { LoadType } from '../../Setup/LoadType.js'

import { ClientMediaTypes } from './ClientMediaConstants.js'
import { GraphFileType, isGraphFileType } from '../../Setup/Enums.js'
import { isLoadType } from '../../Setup/LoadType.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { isJsonRecord, isObject } from '../../Utility/Is.js'


export const isClientVideo = (value: any): value is ClientVideo => {
  return isObject(value) && value instanceof HTMLVideoElement
}
export function assertClientVideo(value: any, name?: string): asserts value is ClientVideo {
  if (!isClientVideo(value)) errorThrow(value, 'ClientVideo', name)
}

export const isClientImage = (value: any): value is ClientImage => {
  return isObject(value) && value instanceof HTMLImageElement
}
export function assertClientImage(value: any, name?: string): asserts value is ClientImage {
  if (!isClientImage(value)) errorThrow(value, 'ClientImage', name)
}

export const isClientAudio = (value: any): value is ClientAudio => {
  return isObject(value) && value instanceof AudioBuffer
}
export function assertClientAudio(value: any, name?: string): asserts value is ClientAudio {
  if (!isClientAudio(value)) errorThrow(value, 'ClientAudio', name)
}

export const isClientFont = (value: any): value is ClientFont => {
  return isObject(value) && 'family' in value
}
export function assertClientFont(value: any, name?: string): asserts value is ClientFont {
  if (!isClientFont(value)) errorThrow(value, 'ClientFont', name)
}


export type LoaderType = GraphFileType | LoadType
export const isLoaderType = (value: any): value is LoaderType => { 
  return isLoadType(value) || isGraphFileType(value)
}
export function assertLoaderType(value: any, name?: string): asserts value is LoaderType {
  if (!isLoaderType(value)) errorThrow(value, 'LoaderType', name)
}


export const isClientMedia = (value: any): value is ClientMedia => (
  isClientAudio(value) || 
  isClientFont(value) || 
  isClientImage(value) || 
  isClientVideo(value) || 
  isJsonRecord(value)
)
export function assertClientMedia(value: any, name?: string): asserts value is ClientMedia {
  if (!isClientMedia(value)) errorThrow(value, 'ClientMedia', name)
}

export const isClientMediaType = (type?: any): type is ClientMediaType => {
  return ClientMediaTypes.includes(type)
}
export function assertClientMediaType(value: any, name?: string): asserts value is ClientMediaType {
  if (!isClientMediaType(value)) errorThrow(value, 'ClientMediaType', name)
}
