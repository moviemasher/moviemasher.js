import type { AssetObject, AssetType, DataOrError, DecodeOptions, DecodingObject, DecodingType, EncodeOptions, EncodingObject, EncodingType, EndpointRequest, LoadType, ManageType, MashAssetObject, Rect, StringDataOrError, Strings, TranscodeOptions, TranscodingObject, TranscodingType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { ServerMediaRequest } from './ServerMedia.js'

import { ASSET, DECODE, ENCODE, TRANSCODE, assertAsset } from '@moviemasher/runtime-shared'
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
  static Type = ASSET
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
  static Type = DECODE
  constructor(decodingType: DecodingType, assetType: AssetType, request: EndpointRequest, pathFragment: string, decodeOptions: DecodeOptions) { 
    super(EventServerDecode.Type, { detail: { assetType, request, pathFragment, decodingType, decodeOptions } }) 
  }
}

export interface EventServerDecodeDetail {
  assetType: AssetType
  pathFragment: string
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
  constructor(pathFragment: string) {
    super(EventServerDecodeStatus.Type, { detail: { pathFragment } })
  }
}

export interface EventServerDecodeStatusDetail {
  pathFragment: string
  promise?: Promise<DataOrError<DecodingObject | Date>>
}

/**
 * Dispatch to retrieve a promise that encodes a mash asset.
 */
export class EventServerEncode extends CustomEvent<EventServerEncodeDetail> {
  static Type = ENCODE
  constructor(encodingType: EncodingType, mashAssetObject: MashAssetObject, encodeOptions: EncodeOptions, pathFragment: string) { 
    super(EventServerEncode.Type, { detail: { encodingType, mashAssetObject, encodeOptions, pathFragment } }) 
  }
}

export interface EventServerEncodeDetail {
  encodingType: EncodingType
  pathFragment: string
  encodeOptions: EncodeOptions
  mashAssetObject: MashAssetObject
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns encoding if finished.
 */
export class EventServerEncodeStatus extends CustomEvent<EventServerEncodeStatusDetail> {
  static Type = 'encode-status'
  constructor(pathFragment: string) {
    super(EventServerEncodeStatus.Type, { detail: { pathFragment } })
  }
}

export interface EventServerEncodeStatusDetail {
  pathFragment: string
  promise?: Promise<DataOrError<EncodingObject | Date>>
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
  static Type = TRANSCODE
  constructor(transcodingType: TranscodingType, assetType: AssetType, request: EndpointRequest, pathFragment: string, transcodeOptions: TranscodeOptions) { 
    super(EventServerTranscode.Type, { detail: { assetType, transcodeOptions, request, transcodingType, pathFragment } }) 
  }
}

export interface EventServerTranscodeDetail {
  assetType: AssetType
  pathFragment: string
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
  constructor(pathFragment: string) {
    super(EventServerTranscodeStatus.Type, { detail: { pathFragment } })
  }
}

export interface EventServerTranscodeStatusDetail {
  pathFragment: string
  promise?: Promise<DataOrError<TranscodingObject | Date>>
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