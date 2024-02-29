import type { AssetCacheArgs, ClientTextAssetObject, AssetFunction, AssetObject, AssetObjects, AudioInstance, AudioInstanceArgs, AudioInstanceObject, ClientImage, ClientVideo, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, Decoding, Decodings, DefiniteError, DropType, EndpointRequest, ImageInstance, ImageInstanceObject, ListenersFunction, MaybeComplexSvgItem, Numbers, ProbingData, Rect, RectOptions, Resource, Scalar, ShapeAssetObject, Size, Sources, SvgItem, Time, Times, VideoInstance, VideoInstanceObject } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup } from 'lit'
import type { OptionalContent } from '../client-types.js'
import type { ClientImporter, ClientRawAudioAsset, ClientRawAudioInstance, ClientRawImageAsset, ClientRawImageInstance, ClientRawVideoAsset, ClientRawVideoInstance } from '../types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { AudioAssetMixin, AudioInstanceMixin } from '@moviemasher/shared-lib/mixin/audio.js'
import { ImageAssetMixin, ImageInstanceMixin } from '@moviemasher/shared-lib/mixin/image.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $ALPHA, $AUDIO, $BITMAPS, $FONT, $IMAGE, $PROBE, $RAW, $RETRIEVE, $SHAPE, $TEMPORARY, $TEXT, $TRANSCODE, $VIDEO, $WAVEFORM, DOT, DROP_TYPES, ERROR, MIME_SVG, MOVIE_MASHER, QUESTION, SIZE_ZERO, SLASH, errorCaught, errorPromise, idGenerateString, isAssetObject, isAudibleType, isDefiniteError, isDropType, namedError, promiseNumbers } from '@moviemasher/shared-lib/runtime.js'
import { isClientAudio, isClientFont, isClientImage, isClientVideo, isPopulatedString } from '@moviemasher/shared-lib/utility/guard.js'
import { assertDefined, assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { centerPoint, assertSizeNotZero, copySize, coverSize, sizeNotZero, sizeString } from '@moviemasher/shared-lib/utility/rect.js'
import { requestUrl } from '@moviemasher/shared-lib/utility/request.js'
import { svgImagePromiseWithOptions, svgImageWithOptions, svgOpacity, svgSvgElement } from '@moviemasher/shared-lib/utility/svg.js'
import { assertTimeRange, isTime, timeFromArgs, timeFromSeconds } from '@moviemasher/shared-lib/utility/time.js'
import { html } from 'lit-html'
import { ClientInstanceClass } from '@moviemasher/shared-lib/base/client-instance.js'
import { ClientRawAssetClass } from '@moviemasher/shared-lib/base/client-raw-asset.js'
import { Component } from '../base/component.js'
import { Scroller } from '../base/component-view.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/client-audible.js'
import { DROP_TARGET_CSS, DropTargetMixin, SizeReactiveMixin } from '../mixin/component.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/client-visible.js'
import { eventStop } from '../runtime.js'
import { dropFile, droppingFiles } from '../utility/draganddrop.js'
import { EventImportFile, EventImporterAdd, EventImporterError, EventImporterNodeFunction } from '../utility/events.js'
import { svgColorMask, svgStringElement } from '@moviemasher/shared-lib/utility/svg.js'

const WithAsset = AudibleAssetMixin(ClientRawAssetClass)
const WithClientAsset = ClientAudibleAssetMixin(WithAsset)
const WithAudioAsset = AudioAssetMixin(WithClientAsset)
export class ClientRawAudioAssetClass extends WithAudioAsset implements ClientRawAudioAsset {
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { audible } = args
    if (!audible) return Promise.resolve({ data: 0 })

    const resource = this.resourceOfType($AUDIO) 
    if (!resource) return Promise.resolve({ data: 0 })
    
    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response: clientAudio } = resource.request
      if (isClientAudio(clientAudio)) return { data: 1 }
     
      return errorPromise(ERROR.Unimplemented, $AUDIO)
    })
  }

  override assetIcon(size: Size, _cover?: boolean): Promise<DataOrError<Element>> {
    const resource = this.resourceOfType($WAVEFORM) 
    if (!resource) return errorPromise(ERROR.Unavailable, $TRANSCODE)
    
    return this.assetIconPromise(resource, size, false).then(orError => {      
      if (isDefiniteError(orError)) return orError

      const { waveformTransparency = $ALPHA } = MOVIE_MASHER.options
      return { data: svgColorMask(orError.data, size, waveformTransparency) }
    })
  }

  override instanceFromObject(object?: AudioInstanceObject | undefined): AudioInstance {
    return new ClientRawAudioInstanceClass(this.instanceArgs(object))
  }

  override instanceArgs(object: AudioInstanceObject = {}): AudioInstanceArgs {
    const args = super.instanceArgs(object)
    return { ...args, asset: this }
  }
}

