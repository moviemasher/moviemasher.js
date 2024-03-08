import type { AssetFile, AssetFiles, AssetFunction, CacheArgs, ServerInstance, ServerVideoAsset, VideoInstance, VideoInstanceObject } from '../types.js'
import type { ClientRawVideoAsset, ClientRawVideoInstance, AssetCacheArgs, ClientImage, ClientVideo, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, EndpointRequest, MaybeComplexSvgItem, Numbers, Rect, RectOptions, Resource, Scalar, Size, SvgItem, Time, Times } from '../types.js'

import { AudibleAssetMixin, AudibleInstanceMixin } from '../mixin/audible.js'
import { VideoAssetMixin, VideoInstanceMixin } from '../mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '../mixin/visible.js'
import { $AUDIO, $BITMAPS, $CLIENT, $IMAGE, $RAW, $RETRIEVE, $VIDEO, DOT, ERROR, MOVIE_MASHER, QUESTION, SLASH, errorPromise, isAssetObject, isDefiniteError, namedError, promiseNumbers } from '../runtime.js'
import { isClientAudio, isClientImage, isClientVideo } from '../utility/guard.js'
import { assertDefined, assertTrue } from '../utility/guards.js'
import { centerPoint, assertSizeNotZero, coverSize, sizeNotZero, sizeString, copySize } from '../utility/rect.js'
import { requestUrl } from '../utility/request.js'
import { svgImagePromiseWithOptions, svgImageWithOptions, svgOpacity, svgSvgElement } from '../utility/svg.js'
import { assertTimeRange, isTime, timeFromArgs, timeFromSeconds } from '../utility/time.js'
import { ClientInstanceClass } from '../base/client-instance.js'
import { ClientRawAssetClass } from '../base/client-raw-asset.js'
import { ClientAudibleAssetMixin, ClientAudibleInstanceMixin } from '../mixin/client-audible.js'
import { ClientVisibleAssetMixin, ClientVisibleInstanceMixin } from '../mixin/client-visible.js'

import { ServerInstanceClass } from '../base/server-instance.js'
import { ServerRawAssetClass } from '../base/server-raw-asset.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/server-audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/server-visible.js'

interface ServerRawVideoAsset extends ServerVideoAsset {}

interface ServerRawVideoInstance extends VideoInstance, ServerInstance {
  asset: ServerRawVideoAsset
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

export class ClientRawVideoAssetClass extends VideoAssetMixin(
  ClientVisibleAssetMixin(
    ClientAudibleAssetMixin(
      VisibleAssetMixin(AudibleAssetMixin(ClientRawAssetClass)
)
    )
  )
) implements ClientRawVideoAsset {  
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
  const { context } = MOVIE_MASHER
  const assetClass = context === $CLIENT ? ClientRawVideoAssetClass : ServerRawVideoAssetClass
  return { data: new assetClass(assetObject) }
}

export class ClientRawVideoInstanceClass extends VideoInstanceMixin(
  ClientVisibleInstanceMixin(
    ClientAudibleInstanceMixin(
      VisibleInstanceMixin(AudibleInstanceMixin(ClientInstanceClass))
    )
  )
) implements ClientRawVideoInstance {
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

export class ServerRawVideoAssetClass extends VideoAssetMixin(
  ServerAudibleAssetMixin(
    ServerVisibleAssetMixin(
      VisibleAssetMixin(
        AudibleAssetMixin(ServerRawAssetClass)
      )
    )
  )
) implements ServerRawVideoAsset {
  override assetFiles(args: CacheArgs): AssetFiles {
    const { audible, visible } = args
    const files: AssetFiles = []
    const { request } = this
    if (!request) return files
    
    const { path: file } = request
    assertDefined(file)

    if (visible) {
      const visFile: AssetFile = { type: $VIDEO, avType: $VIDEO, file, asset: this }
      files.push(visFile)
    }
    if (audible) {
      const mutable = this.duration ? this.canBeMuted : true
      if (mutable) {
        const audFile: AssetFile = { type: $AUDIO, avType: $AUDIO, file, asset: this }
        files.push(audFile)
      }
    }
    return files
  }

  override instanceFromObject(object?: VideoInstanceObject): ServerRawVideoInstance {
    const args = this.instanceArgs(object)
    return new ServerRawVideoInstanceClass(args)
  }

  type = $VIDEO
}

export class ServerRawVideoInstanceClass extends VideoInstanceMixin(
  ServerAudibleInstanceMixin(
    ServerVisibleInstanceMixin(
      VisibleInstanceMixin(AudibleInstanceMixin(ServerInstanceClass))
    )
  )
) implements ServerRawVideoInstance {  
  declare asset: ServerRawVideoAsset
}

