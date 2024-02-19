import type { AssetCacheArgs, AssetObject, AssetObjects, AudioInstance, AudioInstanceArgs, AudioInstanceObject, ClientImage, ClientVideo, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, Decoding, Decodings, DefiniteError, DropType, EndpointRequest, ImageInstance, ImageInstanceObject, InstanceArgs, ListenersFunction, MaybeComplexSvgItem, Numbers, ProbingData, Rect, RectOptions, Resource, Scalar, ShapeAssetObject, Size, Sources, SvgItem, Time, Times, VideoInstance, VideoInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup } from 'lit'
import type { OptionalContent } from '../../client-types.js'
import type { ClientImageDataOrError, ClientImporter, ClientRawAssetObject, ClientRawAudioAsset, ClientRawAudioAssetObject, ClientRawAudioInstance, ClientRawImageAsset, ClientRawImageAssetObject, ClientRawImageInstance, ClientRawVideoAsset, ClientRawVideoAssetObject, ClientRawVideoInstance, ClientTextAssetObject } from '../../types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { ImageAssetMixin, ImageInstanceMixin } from '@moviemasher/shared-lib/mixin/image.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { promiseNumbers, $ALPHA, $AUDIO, $BITMAPS, $FONT, $IMAGE, $PROBE, $RAW, $SHAPE, $TEMPORARY, $TEXT, $VIDEO, $WAVEFORM, DOT, DROP_TYPES, ERROR, MIME_SVG, MOVIEMASHER, QUESTION, SIZE_ZERO, SLASH, errorCaught, errorPromise, idGenerateString, isAssetObject, isAudibleType, isDefiniteError, isDropType, namedError, $RETRIEVE } from '@moviemasher/shared-lib/runtime.js'
import { isClientAudio, isClientFont, isClientImage, isClientVideo, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, copySize, coverSize, sizeNotZero, sizeString } from '@moviemasher/shared-lib/utility/rect.js'
import { requestUrl } from '@moviemasher/shared-lib/utility/request.js'
import { svgImagePromiseWithOptions, svgImageWithOptions, svgOpacity, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { assertTimeRange, isTime, timeFromArgs, timeFromSeconds } from '@moviemasher/shared-lib/utility/time.js'
import { html } from 'lit-html'
import { ClientInstanceClass } from '../../base/ClientInstanceClass.js'
import { Component } from '../../base/Component.js'
import { Scroller } from '../../base/LeftCenterRight.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '../../mixin/audible.js'
import { DROP_TARGET_CSS, DropTargetMixin, SizeReactiveMixin } from '../../mixin/component.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../../mixin/visible.js'
import { centerPoint, eventStop } from '../../runtime.js'
import { dropFile, droppingFiles } from '../../utility/draganddrop.js'
import { EventAsset, EventImportFile, EventImporterAdd, EventImporterError, EventImporterNodeFunction } from '../../utility/events.js'
import { svgColorMask, svgStringElement } from '../../utility/svg.js'
import { ClientRawAssetClass } from '../../base/ClientRawAssetClass.js'


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

    const resource = this.resourceOfType($AUDIO) 
    if (!resource) return Promise.resolve({ data: 0 })
    
    return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response: clientAudio } = resource.request
      if (!isClientAudio(clientAudio)) return errorPromise(ERROR.Unimplemented, 'audio')
      
      this.loadedAudio = clientAudio
      return { data: 1 }
    })
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const resource = this.resourceOfType($WAVEFORM) 
    if (!resource) return errorPromise(ERROR.Unavailable, 'transcoding')
    
    // console.log(this.constructor.name, 'ClientRawAudioAssetClass.assetIcon', this.label)
    return this.assetIconPromise(resource, size, false).then(orError => {
      // console.log(this.constructor.name, 'ClientRawAudioAssetClass.assetIcon assetIconPromise', this.label)
    
      if (isDefiniteError(orError)) return orError
      
      const { waveformTransparency = $ALPHA } = MOVIEMASHER.options
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
    if (isAssetObject(assetObject, $AUDIO, $RAW)) {
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

    const requestable = this.resourceOfType($IMAGE) 
    if (!requestable) return Promise.resolve({ data: 0 })
    
    return this.imagePromise(requestable).then(icon => {
      return { data: isDefiniteError(icon) ? 0 : 1 }
    })
  }

  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    const transcoding = this.resourceOfType($IMAGE)   
    if (!transcoding) return errorPromise(ERROR.Unavailable, 'transcoding')

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
    if (!asset && isAssetObject(assetObject, $IMAGE, $RAW)) {
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

  override containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { containerRect, opacity } = args
    return this.svgItemPromise(containerRect, opacity)
  }

  override contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { contentRect: rect, opacity } = args
    return this.svgItemPromise(rect, opacity)
  }

  private get imagePromise() {
    const { asset } = this
    const resource = asset.resourceOfType($IMAGE) 
    if (!resource) return errorPromise(ERROR.Unavailable, 'resource')
    
    return asset.imagePromise(resource)
  }

  private svgItemPromise(rect: Rect, opacity?: Scalar): Promise<DataOrError<MaybeComplexSvgItem>> {
    return this.imagePromise.then(orError => {
      if (isDefiniteError(orError)) return orError

      const { src } = orError.data
      return svgImagePromiseWithOptions(src, rect).then(image => {
        const data = svgOpacity(image, opacity)
        return { data }
      })
    })
  }
}

