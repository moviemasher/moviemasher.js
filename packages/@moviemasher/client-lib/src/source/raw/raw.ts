import type { AssetCacheArgs, AssetObject, AssetObjects, AudioInstance, AudioInstanceArgs, AudioInstanceObject, ClientMediaRequest, DataOrError, DecodeOptions, Decoding, Decodings, DefiniteError, DropType, ImageElement, ImageInstance, ImageInstanceObject, InstanceArgs, ListenersFunction, Numbers, ProbingData, Rect, RectOptions, Requestable, ShapeAssetObject, Size, Sources, StringDataOrError, SvgItem, SvgItemArgs, Time, Times, TranscodeOptions, VideoInstance, VideoInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup } from 'lit'
import type { OptionalContent } from '../../client-types.js'
import type { ClientImageDataOrError, ClientImporter, ClientRawAsset, ClientRawAssetObject, ClientRawAudioAsset, ClientRawAudioAssetObject, ClientRawAudioInstance, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, ClientRawVideoAsset, ClientRawVideoAssetObject, ClientRawVideoInstance, ClientTextAssetObject, ClientVideo, ServerProgress, UploadResult } from '../../types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { ImageAssetMixin, ImageInstanceMixin } from '@moviemasher/shared-lib/mixin/image.js'
import { RawAssetMixin } from '@moviemasher/shared-lib/mixin/raw.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { MOVIEMASHER, ALPHA, AUDIO, DOT, DROP_TYPES, ERROR, FONT, IMAGE, PROBE, PROBING_TYPES, QUESTION, RAW, BITMAPS, SHAPE, SIZE_ZERO, SLASH, SVG, TEMPORARY, TEXT, TRANSCODE, VIDEO, WAVEFORM, arrayRemove, errorCaught, errorPromise, errorThrow, idGenerateString, isAssetObject, isAudibleAssetType, isDefiniteError, isDropType, isPopulatedString, isProbing, isUndefined, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertDefined, assertPopulatedString, assertTrue, isAudibleAsset } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeAboveZero, centerPoint, sizeAboveZero, sizeCopy, sizeCover, sizeString } from '@moviemasher/shared-lib/utility/rect.js'
import { promiseNumbers, requestUrl } from '@moviemasher/shared-lib/utility/request.js'
import { svgImageWithOptions, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { assertTimeRange, isTime, timeFromArgs, timeFromSeconds } from '@moviemasher/shared-lib/utility/time.js'
import { html } from 'lit-html'
import { Component } from '../../base/Component.js'
import { Scroller } from '../../base/LeftCenterRight.js'
import { isClientAudio } from '../../guards/ClientGuards.js'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { DROP_TARGET_CSS, DropTargetMixin, SizeReactiveMixin } from '../../mixin/component.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { MIME_SVG, eventStop } from '../../runtime.js'
import { dropFile, droppingFiles } from '../../utility/draganddrop.js'
import { EventAsset, EventClientAudioPromise, EventClientDecode, EventClientFontPromise, EventClientImagePromise, EventClientTranscode, EventClientVideoPromise, EventImportFile, EventImporterAdd, EventImporterError, EventImporterNodeFunction, EventUpload } from '../../utility/events.js'
import { svgColorMask, svgImagePromiseWithOptions, svgStringElement } from '../../utility/svg.js'
import { ClientAudibleAssetMixin } from '../../mixin/audible.js'
import { ClientAudibleInstanceMixin } from '../../mixin/audible.js'
import { ClientAssetClass } from '../../base/ClientAssetClass.js'

const MAX_WIDTH = 2000
const MIN_WIDTH = 200

const pixelsFromDuration = (duration: number): number => {
  const width = Math.round(duration * 10)
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width))
}

const WithRawAssetMixin = RawAssetMixin(ClientAssetClass)

export class ClientRawAssetClass extends WithRawAssetMixin implements ClientRawAsset {
  constructor(...args: any[]) {
    const [object] = args as [ClientRawAssetObject]
    super(object)
    const { request } = object
    this.request = request
  }

  override get assetObject(): ClientRawAssetObject {
    const { transcodings, request } = this
    return { ...super.assetObject, request, transcodings }
  }

