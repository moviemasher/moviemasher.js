import type { ClientImage, ClientImageDataOrError, ClientImporter, ClientInstance, ClientMediaRequest, ClientRawAsset, ClientRawAssetObject, ClientRawAudioAsset, ClientRawAudioAssetObject, ClientRawAudioInstance, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, ClientRawVideoAsset, ClientRawVideoAssetObject, ClientRawVideoInstance, ClientTextAssetObject, ClientVideo, Panel, PreviewElement, ServerProgress, SvgItem, UploadResult } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, AssetObject, AssetObjects, AudibleAsset, AudioInstance, AudioInstanceArgs, AudioInstanceObject, DataOrError, DecodeOptions, Decoding, Decodings, ImageInstance, ImageInstanceObject, ImportType, InstanceArgs, ListenersFunction, Numbers, ProbingData, Rect, RectOptions, Size, StringDataOrError, Time, Times, Transcoding, TranscodingTypes, Transcodings, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'
import type { CSSResultGroup } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { AudibleAssetMixin, AudioAssetMixin, ImageAssetMixin, VideoAssetMixin, VisibleAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { AudibleInstanceMixin, AudioInstanceMixin, ImageInstanceMixin, VideoInstanceMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { assertDefined, assertPopulatedString, assertTrue, isAudibleAsset } from '@moviemasher/lib-shared/utility/guards.js'
import { assertSizeAboveZero, centerPoint, pointCopy, sizeAboveZero, sizeCopy, sizeCover, sizeString } from '@moviemasher/lib-shared/utility/rect.js'
import { promiseNumbers, requestUrl } from '@moviemasher/lib-shared/utility/request.js'
import { assertTimeRange, isTime, timeFromArgs, timeFromSeconds } from '@moviemasher/lib-shared/utility/time.js'
import { EventAsset, EventClientAudioPromise, EventClientDecode, EventClientFontPromise, EventClientImagePromise, EventClientTranscode, EventClientVideoPromise, EventImport, EventImporterAdd, EventImporters, EventUpload, MOVIEMASHER, eventStop } from '@moviemasher/runtime-client'
import { AUDIO, DOT, ERROR, FONT, IMAGE, IMPORT_TYPES, NAMESPACE_SVG, PROBE, PROBING_TYPES, RAW, SEMICOLON, SEQUENCE, SLASH, TEMPORARY, TEXT, VIDEO, errorPromise, errorThrow, isAssetObject, isAudibleAssetType, isBoolean, isDefiniteError, isImportType, isProbing, isUndefined, namedError } from '@moviemasher/runtime-shared'
import { html } from 'lit-html'
import { Component } from '../base/Component.js'
import { Scroller } from '../base/LeftCenterRight.js'
import { isClientAudio, isClientVideo } from '../guards/ClientGuards.js'
import { ClientInstanceClass } from '../instance/ClientInstanceClass.js'
import { ClientVisibleAssetMixin } from '../mixins/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../mixins/ClientVisibleInstanceMixin.js'
import { DROP_TARGET_CSS, DropTargetMixin, SizeReactiveMixin } from '../mixins/component.js'
import { dropRawFiles, droppingFiles } from '../utility/draganddrop.js'
import { requestImagePromise } from '../utility/request.js'
import { svgImagePromiseWithOptions, svgSetChildren, svgSetDimensions, svgSvgElement } from '../utility/svg.js'
import { ClientAudibleAssetMixin } from './Audible/ClientAudibleAssetMixin.js'
import { ClientAudibleInstanceMixin } from './Audible/ClientAudibleInstanceMixin.js'
import { ClientAssetClass } from './ClientAssetClass.js'

function assertAudibleAsset(value: any, name?: string): asserts value is AudibleAsset {
  if (!isAudibleAsset(value)) errorThrow(value, 'AudibleAsset', name)
}

export class ClientRawAssetClass extends ClientAssetClass implements ClientRawAsset {
  constructor(...args: any[]) {
    const [object] = args as [ClientRawAssetObject]
    super(object)

    const { request } = object
    this.request = request
  }

  override get assetObject(): ClientRawAssetObject {
    const { request, transcodings } = this
    return { ...super.assetObject, request, transcodings }
  }

  override assetIcon(_: Size): Promise<SVGSVGElement> | undefined { return }

  override initializeProperties(object: ClientRawAssetObject): void {
    const { transcodings } = object
    if (transcodings) this.transcodings.push(...transcodings)
    super.initializeProperties(object)
  }


  preferredTranscoding(...types: TranscodingTypes): Transcoding | undefined {
    for (const type of types) {
      const found = this.transcodings.find(object => object.type === type)
      if (found) return found
    }
    return
  }
  
  override async savePromise(progress?: ServerProgress): Promise<StringDataOrError> {
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

      const transcodePromise = this.transcodePromise(progress)
      if (transcodePromise) {
        const transcodeOrError = await transcodePromise
        if (isDefiniteError(transcodeOrError)) return transcodeOrError
      }
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

  private async transcodePromise(progress?: ServerProgress): Promise<Promise<StringDataOrError> | undefined> {
    const { type } = this
    const transcodingTypes: TranscodingTypes = []
    switch (type) {
      case VIDEO: {
        assertAudibleAsset(this)
        
        transcodingTypes.push(SEQUENCE)
        if (this.audio) transcodingTypes.push(AUDIO)
        break
      }
      default: transcodingTypes.push(type)
    }
    for (const transcodingType of transcodingTypes) {
      const event = new EventClientTranscode(this, transcodingType, {}, progress)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (!promise) continue

      const orError = await promise
      // console.log('ClientRawAssetClass.transcodePromise', { orError })
      
      if (isDefiniteError(orError)) return orError

      const { data: transcoding } = orError
      // console.log('ClientRawAssetClass.transcodePromise', { transcoding })
      this.transcodings.push(transcoding)
    }
    return { data: 'OK' }
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

  request: ClientMediaRequest


  transcodings: Transcodings = []
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

    const { loadedImage } = this
    if (loadedImage) return Promise.resolve({ data: 0 })

    const transcoding = this.preferredTranscoding(IMAGE) 
    if (!transcoding) return Promise.resolve({ data: 0 })
    
    const { request } = transcoding
    const event = new EventClientImagePromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)
    
    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientImage } = orError
      // console.log(this.constructor.name, 'assetCachePromise setting loadedImage')
      this.loadedImage = clientImage
      return { data: 1 }
    })
  }

  override assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined {
    // console.debug(this.constructor.name, 'assetIcon', { size })
    const transcoding = this.preferredTranscoding(IMAGE) || this
    if (!transcoding) return undefined
    
    const { request } = transcoding
    const event = new EventClientImagePromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      assertSizeAboveZero(clientImage)

      const { width, height, src } = clientImage
      // console.debug(this.constructor.name, 'assetIcon', { src })

      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, !cover)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect } 
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        return svgSvgElement(size, svgImage)
      })
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

  loadedImage?: ClientImage 

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

  override svgItemForTimelinePromise(rect: Rect, _time: Time, ): Promise<SvgItem> {
    const { asset } = this
    const requestable = asset.preferredTranscoding(IMAGE) || asset
    if (!requestable) {
      // console.debug(this.constructor.name, 'svgItemForTimelinePromise no requestable')
      return errorThrow(`No requestable for ${IMAGE}`)
    }
    
    const { request } = requestable

    const event = new EventClientImagePromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail

    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
  declare asset: ClientRawImageAsset
}


