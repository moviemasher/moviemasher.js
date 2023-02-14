import { GraphFile, PreloadArgs, GraphFiles, ServerPromiseArgs } from "../../Base/Code"
import { SequenceType, VideoType, AudioType } from "../../Setup/Enums"
import { Video, VideoDefinition } from "./Video"
import { assertPopulatedString, assertTimeRange, isBoolean } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ClientVideo } from "../../ClientMedia/ClientMedia"
import { SvgItem } from "../../Helpers/Svg/Svg"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange, Times } from "../../Helpers/Time/Time"
import { EmptyMethod, NamespaceSvg } from "../../Setup/Constants"
import { sizeCopy, sizeCover } from "../../Utility/Size"
import { svgImagePromiseWithOptions, svgSetDimensions } from "../../Helpers/Svg/SvgFunctions"
import { ContainerMixin } from "../Container/ContainerMixin"
import { MediaInstanceBase } from "../MediaInstanceBase"
import { assertClientVideo } from "../../ClientMedia/ClientMediaFunctions"
import { timeRangeFromTimes } from "../../Helpers/Time/TimeUtilities"
import { endpointUrl } from "../../Helpers/Endpoint/EndpointFunctions"
import { isRequestable, Requestable } from "../../Base/Requestable/Requestable"
import { errorThrow } from "../../Helpers/Error/ErrorFunctions"
import { ErrorName } from "../../Helpers/Error/ErrorName"

const VideoWithTweenable = TweenableMixin(MediaInstanceBase)

const VideoWithContainer = ContainerMixin(VideoWithTweenable)
const VideoWithContent = ContentMixin(VideoWithContainer)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithContent)
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
    const file = endpointUrl(request!.endpoint) 
    
    assertPopulatedString(file)

    if (visible) {
      if (!icon) {
        const visibleGraphFile: GraphFile = {
          input: true, type: VideoType, file, definition
        }
        files.push(visibleGraphFile)
      }
    }
    if (audible) {
      const mutable = definition.duration ? this.mutable() : true
      if (mutable && !this.muted) {
        const audioGraphFile: GraphFile = {
          input: true, type: AudioType, definition,
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
      const visibleTranscoding = definition.preferredTranscoding(SequenceType, VideoType)
      if (isRequestable(visibleTranscoding) ) {
        const audibleTranscoding = audio && audible && definition.preferredTranscoding(AudioType, VideoType)
        if (visibleTranscoding !== audibleTranscoding) {
          const { type } = visibleTranscoding
          console.log(this.constructor.name, 'loadPromise visibleTranscoding', visibleTranscoding)
 
          if (type === VideoType) {
            promises.push(visibleTranscoding.clientMediaPromise.then(orError => {
              const { error, clientMedia: clientMedia } = orError
              if (error) return errorThrow(error)
            }))
          } else promises.push(this.sequenceImagesPromise(args))

        } else console.log(this.constructor.name, 'loadPromise', visibleTranscoding, '===', audibleTranscoding)
      } else console.log(this.constructor.name, 'loadPromise NOT isTranscoding', visibleTranscoding)
    
    } 
    return Promise.all(promises).then(EmptyMethod)
  }

  private previewVideoPromise(previewTranscoding: Requestable): Promise<ClientVideo> {
    const { loadedVideo } = this
    if (loadedVideo) return Promise.resolve(loadedVideo)

    return previewTranscoding.clientMediaPromise.then(orError => {
      const { error, clientMedia: media } = orError
      if (error) return errorThrow(error)

      console.log(this.constructor.name, 'previewVideoPromise.clientMediaPromise', media)
      assertClientVideo(media)

      const video = media.cloneNode() as ClientVideo
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
      case VideoType: {
        return this.videoItemForPlayerPromise(previewTranscoding, rect, definitionTime)
      }
      case SequenceType: {
        return this.sequenceItemPromise(rect, definitionTime)
      }
    }
    return errorThrow(ErrorName.Type)
  }

  override svgItemForTimelinePromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const definitionTime = this.definitionTime(time, range)
    return this.sequenceItemPromise(rect, definitionTime)
  }

  loadedVideo?: ClientVideo 

  override unload() {
    delete this._foreignElement
    delete this.loadedVideo
  }

  private videoForPlayerPromise(rect: Rect, definitionTime: Time): SvgItem {
    const { loadedVideo: video } = this 
    assertClientVideo(video)

    const { clientCanMaskVideo } = VideoClass
    if (clientCanMaskVideo) svgSetDimensions(this.foreignElement, rect)
      
    video.currentTime = definitionTime.seconds

    const { width, height } = rect
    video.width = width 
    video.height = height

    return clientCanMaskVideo ? this.foreignElement : video
  }


  private videoItemForPlayerPromise(previewTranscoding: Requestable, rect: Rect, definitionTime: Time): Promise<SvgItem> {
    console.log(this.constructor.name, 'videoItemForPlayerPromise', definitionTime, previewTranscoding)
    return this.previewVideoPromise(previewTranscoding).then(() => (
      this.videoForPlayerPromise(rect, definitionTime)
    ))
  }

  // private videoItemForTimelinePromise(previewTranscoding: Requestable, rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
  //   console.log(this.constructor.name, 'videoItemForTimelinePromise')
  //   return this.previewVideoPromise(previewTranscoding).then(video => {
  //     const { clientCanMaskVideo } = VideoClass
  //     if (clientCanMaskVideo) {
  //       svgSetDimensions(this.foreignElement, rect)
  //     }
  //     const { currentTime } = video
  //     const definitionTime = this.definitionTime(time, range)
  //     const maxDistance = time.isRange ? 1 : 1.0 / time.fps
  //     const { seconds } = definitionTime
  //     if (Math.abs(seconds - currentTime) > maxDistance) {
  //       video.currentTime = seconds
  //     }  
      
  //     const { width, height } = rect
  //     video.width = width 
  //     video.height = height

  //     return clientCanMaskVideo ? this.foreignElement : video
  //   })
  // }


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