  override initializeProperties(object: ClientRawAssetObject): void {
    const { transcodings } = object
    if (transcodings) this.transcodings.push(...transcodings)
    super.initializeProperties(object)
  }

  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError>  {
    const uploadPromise = this.uploadPromise(progress)
    if (uploadPromise) {
      const uploadOrError = await uploadPromise
      if (isDefiniteError(uploadOrError)) {
        // console.error(this.constructor.name, 'ClientRawAssetClass savePromise', uploadOrError)
        return uploadOrError
      }
      
      const { data } = uploadOrError
      
      const { id, assetRequest } = data
      this.request = assetRequest
      // console.log(this.constructor.name, 'ClientRawAssetClass savePromise calling saveId', uploadOrError.data)

      this.saveId(id)


      const decodePromise = this.decodePromise(progress)
      if (decodePromise) {
        const decodeOrError = await decodePromise
        if (isDefiniteError(decodeOrError)) return decodeOrError
      }

      const transcodeOrError = await this.transcodePromise(progress)
      if (isDefiniteError(transcodeOrError)) return transcodeOrError
    
    }
    return await super.savePromise(progress)
  }

  private decodePromise(progress?: ServerProgress): Promise<StringDataOrError> | undefined {
    const decoding = this.decodings.find(decoding => decoding.type === PROBE)
    if (isProbing(decoding)) {
      // only video that doesn't know its aubible needs to be decoded
      if (this.type !== VIDEO) return
      
      const { data } = decoding
      if (!isUndefined(data.audio)) return
    }
    const decodingType = PROBE
    const options: DecodeOptions = { types: PROBING_TYPES }
    const event = new EventClientDecode(this, decodingType, options, progress)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data } = orError
      if (decoding) this.decodings.splice(this.decodings.indexOf(decoding), 1)
      this.decodings.unshift(data)
      return { data: 'OK' }
    })
  }

  private async transcodePromise(progress?: ServerProgress): Promise<StringDataOrError>  {
    const { type, request, source } = this
    const result = { data: 'OK' }
    if (source !== RAW) return result

    const { [TRANSCODE]: transcodeOptions } = MOVIEMASHER.options
        
    if (transcodeOptions && transcodeOptions[type]) {
      const types = [...transcodeOptions[type]]
      switch(type) {
        case VIDEO: {
          delete this._canBeMuted
          if (!this.canBeMuted) {
            // don't make audio or waveform if there is no audio track
            arrayRemove(types, AUDIO)
            arrayRemove(types, WAVEFORM)
          }
          break
        }
        case IMAGE: {
          const url = requestUrl(request)
          if (url.endsWith(`${DOT}${SVG}`)) {
            // don't make image previews for SVG files
            arrayRemove(types, IMAGE)
          }
          break
        }
      }
      
      for (const transcodingType of types) {
        const transcodeOptions: TranscodeOptions = {}
        if (transcodingType === WAVEFORM && isAudibleAsset(this)) {
          transcodeOptions.width = pixelsFromDuration(this.duration)
        }
        const event = new EventClientTranscode(this, transcodingType, transcodeOptions, progress)
        MOVIEMASHER.eventDispatcher.dispatch(event)
        const { promise } = event.detail
        if (!promise) continue

        const orError = await promise      
        if (isDefiniteError(orError)) return orError

        const { data: transcoding } = orError
        this.transcodings.push(transcoding)
      }
    }
    
    return result
  }
  
  override unload(): void {
    super.unload()
    const { request } = this
    const { objectUrl, response, mediaPromise, urlPromise } = request
    if (objectUrl) {
      globalThis.window.alert(`ClientRawAssetClass revokeObjectURL ${objectUrl}`)
      URL.revokeObjectURL(objectUrl)
      delete request.objectUrl
    }
    if (response) delete request.response
    if (mediaPromise) delete request.mediaPromise
    if (urlPromise) delete request.urlPromise
  }

  private uploadPromise(progress?: ServerProgress): Promise<DataOrError<UploadResult>> | undefined {
    const { request } = this
    const { file, objectUrl } = request
    if (!file) return
    
    const event = new EventUpload(request, progress)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError 

      if (objectUrl) URL.revokeObjectURL(objectUrl)
      return orError
    })
  }

  override request: ClientMediaRequest
}