function assertClientVideo(value: any, name?: string): asserts value is ClientVideo {
  if (!isClientVideo(value)) errorThrow(value, 'ClientVideo', name)
}

const canvasContext = (size: Size): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const { document } = globalThis
  const canvas = document.createElement('canvas')
  const { width, height } = size
  canvas.height = height
  canvas.width = width
  const context = canvas.getContext('2d')
  assertTrue(context)
  return [canvas, context]
}

const seekingPromises = new Map<ClientVideo, Promise<ClientImageDataOrError>>()

const seek = (definitionTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = definitionTime.seconds
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

const seekNeeded = (definitionTime: Time, video:HTMLVideoElement): boolean => {
  const { currentTime } = video
  if (!(currentTime || definitionTime.frame)) return true

  const videoTime = timeFromSeconds(currentTime, definitionTime.fps)
  return !videoTime.equalsTime(definitionTime)
}

const imageFromVideoPromise = (video: ClientVideo, definitionTime: Time, outSize?: Size): Promise<ClientImageDataOrError> => {
  // console.log('imageFromVideoPromise', definitionTime)
  
  const promise: Promise<ClientImageDataOrError> = new Promise(resolve => {
    if (!seekNeeded(definitionTime, video)) {
      // console.log('imageFromVideoPromise !seekNeeded', definitionTime)

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
      seek(definitionTime, video)
    }
  })
  const existing = seekingPromises.get(video)
  
  seekingPromises.set(video, promise)
  if (existing) {
    // console.log('imageFromVideoPromise replacing promise', definitionTime)
    
    return existing.then(() => promise)
  }
  // console.log('imageFromVideoPromise setting promise', definitionTime)

  return promise
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
    const { audio } = this
    if (audible && audio) promises.push(this.preloadAudiblePromise(args))
    if (visible) promises.push(this.preloadVisiblePromise(args))
    return promiseNumbers(promises)
  }

  override audibleSource(): AudioBufferSourceNode | undefined {
    const { audio } = this
    if (!audio) return undefined
    return super.audibleSource()
  }

  override assetIcon(size: Size, cover?: boolean): Promise<SVGSVGElement> | undefined {
    const { previewTranscoding: transcoding } = this
    // if (!transcoding) return undefined
    
    const time = timeFromArgs(1)
    return this.imageFromTranscodingPromise(transcoding, time, size).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)
      
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
        return svgSvgElement(size, svgImage)
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

  private imageFromTranscodingPromise(transcoding: Transcoding | undefined, definitionTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    const target: Transcoding | ClientRawVideoAsset = transcoding || this
    const { type, request } = target
    // console.log(this.constructor.name, 'imageFromTranscodingPromise', type, definitionTime, outSize)
    switch (type) {
      case IMAGE: {
        const event = new EventClientImagePromise(request)
        MOVIEMASHER.eventDispatcher.dispatch(event)
        const { promise } = event.detail
        if (!promise) return errorPromise(ERROR.Unimplemented, EventClientImagePromise.Type)

        return promise
      }
      case VIDEO: {
        return this.imageFromVideoTranscodingPromise(transcoding, definitionTime, outSize)
      }
      case SEQUENCE: {
        const loaded = this.loadedImage(definitionTime, outSize)
        if (loaded) return Promise.resolve({ data: loaded })

        return this.imageFromSequencePromise(target, definitionTime, outSize)
      }
    }
    return errorPromise(ERROR.Internal)
  }
  private begin = 1
  private increment = 1

  private imageFromSequencePromise(transcoding: Transcoding, definitionTime: Time, _?: Size): Promise<ClientImageDataOrError> {
    // const { frame } = definitionTime
    const frames = this.framesArray(definitionTime)
  
    const frame = frames.length ? frames[0] : this.framesMax 

    const url = this.urlForFrame(frame, transcoding)
    // console.log(this.constructor.name, 'imageFromSequencePromise', { url, frame })


    const request = { endpoint: url}
    return requestImagePromise(request)
  }

  private imageFromVideoTranscodingPromise(previewTranscoding: Transcoding | undefined, definitionTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    // console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', definitionTime, outSize)
    
    const loaded = this.loadedImage(definitionTime, outSize)
    if (loaded) return Promise.resolve({ data: loaded })
    
    const { request } = previewTranscoding || this

    const event = new EventClientVideoPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return errorPromise(ERROR.Unimplemented, EventClientVideoPromise.Type)

    return promise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientVideo } = orError
      const key = this.loadedImageKey(definitionTime, outSize)

      return imageFromVideoPromise(clientVideo, definitionTime, outSize).then(orError => {
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

  private loadedImages = new Map<string, ClientImage>()

  private loadedImage(definitionTime: Time, outSize?: Size): ClientImage | undefined {
    const key = this.loadedImageKey(definitionTime, outSize)
    // console.debug(this.constructor.name, 'loadedImage GETTING', key)
    return this.loadedImages.get(key)
  }

  private loadedImageKey(definitionTime: Time, outSize?: Size): string {
    const { frame, fps } = definitionTime
    const frameFps = `${frame}@${fps}`
    if (!sizeAboveZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }

  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImageDataOrError>{
    // console.log(this.constructor.name, 'loadedImagePromise', definitionTime)
    const { previewTranscoding: transcoding } = this
    // if (! transcoding) return errorThrow(ERROR.Internal)

    return this.imageFromTranscodingPromise(transcoding, definitionTime, outSize)
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
        this.audio = false
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
    // const { audible } = args
    // const { audio } = this
    const requestable = this.preferredTranscoding(SEQUENCE, VIDEO) || this
   
    // if (visibleTranscoding) {
    // const audibleTranscoding = audio && audible && this.preferredTranscoding(AUDIO, VIDEO)
    // if (visibleTranscoding !== audibleTranscoding) {
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
        // console.debug(this.constructor.name, 'preloadVisiblePromise', 'isClientVideo', args)
        // const { time } = args

        return { data: 1 }
      }))
    } else promises.push(this.sequenceImagesPromise(args))

      // } 
    // } 
    return promiseNumbers(promises)
  }

  get previewTranscoding(): Transcoding | undefined {
    return this.preferredTranscoding(SEQUENCE, VIDEO)
  }

  private sequenceImagesPromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { assetTime: range } = args
    if (!isTime(range)) {
      // console.error(this.constructor.name, 'sequenceImagesPromise', args)
      return Promise.resolve({ data: 0 })
    }
    
    
    const definitionTimes: Times = []
    if (range.isRange) {
      assertTimeRange(range)
      // const { times } = range
      // const [start, end] = times//.map(time => this.definitionTime(time, range))
      // const definitionRange = timeRangeFromTimes(start, end)
      definitionTimes.push(...range.frameTimes)
    } else definitionTimes.push(range)
    const promises = definitionTimes.map(definitionTime => {
      return this.loadedImagePromise(definitionTime).then(orError => {
        if (isDefiniteError(orError)) return orError

        return { data: 1 }
      })
    })
    return promiseNumbers(promises)
  }

  private url(transcoding: Transcoding | undefined) {
    const target = transcoding || this
    const { request } = target
    const url = requestUrl(request)
    return url
  }

  private urlForFrame(frame : number, transcoding: Transcoding): string {
    const { increment, begin } = this

    const url = this.url(transcoding)
    const components = url.split(SLASH)
    const pattern = components.pop() // eg. '%02d.jpg'
    assertPopulatedString(pattern, 'pattern') 
    const extension = pattern?.split(DOT).pop() // eg. 'jpg'
    assertPopulatedString(extension, 'extension') 
    // regular expression to extract padding from pattern
    const regExp = /%0(\d+)d/
    const match = pattern.match(regExp)
    assertDefined(match, 'match')
    const padding = Number(match[1])

    const frameString = String((frame * increment) + begin)
    const padded = padding ? frameString.padStart(padding, '0') : frameString
 
    const fileName = [padded, extension].join(DOT)
    return [...components, fileName].join(SLASH)
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
const VideoWithClientVisibleInstanceD = ClientVisibleInstanceMixin(VideoWithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(VideoWithClientVisibleInstanceD)

export class ClientRawVideoInstanceClass extends WithVideoInstance implements ClientRawVideoInstance {
  constructor(args: VideoInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawVideoAsset

  override containedPreviewPromise(video: ClientVideo, _content: ClientInstance, containerRect: Rect, _size: Size, time: Time, _component: Panel): Promise<PreviewElement> {
    const x = Math.round(Number(video.getAttribute('x')))
    const y = Math.round(Number(video.getAttribute('y')))
    const containerPoint = pointCopy(containerRect)
    containerPoint.x -= x
    containerPoint.y -= y

    const zeroRect = { ...containerPoint, ...sizeCopy(containerRect) }
    const promise: Promise<string[]> = this.stylesPromise(zeroRect, this.assetTime(time))

    return promise.then(styles => {
      const { div } = this

      styles.push(`left: ${x}px`)
      styles.push(`top: ${y}px`)
      div.setAttribute('style', styles.join(SEMICOLON) + SEMICOLON)
      svgSetChildren(div, [video])

      return div
    })
  }
  
  private _div?: HTMLDivElement
  private get div() {
    return this._div ||= globalThis.document.createElement('div')
  }

  protected _foreignElement?: SVGForeignObjectElement
  get foreignElement(): SVGForeignObjectElement { 
    const { _foreignElement } = this
    if (_foreignElement) return _foreignElement

    const { document } = globalThis
    const element = document.createElementNS(NAMESPACE_SVG, 'foreignObject')
    return this._foreignElement = element
  }

  loadedVideo?: ClientVideo 

  private previewVideoPromise(previewTranscoding: Transcoding | undefined): Promise<ClientVideo> {
    const { loadedVideo } = this
    if (loadedVideo) return Promise.resolve(loadedVideo)

    const target = previewTranscoding || this.asset
    const { request } = target
    const event = new EventClientVideoPromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientVideo } = orError
 
      const video = clientVideo.cloneNode() as ClientVideo
      this.loadedVideo = video
      this.foreignElement.appendChild(video)
      return video
    })
  }


  private sequenceItemPromise(rect: Rect, definitionTime: Time): Promise<SvgItem> {
    // return errorThrow(ERROR.Unimplemented)
    const { asset } = this
    return asset.loadedImagePromise(definitionTime).then(orError => {
      if (isDefiniteError(orError)) errorThrow(ERROR.Internal)

      const { data: loadedImage } = orError
      
      const { src } = loadedImage
      // const coverSize = sizeCover(sizeCopy(loadedImage), sizeCopy(rect))
      // console.debug(this.constructor.name, 'sequenceItemPromise', { rect, definitionTime })
      return svgImagePromiseWithOptions(src, rect)
    })
  }


  private stylesPromise(zeroRect: Rect, definitionTime: Time): Promise<string[]> {
    return this.stylesSrcPromise(zeroRect, definitionTime).then(src => {
      const styles: string[] = []
      styles.push(`mask-image: url(${src})`)
      styles.push('mask-repeat: no-repeat')
      styles.push('mask-mode: luminance')
      styles.push(`mask-size: ${zeroRect.width}px ${zeroRect.height}px`)
      styles.push(`mask-position: ${zeroRect.x}px ${zeroRect.y}px`)
      return styles
    })
  }

  private stylesSrcPromise(zeroRect: Rect, definitionTime: Time): Promise<string> {
    const { type, asset } = this
    const types: TranscodingTypes = []
    if (type === IMAGE) types.push(type)
    else types.push(SEQUENCE, VIDEO)
    const transcoding = asset.preferredTranscoding(...types)
    assertDefined(transcoding)


    const { type: transcodingType } = transcoding

    // TODO: support sequences
    if (transcodingType === SEQUENCE) {
      return asset.loadedImagePromise(definitionTime, sizeCopy(zeroRect)).then(orError => {
        if (isDefiniteError(orError)) return errorThrow(orError.error)

        return orError.data.src
      })
    }
    const imageTranscoding = asset.preferredTranscoding(IMAGE) 
    assertDefined(imageTranscoding)

    const { request } = imageTranscoding
    const event = new EventClientImagePromise(request)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    return promise!.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      return clientImage.src
    })
  }

  override svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> {
    const { loadedVideo, asset } = this
    const definitionTime = this.assetTime(time)
    if (loadedVideo) return Promise.resolve(this.videoForPlayerPromise(rect, definitionTime))

    const { previewTranscoding } = asset
    const target = previewTranscoding || this
 
    const { type } = target
    switch (type) {
      case VIDEO: {
        return this.videoItemForPlayerPromise(previewTranscoding, rect, definitionTime)
      }

      // TODO: support sequence
      case SEQUENCE: {
        return this.sequenceItemPromise(rect, definitionTime)
      }
    }
    return errorThrow(ERROR.Type)
  }

  override svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> {
    const definitionTime = this.assetTime(time)
    return this.sequenceItemPromise(rect, definitionTime)
  }

  override unload() {
    delete this._foreignElement
    delete this.loadedVideo
  }

  private videoForPlayerPromise(rect: Rect, definitionTime: Time): SvgItem {
    const { loadedVideo: video } = this 
    assertClientVideo(video)
    
    video.currentTime = definitionTime.seconds

    const { clientCanMaskVideo } = ClientRawVideoInstanceClass
    if (clientCanMaskVideo) svgSetDimensions(this.foreignElement, rect)
  
    const { width, height } = rect
    video.width = width 
    video.height = height

    return clientCanMaskVideo ? this.foreignElement : video
  }


  private videoItemForPlayerPromise(previewTranscoding: Transcoding | undefined, rect: Rect, definitionTime: Time): Promise<SvgItem> {
    // console.log(this.constructor.name, 'videoItemForPlayerPromise', definitionTime, previewTranscoding)
    return this.previewVideoPromise(previewTranscoding).then(() => (
      this.videoForPlayerPromise(rect, definitionTime)
    ))
  }


  static _clientCanMaskVideo?: boolean
  static get clientCanMaskVideo(): boolean {
    const { _clientCanMaskVideo } = this
    if (isBoolean(_clientCanMaskVideo)) return _clientCanMaskVideo

    const { navigator } = globalThis
    const { userAgent } = navigator
    const safari = userAgent.includes('Safari') && !userAgent.includes('Chrome')
    return this._clientCanMaskVideo = !safari
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
  const accept = IMPORT_TYPES.flatMap(type => {
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

const ClientRawTag = 'movie-masher-client-raw'

const ClientRawSizeReactive = SizeReactiveMixin(Scroller)
const ClientRawDropTarget = DropTargetMixin(ClientRawSizeReactive)
/**
 * @category Component
 */
export class ClientRawElement extends ClientRawDropTarget {
  override acceptsClip = false
  
  override dropValid(dataTransfer: DataTransfer | null): boolean { 
    return droppingFiles(dataTransfer)
  }

  protected handleChange(changeEvent: DragEvent) {
    const input = changeEvent.currentTarget as HTMLInputElement
    const { files: fileList } = input
    // console.log(this.tagName, 'handleChange', fileList)
    if (!fileList?.length) return
    
    const event = new EventImport(fileList)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    if (!promise) return

    promise.then((assetObjects) => {
      // console.log(this.tagName, 'handleChange', !!input)
      input.value = ''
      MOVIEMASHER.eventDispatcher.dispatch(new EventImporterAdd(assetObjects))
    })
  }

  override handleDropped(event: DragEvent): void {
    eventStop(event)

    const { dataTransfer } = event 
    if (!dataTransfer) return
  
    const { files } = dataTransfer
    const promise = dropRawFiles(files)
    promise?.then(assetObjects => { 
      MOVIEMASHER.eventDispatcher.dispatch(new EventImporterAdd(assetObjects))
    })
  }
  
  override render(): unknown {
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

const fileAssetObjectPromise = (file: File, type: ImportType): Promise<AssetObject | void> => {
  const { name: label } = file
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
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: loadedAudio } = orError
        request.response = loadedAudio
        const { duration } = loadedAudio
        info.duration = duration
        const object: ClientRawAudioAssetObject = { ...shared, type, loadedAudio }
        return object
      })
    }
    case IMAGE: {
      const event = new EventClientImagePromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: image } = orError
        request.response = image
        const { width, height } = image
        info.width = width
        info.height = height
        const object: ClientRawImageAssetObject = { ...shared, type, loadedImage: image }
        // console.log('object', object)
        return object
      })
    }
    case VIDEO: {
      const event = new EventClientVideoPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: video } = orError
        request.response = video
        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: ClientRawVideoAssetObject = { ...shared, type, loadedVideo: video }
        return object
      })
    }
    case FONT: {
      const event = new EventClientFontPromise(request)
      MOVIEMASHER.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      return promise!.then(orError => {
        if (isDefiniteError(orError)) return 

        const { data: font } = orError
        request.response = font
        const object: ClientTextAssetObject = { 
          ...shared, source: TEXT, loadedFont: font 
        }
        return object
      })
    }
  } 
}