const canvasContext = (size: Size): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const { document } = MOVIEMASHER.window
  const canvas = document.createElement('canvas')
  const { width, height } = size
  canvas.height = height
  canvas.width = width
  const canvasContext = canvas.getContext('2d')
  assertTrue(canvasContext)

  return [canvas, canvasContext]
}

const seekingPromises = new Map<ClientVideo, Promise<ClientImageDataOrError>>()

const seek = (assetTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = assetTime.seconds
}

const videoImagePromise = (video: ClientVideo, outSize?: Size): Promise<ClientImageDataOrError> => {
  const inSize = copySize(video)
  const size = sizeNotZero(outSize) ? coverSize(inSize, outSize) : inSize
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

const fileAssetObjectPromise = (file: File, dropType: DropType): Promise<DataOrError<AssetObject>> => {
  const { name } = file
  const nameBits = name.split(DOT)
  const extension = nameBits.pop()
  assertDefined(extension)

  const label = nameBits.join(DOT).replace(/[-._]/g, ' ')
  const request: EndpointRequest = { 
    file, objectUrl: URL.createObjectURL(file), endpoint: '' 
  }

  const type = dropType === $FONT ? extension : dropType
  const resource: Resource = { type, request }
  // we can't reliably tell if there is an audio track so we assume there is 
  // one, and catch problems if it's played before decoded
  const info: ProbingData = { extension, audible: isAudibleType(dropType) }
  const decoding: Decoding = { data: info, type: $PROBE }
  const decodings: Decodings = []
  if (dropType !== $FONT) { decodings.push(decoding) }
  const id = `${$TEMPORARY}-${crypto.randomUUID()}`
  const shared: ClientRawAssetObject = { 
    type: $IMAGE, label, resources: [resource], decodings, id, source: $RAW,
  }

  return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { response: media } = request
    switch (dropType) {
      case $AUDIO: {
        if (!isClientAudio(media)) return errorPromise(ERROR.Unimplemented, 'audio')

        request.response = media
        const { duration } = media
        info.duration = duration
        const object: ClientRawAudioAssetObject = { ...shared, type: dropType, loadedAudio: media }
        return { data: object }
      }
      case $IMAGE: {
        if (!isClientImage(media)) return errorPromise(ERROR.Unimplemented, 'image')

        const { width, height } = media
        info.width = width
        info.height = height
        const object: ClientRawImageAssetObject = { ...shared, type: dropType }
        // console.log('object', object)
        return { data: object }
      
      }
      case $VIDEO: {
        if (!isClientVideo(media)) return errorPromise(ERROR.Unimplemented, 'video')

        request.response = media
        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = media
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: ClientRawVideoAssetObject = { ...shared, type: dropType, loadedVideo: media }
        return { data: object }
      }
      case $FONT: {
        if (!isClientFont(media)) return errorPromise(ERROR.Unimplemented, 'font')

        request.response = media
        const object: ClientTextAssetObject = { ...shared, source: $TEXT }
        return { data: object }
      }
    } 
  })
}

