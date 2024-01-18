import type { AbsolutePath, AssetObject, AssetPromiseEventDetail, AssetType, ComplexSvgItem, DecodeOptions, DecodingType, DropType, EncodeOptions, EncodingType, EndpointRequest, EventDispatcher, EventDispatcherListener, EventDispatcherListeners, EventOptions, ManageType, MashAssetObject, Mimetype, ServerMediaRequest, Strings, TranscodeOptions, TranscodingType } from '@moviemasher/shared-lib/types.js'
import type { EventServerDecodeDetail, EventServerDecodeStatusDetail, EventServerEncodeDetail, EventServerEncodeProgressDetail, EventServerEncodeStatusDetail, EventServerManagedAssetDetail, EventServerMediaPromiseDetail, EventServerTextRectDetail, EventServerTranscodeDetail, EventServerTranscodeStatusDetail, ServerAsset } from './types.js'

import { ASSET_TARGET, COLOR, DECODE, ENCODE, MOVIEMASHER, SERVER, TRANSCODE, errorThrow, isAbsolutePath, isAsset, isMimetype, isObject, isString } from '@moviemasher/shared-lib/runtime.js'
import { JSDOM } from 'jsdom'

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
 * Uses the global object as the event dispatcher.
 */
export class ServerEventDispatcher implements EventDispatcher {
  addDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): void {
    addEventListener(type, listener as EventListener, options)
  }

  dispatch<T>(event: CustomEvent<T> | Event): boolean {
    // const string = typeof (typeOrEvent) === 'string'
    // const event = string ? new CustomEvent<T>(typeOrEvent) : typeOrEvent
    return dispatchEvent(event)
  }

  listenersAdd(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.addDispatchListener(type, listener)
    })
  }

  listenersRemove(record: EventDispatcherListeners) {
    Object.entries(record).forEach(([type, listener]) => {
      this.removeDispatchListener(type, listener)
    })
  }
  
  removeDispatchListener<T>(type: string, listener: EventDispatcherListener<T>, options?: EventOptions): void {
    removeEventListener(type, listener as EventListener, options)
  }
}

/** 
 * Dispatch to retrieve server asset promise for request.
 * @category ServerEvents
 */
export class EventServerMediaPromise extends CustomEvent<EventServerMediaPromiseDetail> {
  static Type = 'server-asset-promise'
  constructor(request: ServerMediaRequest, dropType: DropType, validDirectories?: Strings) { 
    super(EventServerMediaPromise.Type, { detail: { request, dropType, validDirectories } }) 
  }
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

/**
 * Dispatch to retrieve a managed asset from an asset id or object.
 * @category ClientEvents
 */
export class EventServerManagedAssetPromise extends CustomEvent<AssetPromiseEventDetail> {
  static Type = 'managed-asset-promise'
  constructor(assetIdOrObject: string | AssetObject) {
    const string = isString(assetIdOrObject)
    const assetId = string ? assetIdOrObject : assetIdOrObject.id
    const assetObject = string ? undefined : assetIdOrObject
    const detail: AssetPromiseEventDetail = { assetId, assetObject }
    super(EventServerManagedAssetPromise.Type, { detail })
  }
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

/**
 * Dispatch to retrieve a promise that encodes a mash asset.
 * @category ServerEvents
 */
export class EventServerEncode extends CustomEvent<EventServerEncodeDetail> {
  static Type = ENCODE
  constructor(mashAssetObject: MashAssetObject, id?: string, encodeOptions?: EncodeOptions, encodingType?: EncodingType, user?: string, relativeRoot?: string) { 
    super(EventServerEncode.Type, { detail: { encodingType, mashAssetObject, encodeOptions, user, id, relativeRoot } }) 
  }
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
  
export const isServerAsset = (value: any): value is ServerAsset => {
  return isAsset(value) && 'assetFiles' in value
}

export function assertMimetype(value: any, name?: string): asserts value is Mimetype {
  if (!isMimetype(value)) errorThrow(value, 'Mimetype', name)
}

export function assertAbsolutePath(value: any, name?: string): asserts value is AbsolutePath {
  if (!isAbsolutePath(value)) errorThrow(value, 'AbsolutePath', name)
}

const document = () => {
  const dom = new JSDOM('<html><body></body></html>', { runScripts: 'dangerously', resources: 'usable' })
  const { window } = dom
  const { document } = window
  return document
}

MOVIEMASHER.imports = {
  [COLOR]: '@moviemasher/server-lib/asset/image-color.js',
  ServerMashVideoListeners: '@moviemasher/server-lib/asset/video-mash.js',
  ServerRawAudioListeners: '@moviemasher/server-lib/asset/audio-raw.js',
  ServerRawImageListeners: '@moviemasher/server-lib/asset/image-raw.js',
  ServerRawVideoListeners: '@moviemasher/server-lib/asset/video-raw.js',
  ServerShapeImageListeners: '@moviemasher/server-lib/asset/image-shape.js',
  ServerTextImageListeners: '@moviemasher/server-lib/asset/image-text.js',
  ServerAssetManagerListeners: '@moviemasher/server-lib/asset/manager.js',
  ServerAssetPromiseListeners: '@moviemasher/server-lib/asset/promise.js',
  ServerEncodeAudioListeners: '@moviemasher/server-lib/encode/encode.js',
  ServerEncodeImageListeners: '@moviemasher/server-lib/encode/encode.js',
  ServerEncodeVideoListeners: '@moviemasher/server-lib/encode/encode.js',
  ServerEncodeStatusListeners: '@moviemasher/server-lib/encode/encode.js',
  ServerDecodeProbeListeners: '@moviemasher/server-lib/decode/probe.js',
  ServerDecodeStatusListeners: '@moviemasher/server-lib/decode/probe.js',
  ServerTranscodeListeners: '@moviemasher/server-lib/transcode/transcode.js',
  ServerTranscodeStatusListeners: '@moviemasher/server-lib/transcode/transcode.js',
}

MOVIEMASHER.document = document()
MOVIEMASHER.eventDispatcher = new ServerEventDispatcher()
MOVIEMASHER.context = SERVER