const WithAsset = AudibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientAudibleAssetMixin(WithAsset)
const WithAudioAsset = AudioAssetMixin(WithClientAsset)
export class ClientRawAudioAssetClass extends WithAudioAsset implements ClientRawAudioAsset {
  constructor(args: ClientRawAudioAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { audible } = args
    if (!audible) return Promise.resolve({ data: 0 })

    const { loadedAudio } = this
    if (loadedAudio) return Promise.resolve({ data: 0 })

    const transcoding = this.preferredTranscoding(AUDIO) || this
    if (!transcoding) {
      return Promise.resolve({ data: 0 })
    }

    const { request } = transcoding
    const event = new EventClientAudioPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientAudio } = orError
      this.loadedAudio = clientAudio
      return { data: 1 }
    })
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const transcoding = this.preferredTranscoding(WAVEFORM) 
    if (!transcoding) return errorPromise(ERROR.Unavailable, 'transcoding')
    
    // console.log(this.constructor.name, 'ClientRawAudioAssetClass.assetIcon', this.label)
    return this.assetIconPromise(transcoding, size, false).then(orError => {
      // console.log(this.constructor.name, 'ClientRawAudioAssetClass.assetIcon assetIconPromise', this.label)
    
      if (isDefiniteError(orError)) return orError
      
      const { waveformTransparency = ALPHA } = MOVIEMASHER.options
      return { data: svgColorMask(orError.data, size, waveformTransparency) }
    })
  }

  override initializeProperties(object: ClientRawAudioAssetObject): void {
    const { loadedAudio } = object
    if (loadedAudio) this.loadedAudio = loadedAudio
    super.initializeProperties(object)
  }

  override instanceFromObject(object?: AudioInstanceObject | undefined): AudioInstance {
    return new ClientRawAudioInstanceClass(this.instanceArgs(object))
  }

  override instanceArgs(object: AudioInstanceObject = {}): AudioInstanceArgs {
    const args = super.instanceArgs(object)
    return { ...args, asset: this }
  }

  override loadedAudio?: AudioBuffer

  static handleAsset(event: EventAsset): void {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, AUDIO, RAW)) {
      detail.asset = new ClientRawAudioAssetClass(assetObject)
      event.stopImmediatePropagation()
    }  
  }
}

// listen for audio/raw asset event
export const ClientRawAudioListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientRawAudioAssetClass.handleAsset
})

const AudioWithInstance = AudibleInstanceMixin(ClientInstanceClass)
const AudioWithClientInstance = ClientAudibleInstanceMixin(AudioWithInstance)
const WithAudioInstance = AudioInstanceMixin(AudioWithClientInstance)

export class ClientRawAudioInstanceClass extends WithAudioInstance implements ClientRawAudioInstance {
  constructor(args: AudioInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawAudioAsset
}

const ImageWithAsset = VisibleAssetMixin(ClientRawAssetClass)
const ImageWithClientAsset = ClientVisibleAssetMixin(ImageWithAsset)
const WithImageAsset = ImageAssetMixin(ImageWithClientAsset)

export class ClientRawImageAssetClass extends WithImageAsset implements ClientRawImageAsset {
  constructor(args: ClientRawImageAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { visible } = args
    if (!visible) return Promise.resolve({ data: 0 })

    const requestable = this.preferredTranscoding(IMAGE) || this
    if (!requestable) return Promise.resolve({ data: 0 })
    
    return this.imagePromise(requestable.request).then(icon => {
      return { data: isDefiniteError(icon) ? 0 : 1 }
    })
  }

  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    // console.log(this.constructor.name, 'ClientRawImageAssetClass.assetIcon', this.label)

    const transcoding = this.preferredTranscoding(IMAGE) || this    
    return this.assetIconPromise(transcoding, size, cover).then(orError => {
      if (isDefiniteError(orError)) return orError

      
      return { data: svgSvgElement(size, orError.data) }
    })
  }
  
  override initializeProperties(object: ClientRawImageAssetObject): void {
    const { loadedImage } = object
    if (loadedImage) this.loadedImage = loadedImage
    super.initializeProperties(object)
  }

  override instanceFromObject(object?: ImageInstanceObject | undefined): ImageInstance {
    return new ClientRawImageInstanceClass(this.instanceArgs(object))
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, asset } = detail
    if (!asset && isAssetObject(assetObject, IMAGE, RAW)) {
      detail.asset = new ClientRawImageAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for image/raw asset event
export const ClientRawImageListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientRawImageAssetClass.handleAsset
})

const ImageWithInstance = VisibleInstanceMixin(ClientInstanceClass)
const ImageWithClientInstance = ClientVisibleInstanceMixin(ImageWithInstance)
const WithImageInstance = ImageInstanceMixin(ImageWithClientInstance)

export class ClientRawImageInstanceClass extends WithImageInstance implements ClientRawImageInstance {
  constructor(args: ImageInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawImageAsset


  override svgItemForTimelinePromise(rect: Rect, _time: Time, ): Promise<DataOrError<SvgItem>> {
    const { asset } = this
    const requestable = asset.preferredTranscoding(IMAGE) || asset
    const { request } = requestable
    return asset.imagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { src } = orError.data
      return svgImagePromiseWithOptions(src, rect).then(data => ({ data }))
    })
  }
}