export const audioRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $AUDIO, $RAW)) {
    return namedError(ERROR.Syntax, [$AUDIO, $RAW].join(SLASH))
  }
  return { data: new ClientRawAudioAssetClass(assetObject) }
}

const AudioWithInstance = AudibleInstanceMixin(ClientInstanceClass)
const AudioWithClientInstance = ClientAudibleInstanceMixin(AudioWithInstance)
const WithAudioInstance = AudioInstanceMixin(AudioWithClientInstance)
export class ClientRawAudioInstanceClass extends WithAudioInstance implements ClientRawAudioInstance {
  declare asset: ClientRawAudioAsset
}

const ImageWithAsset = VisibleAssetMixin(ClientRawAssetClass)
const ImageWithClientAsset = ClientVisibleAssetMixin(ImageWithAsset)
const WithImageAsset = ImageAssetMixin(ImageWithClientAsset)
export class ClientRawImageAssetClass extends WithImageAsset implements ClientRawImageAsset {
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

  override instanceFromObject(object?: ImageInstanceObject | undefined): ImageInstance {
    return new ClientRawImageInstanceClass(this.instanceArgs(object))
  }
}

export const imageRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $IMAGE, $RAW)) {
    return namedError(ERROR.Syntax, [$IMAGE, $RAW].join(SLASH))
  }
  return { data: new ClientRawImageAssetClass(assetObject) }
}

const ImageWithInstance = VisibleInstanceMixin(ClientInstanceClass)
const ImageWithClientInstance = ClientVisibleInstanceMixin(ImageWithInstance)
const WithImageInstance = ImageInstanceMixin(ImageWithClientInstance)
export class ClientRawImageInstanceClass extends WithImageInstance implements ClientRawImageInstance {
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
  const { document } = MOVIE_MASHER.window
  const canvas = document.createElement('canvas')
  const { width, height } = size
  canvas.height = height
  canvas.width = width
  const canvasContext = canvas.getContext('2d')
  assertTrue(canvasContext)

  return [canvas, canvasContext]
}

const seekingPromises = new Map<ClientVideo, Promise<DataOrError<ClientImage>>>()

const seek = (assetTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = assetTime.seconds
}

