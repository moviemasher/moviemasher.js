import type { ClientAudio, ClientAudioDataOrError, ClientFont, ClientFontDataOrError, ClientImage, ClientImageDataOrError, ClientMedia, ClientMediaType, ClientVideo, ClientVideoDataOrError } from './ClientMedia.js'
import type { EndpointRequest } from '@moviemasher/runtime-shared'
import type { ClientAudioEventDetail, ClientFontEventDetail, ClientImageEvent, ClientImageEventDetail, ClientVideoEventDetail } from './ClientMediaEvents.js'

import { ClientMediaTypes } from './ClientMediaConstants.js'
import { errorThrow } from '@moviemasher/runtime-shared'
import { assertDefined, isJsonRecord } from '../../Shared/SharedGuards.js'
import { isObject } from "@moviemasher/runtime-shared"
import { MovieMasher } from '@moviemasher/runtime-client'


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

export const isClientFont = (value: any): value is ClientFont => {
  return isObject(value) && 'family' in value
}
export function assertClientFont(value: any, name?: string): asserts value is ClientFont {
  if (!isClientFont(value)) errorThrow(value, 'ClientFont', name)
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

export function assertClientAudio(value: any, name?: string): asserts value is ClientAudio {
  if (!isClientAudio(value)) errorThrow(value, 'ClientAudio', name)
}

// MOVED: component 
export const isClientAudio = (value: any): value is ClientAudio => {
  return isObject(value) && value instanceof AudioBuffer
}

export const clientMediaAudioPromise = (request: EndpointRequest): Promise<ClientAudioDataOrError> => {
  const detail: ClientAudioEventDetail = { request }
  MovieMasher.eventDispatcher.dispatch(new CustomEvent('clientaudio', { detail }))
  const { promise } = detail
  assertDefined(promise)
  return promise 
}


export const clientMediaImagePromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
  const detail: ClientImageEventDetail = { request }
  const event: ClientImageEvent = new CustomEvent<ClientImageEventDetail>('clientimage', { detail })
  MovieMasher.eventDispatcher.dispatch<ClientImageEventDetail>(event)
  const { promise } = detail
  assertDefined(promise)
  return promise 
}

export const clientMediaVideoPromise = (request: EndpointRequest): Promise<ClientVideoDataOrError> => {
  const detail: ClientVideoEventDetail = { request }
  MovieMasher.eventDispatcher.dispatch(new CustomEvent('clientvideo', { detail }))
  const { promise } = detail
  assertDefined(promise)
  return promise 
}

export const clientMediaFontPromise = (request: EndpointRequest): Promise<ClientFontDataOrError> => {
  const detail: ClientFontEventDetail = { request }
  MovieMasher.eventDispatcher.dispatch(new CustomEvent('clientfont', { detail }))
  const { promise } = detail
  assertDefined(promise, 'clientMediaFontPromise promise')
  return promise 
}
