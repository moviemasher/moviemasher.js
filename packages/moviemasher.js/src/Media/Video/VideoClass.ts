import { GraphFile, PreloadArgs, GraphFiles, SvgImageOptions, ServerPromiseArgs } from "../../MoveMe"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, assertTimeRange, isBoolean } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { LoadedVideo, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange, Times } from "../../Helpers/Time/Time"
import { EmptyMethod, NamespaceSvg } from "../../Setup/Constants"
import { Size, sizeCopy, sizeCover } from "../../Utility/Size"
import { urlPrependProtocol } from "../../Utility/Url"
import { svgImagePromiseWithOptions, svgSetDimensions } from "../../Utility/Svg"
import { ContainerMixin } from "../Container/ContainerMixin"
import { MediaInstanceBase } from "../MediaInstance/MediaInstanceBase"
import { isTranscoding, Transcoding } from "../Transcoding/Transcoding"
import { assertLoadedVideo, isLoadedAudio, isLoadedVideo } from "../../Loader/Loader"
import { Errors } from "../../Setup/Errors"
import { timeRangeFromTimes } from "../../Helpers/Time/TimeUtilities"
import { endpointUrl } from "../../Utility/Endpoint"

const VideoWithTweenable = TweenableMixin(MediaInstanceBase)

