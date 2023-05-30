import type { ClientAudio, ClientAudioDataOrError, ClientFont, ClientFontDataOrError, ClientImage, ClientImageDataOrError, ClientMedia, ClientMediaType, ClientVideo, ClientVideoDataOrError } from './ClientMedia.js'
import type { LoadType } from '../../Setup/LoadType.js'
import type { GraphFileType } from "../../Setup/GraphFileType.js"

import { ClientMediaTypes } from './ClientMediaConstants.js'
import { errorThrow } from '../Error/ErrorFunctions.js'
import { assertDefined, isJsonRecord, isObject } from '../../Shared/SharedGuards.js'
import { EndpointRequest } from '../Request/Request.js'
import { ClientAudioEventDetail, ClientFontEventDetail, ClientImageEvent, ClientImageEventDetail, ClientVideoEventDetail } from './ClientMediaEvents.js'
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


export type LoaderType = GraphFileType | LoadType


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
  MovieMasher.dispatch(new CustomEvent('clientaudio', { detail }))
  const { promise } = detail
  assertDefined(promise)
  return promise // requestAudioPromise(request)
}


export const clientMediaImagePromise = (request: EndpointRequest): Promise<ClientImageDataOrError> => {
  const detail: ClientImageEventDetail = { request }
  const event: ClientImageEvent = new CustomEvent<ClientImageEventDetail>('clientimage', { detail })
  MovieMasher.dispatch<ClientImageEventDetail>(event)
  const { promise } = detail
  assertDefined(promise)
  return promise // requestImagePromise(request)
}

export const clientMediaVideoPromise = (request: EndpointRequest): Promise<ClientVideoDataOrError> => {
  const detail: ClientVideoEventDetail = { request }
  MovieMasher.dispatch(new CustomEvent('clientvideo', { detail }))
  const { promise } = detail
  assertDefined(promise)
  return promise // requestVideoPromise(request)
}



export const clientMediaFontPromise = (request: EndpointRequest): Promise<ClientFontDataOrError> => {
  const detail: ClientFontEventDetail = { request };
  MovieMasher.dispatch(new CustomEvent('clientfont', { detail }));
  const { promise } = detail;
  assertDefined(promise);
  return promise; // requestFontPromise(request)
}