const videoImagePromise = (video: ClientVideo, outSize?: Size): Promise<DataOrError<ClientImage>> => {
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

const imageFromVideoPromise = (video: ClientVideo, assetTime: Time, outSize?: Size): Promise<DataOrError<ClientImage>> => {
  const promise: Promise<DataOrError<ClientImage>> = new Promise(resolve => {
    if (!seekNeeded(assetTime, video)) {
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
  return existing ? existing.then(() => promise) : promise
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
  const shared: AssetObject = { 
    type: $IMAGE, label, resources: [resource], decodings, id, source: $RAW,
  }
  return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
    if (isDefiniteError(orError)) return orError

    const { response: media } = request
    switch (dropType) {
      case $AUDIO: {
        if (!isClientAudio(media)) return errorPromise(ERROR.Unimplemented, 'audio')

        const { duration } = media
        info.duration = duration
        const object: AssetObject = { ...shared, type: dropType }
        return { data: object }
      }
      case $IMAGE: {
        if (!isClientImage(media)) return errorPromise(ERROR.Unimplemented, 'image')

        const { width, height } = media
        info.width = width
        info.height = height
        const object: AssetObject = { ...shared, type: dropType }
        return { data: object }
      
      }
      case $VIDEO: {
        if (!isClientVideo(media)) return errorPromise(ERROR.Unimplemented, 'video')

        const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = media
        const width = videoWidth || clientWidth
        const height = videoHeight || clientHeight
        info.duration = duration
        info.width = width
        info.height = height
        const object: AssetObject = { ...shared, type: dropType }
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
  override assetCachePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const promises: Promise<DataOrError<number>>[] = []
    const { audible, visible } = args
    const { canBeMuted } = this
    if (audible && canBeMuted) promises.push(this.preloadAudiblePromise(args))
    if (visible) promises.push(this.preloadVisiblePromise(args))
    return promiseNumbers(promises)
  }

  override audibleSource(): AudioBufferSourceNode | undefined {
    return this.canBeMuted ? super.audibleSource() : undefined
  }

  override assetIcon(size: Size, cover?: boolean): Promise<DataOrError<Element>> {
    const { previewResource: resource } = this
    if (!resource) return errorPromise(ERROR.Unavailable, 'resource')

    const time = timeFromArgs(1)
    return this.imageFromResourcePromise(resource, time, size).then(orError => {
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
    return Math.floor(this.fps * this.duration) - 2 
  }

  private imageFromResourcePromise(resource: Resource, assetTime: Time, outSize?: Size): Promise<DataOrError<ClientImage>> {
    const target: Resource | ClientRawVideoAsset = resource || this
    const { type, request } = target
    switch (type) {
      case $IMAGE: {
        return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
          if (isDefiniteError(orError)) return orError

          const { response } = request
          if (!isClientImage(response)) return errorPromise(ERROR.Unimplemented, $IMAGE)

          return { data: response }
        })
      }
      case $VIDEO: {
        return this.imageFromVideoTranscodingPromise(resource, assetTime, outSize)
      }
      case $BITMAPS: {
        const loaded = this.clientImageCached(assetTime, outSize)
        if (loaded) return Promise.resolve({ data: loaded })

        return this.imageFromSequencePromise(target, assetTime, outSize)
      }
    }
    return errorPromise(ERROR.Internal)
  }

  private begin = 1
  private increment = 1

  private imageFromSequencePromise(target: Resource, assetTime: Time, _?: Size): Promise<DataOrError<ClientImage>> {
    const frames = this.framesArray(assetTime)
    const frame = frames.length ? frames[0] : this.framesMax 
    const { increment, begin } = this
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
    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response } = imageRequest
      if (!isClientImage(response)) return namedError(ERROR.Unimplemented, $IMAGE)

      return { data: response }
    })
  }

  private frameRequests: Record<string, EndpointRequest> = {}


  private imageFromVideoTranscodingPromise(resource: Resource, assetTime: Time, outSize?: Size): Promise<DataOrError<ClientImage>> {
    const loaded = this.clientImageCached(assetTime, outSize)
    if (loaded) return Promise.resolve({ data: loaded })
    
    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { response: clientVideo } = resource.request
      if (!isClientVideo(clientVideo)) return namedError(ERROR.Unimplemented, 'video')

      const key = this.loadedImageKey(assetTime, outSize)

      return imageFromVideoPromise(clientVideo, assetTime, outSize).then(orError => {
        if (!isDefiniteError(orError)) {
          const { data: image } = orError
          // console.debug(this.constructor.name, 'imageFromVideoTranscodingPromise SETTING', key)
          this.clientImages.set(key, image)
        }
        return orError
      })
    })
  }  

  override instanceFromObject(object?: VideoInstanceObject | undefined): VideoInstance {
    return new ClientRawVideoInstanceClass(this.instanceArgs(object))
  }

  private clientImages = new Map<string, ClientImage>()

  clientImage(assetTime: Time, size?: Size): DataOrError<ClientImage> {
    const data = this.clientImageCached(assetTime, size)
    if (data) return { data }

    return namedError(ERROR.Unavailable, $IMAGE)
  }

  private clientImageCached(assetTime: Time, outSize?: Size): ClientImage | undefined {
    const key = this.loadedImageKey(assetTime, outSize)
    return this.clientImages.get(key)
  }

  private loadedImageKey(assetTime: Time, outSize?: Size): string {
    const { frame, fps } = assetTime
    const frameFps = `${frame}@${fps}`
    if (!sizeNotZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }

  clientImagePromise(assetTime: Time, outSize?: Size): Promise<DataOrError<ClientImage>>{
    const { previewResource: resource } = this
    if (!resource) return errorPromise(ERROR.Unavailable)

    return this.imageFromResourcePromise(resource, assetTime, outSize)
  }


  private preloadAudiblePromise(_args: AssetCacheArgs): Promise<DataOrError<number>> {
    const resource = this.resourceOfType($AUDIO, $VIDEO) 
    if (!resource) return Promise.resolve({ data: 0 })

    return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
      if (isDefiniteError(orError)) {
        this.canBeMuted = false
        return orError
      }
      const { response: media } = resource.request
      if (isClientAudio(media)) return { data: 1 }
      
      return namedError(ERROR.Internal)
    })
  }

  private preloadVisiblePromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const resource = this.resourceOfType($BITMAPS, $VIDEO) 
    if (!resource) return Promise.resolve({ data: 0 })

    const { type } = resource  
    if (type === $VIDEO) {
      return MOVIE_MASHER.promise(resource, $RETRIEVE).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { response: clientVideo } = resource.request
        if (!isClientVideo(clientVideo)) return namedError(ERROR.Unimplemented, $VIDEO)

        return { data: 1 }
      })
    } 
    return this.sequenceImagesPromise(args)
  }

  private get previewResource(): Resource | undefined {
    return this.resourceOfType($BITMAPS, $VIDEO)
  }

  private sequenceImagesPromise(args: AssetCacheArgs): Promise<DataOrError<number>> {
    const { assetTime: range } = args
    if (!isTime(range)) return Promise.resolve({ data: 0 })
    
    const assetTimes: Times = []
    if (range.isRange) {
      assertTimeRange(range)
      
      assetTimes.push(...range.frameTimes)
    } else assetTimes.push(range)
      const promises = assetTimes.map(assetTime => {
        return this.clientImagePromise(assetTime).then(orError => {
        if (isDefiniteError(orError)) return orError

        return { data: 1 }
      })
    })
    return promiseNumbers(promises)
  }
}