const canvasContext = (size: Size): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const { document } = MOVIEMASHER
  const canvas = document.createElement('canvas')
  const { width, height } = size
  canvas.height = height
  canvas.width = width
  const context = canvas.getContext('2d')
  assertTrue(context)
  return [canvas, context]
}

const seekingPromises = new Map<ClientVideo, Promise<ClientImageDataOrError>>()

const seek = (assetTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = assetTime.seconds
}

const videoImagePromise = (video: ClientVideo, outSize?: Size): Promise<ClientImageDataOrError> => {
  const inSize = sizeCopy(video)
  const size = sizeAboveZero(outSize) ? sizeCover(inSize, outSize) : inSize
  const { width, height } = size
  const [canvas, context] = canvasContext(size)
  context.drawImage(video, 0, 0, width, height)
  const image = new Image()
  image.src = canvas.toDataURL()
  return image.decode().then(() => ({ data: image}))
}

const seekNeeded = (assetTime: Time, video:HTMLVideoElement): boolean => {
  const { currentTime } = video
  if (!(currentTime || assetTime.frame)) return true

  const videoTime = timeFromSeconds(currentTime, assetTime.fps)
  return !videoTime.equalsTime(assetTime)
}

const imageFromVideoPromise = (video: ClientVideo, assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError> => {
  // console.log('imageFromVideoPromise', assetTime)
  
  const promise: Promise<ClientImageDataOrError> = new Promise(resolve => {
    if (!seekNeeded(assetTime, video)) {
      // console.log('imageFromVideoPromise !seekNeeded', assetTime)

      seekingPromises.delete(video)
      resolve(videoImagePromise(video, outSize))
      return 
    } else {
      video.onseeked = () => {
        video.onseeked = null
        resolve(videoImagePromise(video, outSize).then(orError => {        
          seekingPromises.delete(video)
          return orError
        }))
      }
      seek(assetTime, video)
    }
  })
  const existing = seekingPromises.get(video)
  
  seekingPromises.set(video, promise)
  if (existing) {
    // console.log('imageFromVideoPromise replacing promise', assetTime)
    
    return existing.then(() => promise)
  }
  // console.log('imageFromVideoPromise setting promise', assetTime)

  return promise
}

const fileAssetObjectPromise = (file: File, type: DropType): Promise<DataOrError<AssetObject>> => {
  const { name } = file
  const label = (name.split(DOT).slice(0, -1)).join(DOT).replace(/[-._]/g, ' ')
  const request: ClientMediaRequest = { file, objectUrl: URL.createObjectURL(file), endpoint: '' }

  // we can't reliably tell if there is an audio track so we assume there is 
  // one, and catch problems if it's played before decoded
  const info: ProbingData = { audible: isAudibleAssetType(type) }
  const decoding: Decoding = { id: '', data: info, type: PROBE }
  const decodings: Decodings = [decoding]
  const id = `${TEMPORARY}-${crypto.randomUUID()}`
  const shared: ClientRawAssetObject = { 
    type: IMAGE, label, request, decodings, id, source: RAW,
  }
 
  switch (type) {
    case AUDIO: {
      const event = new EventClientAudioPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventClientAudioPromise.Type)

      return promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: loadedAudio } = orError
        request.response = loadedAudio
        const { duration } = loadedAudio
        info.duration = duration
        const object: ClientRawAudioAssetObject = { ...shared, type, loadedAudio }
        return { data: object }
      })
    }
    case IMAGE: {
      const event = new EventClientImagePromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)

      return promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: image } = orError
        request.response = image
        const { width, height } = image
        info.width = width
        info.height = height
        const object: ClientRawImageAssetObject = { ...shared, type, loadedImage: image }
        // console.log('object', object)
        return { data: object }
      })
    }
    case VIDEO: {
      const event = new EventClientVideoPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventClientVideoPromise.Type)

      return promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: video } = orError
        request.response = video
        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: ClientRawVideoAssetObject = { ...shared, type, loadedVideo: video }
        return { data: object }
      })
    }
    case FONT: {
      const event = new EventClientFontPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventClientFontPromise.Type)

      return promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: font } = orError
        request.response = font
        const object: ClientTextAssetObject = { 
          ...shared, source: TEXT, loadedFont: font 
        }
        return { data: object }
      })
    }
  } 
}