const VideoWithContainer = ContainerMixin(VideoWithTweenable)
const VideoWithContent = ContentMixin(VideoWithContainer)
const VideoWithPreloadable = PreloadableMixin(VideoWithContent)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  declare definition : VideoDefinition

  private _foreignElement?: SVGForeignObjectElement
  get foreignElement() { 
    const { _foreignElement } = this
    if (_foreignElement) return _foreignElement

    const { document } = globalThis
    const element = document.createElementNS(NamespaceSvg, 'foreignObject')
    return this._foreignElement = element
  }

  graphFiles(args: PreloadArgs): GraphFiles {
    const files: GraphFiles = []

    const { audible, visible, icon } = args
 
    const { definition } = this
    const { request } = definition
    const file = endpointUrl(request.endpoint) 
    
    assertPopulatedString(file)

    if (visible) {
      if (!icon) {
        const visibleGraphFile: GraphFile = {
          input: true, type: LoadType.Video, file, definition
        }
        files.push(visibleGraphFile)
      }
    }
    if (audible) {
      const mutable = definition.duration ? this.mutable() : true
      if (mutable && !this.muted) {
        const audioGraphFile: GraphFile = {
          input: true, type: LoadType.Audio, definition,
          file: '',
        }  
        files.push(audioGraphFile)
      } 
    }
    return files
  }

  loadPromise(args: PreloadArgs): Promise<void> {
    console.log(this.constructor.name, 'loadPromise', args)
    const promises: Promise<void>[] = []
    const { definition } = this
    const { audio } = definition
    const { visible, audible } = args
    
    if (audio && audible) {
      promises.push(definition.loadedAudioPromise.then(EmptyMethod))
    }
    if (visible) {
      const visibleTranscoding = definition.preferredTranscoding(DefinitionType.VideoSequence, DefinitionType.Video)
      if (isTranscoding(visibleTranscoding) ) {
        const audibleTranscoding = audio && audible && definition.preferredTranscoding(DefinitionType.Audio, DefinitionType.Video)
        if (visibleTranscoding !== audibleTranscoding) {
          const { type } = visibleTranscoding
          console.log(this.constructor.name, 'loadPromise visibleTranscoding', visibleTranscoding)
 
          if (type === DefinitionType.Video) {
            promises.push(visibleTranscoding.loadedMediaPromise.then(EmptyMethod))
          } else promises.push(this.sequenceImagesPromise(args))

        } else console.log(this.constructor.name, 'loadPromise', visibleTranscoding, '===', audibleTranscoding)
      } else console.log(this.constructor.name, 'loadPromise NOT isTranscoding', visibleTranscoding)
    
    } 
    return Promise.all(promises).then(EmptyMethod)
  }

  private previewVideoPromise(previewTranscoding: Transcoding): Promise<LoadedVideo> {
    const { loadedVideo } = this
    if (loadedVideo) return Promise.resolve(loadedVideo)

    return previewTranscoding.loadedMediaPromise.then(media => {
      console.log(this.constructor.name, 'previewVideoPromise.loadedMediaPromise', media)
      assertLoadedVideo(media)

      const video = media.cloneNode() as LoadedVideo
      this.loadedVideo = video
      this.foreignElement.appendChild(video)
      return video
    })
  }

  private sequenceImagesPromise(args: PreloadArgs): Promise<void> {
    const { time, clipTime: range } = args
    const definitionTimes: Times = []
    if (time.isRange) {
      assertTimeRange(time)
      const { times } = time
      const [start, end] = times.map(time => this.definitionTime(time, range))
      const definitionRange = timeRangeFromTimes(start, end)
      definitionTimes.push(...definitionRange.frameTimes)
    } else definitionTimes.push(this.definitionTime(time, range))
    const promises = definitionTimes.map(definitionTime => {
      return this.definition.loadedImagePromise(definitionTime)
    })
    return Promise.all(promises).then(EmptyMethod)
  }

  private sequenceItemPromise(rect: Rect, definitionTime: Time): Promise<SvgItem> {
    return this.definition.loadedImagePromise(definitionTime).then(loadedImage => {
      const { src } = loadedImage
      const coverSize = sizeCover(sizeCopy(loadedImage), sizeCopy(rect))
      return svgImagePromiseWithOptions(src, coverSize)
    })
  }

  serverPromise(args: ServerPromiseArgs): Promise<void> {
    console.log(this.constructor.name, 'serverPromise', args)
    const { definition } = this
    const { audio } = definition
    const { visible } = args
    if (visible || audio) return this.definition.serverPromise(args)

    return Promise.resolve()
  }

  override svgItemForPlayerPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const { loadedVideo } = this
    const definitionTime = this.definitionTime(time, range)
    if (loadedVideo) return Promise.resolve(this.videoForPlayerPromise(rect, definitionTime))

    const { previewTranscoding } = this.definition
    const { type } = previewTranscoding
    switch (type) {
      case DefinitionType.Video: {
        return this.videoItemForPlayerPromise(previewTranscoding, rect, definitionTime)
      }
      case DefinitionType.VideoSequence: {
        return this.sequenceItemPromise(rect, definitionTime)
      }
    }
    throw new Error(Errors.type)
  }

  override svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const definitionTime = this.definitionTime(time, range)
    return this.sequenceItemPromise(rect, definitionTime)
  }

  loadedVideo?: LoadedVideo 

  override unload() {
    delete this._foreignElement
    delete this.loadedVideo
  }

  private videoForPlayerPromise(rect: Rect, definitionTime: Time): SvgItem {
    const { loadedVideo: video } = this 
    assertLoadedVideo(video)

    const { clientCanMaskVideo } = VideoClass
    if (clientCanMaskVideo) svgSetDimensions(this.foreignElement, rect)
      
    video.currentTime = definitionTime.seconds

    const { width, height } = rect
    video.width = width 
    video.height = height

    return clientCanMaskVideo ? this.foreignElement : video
  }


  private videoItemForPlayerPromise(previewTranscoding: Transcoding, rect: Rect, definitionTime: Time): Promise<SvgItem> {
    console.log(this.constructor.name, 'videoItemForPlayerPromise', definitionTime, previewTranscoding)
    return this.previewVideoPromise(previewTranscoding).then(() => (
      this.videoForPlayerPromise(rect, definitionTime)
    ))
  }

  private videoItemForTimelinePromise(previewTranscoding: Transcoding, rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    console.log(this.constructor.name, 'videoItemForTimelinePromise')
    return this.previewVideoPromise(previewTranscoding).then(video => {
      const { clientCanMaskVideo } = VideoClass
      if (clientCanMaskVideo) {
        svgSetDimensions(this.foreignElement, rect)
      }
      const { currentTime } = video
      const definitionTime = this.definitionTime(time, range)
      const maxDistance = time.isRange ? 1 : 1.0 / time.fps
      const { seconds } = definitionTime
      if (Math.abs(seconds - currentTime) > maxDistance) {
        video.currentTime = seconds
      }  
      
      const { width, height } = rect
      video.width = width 
      video.height = height

      return clientCanMaskVideo ? this.foreignElement : video
    })
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