export const videoRawAssetFunction: AssetFunction = (assetObject) => {
  if (!isAssetObject(assetObject, $VIDEO, $RAW)) {
    return namedError(ERROR.Syntax, [$VIDEO, $RAW].join(SLASH))
  }
  return { data: new ClientRawVideoAssetClass(assetObject) }
}

const VideoWithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const VideoWithVisibleInstance = VisibleInstanceMixin(VideoWithAudibleInstance)
const VideoWithClientAudibleInstance = ClientAudibleInstanceMixin(VideoWithVisibleInstance)
const VideoWithClientVisibleInstance = ClientVisibleInstanceMixin(VideoWithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(VideoWithClientVisibleInstance)
export class ClientRawVideoInstanceClass extends WithVideoInstance implements ClientRawVideoInstance {
  declare asset: ClientRawVideoAsset

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

  private sequenceItem(rect: Rect, assetTime: Time, opacity?: Scalar): DataOrError<SvgItem> {
    const { asset } = this
    const orError = asset.clientImage(assetTime)
    if (isDefiniteError(orError)) return orError

    const { data: clientImage } = orError
    const { src } = clientImage
    const image = svgImageWithOptions(src, rect)
    const data = svgOpacity(image, opacity) 
    return { data }
  }

  private sequenceItemPromise(rect: Rect, assetTime: Time, opacity?: Scalar): Promise<DataOrError<SvgItem>> {
    const { asset } = this
    return asset.clientImagePromise(assetTime).then(orError => {
      if (isDefiniteError(orError)) return orError

      const { data: clientImage } = orError
      const { src } = clientImage
      return svgImagePromiseWithOptions(src, rect).then(image => {
        const data = svgOpacity(image, opacity) 
        return { data }
      })
    })
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

      MOVIE_MASHER.dispatch(event)
      const { promise } = event.detail
      if (!promise) return
    })
    // TODO something with errors
    errors.forEach(error => {
      MOVIE_MASHER.dispatch(new EventImporterError(error))
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
    const { document } = MOVIE_MASHER.window
    this._ui ||= document.createElement(ClientRawTag)
    this._ui.sources = this.sources
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