const fileMedia = (file: File): Promise<DataOrError<AssetObject>> => {
  const { type: mimetype, size, name } = file
  const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
  const extension = name.split('.').pop()
  const type = mimetype.split('/').shift()
  if (!(extension && sizeInMeg && isDropType(type))) {
    return errorPromise(ERROR.ImportFile)
  }

  const max = options[`${type}Max`]
  if (!max) return errorPromise(ERROR.Internal)
  if (max > 0 && sizeInMeg > max) return errorPromise(ERROR.ImportSize)
  
  const extensions = options[`${type}Extensions`]
  if (extensions) {
    const fileExtensions = extensions.split(',').map(extension => 
      extension.startsWith('.') ? extension.slice(1) : extension
    )
    if (!fileExtensions.includes(extension)) {
      return errorPromise(ERROR.ImportFile, extension)
    }
  }
  return fileAssetObjectPromise(file, type)
}

const VideoWithAudibleAsset = AudibleAssetMixin(ClientRawAssetClass)
const VideoWithVisibleAsset = VisibleAssetMixin(VideoWithAudibleAsset)
const VideoWithClientAudibleAsset = ClientAudibleAssetMixin(VideoWithVisibleAsset)
const VideoWithClientVisibleAsset = ClientVisibleAssetMixin(VideoWithClientAudibleAsset)
const VideoWithVideoAsset = VideoAssetMixin(VideoWithClientVisibleAsset)

export class ClientRawVideoAssetClass extends VideoWithVideoAsset implements ClientRawVideoAsset {  
  constructor(args: ClientRawVideoAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    // console.debug(this.constructor.name, 'assetCachePromise', args)
    const promises: Promise<DataOrError<number>>[] = []
    const { audible, visible } = args
    const { canBeMuted } = this
    if (audible && canBeMuted) promises.push(this.preloadAudiblePromise(args))
    if (visible) promises.push(this.preloadVisiblePromise(args))
    return promiseNumbers(promises)
  }

  override audibleSource(): AudioBufferSourceNode | undefined {
    const { canBeMuted } = this
    if (!canBeMuted) {
      // console.log(this.constructor.name, 'audibleSource', 'no audio')
      return undefined
    }
    return super.audibleSource()
  }

  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    // console.log(this.constructor.name, 'ClientRawVideoAssetClass.assetIcon', this.label)

