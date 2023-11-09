import type { AssetObject, AssetType, DataOrError, DecodeOptions, Decoding, DecodingType, EncodeOptions, Encoding, EncodingType, EndpointRequest, LoadType, ManageType, MashAssetObject, Rect, StringDataOrError, Strings, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { ServerMediaRequest } from './ServerMedia.js'

import { TARGET_ASSET, JOB_DECODE, JOB_ENCODE, JOB_TRANSCODE, assertAsset } from '@moviemasher/runtime-shared'
import { MovieMasher } from './MovieMasher.js'

export class CustomEvent<T> extends Event { 
  constructor(message: string, data: EventInit & { detail: T }) {
    super(message, data)
    this.detail = data.detail
  }
  
  detail: T
}

/** 
 * Dispatch to retrieve server asset promise for request.
 */
export class EventServerAssetPromise extends CustomEvent<EventServerAssetPromiseDetail> {
  static Type = 'server-asset-promise'
  constructor(request: ServerMediaRequest, loadType: LoadType, validDirectories?: Strings) { 
    super(EventServerAssetPromise.Type, { detail: { request, loadType, validDirectories } }) 
  }
}

export interface EventServerAssetPromiseDetail {
  loadType: LoadType
  request: ServerMediaRequest
  validDirectories?: Strings
  promise?: Promise<StringDataOrError>
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
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

  static Detail(assetIdOrObject: string | AssetObject): EventServerManagedAssetDetail {
    const event = new EventServerManagedAsset(assetIdOrObject)
    MovieMasher.eventDispatcher.dispatch(event)
    return event.detail
  }

  static asset(assetIdOrObject: string | AssetObject): ServerAsset {
    const detail = EventServerManagedAsset.Detail(assetIdOrObject)
    const { asset } = detail
    assertAsset(asset, JSON.stringify(assetIdOrObject))

    return asset
  }
}

export interface EventServerManagedAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
export class EventServerAsset extends CustomEvent<EventServerManagedAssetDetail> {
  static Type = TARGET_ASSET
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
 */
export class EventReleaseServerManagedAssets extends CustomEvent<string | undefined> {
  static Type = 'release-assets'
  constructor(detail?: ManageType) { 
    super(EventReleaseServerManagedAssets.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve a promise that decodes an asset.
 */
export class EventServerDecode extends CustomEvent<EventServerDecodeDetail> {
  static Type = JOB_DECODE
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
 */
export class EventServerEncode extends CustomEvent<EventServerEncodeDetail> {
  static Type = JOB_ENCODE
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
 */
export class EventServerTranscode extends CustomEvent<EventServerTranscodeDetail> {
  static Type = JOB_TRANSCODE
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