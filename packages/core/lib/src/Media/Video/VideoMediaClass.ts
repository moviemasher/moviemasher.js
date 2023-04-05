import {ClientVideo, ClientImage} from '../../Helpers/ClientMedia/ClientMedia.js'
import {VideoClass} from './VideoClass.js'
import {Video, VideoMedia, VideoMediaObject, VideoObject} from './Video.js'
import {UpdatableSizeDefinitionMixin} from '../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin.js'
import {ContentDefinitionMixin} from '../Content/ContentDefinitionMixin.js'
import {UpdatableDurationDefinitionMixin} from '../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin.js'
import {TweenableDefinitionMixin} from '../../Mixin/Tweenable/TweenableDefinitionMixin.js'
import {ContainerDefinitionMixin} from '../Container/ContainerDefinitionMixin.js'
import {MediaBase} from '../MediaBase.js'
import {assertSizeAboveZero, Size, sizeAboveZero, sizeCover, sizeString} from '../../Utility/Size.js'
import {svgImagePromiseWithOptions, svgSvgElement} from '../../Helpers/Svg/SvgFunctions.js'
import {centerPoint, RectOptions} from '../../Utility/Rect.js'
import {Time} from '../../Helpers/Time/Time.js'
import {imageFromVideoPromise} from './Image.js'
import {timeFromArgs} from '../../Helpers/Time/TimeUtilities.js'
import { TypeSequence, TypeImage, TypeVideo} from '../../Setup/Enums.js'
import {Requestable} from '../../Base/Requestable/Requestable.js'
import {errorThrow} from '../../Helpers/Error/ErrorFunctions.js'
import {ErrorName} from '../../Helpers/Error/ErrorName.js'
import {requestImagePromise, requestVideoPromise} from '../../Helpers/Request/RequestFunctions.js'
import {isDefiniteError} from '../../Utility/Is.js'

const VideoMediaWithTweenable = TweenableDefinitionMixin(MediaBase)
const VideoMediaWithContainer = ContainerDefinitionMixin(VideoMediaWithTweenable)
const VideoMediaWithContent = ContentDefinitionMixin(VideoMediaWithContainer)
const VideoMediaWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoMediaWithContent)
const VideoMediaWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoMediaWithUpdatableSize)
export class VideoMediaClass extends VideoMediaWithUpdatableDuration implements VideoMedia {
  constructor(object: VideoMediaObject) {
    super(object)
    const { loadedVideo } = object as VideoMediaObject
    if (loadedVideo) this.loadedVideo = loadedVideo
  
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: 'speed', type: DataType.Number, value: 1.0 }))
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { previewTranscoding: transcoding } = this
    const time = timeFromArgs(1)
    return this.imageFromTranscodingPromise(transcoding, time).then(image => {
      assertSizeAboveZero(image)

      const { width, height, src } = image
      const inSize = { width, height }
      const coverSize = sizeCover(inSize, size, true)
      const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
      const options: RectOptions = {
        ...outRect
      }
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
  private imageFromSequencePromise(previewTranscoding: Requestable, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    throw new Error()
  }

  private imageFromTranscodingPromise(transcoding: Requestable, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    const { type, request } = transcoding
    switch (type) {
      case TypeImage: {

        return requestImagePromise(request).then(orError => {
          if (isDefiniteError(orError)) return errorThrow(orError.error)
          
          return orError.data
        })
      }
      case TypeVideo: {
        return this.imageFromVideoTranscodingPromise(transcoding, definitionTime, outSize)
      }
      case TypeSequence: {
        return this.imageFromSequencePromise(transcoding, definitionTime, outSize)
      }
    }
    return errorThrow(ErrorName.Internal)
  }

  private imageFromVideoTranscodingPromise(previewTranscoding: Requestable, definitionTime: Time, outSize?: Size): Promise<ClientImage> {
    console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', definitionTime)
    
    const loaded = this.loadedImage(definitionTime, outSize)
    if (loaded) return Promise.resolve(loaded)
    
    return requestVideoPromise(previewTranscoding.request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientVideo } = orError

      const key = this.loadedImageKey(definitionTime, outSize)
    
      return imageFromVideoPromise(clientVideo, definitionTime, outSize).then(image => {
        this.loadedImages.set(key, image)
        return image
      })
    })

  }


  instanceFromObject(object: VideoObject = {}): Video {
    return new VideoClass(this.instanceArgs(object))
  }

  loadedVideo?: ClientVideo
  
  pattern = '%.jpg'

  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<ClientImage>{
    console.log(this.constructor.name, 'loadedImagePromise', definitionTime)
    const { previewTranscoding: transcoding } = this
    return this.imageFromTranscodingPromise(transcoding, definitionTime, outSize)
  }
  

  get iconTranscoding(): Requestable {
    return this.preferredTranscoding(
      TypeImage, TypeSequence, TypeVideo
    )
  }

  
  get previewTranscoding(): Requestable {
    return this.preferredTranscoding(
      TypeSequence, TypeVideo
    )
  }

  type = TypeVideo 
}