    const { previewTranscoding: transcoding } = this
    const time = timeFromArgs(1)
    return this.imageFromTranscodingPromise(transcoding, time, size).then(orError => {
      if (isDefiniteError(orError)) return orError
      
      const { data: image} = orError
      const { src } = image
      assertSizeAboveZero(image)

      const { width, height } = image
      const inSize = { width, height }
      const containedSize = sizeCover(inSize, size, !cover)
      const outRect = { ...containedSize, ...centerPoint(size, containedSize) }
      const options: RectOptions = { ...outRect }
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        // console.log(this.constructor.name, 'assetIcon', svgImage.constructor.name, options, src)
        return { data: svgSvgElement(size, svgImage) }
      })
    })
  }

  private fps = 10

  private framesArray(start: Time): Numbers {
    const { duration, fps } = this
    return start.durationFrames(duration, fps)
  }

  private get framesMax() : number { 
    const { fps, duration } = this
    // console.log(this.constructor.name, 'framesMax', fps, duration)
    return Math.floor(fps * duration) - 2 
  }

  private imageFromTranscodingPromise(transcoding: Requestable | undefined, assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    const target: Requestable | ClientRawVideoAsset = transcoding || this
    const { type, request } = target
    // console.log(this.constructor.name, 'imageFromTranscodingPromise', type, assetTime)
    switch (type) {
      case IMAGE: {
        const event = new EventClientImagePromise(request)
        MOVIEMASHER.eventDispatcher.dispatch(event)
        const { promise } = event.detail
        if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)

        return promise
      }
      case VIDEO: {
        return this.imageFromVideoTranscodingPromise(transcoding, assetTime, outSize)
      }
      case BITMAPS: {
        const loaded = this.loadedImageForPromise(assetTime, outSize)
        if (loaded) return Promise.resolve({ data: loaded })

        // console.log(this.constructor.name, 'imageFromTranscodingPromise', type)
        
        return this.imageFromSequencePromise(target, assetTime, outSize)
      }
    }
    return errorPromise(ERROR.Internal)
  }

  private begin = 1
  private increment = 1

  private imageFromSequencePromise(transcoding: Requestable, assetTime: Time, _?: Size): Promise<ClientImageDataOrError> {
    const frames = this.framesArray(assetTime)
    const frame = frames.length ? frames[0] : this.framesMax 
    const { increment, begin } = this

    const target = transcoding || this
    const { request } = target
    const urlFromRequest = requestUrl(request)

    const components = urlFromRequest.split(SLASH)
    const patternAndQuery = components.pop() // eg. '%02d.jpg?..'
    assertPopulatedString(patternAndQuery, 'pattern') 
    const [pattern, query] = patternAndQuery.split(QUESTION) 

    const extension = pattern.split(DOT).pop() // eg. 'jpg'
    assertPopulatedString(extension, 'extension') 

    // regular expression to extract padding from pattern
    const regExp = /%0(\d+)d/
    const match = pattern.match(regExp)
    assertDefined(match, 'match')
    const padding = Number(match[1])

    const frameString = String((frame * increment) + begin)
    const padded = padding ? frameString.padStart(padding, '0') : frameString
 
    const fileName = [padded, extension].join(DOT)

    const endpointComponents = [[...components, fileName].join(SLASH)]
    if (query) endpointComponents.push(query)
    const endpoint = endpointComponents.join(QUESTION)

    const imageRequest = this.frameRequests[endpoint] ||= { ...request, endpoint }

    const event = new EventClientImagePromise(imageRequest)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail

    return promise!
  }

  private frameRequests: Record<string, ClientMediaRequest> = {}


  private imageFromVideoTranscodingPromise(previewTranscoding: Requestable | undefined, assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    // console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', assetTime, outSize)
    
    const loaded = this.loadedImageForPromise(assetTime, outSize)
    if (loaded) return Promise.resolve({ data: loaded })
    
    const { request } = previewTranscoding || this

    const event = new EventClientVideoPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientVideoPromise.Type)

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientVideo } = orError
      const key = this.loadedImageKey(assetTime, outSize)

      return imageFromVideoPromise(clientVideo, assetTime, outSize).then(orError => {
        if (!isDefiniteError(orError)) {
          const { data: image } = orError
          // console.debug(this.constructor.name, 'imageFromVideoTranscodingPromise SETTING', key)
          this.loadedImages.set(key, image)
        }
        return orError
      })
    })
  }  

  override initializeProperties(object: ClientRawVideoAssetObject): void {
    const { loadedVideo } = object
    if (loadedVideo) this.loadedVideo = loadedVideo
    super.initializeProperties(object)
  }

  override instanceFromObject(object?: VideoInstanceObject | undefined): VideoInstance {
    return new ClientRawVideoInstanceClass(this.instanceArgs(object))
  }

  private loadedImages = new Map<string, ImageElement>()

  loadedImage(assetTime: Time, size?: Size): DataOrError<ImageElement> {
    const loaded = this.loadedImageForPromise(assetTime, size)
    if (loaded) return { data: loaded }

    return namedError(ERROR.Unavailable, 'loadedImage')
  }

  private loadedImageForPromise(assetTime: Time, outSize?: Size): ImageElement | undefined {
    const key = this.loadedImageKey(assetTime, outSize)
    return this.loadedImages.get(key)
  }

  private loadedImageKey(assetTime: Time, outSize?: Size): string {
    const { frame, fps } = assetTime
    const frameFps = `${frame}@${fps}`
    if (!sizeAboveZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }

  loadedImagePromise(assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError>{
    const { previewTranscoding: transcoding } = this
    return this.imageFromTranscodingPromise(transcoding, assetTime, outSize)
  }

  private preloadAudiblePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    if (this.loadedAudio) return Promise.resolve({ data: 0 })

    const transcoding = this.preferredTranscoding(AUDIO, VIDEO) || this
    const { request } = transcoding 

    const event = new EventClientAudioPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientAudioPromise.Type)

    
    return promise.then(orError => {
      if (isDefiniteError(orError)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isDefiniteError', orError)
        this.canBeMuted = false
        return orError
      }

      const { data } = orError
      if (isClientAudio(data)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isClientAudio')
        this.loadedAudio = data
        return { data: 1 }
      }

      return namedError(ERROR.Internal)
    })
  }
  declare request: ClientMediaRequest

  private preloadVisiblePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const promises: Promise<DataOrError<number>>[] = []
    const requestable = this.preferredTranscoding(BITMAPS, VIDEO) || this
    const { type, request } = requestable  
    if (type === VIDEO) {
      const event = new EventClientVideoPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return errorPromise(ERROR.Unimplemented, EventClientVideoPromise.Type)

      promises.push(promise.then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: clientVideo } = orError
        this.loadedVideo = clientVideo
        return { data: 1 }
      }))
    } else promises.push(this.sequenceImagesPromise(args))
    return promiseNumbers(promises)
  }

  get previewTranscoding(): Requestable | undefined {
    return this.preferredTranscoding(BITMAPS, VIDEO)
  }

  private sequenceImagesPromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { assetTime: range } = args
    if (!isTime(range)) {
      // console.error(this.constructor.name, 'sequenceImagesPromise', args)
      return Promise.resolve({ data: 0 })
    }
    
    
    const assetTimes: Times = []
    if (range.isRange) {
      assertTimeRange(range)
      
      assetTimes.push(...range.frameTimes)
    } else assetTimes.push(range)
      const promises = assetTimes.map(assetTime => {
        return this.loadedImagePromise(assetTime).then(orError => {
        if (isDefiniteError(orError)) return orError

        return { data: 1 }
      })
    })
    return promiseNumbers(promises)
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, asset } = detail
    if (!asset && isAssetObject(assetObject, VIDEO, RAW)) {
      detail.asset = new ClientRawVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/raw asset event
export const ClientRawVideoListeners: ListenersFunction = () => ({
  [EventAsset.Type]: ClientRawVideoAssetClass.handleAsset
})

const VideoWithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const VideoWithVisibleInstance = VisibleInstanceMixin(VideoWithAudibleInstance)
const VideoWithClientAudibleInstance = ClientAudibleInstanceMixin(VideoWithVisibleInstance)
const VideoWithClientVisibleInstance = ClientVisibleInstanceMixin(VideoWithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(VideoWithClientVisibleInstance)

export class ClientRawVideoInstanceClass extends WithVideoInstance implements ClientRawVideoInstance {
  constructor(args: VideoInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawVideoAsset


  private sequenceItemPromise(rect: Rect, assetTime: Time): Promise<DataOrError<SvgItem>> {
    const { asset } = this
    return asset.loadedImagePromise(assetTime).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: loadedImage } = orError
      const { src } = loadedImage
      return svgImagePromiseWithOptions(src, rect).then(data => ({ data }))
    })
  }

  private sequenceItem(rect: Rect, assetTime: Time): DataOrError<SvgItem> {
    const { asset } = this
    const orError = asset.loadedImage(assetTime)
    if (isDefiniteError(orError)) return orError

    const { data: loadedImage } = orError
    const { src } = loadedImage
    const data = svgImageWithOptions(src, rect)
    return { data }
  }

  override svgItem(args: SvgItemArgs): DataOrError<SvgItem> {
    const { rect, time } = args
    return this.sequenceItem(rect, this.assetTime(time))
  }

  override svgItemForTimelinePromise(rect: Rect, time: Time): Promise<DataOrError<SvgItem>> {
    return this.sequenceItemPromise(rect, this.assetTime(time))
  }

  override unload() {
    delete this._foreignElement
    delete this.loadedVideo
  }
}