const fileMedia = (file: File): Promise<AssetObject | void> => {
  const { type: mimetype, size, name } = file
  const sizeInMeg = Math.ceil(size * 10 / 1024 / 1024) / 10
  const extension = name.split('.').pop()
  const type = mimetype.split('/').shift()
  if (!(extension && sizeInMeg && isImportType(type))) {
    return Promise.resolve()
  }

  const max = options[`${type}Max`]
  if (!max) {
    return Promise.resolve()
  }
  if (max > 0) {
    if (sizeInMeg > max) {
      return Promise.resolve()
    }
  }
  const extensions = options[`${type}Extensions`]
  if (extensions) {
    const fileExtensions = extensions.split(',').map(extension => 
      extension.startsWith('.') ? extension.slice(1) : extension
    )
    if (!fileExtensions.includes(extension)) {
      return Promise.resolve()
    }
  }
  return fileAssetObjectPromise(file, type)
}

class RawClientImporter implements ClientImporter {
  get icon(): Node {
    const cleaned = "<svg version='1.1' stroke='currentColor' fill='none' stroke-width='2' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><desc></desc><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M14 3v4a1 1 0 0 0 1 1h4'></path><path d='M5 13v-8a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-5.5m-9.5 -2h7m-3 -3l3 3l-3 3'></path></svg>"
    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const [firstChild] = document.children
    return firstChild
  }

  id = ClientRawTag

  label = 'Raw'

  private _ui?: ClientRawElement
  get ui(): Node {
    // console.log(this.id, 'ui')
    return this._ui ||= document.createElement(ClientRawTag)
  }

  static handleImport (event: EventImport) {
    const { detail } = event
    const { fileList } = detail
    const objects: AssetObjects = []
    const [file, ...rest] = Array.from(fileList)
    let promise = fileMedia(file)
    rest.forEach(file => {
      promise = promise.then(object => {
        if (object) objects.push(object)
        return fileMedia(file)
      })
    })
    detail.promise = promise.then(object => {
      if (object) objects.push(object)

      return objects
    })
    event.stopPropagation()
  }

  static handleImporters(event: EventImporters) {
    const { detail } = event
    const { importers } = detail
    importers.push(RawClientImporter.instance)
  }

  private static _instance?: RawClientImporter
  static get instance(): RawClientImporter {
    return this._instance ||= new RawClientImporter()
  }
}

// listen for import related events
export const ClientRawImportListeners: ListenersFunction = () => ({
  [EventImporters.Type]: RawClientImporter.handleImporters,
  [EventImport.Type]: RawClientImporter.handleImport,
})