const fileAssetObject = (file: File): Promise<DataOrError<AssetObject>> => {
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
    if (!transcoding) return errorPromise(ERROR.Unavailable, 'resource')

    const time = timeFromArgs(1)
    return this.imageFromResourcePromise(transcoding, time, size).then(orError => {
      if (isDefiniteError(orError)) return orError
      
      const { data: image} = orError
      const { src } = image
      assertSizeNotZero(image)

      const { width, height } = image
      const inSize = { width, height }
      const containedSize = coverSize(inSize, size, !cover)
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

  private imageFromResourcePromise(resource: Resource, assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    const target: Resource | ClientRawVideoAsset = resource || this
    const { type, request } = target
    
    // console.log(this.constructor.name, 'imageFromTranscodingPromise', type, assetTime)
    switch (type) {
      case $IMAGE: {
        return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
          if (isDefiniteError(orError)) return orError

          const { response } = request
          if (!isClientImage(response)) return errorPromise(ERROR.Unimplemented, 'image')

          return { data: response }
        })
      }
      case $VIDEO: {
        return this.imageFromVideoTranscodingPromise(resource, assetTime, outSize)
      }
      case $BITMAPS: {
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

  private imageFromSequencePromise(transcoding: Resource, assetTime: Time, _?: Size): Promise<ClientImageDataOrError> {
    const frames = this.framesArray(assetTime)
    const frame = frames.length ? frames[0] : this.framesMax 
    const { increment, begin } = this

    const target = transcoding || this
    const { request } = target
    const urlFromRequest = requestUrl(request)

    const components = urlFromRequest.split(SLASH)
    const patternAndQuery = components.pop() // eg. '%02d.jpg?..'
    assertDefined<string>(patternAndQuery, 'pattern') 
    const [pattern, query] = patternAndQuery.split(QUESTION) 

    const extension = pattern.split(DOT).pop() // eg. 'jpg'
    assertDefined(extension, 'extension') 

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

    const resource = { type: $IMAGE, request: imageRequest }
    return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response } = request
      if (!isClientImage(response)) return namedError(ERROR.Unimplemented, 'image')

      return { data: response }
    })
  }

  private frameRequests: Record<string, EndpointRequest> = {}


  private imageFromVideoTranscodingPromise(resource: Resource, assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError> {
    const loaded = this.loadedImageForPromise(assetTime, outSize)
    if (loaded) return Promise.resolve({ data: loaded })
    
    return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response: clientVideo } = resource.request
      if (!isClientVideo(clientVideo)) return namedError(ERROR.Unimplemented, 'video')

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

  private loadedImages = new Map<string, ClientImage>()

  loadedImage(assetTime: Time, size?: Size): DataOrError<ClientImage> {
    const loaded = this.loadedImageForPromise(assetTime, size)
    if (loaded) return { data: loaded }

    return namedError(ERROR.Unavailable, 'loadedImage')
  }

  private loadedImageForPromise(assetTime: Time, outSize?: Size): ClientImage | undefined {
    const key = this.loadedImageKey(assetTime, outSize)
    return this.loadedImages.get(key)
  }

  private loadedImageKey(assetTime: Time, outSize?: Size): string {
    const { frame, fps } = assetTime
    const frameFps = `${frame}@${fps}`
    if (!sizeNotZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }

  loadedImagePromise(assetTime: Time, outSize?: Size): Promise<ClientImageDataOrError>{
    const { previewTranscoding: transcoding } = this
    if (!transcoding) return errorPromise(ERROR.Unavailable, 'resource')

    return this.imageFromResourcePromise(transcoding, assetTime, outSize)
  }

  private preloadAudiblePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    if (this.loadedAudio) return Promise.resolve({ data: 0 })

    const resource = this.resourceOfType($AUDIO, $VIDEO) 
    if (!resource) return Promise.resolve({ data: 0 })

    return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
      if (isDefiniteError(orError)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isDefiniteError', orError)
        this.canBeMuted = false
        return orError
      }
      const { response: media } = resource.request
     
      if (isClientAudio(media)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isClientAudio')
        this.loadedAudio = media
        return { data: 1 }
      }
      return namedError(ERROR.Internal)
    })
  }

  private preloadVisiblePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const resource = this.resourceOfType($BITMAPS, $VIDEO) 
    if (!resource) return Promise.resolve({ data: 0 })

    const { type } = resource  
    if (type === $VIDEO) {
      return MOVIEMASHER.promise($RETRIEVE, resource).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { response: clientVideo } = resource.request
        if (!isClientVideo(clientVideo)) return namedError(ERROR.Unimplemented, 'video')

        this.loadedVideo = clientVideo
        return { data: 1 }
      })
    } 
    return this.sequenceImagesPromise(args)
  }

  private get previewTranscoding(): Resource | undefined {
    return this.resourceOfType($BITMAPS, $VIDEO)
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
    if (!asset && isAssetObject(assetObject, $VIDEO, $RAW)) {
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


  private sequenceItemPromise(rect: Rect, assetTime: Time, opacity?: Scalar): Promise<DataOrError<SvgItem>> {
    const { asset } = this
    return asset.loadedImagePromise(assetTime).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: loadedImage } = orError
      const { src } = loadedImage
      return svgImagePromiseWithOptions(src, rect).then(image => {
        const data = svgOpacity(image, opacity) 
        return { data }
      })
    })
  }

  private sequenceItem(rect: Rect, assetTime: Time, opacity?: Scalar): DataOrError<SvgItem> {
    const { asset } = this
    const orError = asset.loadedImage(assetTime)
    if (isDefiniteError(orError)) return orError

    const { data: loadedImage } = orError
    const { src } = loadedImage
    const image = svgImageWithOptions(src, rect)
    const data = svgOpacity(image, opacity) 
    return { data }
  }

  override containerSvgItem(args: ContainerSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
    const { containerRect, time, opacity } = args
    return this.sequenceItem(containerRect, this.assetTime(time), opacity)
  }

  override contentSvgItem(args: ContentSvgItemArgs): DataOrError<MaybeComplexSvgItem> {
    const { contentRect, time, opacity } = args
    return this.sequenceItem(contentRect, this.assetTime(time), opacity)
  }

  override containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { containerRect: rect, time, opacity } = args
    return this.sequenceItemPromise(rect, this.assetTime(time), opacity)
  }

  override contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
    const { contentRect: rect, time, opacity } = args
    return this.sequenceItemPromise(rect, this.assetTime(time), opacity)
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
    const size = copySize(SIZE_ZERO)
    if (viewBox) {
      const bits = viewBox.split(' ').map(string => string.trim())
      const [width, height] = bits.slice(-2).map(Number)
      size.width = width
      size.height = height
    }
    if (size.width === 0 || size.height === 0)  {
      const width = svg.getAttribute('width')
      const height = svg.getAttribute('height')
      if (width && height) {
        size.width = Number(width.trim())
        size.height = Number(height.trim())
      }
    }
    if (!sizeNotZero(size)) return namedError(ERROR.ImportFile, 'viewBox')

    const paths = [...svg.querySelectorAll('path')].map(path => {
      return path.getAttribute('d') || ''
    })
    const path = paths.filter(Boolean).join(' M 0 0 ')
    if (!path) return namedError(ERROR.ImportFile, 'path')
    const object: ShapeAssetObject = {
      label: file.name, path, type: $IMAGE, source: $SHAPE, id: idGenerateString(),
      pathWidth: size.width, pathHeight: size.height,
    }
    return { data: object }
  }


  private async handleFileList(fileList?: FileList | null): Promise<void> {
    if (!fileList?.length) return

    const assetObjects: AssetObjects = []
    const errors: DefiniteError[] = []

    for (const file of fileList) {
      if (this.sources.includes($SHAPE)) {
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
        // console.log('handleFileList NO $SHAPE', this.sources)
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

      MOVIEMASHER.dispatch(event)
      const { promise } = event.detail
      if (!promise) return


    })
    // TODO something with errors
    errors.forEach(error => {
      MOVIEMASHER.dispatch(new EventImporterError(error))
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
    const { document } = MOVIEMASHER.window
    this._ui ||= document.createElement(ClientRawTag)
    this._ui.sources = this.sources
    // console.log(this.id, 'ui')
    return this._ui
  }

  private sources: Sources = []
  
  static handleImportFile (event: EventImportFile) {
    const { detail } = event
    const { file } = detail
    detail.promise = fileAssetObject(file)
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