const options = {
  audioExtensions: '',
  audioMax: -1,
  fontExtensions: '',
  fontMax: -1,
  imageExtensions: '',
  imageMax: -1,
  videoExtensions: '',
  videoMax: -1,
}

const accept = (): string => {
  const accept = DROP_TYPES.flatMap(type => {
    const max = options[`${type}Max`]
    if (!max) return []

    const extensions = options[`${type}Extensions`]
    if (!extensions) return [`${type}/*`]
    
    return extensions.split(',').map(extension => 
      `${extension.startsWith('.') ? '' : '.'}${extension}`
    )
  }).join(',')
  return accept
}

export const ClientRawTag = 'movie-masher-importer-raw'

const ClientRawSizeReactive = SizeReactiveMixin(Component)
const ClientRawDropTarget = DropTargetMixin(ClientRawSizeReactive)
/**
 * @category Elements
 */
export class ClientRawElement extends ClientRawDropTarget {
  override acceptsClip = false
  
  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  protected async handleChange(event: DragEvent): Promise<void> {
    const input = event.currentTarget as HTMLInputElement
    const result = await this.handleFileList(input.files)
    input.value = ''
    return result
  }

  override async handleDropped(event: DragEvent): Promise<void> {
    eventStop(event)
    return this.handleFileList(event.dataTransfer?.files)
  }

