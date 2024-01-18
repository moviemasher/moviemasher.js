import type { AudibleAsset, AudibleType, AudioAsset, AudioAssetObject, ClientMediaRequest, Clip, ClipObject, ComplexSvgItem, ContainerAsset, ContainerInstance, ContentAsset, ContentInstance, Encoding, Endpoint, EndpointRequest, ImageAsset, Instance, Integer, MashAsset, NestedStringRecord, NumberRecord, Point, PopulatedString, PropertyId, Rect, Requestable, Scalar, ServerMediaRequest, Size, StringRecord, StringTuple, Transcoding, TranscodingType, TranscodingTypes, Unknowns, Value, VideoAsset, VisibleAsset, VisibleContentInstance, VisibleInstance } from '../types.js'

import { ASSET_TYPES, AUDIBLE_TYPES, AUDIO, HEIGHT, IMAGE, MASH, BITMAPS, TARGET_IDS, VIDEO, VISIBLE_TYPES, WAVEFORM, WIDTH, errorThrow, isAbsolutePath, isArray, isAsset, isAssetObject, isAssetType, isBoolean, isDefined, isNumber, isNumberOrNaN, isNumeric, isObject, isPopulatedString, isSourceAsset, isString, length } from '../runtime.js'

export const isTranscoding = (value: any): value is Transcoding => {
  return isRequestable(value) && isTranscodingType(value.type)
}

export const isEncoding = (value: any): value is Encoding => {
  return isRequestable(value) && isAssetType(value.type)
}

export const isRequestable = (value: any): value is Requestable => {
  return isObject(value) && 'request' in value
}

export function isPopulatedArray<T = unknown>(value: any): value is T[] {
  return isArray<T>(value) && length(value)
}

export const isInteger = (value: any): value is Integer => isNumber(value) && Number.isInteger(value)
export const isFloat = (value: any): boolean => isNumber(value) && !isInteger(value)
export const isPositive = (value: any): value is number => isNumber(value) && value >= 0
export const isBelowOne = (value: any): value is number => isNumber(value) && value < 1
export const isAboveZero = (value: any): value is number => isNumber(value) && value > 0

export const isValue = (value: any): value is Value => {
  return isNumber(value) || isString(value)
}

export const isScalar = (value: any): value is Scalar => (
  isBoolean(value) || isValue(value)
)

export const isTrueValue = (value: any): value is Value => {
  if (!isValue(value)) return false

  if (isNumeric(value)) return !!Number(value)

  return isPopulatedString(value)
}

export const isStringRecord = (value: any): value is StringRecord => {
  return isObject(value) && Object.values(value).every(value => isString(value))
}

export const isNumberRecord = (value: any): value is NumberRecord => {
  return isObject(value) && Object.values(value).every(value => isNumber(value))
}

export function assertNumberRecord(value: any, name?: string): asserts value is NumberRecord {
  if (!isNumberRecord(value)) errorThrow(value, 'NumberRecord', name)
}

export const isNestedStringRecord = (value: any): value is NestedStringRecord => {
  return isObject(value) && Object.values(value).every(value => (
    isStringRecord(value) || isNestedStringRecord(value)
  ))
}

export function assertObject(value: any, name?: string): asserts value is object {
  if (!isObject(value)) errorThrow(value, 'Object', name)
}

export function assertString(value: any, name?: string): asserts value is string {
  if (!isString(value)) errorThrow(value, 'String', name)
}

export function assertNumber(value: any, name?: string): asserts value is number {
  if (!isNumberOrNaN(value)) errorThrow(value, 'Number', name)
}

export function assertBoolean(value: any, name?: string): asserts value is boolean {
  if (!isBoolean(value)) errorThrow(value, 'Boolean', name)
}

export function assertDefined<T = true>(value: any, name?: string): asserts value is T {
  if (!isDefined<T>(value)) errorThrow(value, 'Defined', name)
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

export function assertArray<T = unknown>(value: any, name?: string): asserts value is T[] {
  if (!isArray(value)) errorThrow(value, 'Array', name)
}

export function assertPopulatedString(value: any, name = 'value'): asserts value is PopulatedString {
  if (!isPopulatedString(value)) errorThrow(value, 'populated string', name)
}

export function assertPopulatedArray(value: any, name = 'value'): asserts value is Unknowns {
  if (!isPopulatedArray(value)) errorThrow(value, 'populated array', name)
}

export function assertTrue(value: any, name = 'value'): asserts value is true {
  if (!value) errorThrow(value, 'true', name)
}

export function assertValue(value: any, name?: string): asserts value is Value {
  if (!isValue(value)) errorThrow(value, 'Value', name)
}

export function assertScalar(value: any, name?: string): asserts value is Scalar {
  if (!isScalar(value)) errorThrow(value, 'Scalar', name)
}

export const isPropertyId = (value: any): value is PropertyId => (
  isPopulatedString(value)
  && TARGET_IDS.some(type => value.startsWith(type))
  && value.split('.').length === 2
)

const TypesTranscoding: TranscodingTypes = [...ASSET_TYPES, BITMAPS, WAVEFORM]

export const isTranscodingType = (type?: any): type is TranscodingType => {
  return TypesTranscoding.includes(type)
}

export const isAudibleAsset = (value: any): value is AudibleAsset => {
  return isAsset(value) && AUDIBLE_TYPES.includes(value.type as AudibleType)
}

export const isAudioAssetObject = (value: any): value is AudioAssetObject => (
  isAssetObject(value) && value.type === AUDIO
)

export const isAudioAsset = (value: any): value is AudioAsset => (
  isAsset(value) && value.type === AUDIO
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
  return isAsset(value) && value.type === IMAGE
}

export const isInstance = (value?: any): value is Instance => {
  return isObject(value) && 'assetIds' in value
}

export const isVideoAsset = (value: any): value is VideoAsset => {
  return isAsset(value) && value.type === VIDEO
}

export const isMashAsset = (value: any): value is MashAsset => (
  isVideoAsset(value)
  && isSourceAsset(value)
  && value.source === MASH
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

export const isSize = (value: any): value is Size => {
  return isObject(value) &&
    WIDTH in value && HEIGHT in value &&
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

export const isStringTuple = (value: any): value is StringTuple => {
  return isArray(value) && value.length === 2 && value.every(isPopulatedString)
}

export function assertStringTuple(value: any, name?: string): asserts value is StringTuple {
  if (!isStringTuple(value)) errorThrow(value, 'StringTuple', name)
}

export const isRequest = (value: any): value is EndpointRequest => (
  isObject(value)
  && 'endpoint' in value
  && (isPopulatedString(value.endpoint) || isEndpoint(value.endpoint))
)


export const isServerMediaRequest = (value: any): value is ServerMediaRequest => {
  return isRequest(value) && 'path' in value && isAbsolutePath(value.path)
}

export const isClientMediaRequest = (value: any): value is ClientMediaRequest => {
  return isRequest(value) && 'objectUrl' in value && isPopulatedString(value.objectUrl)
}

export const isComplexSvgItem = (value: any): value is ComplexSvgItem => (
  isObject(value) && 'svgItem' in value
)
