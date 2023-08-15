import type { ClientImage, ClientInstance, ClientRawVideoAsset, ClientRawVideoAssetObject, ClientRawVideoInstance, ClientVideo, MediaRequest, Panel, Preview, SvgItem, Transcoding } from '@moviemasher/runtime-client'
import type { AssetCacheArgs, InstanceArgs, Rect, RectOptions, Size, Time, Times, TranscodingTypes, VideoInstance, VideoInstanceObject } from '@moviemasher/runtime-shared'

import { AudibleAssetMixin, AudibleInstanceMixin, EmptyFunction, NamespaceSvg, SemicolonChar, VideoAssetMixin, VideoInstanceMixin, VisibleAssetMixin, VisibleInstanceMixin, assertDefined, assertSizeAboveZero, assertTimeRange, assertTrue, centerPoint, pointCopy, sizeAboveZero, sizeContain, sizeCopy, sizeCover, sizeString, timeFromArgs, timeFromSeconds, } from '@moviemasher/lib-shared'
import { EventAsset, EventClientAudioPromise, EventClientImagePromise, EventClientVideoPromise, MovieMasher } from '@moviemasher/runtime-client'
import { ErrorName, SourceRaw, TypeAudio, TypeImage, TypeSequence, TypeVideo, errorThrow, isAssetObject, isBoolean, isDefiniteError } from '@moviemasher/runtime-shared'
import { isClientAudio, isClientVideo } from '../../Client/ClientGuards.js'
import { svgImagePromiseWithOptions, svgSetChildren, svgSetDimensions, svgSvgElement } from '../../Client/SvgFunctions.js'
import { ClientVisibleAssetMixin } from '../../Client/Visible/ClientVisibleAssetMixin.js'
import { ClientVisibleInstanceMixin } from '../../Client/Visible/ClientVisibleInstanceMixin.js'
import { ClientInstanceClass } from '../../instance/ClientInstanceClass.js'
import { ClientAudibleAssetMixin } from '../Audible/ClientAudibleAssetMixin.js'
import { ClientAudibleInstanceMixin } from '../Audible/ClientAudibleInstanceMixin.js'
import { ClientRawAssetClass } from './ClientRawAssetClass.js'


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

const seekingPromises = new Map<ClientVideo, Promise<ClientImage>>()

const seek = (definitionTime: Time, video:HTMLVideoElement): void => {
  video.currentTime = definitionTime.seconds
}

const videoImagePromise = (video: ClientVideo, outSize?: Size): Promise<ClientImage> => {
  const inSize = sizeCopy(video)
  const size = sizeAboveZero(outSize) ? sizeCover(inSize, outSize) : inSize
  const { width, height } = size
  const [canvas, context] = canvasContext(size)
  context.drawImage(video, 0, 0, width, height)
  const image = new Image()
  image.src = canvas.toDataURL()
  return image.decode().then(() => image)
}

const seekNeeded = (definitionTime: Time, video:HTMLVideoElement): boolean => {
  const { currentTime } = video
  if (!(currentTime || definitionTime.frame)) return true

  const videoTime = timeFromSeconds(currentTime, definitionTime.fps)
  return !videoTime.equalsTime(definitionTime)
}

