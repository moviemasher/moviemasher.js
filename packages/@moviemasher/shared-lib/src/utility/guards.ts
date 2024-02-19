import type { AssetResource, AudibleAsset, AudibleType, AudioAsset, AudioAssetObject, AudioInstance, Clip, ClipObject, ComplexSvgItem, ContainerAsset, ContainerInstance, ContentAsset, ContentInstance, DropResource, Encoding, Endpoint, EndpointRequest, ImageAsset, Instance, Integer, MashAsset, Point, PopulatedString, PropertyId, Rect, Resource, Size, StringTuple, Transcoding, TranscodingType, TranscodingTypes, Value, VideoAsset, VisibleAsset, VisibleInstance } from '../types.js'

import { $AUDIO, $BITMAPS, $HEIGHT, $IMAGE, $MASH, $VIDEO, $WAVEFORM, $WIDTH, RAW_TYPES, AUDIBLE_TYPES, TARGET_IDS, VISIBLE_TYPES, errorThrow, isAsset, isAssetObject, isRawType, isSourceAsset, isDropType, $TTF } from '../runtime.js'
import { isAboveZero, isDefined, isInteger, isNumber, isObject, isPopulatedString, isPositive, isValue } from './guard.js'

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && isTranscodingType(value.type)
}

export function assertDefined<T = true>(value: any, name?: string): asserts value is T {
  if (!isDefined<T>(value)) errorThrow(value, 'Defined', name)
}


export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) errorThrow(value, 'populated string', name)
}


export const isEncoding = (value: any): value is Encoding => {
  return isRequestable(value) && isRawType(value.type)
}

export const isRequestable = (value: any): value is Resource => {
  return isObject(value) && 'request' in value
}


export const isRawResource = (value: any): value is AssetResource => (
  isRequestable(value) && isRawType(value.type) 
)
export const isDropResource = (value: any): value is DropResource => (
  isRequestable(value) && (isRawType(value.type) || value.type === $TTF)
)

export function assertAssetResource(value: any, name?: string): asserts value is AssetResource {
  if (!isRawResource(value)) errorThrow(value, 'AssetResource', name)
}

export function assertInteger(value: any, name?: string): asserts value is Integer {
  if (!isInteger(value)) errorThrow(value, 'Integer', name)
}

export function assertPositive(value: any, name?: string): asserts value is number {
  if (!isPositive(value)) errorThrow(value, '>= 0', name)
}

export function assertAboveZero(value: any, name?: string): asserts value is number {
  if (!isAboveZero(value)) errorThrow(value, '> zero', name)
}


export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) errorThrow(value, 'true', name)
}

export function assertValue(value: any, name?: string): asserts value is Value {
  if (!isValue(value)) errorThrow(value, 'Value', name)
}

export const isPropertyId = (value: any): value is PropertyId => (
  isPopulatedString(value)
  && TARGET_IDS.some(type => value.startsWith(type))
  && value.split('.').length === 2
)

const TypesTranscoding: TranscodingTypes = [...RAW_TYPES, $BITMAPS, $WAVEFORM]

export const isTranscodingType = (type?: any): type is TranscodingType => {
  return TypesTranscoding.includes(type)
}

export const isAudibleAsset = (value: any): value is AudibleAsset => {
  return isAsset(value) && AUDIBLE_TYPES.includes(value.type as AudibleType)
}

export const isAudioAssetObject = (value: any): value is AudioAssetObject => (
  isAssetObject(value) && value.type === $AUDIO
)

export const isAudioAsset = (value: any): value is AudioAsset => (
  isAsset(value) && value.type === $AUDIO
)

export const isClip = (value: any): value is Clip => {
  return isObject(value) && 'contentId' in value
}

export function assertClip(value: any, name?: string): asserts value is Clip {
  if (!isClip(value)) errorThrow(value, 'Clip', name)
}

export const isClipObject = (value: any): value is ClipObject => {
  return isObject(value)
}

export const isImageAsset = (value: any): value is ImageAsset => {
  return isAsset(value) && value.type === $IMAGE
}

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && 'assetIds' in value
}

export const isAudioInstance = (value: any): value is AudioInstance => (
  isInstance(value) && isAudioAsset(value.asset)
)
export function assertAudioInstance(value: any, name?: string): asserts value is AudioInstance {
  if (!isAudioInstance(value)) errorThrow(value, 'AudioInstance', name)
}

export const isVideoAsset = (value: any): value is VideoAsset => {
  return isAsset(value) && value.type === $VIDEO
}

export const isMashAsset = (value: any): value is MashAsset => (
  isVideoAsset(value)
  && isSourceAsset(value)
  && value.source === $MASH
  && 'trackInstance' in value
)

export const isVisibleAsset = (value: any): value is VisibleAsset => {
  return isAsset(value) && VISIBLE_TYPES.includes(value.type)
}

const canBeContainerAsset = (value?: any): value is ContainerAsset => {
  return isVisibleAsset(value) && !!value.canBeContainer
}

export const canBeContainerInstance = (value?: any): value is ContainerInstance => {
  return isVisibleInstance(value) && canBeContainerAsset(value.asset)
}

export function assertCanBeContainerInstance(value?: any, name?: string): asserts value is ContainerInstance {
  if (!canBeContainerInstance(value)) errorThrow(value, 'ContainerInstance', name)
}

const canBeContentAsset = (value?: any): value is ContentAsset => {
  return isVisibleAsset(value) && !!value.canBeContent
}

export const canBeContentInstance = (value?: any): value is ContentInstance => {
  return isInstance(value) && canBeContentAsset(value.asset)
}

export function assertCanBeContentInstance(value?: any, name?: string): asserts value is ContentInstance {
  if (!canBeContentInstance(value)) errorThrow(value, 'ContentInstance', name)
}

export const isEndpoint = (value: any): value is Endpoint => {
  return isObject(value)
}

export function assertEndpoint(value: any, name?: string): asserts value is Endpoint {
  if (!isEndpoint(value)) errorThrow(value, 'Endpoint', name)
}

export const isRect = (value: any): value is Rect => {
  return isSize(value) && isPoint(value)
}

export function assertRect(value: any, name?: string): asserts value is Rect {
  if (!isRect(value))
    errorThrow(value, 'Rect', name)
}

export const isPoint = (value: any): value is Point => {
  return isObject(value) &&
    'x' in value && 'y' in value &&
    isNumber(value.x) && isNumber(value.y)
}

export function assertPoint(value: any, name?: string): asserts value is Point {
  if (!isPoint(value))
    errorThrow(value, 'Point', name)
}

export const isSize = <T=number>(value: any): value is Size<T> => {
  return isObject(value) &&
    $WIDTH in value && $HEIGHT in value &&
    isNumber(value.width) && isNumber(value.height)
}

export function assertSize(value: any, name?: string): asserts value is Size {
  if (!isSize(value))
    errorThrow(value, 'Size', name)
}

export const isVisibleInstance = (value: any): value is VisibleInstance => {
  return isInstance(value) && 'asset' in value && isVisibleAsset(value.asset) 
}

export function assertVisibleInstance(value: any, name?: string): asserts value is VisibleInstance {
  if (!isVisibleInstance(value)) errorThrow(value, 'VisibleInstance', name)
}


export const isRequest = (value: any): value is EndpointRequest => (
  isObject(value)
  && 'endpoint' in value
  && (isPopulatedString(value.endpoint) || isEndpoint(value.endpoint))
)

export const isComplexSvgItem = (value: any): value is ComplexSvgItem => (
  isObject(value) && 'svgItem' in value
)


