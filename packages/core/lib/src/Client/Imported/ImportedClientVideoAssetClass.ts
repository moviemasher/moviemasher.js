import { RectOptions, Size, Time, Times, TypeAudio } from '@moviemasher/runtime-shared'

import type { ClientImage } from '../../Helpers/ClientMedia/ClientMedia.js'
import type { VideoAssetObject } from "../../Shared/Video/VideoAsset.js"


import { TypeImage, TypeVideo } from '@moviemasher/runtime-shared'
import { ImportedClientAssetClass } from "./ImportedClientAssetClass.js"
import { assertImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js"
import { timeFromArgs, timeRangeFromTimes } from '../../Helpers/Time/TimeUtilities.js'
import { assertSizeAboveZero, sizeAboveZero, sizeCover, sizeString } from '../../Utility/SizeFunctions.js'
import { centerPoint } from '../../Utility/RectFunctions.js'
import { svgImagePromiseWithOptions, svgSvgElement } from '../../Helpers/Svg/SvgFunctions.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { assertTimeRange, isDefiniteError } from '../../Shared/SharedGuards.js'
import { imageFromVideoPromise } from '../../Utility/Image.js'
import { TypeSequence } from '../../Setup/EnumConstantsAndFunctions.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { AudibleAssetMixin } from '../../Shared/Audible/AudibleAssetMixin.js'
import { AudibleClientAssetMixin } from "../Audible/AudibleClientAssetMixin.js"
import { VisibleAssetMixin } from '../../Shared/Visible/VisibleAssetMixin.js'
import { ClientVisibleAssetMixin } from "../Visible/ClientVisibleAssetMixin.js"
import { VideoAssetMixin } from '../../Shared/Video/VideoAssetMixin.js'
import { ImportedClientVideoAsset } from './ImportedTypes.js'
import { assertClientAudio, assertClientVideo, clientMediaAudioPromise, clientMediaImagePromise, clientMediaVideoPromise, isClientAudio } from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import { isClientImportedAssetObject } from '../Asset/ClientAssetGuards.js'
import { Transcoding } from '../../Plugin/Transcode/Transcoding/Transcoding.js'
import { AssetCacheArgs } from '../../Base/Code.js'
import { EmptyFunction } from '../../Setup/EmptyFunction.js'
import { endpointFromUrl } from '../../Helpers/Endpoint/EndpointFunctions.js'

const WithAudibleAsset = AudibleAssetMixin(ImportedClientAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithClientAudibleAsset = AudibleClientAssetMixin(WithVisibleAsset)
const WithClientVisibleAsset = ClientVisibleAssetMixin(WithClientAudibleAsset)
const WithVideo = VideoAssetMixin(WithClientVisibleAsset)

export class ImportedClientVideoAssetClass extends WithVideo implements ImportedClientVideoAsset {
  constructor(object: VideoAssetObject) {
    assertImportedAssetObject(object)
    super(object)
    if (isClientImportedAssetObject(object)) {
      const { loadedVideo } = object
      if (loadedVideo) this.loadedVideo = loadedVideo
    }
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { previewTranscoding: transcoding } = this
    if (!transcoding) return undefined
    
    const time = timeFromArgs(1)
    return this.imageFromTranscodingPromise(transcoding, time).then(image => {
      const { src } = image
      assertSizeAboveZero(image)

      const { width, height } = image
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = { ...outRect }
      return svgImagePromiseWithOptions(src, options).then(svgImage => {
        return svgSvgElement(size, svgImage)
      })
    })
  }


  loadedImages = new Map<string, ClientImage>()

  loadedImage(definitionTime: Time, outSize?: Size): ClientImage | undefined {
    return this.loadedImages.get(this.loadedImageKey(definitionTime, outSize))
  }

  loadedImageKey(definitionTime: Time, outSize?: Size): string {
    const { frame, fps } = definitionTime
    const frameFps = `${frame}@${fps}`
    if (! sizeAboveZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }


  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>{
    console.log(this.constructor.name, 'loadedImagePromise', definitionTime)
    const { previewTranscoding: transcoding } = this
    if (! transcoding) return errorThrow(ErrorName.Internal)

    return this.imageFromTranscodingPromise(transcoding, definitionTime, outSize)
  }
  

  private imageFromTranscodingPromise(transcoding: Transcoding, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    const { type, request } = transcoding
    switch (type) {
      case TypeImage: {

        return clientMediaImagePromise(request).then(orError => {
          if (isDefiniteError(orError)) return errorThrow(orError.error)
          
          return orError.data
        })
      }
      case TypeVideo: {
        return this.imageFromVideoTranscodingPromise(transcoding, definitionTime, outSize)
      }

      // TODO: support...
      // case TypeSequence: {
      //   return this.imageFromSequencePromise(transcoding, definitionTime, outSize)
      // }
    }
    return errorThrow(ErrorName.Internal)
  }

  private imageFromVideoTranscodingPromise(previewTranscoding: Transcoding, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', definitionTime)
    
    const loaded = this.loadedImage(definitionTime, outSize)
    if (loaded) return Promise.resolve(loaded)
    
    return clientMediaVideoPromise(previewTranscoding.request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientVideo } = orError
      const key = this.loadedImageKey(definitionTime, outSize)
    
      return imageFromVideoPromise(clientVideo, definitionTime, outSize).then(image => {
        this.loadedImages.set(key, image)
        return image
      })
    })

  }    

  assetCachePromise(args: AssetCacheArgs): Promise<void> {
    const promises: Promise<void>[] = []
    const { audible, visible } = args
    const { audio } = this
    if (audible && audio) promises.push(this.preloadAudiblePromise(args))
    if (visible) promises.push(this.preloadVisiblePromise(args))
    return Promise.all(promises).then(EmptyFunction)
  }

  
  preloadAudiblePromise(args: AssetCacheArgs): Promise<void> {
    if (this.loadedAudio)
      return Promise.resolve()

    const transcoding = this.preferredAsset(TypeAudio, TypeVideo)
    if (!transcoding)
      return Promise.resolve()

    const { request } = transcoding
    const { response } = request
    if (isClientAudio(response)) {
      this.loadedAudio = response
      return Promise.resolve()
    }
    return clientMediaAudioPromise(request).then(orError => {
      if (isDefiniteError(orError))
        return

      const { data } = orError
      if (isClientAudio(data)) {
        this.loadedAudio = data
        return
      }
      assertClientVideo(data)

      const { src } = data
      const endpoint = endpointFromUrl(src)
      const request = { endpoint }
      return clientMediaAudioPromise(request).then(orError => {
        if (isDefiniteError(orError))
          return

        const { data: audio } = orError
        assertClientAudio(audio)

        this.loadedAudio = audio
      })
    })
  }
  preloadVisiblePromise(args: AssetCacheArgs): Promise<void> {
    const promises: Promise<void>[] = []
    const { audible } = args
    const { audio } = this
    const visibleTranscoding = this.preferredAsset(TypeSequence, TypeVideo)
    if (visibleTranscoding) {
      const audibleTranscoding = audio && audible && this.preferredAsset(TypeAudio, TypeVideo)
      if (visibleTranscoding !== audibleTranscoding) {
        const { type, request } = visibleTranscoding 
        if (type === TypeVideo) {
          promises.push(clientMediaVideoPromise(request).then(orError => {
            if (isDefiniteError(orError)) return errorThrow(orError.error)
          }))
        } else promises.push(this.sequenceImagesPromise(args))

      } 
    } 
    return Promise.all(promises).then(() => {})
  }

  get previewTranscoding(): Transcoding | undefined {
    return this.findTranscoding(TypeVideo, TypeSequence, TypeVideo)
  }

  private sequenceImagesPromise(args: AssetCacheArgs): Promise<void> {
    const { time, assetTime: range } = args
    const definitionTimes: Times = []
    if (range.isRange) {
      assertTimeRange(range)
      const { times } = range
      const [start, end] = times//.map(time => this.definitionTime(time, range))
      const definitionRange = timeRangeFromTimes(start, end)
      definitionTimes.push(...range.frameTimes)
    } else definitionTimes.push(range)
    const promises = definitionTimes.map(definitionTime => {
      return this.loadedImagePromise(definitionTime)
    })
    return Promise.all(promises).then(EmptyFunction)
  }
}


