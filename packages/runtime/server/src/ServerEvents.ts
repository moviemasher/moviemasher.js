import type { AssetObject, AssetType, DataOrError, DecodeOptions, Decoding, DecodingType, EncodeOptions, Encoding, EncodingType, EndpointRequest, ImportType, ManageType, MashAssetObject, Rect, StringDataOrError, Strings, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { ServerMediaRequest } from './ServerMedia.js'

import { ASSET_TARGET, DECODE, ENCODE, TRANSCODE, assertAsset, jsonStringify } from '@moviemasher/runtime-shared'
import { MOVIEMASHER_SERVER } from './MovieMasherRuntimeServer.js'

/**
 * 
 * @category ServerEvents
 */
export class CustomEvent<T> extends Event { 
  constructor(message: string, data: EventInit & { detail: T }) {
    super(message, data)
    this.detail = data.detail
  }
  
  detail: T
}

/** 
 * Dispatch to retrieve server asset promise for request.
 * @category ServerEvents
 */
export class EventServerAssetPromise extends CustomEvent<EventServerAssetPromiseDetail> {
  static Type = 'server-asset-promise'
  constructor(request: ServerMediaRequest, importType: ImportType, validDirectories?: Strings) { 
    super(EventServerAssetPromise.Type, { detail: { request, importType, validDirectories } }) 
  }
}

export interface EventServerAssetPromiseDetail {
  importType: ImportType
  request: ServerMediaRequest
  validDirectories?: Strings
  promise?: Promise<StringDataOrError>
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ServerEvents
 */
export class EventServerManagedAsset extends CustomEvent<EventServerManagedAssetDetail> {
  static Type = 'managed-asset'
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventServerManagedAsset.Type, { detail }) 
  }
}

export interface EventServerManagedAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 * @category ServerEvents
 */
export class EventServerAsset extends CustomEvent<EventServerManagedAssetDetail> {
  static Type = ASSET_TARGET
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventServerAsset.Type, { detail }) 
  }
}

/**
 * Dispatch to release managed assets.
 * @category ServerEvents
 */
export class EventReleaseServerManagedAssets extends CustomEvent<string | undefined> {
  static Type = 'release-assets'
  constructor(detail?: ManageType) { 
    super(EventReleaseServerManagedAssets.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve a promise that decodes an asset.
 * @category ServerEvents
 */
export class EventServerDecode extends CustomEvent<EventServerDecodeDetail> {
  static Type = DECODE
  constructor(decodingType: DecodingType, assetType: AssetType, request: EndpointRequest, user: string, id: string, decodeOptions: DecodeOptions) { 
    super(EventServerDecode.Type, { detail: { assetType, request, user, decodingType, id, decodeOptions } }) 
  }
}

export interface EventServerDecodeDetail {
  assetType: AssetType
  user: string
  id: string
  request: ServerMediaRequest
  decodingType: DecodingType
  decodeOptions: DecodeOptions
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 * @category ServerEvents
 */
export class EventServerDecodeStatus extends CustomEvent<EventServerDecodeStatusDetail> {
  static Type = 'decode-status'
  constructor(id: string) {
    super(EventServerDecodeStatus.Type, { detail: { id } })
  }
}

export interface EventServerDecodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Decoding | Date>>
}

/**
 * Dispatch to retrieve a promise that encodes a mash asset.
 * @category ServerEvents
 */
export class EventServerEncode extends CustomEvent<EventServerEncodeDetail> {
  static Type = ENCODE
  constructor(encodingType: EncodingType, mashAssetObject: MashAssetObject, user: string, id: string, encodeOptions: EncodeOptions, relativeRoot?: string) { 
    super(EventServerEncode.Type, { detail: { encodingType, mashAssetObject, encodeOptions, user, id, relativeRoot } }) 
  }
}

export interface EventServerEncodeDetail {
  relativeRoot?: string
  user: string
  id: string
  encodingType: EncodingType
  encodeOptions: EncodeOptions
  mashAssetObject: MashAssetObject
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns encoding if finished.
 * @category ServerEvents
 */
export class EventServerEncodeStatus extends CustomEvent<EventServerEncodeStatusDetail> {
  static Type = 'encode-status'
  constructor(id: string) {
    super(EventServerEncodeStatus.Type, { detail: { id } })
  }
}

export interface EventServerEncodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Encoding | Date>>
}

/**
 * Dispatched when progress is made on an encoding.
 * @category ServerEvents
 */
export class EventServerEncodeProgress extends CustomEvent<EventServerEncodeProgressDetail> {
  static Type = 'encode-progress'
  constructor(id: string, progress: number) {
    super(EventServerEncodeProgress.Type, { detail: { id, progress } })
  }
}

export interface EventServerEncodeProgressDetail {
  id: string
  progress: number
}

/**
 * Dispatch to retrieve a promise that transcodes an asset.
 * @category ServerEvents
 */
export class EventServerTranscode extends CustomEvent<EventServerTranscodeDetail> {
  static Type = TRANSCODE
  constructor(transcodingType: TranscodingType, assetType: AssetType, request: EndpointRequest, user: string, id: string, transcodeOptions: TranscodeOptions, relativeRoot?: string) { 
    super(EventServerTranscode.Type, { detail: { assetType, transcodeOptions, request, transcodingType, user, id, relativeRoot } }) 
  }
}

export interface EventServerTranscodeDetail {
  relativeRoot?: string
  user: string
  id: string
  assetType: AssetType
  request: ServerMediaRequest
  transcodingType: TranscodingType
  transcodeOptions: TranscodeOptions
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 * @category ServerEvents
 */
export class EventServerTranscodeStatus extends CustomEvent<EventServerTranscodeStatusDetail> {
  static Type = 'transcode-status'
  constructor(id: string) {
    super(EventServerTranscodeStatus.Type, { detail: { id } })
  }
}

export interface EventServerTranscodeStatusDetail {
  id: string
  promise?: Promise<DataOrError<Transcoding | Date>>
}

/**
 * Dispatch to retrieve a rect for some text in a font.
 * @category ServerEvents
 */
export class EventServerTextRect extends CustomEvent<EventServerTextRectDetail> {
  static Type = 'text-rect'
  constructor(text: string, font: string, height: number) { 
    super(EventServerTextRect.Type, { detail: { text, font, height } }) 
  }
}

export interface EventServerTextRectDetail {
  text: string
  font: string
  height: number
  rect?: Rect
}