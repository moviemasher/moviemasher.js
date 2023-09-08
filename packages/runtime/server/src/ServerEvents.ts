import type { AssetObject, DataOrError, DecodeOptions, DecodingType, EncodeOptions, EncodingType, EndpointRequest, JsonRecordDataOrError, LoadType, ManageType, MashAssetObject, Rect, StringDataOrError, TranscodeOptions, TranscodingType } from '@moviemasher/runtime-shared'
import type { ServerAsset } from './ServerAsset.js'
import type { ServerMediaRequest } from './ServerMedia.js'
import type { EncodingObject, DecodingObject, TranscodingObject } from '@moviemasher/runtime-shared'

import { TypeAsset, TypeDecode, TypeEncode, TypeTranscode } from '@moviemasher/runtime-shared'

export class CustomEvent<T> extends Event { 
  constructor(message: string, data: EventInit & { detail: T }) {
    super(message, data)
    this.detail = data.detail
  }
  
  detail: T
}

export interface EventServerAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ServerAsset
}

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 */
export class EventServerManagedAsset extends CustomEvent<EventServerAssetDetail> {
  static Type = 'managedasset'
  constructor(assetIdOrObject: string | AssetObject) { 
    const string = typeof assetIdOrObject === 'string' 
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail = { assetId, assetObject }
    super(EventServerManagedAsset.Type, { detail }) 
  }
}

/**
 * Dispatch to retrieve an asset from an asset id or object.
 */
export class EventServerAsset extends CustomEvent<EventServerAssetDetail> {
  static Type = TypeAsset
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
 * Dispatch to retrieve a promise that encodes a mash asset.
 */
export class EventServerEncode extends CustomEvent<EventServerEncodeDetail> {
  static Type = TypeEncode
  constructor(encodingType: EncodingType, inputPath: string, outputPath: string, encodeOptions: EncodeOptions, encodingId: string) { 
    super(EventServerEncode.Type, { detail: { outputPath, encodingType, inputPath, encodeOptions, encodingId } }) 
  }
}
export interface EncodeArgs {
  encodingType: EncodingType
  mashAssetObject: MashAssetObject
  options: EncodeOptions
}

export interface EventServerEncodeDetail {
  encodingType: EncodingType
  inputPath: string
  outputPath: string
  encodingId: string
  encodeOptions: EncodeOptions
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns progress or encoding if finished.
 */
export class EventServerEncodeFinish extends CustomEvent<EventServerEncodeFinishDetail> {
  static Type = 'encode-finish'
  constructor(id: string) {
    super(EventServerEncodeFinish.Type, { detail: { id } })
  }
}

export interface EventServerEncodeFinishDetail {
  id: string
  promise?: Promise<DataOrError<EncodingObject | number>>
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
 * Dispatch to retrieve a promise that decodes an asset.
 */
export class EventServerDecode extends CustomEvent<EventServerDecodeDetail> {
  static Type = TypeDecode
  constructor(decodingType: DecodingType, inputPath: string, outputPath: string, decodeOptions: DecodeOptions, decodingId: string) { 
    super(EventServerDecode.Type, { detail: { inputPath, outputPath, decodingType, decodeOptions, decodingId } }) 
  }
}

export interface DecodeArgs {
  request: EndpointRequest
  decodingType: DecodingType
  options: DecodeOptions
}

export interface EventServerDecodeDetail {
  inputPath: string
  outputPath: string
  decodingId: string
  decodingType: DecodingType
  decodeOptions: DecodeOptions
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns progress or decoding if finished.
 */
export class EventServerDecodeFinish extends CustomEvent<EventServerDecodeFinishDetail> {
  static Type = 'decode-finish'
  constructor(id: string) {
    super(EventServerDecodeFinish.Type, { detail: { id } })
  }
}

export interface EventServerDecodeFinishDetail {
  id: string
  promise?: Promise<DataOrError<DecodingObject | number>>
}

/**
 * Dispatch to retrieve a promise that transcodes an asset.
 */
export class EventServerTranscode extends CustomEvent<EventServerTranscodeDetail> {
  static Type = TypeTranscode
  constructor(transcodingType: TranscodingType, inputPath: string, outputPath: string, transcodeOptions: TranscodeOptions, transcodingId: string) { 
    super(EventServerTranscode.Type, { detail: { inputPath, transcodeOptions, outputPath, transcodingType, transcodingId } }) 
  }
}

export interface TranscodeArgs {
  request: ServerMediaRequest
  transcodingType: TranscodingType
  options: TranscodeOptions
}

export interface EventServerTranscodeDetail {
  inputPath: string
  outputPath: string
  transcodingType: TranscodingType
  transcodeOptions: TranscodeOptions
  transcodingId: string
  promise?: Promise<StringDataOrError>
}

/** 
 * Dispatch to retrieve a promise that returns progress or transcoding if finished.
 */
export class EventServerTranscodeFinish extends CustomEvent<EventServerTranscodeFinishDetail> {
  static Type = 'transcode-finish'
  constructor(id: string) {
    super(EventServerTranscodeFinish.Type, { detail: { id } })
  }
}

export interface EventServerTranscodeFinishDetail {
  id: string
  promise?: Promise<DataOrError<TranscodingObject | number>>
}


/** 
 * Dispatch to retrieve server asset promise for request.
 */
export class EventServerAssetPromise extends CustomEvent<EventServerAssetPromiseDetail> {
  static Type = 'server-asset-promise'
  constructor(request: ServerMediaRequest, loadType: LoadType) { 
    super(EventServerAssetPromise.Type, { detail: { request, loadType } }) 
  }
}

export interface EventServerAssetPromiseDetail {
  loadType: LoadType
  request: ServerMediaRequest
  promise?: Promise<StringDataOrError>
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