  private async handleDroppedSvg(file: File): Promise<DataOrError<AssetObject>> {
    const stringOrError = await new Promise<DataOrError<string>>(resolve => {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => { 
        const { loaded, total } = event
        if (loaded === total ) {
          const { result: data } = reader
          if (isPopulatedString(data)) resolve({ data }) 
        }
      }
      reader.onerror = error => { resolve(errorCaught(error)) }
      reader.readAsText(file)
    }) 
    if (isDefiniteError(stringOrError)) return stringOrError
    
    const { data: string } = stringOrError

    // console.log('handleDroppedSvg', string)
    const svg = svgStringElement(string)
    if (!svg) return namedError(ERROR.ImportFile, 'svg')

    const viewBox = svg.getAttribute('viewBox')
    const size = sizeCopy(SIZE_ZERO)
    if (viewBox) {
      const bits = viewBox.split(' ').map(string => string.trim())
      const [width, height] = bits.slice(-2).map(Number)
      size.width = width
      size.height = height
    }
    if (!sizeAboveZero(size))  {
      const width = svg.getAttribute('width')
      const height = svg.getAttribute('height')
      if (width && height) {
        size.width = Number(width.trim())
        size.height = Number(height.trim())
      }
    }
    if (!sizeAboveZero(size)) return namedError(ERROR.ImportFile, 'viewBox')

    const paths = [...svg.querySelectorAll('path')].map(path => {
      return path.getAttribute('d') || ''
    })
    const path = paths.filter(Boolean).join(' M 0 0 ')
    if (!path) return namedError(ERROR.ImportFile, 'path')
    const object: ShapeAssetObject = {
      label: file.name, path, type: IMAGE, source: SHAPE, id: idGenerateString(),
      pathWidth: size.width, pathHeight: size.height,
    }
    return { data: object }
  }


  private async handleFileList(fileList?: FileList | null): Promise<void> {
    if (!fileList?.length) return

    const assetObjects: AssetObjects = []
    const errors: DefiniteError[] = []

    for (const file of fileList) {
      if (this.sources.includes(SHAPE)) {
        if (file.type === MIME_SVG) {
          const shapeOrError = await this.handleDroppedSvg(file)
          if (isDefiniteError(shapeOrError)) {
            errors.push(shapeOrError)
            continue
          }
          assetObjects.push(shapeOrError.data)
          continue
        }
      } else {
        // console.log('handleFileList NO SHAPE', this.sources)
      }
      const orError = await dropFile(file)
      if (isDefiniteError(orError)) {
        errors.push(orError)
        continue
      }
      assetObjects.push(orError.data)
    }
    assetObjects.forEach(assetObject => {
      const event = new EventImporterAdd(assetObject)

      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) return


    })
    // TODO something with errors
    errors.forEach(error => {
      MOVIEMASHER.eventDispatcher.dispatch(new EventImporterError(error))
    })
  }
  
  protected override get defaultContent(): OptionalContent {
    return html`<div class='contents'>
      Drop files here or 
      <input 
        aria-label='file'
        type='file' multiple
        accept='${accept()}'
        @change='${this.handleChange}'
      ></input>
    </div>`
  }

  sources: Sources = []
  
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    Scroller.styles,
    DROP_TARGET_CSS,
    css`
      :host {
        --ratio-preview-selector: var(--ratio-preview, 0.25);
        --pad: var(--pad-content);
        --gap: var(--gap-content);
      }
      div.root {
        display: block;
        overflow-y: auto;
      }
      div.contents {
        padding: var(--pad);
      }

      div.contents > * {
        margin-right: var(--gap); 
        margin-bottom: var(--gap);
      }

      .dropping {
        box-shadow: var(--dropping-shadow);
      }
    `
  ]
}

customElements.define(ClientRawTag, ClientRawElement)

declare global {
  interface HTMLElementTagNameMap {
    [ClientRawTag]: ClientRawElement
  }
}

const RawClientImporterIcon = "<svg version='1.1' stroke='currentColor' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><desc></desc><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M14 3v4a1 1 0 0 0 1 1h4'></path><path d='M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3'></path></svg>"
    
class RawClientImporter implements ClientImporter {
  private _icon?: Node

  get icon(): Node {
    return this._icon ||= svgStringElement(RawClientImporterIcon)!
  }

  id = ClientRawTag

  label = 'Raw'

  private _ui?: ClientRawElement
  ui(): Node {
    const { document } = MOVIEMASHER
    this._ui ||= document.createElement(ClientRawTag)
    this._ui.sources = this.sources
    // console.log(this.id, 'ui')
    return this._ui
  }

  private sources: Sources = []
  
  static handleImportFile (event: EventImportFile) {
    const { detail } = event
    const { file } = detail
    detail.promise = fileMedia(file)
    event.stopPropagation()
  }

  static handleImporters(event: EventImporterNodeFunction) {
    const { detail } = event
    const { map, sources } = detail
    const { instance } = RawClientImporter
    instance.sources = sources
    map.set(instance.icon, instance.ui.bind(instance))
  }

  private static _instance?: RawClientImporter
  static get instance(): RawClientImporter {
    return this._instance ||= new RawClientImporter()
  }
}

// listen for import related events
export const ClientRawImportListeners: ListenersFunction = () => ({
  [EventImporterNodeFunction.Type]: RawClientImporter.handleImporters,
  [EventImportFile.Type]: RawClientImporter.handleImportFile,
})