const imageFromVideoPromise = (video: ClientVideo, definitionTime: Time, outSize?: Size): Promise<ClientImage> => {
  // console.log('imageFromVideoPromise', definitionTime)
  
  const promise: Promise<ClientImage> = new Promise(resolve => {
    if (!seekNeeded(definitionTime, video)) {
      // console.log('imageFromVideoPromise !seekNeeded', definitionTime)

      seekingPromises.delete(video)
      return videoImagePromise(video, outSize)
    }
    // console.log('imageFromVideoPromise seekNeeded', definitionTime)

    video.onseeked = () => {
      // console.log('imageFromVideoPromise onseeked', definitionTime)

      video.onseeked = null
      videoImagePromise(video, outSize).then(image => {
        // console.log('imageFromVideoPromise resolving after videoImagePromise', definitionTime)

        seekingPromises.delete(video)
        resolve(image)
      })
    }
    seek(definitionTime, video)
    return
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
  
  override assetCachePromise(args: AssetCacheArgs): Promise<void> {
    // console.debug(this.constructor.name, 'assetCachePromise', args)
    const promises: Promise<void>[] = []
    const { audible, visible } = args
    const { audio } = this
    if (audible && audio) promises.push(this.preloadAudiblePromise(args))
    if (visible) promises.push(this.preloadVisiblePromise(args))
    return Promise.all(promises).then(EmptyFunction)
  }

  override audibleSource(): AudioBufferSourceNode | undefined {
    const { audio } = this
    if (!audio) return undefined
    return super.audibleSource()
  }

  override definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { previewTranscoding: transcoding } = this
    // if (!transcoding) return undefined
    
    const time = timeFromArgs(1)
    return this.imageFromTranscodingPromise(transcoding, time).then(image => {
      const { src } = image
      assertSizeAboveZero(image)

      const { width, height } = image
      const inSize = { width, height }
      const containedSize = sizeContain(inSize, size)
      const outRect = { ...containedSize, ...centerPoint(size, containedSize) }
      const options: RectOptions = { ...outRect }
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        // console.log(this.constructor.name, 'definitionIcon', svgImage.constructor.name, options, src)
        return svgSvgElement(size, svgImage)
      })
    })
  }

  private imageFromTranscodingPromise(transcoding: Transcoding | undefined, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    const target = transcoding || this
    const { type, request } = target
    switch (type) {
      case TypeImage: {
        const event = new EventClientImagePromise(request)
        MovieMasher.eventDispatcher.dispatch(event)
        const { promise } = event.detail
        return promise!.then(orError => {
          if (isDefiniteError(orError)) return errorThrow(orError.error)
          
          return orError.data
        })
      }
      case TypeVideo: {
        console.log(this.constructor.name, 'imageFromTranscodingPromise', definitionTime, outSize)
        return this.imageFromVideoTranscodingPromise(transcoding, definitionTime, outSize)
      }

      // TODO: support...
      // case TypeSequence: {
      //   return this.imageFromSequencePromise(transcoding, definitionTime, outSize)
      // }
    }
    return errorThrow(ErrorName.Internal)
  }

  private imageFromVideoTranscodingPromise(previewTranscoding: Transcoding | undefined, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', definitionTime, outSize)
    
    const loaded = this.loadedImage(definitionTime, outSize)
    if (loaded) {
      // console.debug(this.constructor.name, 'imageFromVideoTranscodingPromise loaded', definitionTime, outSize)
      return Promise.resolve(loaded)
    }

    // const { loadedVideoPromise } = this
    // assertDefined(loadedVideoPromise)

    const { request } = previewTranscoding || this

    const event = new EventClientVideoPromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assertDefined(promise)
    return promise.then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientVideo } = orError
      const key = this.loadedImageKey(definitionTime, outSize)

      return imageFromVideoPromise(clientVideo, definitionTime, outSize).then(image => {
        // console.debug(this.constructor.name, 'imageFromVideoTranscodingPromise SETTING', key)
        this.loadedImages.set(key, image)
        return image
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

  // private loadedVideo?: ClientVideo

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

  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>{
    // console.log(this.constructor.name, 'loadedImagePromise', definitionTime)
    const { previewTranscoding: transcoding } = this
    // if (! transcoding) return errorThrow(ErrorName.Internal)

    return this.imageFromTranscodingPromise(transcoding, definitionTime, outSize)
  }
  
  // private get loadedVideoPromise(): Promise<ClientVideoDataOrError> | undefined{
  //   const { loadedVideo } = this
  //   if (loadedVideo) return Promise.resolve({ data: loadedVideo })

  //   const { previewTranscoding } = this
  //   const target = previewTranscoding || this
  //   const { request } = target
  //   const event = new EventClientVideoPromise(request)
  //   MovieMasher.eventDispatcher.dispatch(event)
  //   const { promise } = event.detail
  //   if (!promise) return 

  //   return promise.then(orError => {
  //     if (isDefiniteError(orError)) return orError

  //     const { data: clientVideo } = orError
  //     this.loadedVideo = clientVideo
  //     return orError
  //   })
  // }

  private preloadAudiblePromise(_args: AssetCacheArgs): Promise<void> {
    if (this.loadedAudio) return Promise.resolve()

    const transcoding = this.preferredTranscoding(TypeAudio, TypeVideo)
    const { request } = transcoding || this

    const event = new EventClientAudioPromise(request)
    MovieMasher.eventDispatcher.dispatch(event)
    const { promise } = event.detail
    assertDefined(promise, 'audio promise')

    return promise.then(orError => {
      if (isDefiniteError(orError)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isDefiniteError', orError)
        this.audio = false
        return
      }

      const { data } = orError
      if (isClientAudio(data)) {
        // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isClientAudio')
        this.loadedAudio = data
        return
      }
      // assertClientVideo(data)

      // const { src } = data
      // const endpoint = endpointFromUrl(src)
      // const request = { endpoint }

      // console.debug(this.constructor.name, 'preloadAudiblePromise', 'isClientVideo', src, endpoint)
      // const event = new EventClientAudioPromise(request)
      // MovieMasher.eventDispatcher.dispatch(event)
      // const { promise } = event.detail
      // assertDefined(promise, 'audio from video promise')

      // return promise.then(orError => {
      //   if (isDefiniteError(orError)) {
          console.debug(this.constructor.name, 'preloadAudiblePromise', 'isDefiniteError', orError)
      //     return
      //   }

      //   const { data: audio } = orError
      //   assertClientAudio(audio)

      //   this.loadedAudio = audio
      // })
    })
  }
  declare request: MediaRequest

  private preloadVisiblePromise(args: AssetCacheArgs): Promise<void> {
    const promises: Promise<void>[] = []
    // const { audible } = args
    // const { audio } = this
    const visibleTranscoding = this.preferredTranscoding(TypeSequence, TypeVideo)
   
    // if (visibleTranscoding) {
    // const audibleTranscoding = audio && audible && this.preferredTranscoding(TypeAudio, TypeVideo)
    // if (visibleTranscoding !== audibleTranscoding) {
    const { type, request } = visibleTranscoding || this  
    if (type === TypeVideo) {
      const event = new EventClientVideoPromise(request)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      promises.push(promise!.then(orError => {
        if (isDefiniteError(orError)) return errorThrow(orError.error)

        const { data: clientVideo } = orError
        this.loadedVideo = clientVideo
        // console.debug(this.constructor.name, 'preloadVisiblePromise', 'isClientVideo', args)
        // const { time } = args

        return
      }))
    } else promises.push(this.sequenceImagesPromise(args))

      // } 
    // } 
    return Promise.all(promises).then(() => {})
  }

  get previewTranscoding(): Transcoding | undefined {
    return this.findTranscoding(TypeVideo, TypeSequence, TypeVideo)
  }

  private sequenceImagesPromise(args: AssetCacheArgs): Promise<void> {
    const { assetTime: range } = args
    const definitionTimes: Times = []
    if (range.isRange) {
      assertTimeRange(range)
      // const { times } = range
      // const [start, end] = times//.map(time => this.definitionTime(time, range))
      // const definitionRange = timeRangeFromTimes(start, end)
      definitionTimes.push(...range.frameTimes)
    } else definitionTimes.push(range)
    const promises = definitionTimes.map(definitionTime => {
      return this.loadedImagePromise(definitionTime)
    })
    return Promise.all(promises).then(EmptyFunction)
  }

  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, asset } = detail
    if (!asset && isAssetObject(assetObject, TypeVideo, SourceRaw)) {
      detail.asset = new ClientRawVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/raw asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ClientRawVideoAssetClass.handleAsset
)

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
      div.setAttribute('style', styles.join(SemicolonChar) + SemicolonChar)
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
    // return errorThrow(ErrorName.Unimplemented)
    const { asset } = this
    return asset.loadedImagePromise(definitionTime).then(loadedImage => {
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

  private stylesSrcPromise(_zeroRect: Rect, _definitionTime: Time): Promise<string> {
    const { type, asset } = this
    const types: TranscodingTypes = []
    if (type === TypeImage) types.push(type)
    else types.push(TypeSequence, TypeVideo)
    // const transcoding = asset.preferredTranscoding(...types)
    // assertDefined(transcoding)


    // const { type: transcodingType } = transcoding

    // TODO: support sequences
    // if (transcodingType === TypeSequence) {
    //   assertVideoMedia(definition)
    //   return definition.loadedImagePromise(definitionTime, sizeCopy(zeroRect)).then(image => (
    //     image.src
    //   ))
    // }
    const imageTranscoding = asset.preferredTranscoding(TypeImage) 
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
      case TypeVideo: {
        return this.videoItemForPlayerPromise(previewTranscoding, rect, definitionTime)
      }

      // TODO: support sequence
      // case TypeSequence: {
      //   return this.sequenceItemPromise(rect, definitionTime)
      // }
    }
    return errorThrow(ErrorName.Type)
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
