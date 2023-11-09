import type { ClientImage, ClientImageDataOrError, ClientInstance, ClientMediaRequest, ClientRawVideoAsset, ClientRawVideoAssetObject, ClientRawVideoInstance, ClientVideo, Panel, Preview, SvgItem } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, DataOrError, InstanceArgs, Numbers, Rect, RectOptions, Size, Time, Times, Transcoding, TranscodingTypes, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, AudibleInstanceMixin, DOT, NamespaceSvg, SEMICOLON, SLASH, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertDefined, assertPopulatedString, assertSizeAboveZero, assertTimeRange, assertTrue, assertVideoAsset, centerPoint, isTime, pointCopy, promiseNumbers, requestUrl, sizeAboveZero, sizeCopy, sizeCover, sizeString, timeFromArgs, timeFromSeconds } from '@moviemasher/lib-shared'
import { EventAsset, EventClientAudioPromise, EventClientImagePromise, EventClientVideoPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ERROR, RAW, AUDIO, IMAGE, SEQUENCE, VIDEO, errorThrow, isAssetObject, isBoolean, isDefiniteError, errorPromise, namedError } from '@moviemasher/runtime-shared'
import { isClientAudio, isClientVideo } from '../../Client/ClientGuards.js'
import { svgImagePromiseWithOptions, svgSetChildren, svgSetDimensions, svgSvgElement } from '../../Client/SvgFunctions.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAudibleAssetMixin } from '../Audible/ClientAudibleAssetMixin.js'
import { ClientAudibleInstanceMixin } from '../Audible/ClientAudibleInstanceMixin.js'
import { ClientRawAssetClass } from './ClientRawAssetClass.js'
import { requestImagePromise } from '../../utility/request.js'


// function assertClientAudio(value: any, name?: string): asserts value is ClientAudio {
//   if (!isClientAudio(value)) errorThrow(value, 'ClientAudio', name)
// }

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

const WithAudibleAsset = AudibleAssetMixin(ClientRawAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = ClientAudibleAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithClientVisibleAsset)

export class ClientRawVideoAssetClass extends WithVideoAsset implements ClientRawVideoAsset {  
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
        MovieMasher.eventDispatcher.dispatch(event)
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
    MovieMasher.eventDispatcher.dispatch(event)
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
    MovieMasher.eventDispatcher.dispatch(event)
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
      MovieMasher.eventDispatcher.dispatch(event)
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
export const ClientRawVideoListeners = () => ({
  [EventAsset.Type]: ClientRawVideoAssetClass.handleAsset
})

const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = ClientAudibleInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstanceD = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithClientVisibleInstanceD)

export class ClientRawVideoInstanceClass extends WithVideoInstance implements ClientRawVideoInstance {
  constructor(args: VideoInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }

  declare asset: ClientRawVideoAsset

  override containedPreviewPromise(video: ClientVideo, _content: ClientInstance, containerRect: Rect, _size: Size, time: Time, _component: Panel): Promise<Preview> {
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
      // if (!updatableContainer) {
      //   const containerItem = this.pathElement(zeroRect)
      //   containerItem.setAttribute('fill', colorWhite)
      //   const clipId = idGenerateString()
      //   const clipElement = globalThis.document.createElementNS(NamespaceSvg, 'clipPath')
      //   svgSet(clipElement, clipId)
      //   svgAppend(clipElement, containerItem)

      //   const svg = svgSvgElement(size)
      //   svgSetChildren(svg, [svgDefsElement([clipElement])])

      //   styles.push(`clip-path:${svgUrl(clipId)}`)
      //   items.push(svg)
      // }
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
  get foreignElement() { 
    const { _foreignElement } = this
    if (_foreignElement) return _foreignElement

    const { document } = globalThis
    const element = document.createElementNS(NamespaceSvg, 'foreignObject')
    return this._foreignElement = element
  }

  loadedVideo?: ClientVideo 

  private previewVideoPromise(previewTranscoding: Transcoding | undefined): Promise<ClientVideo> {
    const { loadedVideo } = this
    if (loadedVideo) return Promise.resolve(loadedVideo)

    const target = previewTranscoding || this.asset
    const { request } = target
    const event = new EventClientVideoPromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
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
      assertVideoAsset(asset)
      return asset.loadedImagePromise(definitionTime, sizeCopy(zeroRect)).then(orError => {
        if (isDefiniteError(orError)) return errorThrow(orError.error)

        return orError.data.src
      })
    }
    const imageTranscoding = asset.preferredTranscoding(IMAGE) 
    assertDefined(imageTranscoding)

    const { request } = imageTranscoding
    const event = new EventClientImagePromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
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
