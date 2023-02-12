import { LoadedVideo, LoadedImage } from "../../Load/Loaded"
import { VideoClass } from "./VideoClass"
import { Video, VideoDefinition, VideoDefinitionObject, VideoObject } from "./Video"
import { PreloadableDefinitionMixin } from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { ContentDefinitionMixin } from "../Content/ContentDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"
import { ContainerDefinitionMixin } from "../Container/ContainerDefinitionMixin"
import { MediaBase } from "../MediaBase"
import { assertSizeAboveZero, Size, sizeAboveZero, sizeCover, sizeString } from "../../Utility/Size"
import { svgImagePromiseWithOptions, svgSvgElement } from "../../Helpers/Svg/SvgFunctions"
import { centerPoint, RectOptions } from "../../Utility/Rect"
import { Time } from "../../Helpers/Time/Time"
import { assertLoadedImage, assertLoadedVideo } from "../../Load/Loader"
import { imageFromVideoPromise } from "../../Utility/Image"
import { timeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { ImageType, SequenceType, VideoType } from "../../Setup/Enums"
import { Requestable } from "../../Base/Requestable/Requestable"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../../Helpers/Error/ErrorName"

const VideoDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const VideoDefinitionWithContainer = ContainerDefinitionMixin(VideoDefinitionWithTweenable)
const VideoDefinitionWithContent = ContentDefinitionMixin(VideoDefinitionWithContainer)
const VideoDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoDefinitionWithContent)
const VideoDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoDefinitionWithPreloadable)
const VideoDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoDefinitionWithUpdatableSize)
export class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration implements VideoDefinition {
  constructor(object: VideoDefinitionObject) {
    super(object)
    const { loadedVideo } = object as VideoDefinitionObject
    if (loadedVideo) this.loadedVideo = loadedVideo
  
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
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

  loadedImages = new Map<string, LoadedImage>()

  loadedImage(definitionTime: Time, outSize?: Size): LoadedImage | undefined {
    return this.loadedImages.get(this.loadedImageKey(definitionTime, outSize))
  }

  loadedImageKey(definitionTime: Time, outSize?: Size): string {
    const { frame, fps } = definitionTime
    const frameFps = `${frame}@${fps}`
    if (! sizeAboveZero(outSize)) return frameFps

    return `${frameFps}-${sizeString(outSize)}`
  }
  private imageFromSequencePromise(previewTranscoding: Requestable, definitionTime: Time, outSize?: Size): Promise<LoadedImage> {
    throw new Error()
  }

  private imageFromTranscodingPromise(transcoding: Requestable, definitionTime: Time, outSize?: Size): Promise<LoadedImage> {
    const { type } = transcoding
    switch (type) {
      case ImageType: {
        return transcoding.loadedMediaPromise.then(orError => {
          const { error, clientMedia: media } = orError
          if (error) return errorThrow(error)
          
          assertLoadedImage(media)
          return media
        })
      }
      case VideoType: {
        return this.imageFromVideoTranscodingPromise(transcoding, definitionTime, outSize)
      }
      case SequenceType: {
        return this.imageFromSequencePromise(transcoding, definitionTime, outSize)
      }
    }
    return errorThrow(ErrorName.Internal)
  }

  private imageFromVideoTranscodingPromise(previewTranscoding: Requestable, definitionTime: Time, outSize?: Size): Promise<LoadedImage> {
    console.log(this.constructor.name, 'imageFromVideoTranscodingPromise', definitionTime)
    
    const loaded = this.loadedImage(definitionTime, outSize)
    if (loaded) return Promise.resolve(loaded)
    
    return previewTranscoding.loadedMediaPromise.then(orError => {
      const { error, clientMedia: media } = orError
      if (error) return errorThrow(error)

      assertLoadedVideo(media)

      const key = this.loadedImageKey(definitionTime, outSize)
    
      return imageFromVideoPromise(media, definitionTime, outSize).then(image => {
        this.loadedImages.set(key, image)
        return image
      })
    })

  }


  instanceFromObject(object: VideoObject = {}): Video {
    return new VideoClass(this.instanceArgs(object))
  }

  loadedVideo?: LoadedVideo
  
  pattern = '%.jpg'

  loadedImagePromise(definitionTime: Time, outSize?: Size): Promise<LoadedImage>{
    console.log(this.constructor.name, 'loadedImagePromise', definitionTime)
    const { previewTranscoding: transcoding } = this
    return this.imageFromTranscodingPromise(transcoding, definitionTime, outSize)
  }
  

  get iconTranscoding(): Requestable {
    return this.preferredTranscoding(
      ImageType, SequenceType, VideoType
    )
  }

  
  get previewTranscoding(): Requestable {
    return this.preferredTranscoding(
      SequenceType, VideoType
    )
  }

  type = VideoType 
}
