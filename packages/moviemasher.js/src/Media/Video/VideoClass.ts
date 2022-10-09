import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, isBoolean } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { LoadedVideo, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { NamespaceSvg } from "../../Setup/Constants"
import { Size, sizeCopy, sizeCover } from "../../Utility/Size"
import { urlPrependProtocol } from "../../Utility/Url"
import { svgSetDimensions } from "../../Utility/Svg"
import { ContainerMixin } from "../../Container/ContainerMixin"

const VideoWithTweenable = TweenableMixin(InstanceBase)

const VideoWithContainer = ContainerMixin(VideoWithTweenable)
const VideoWithContent = ContentMixin(VideoWithContainer)
const VideoWithPreloadable = PreloadableMixin(VideoWithContent)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  declare definition : VideoDefinition

  fileUrls(args: GraphFileArgs): GraphFiles {
    const files: GraphFiles = []

    const { editing, time, audible, visible, icon } = args
    
    // console.log(this.constructor.name, "fileUrls", audible, editing, visible)

    const { definition } = this
    const { url, source } = definition
    const editingUrl = editing ? url : source
    assertPopulatedString(editingUrl, editing ? 'url' : 'source')

    if (visible) {
      if (!icon) {
        const visibleGraphFile: GraphFile = {
          input: true, type: LoadType.Video, file: editingUrl, definition
        }
        files.push(visibleGraphFile)
      }
    }
    if (audible) {
      // const needed = editing ? time.isRange : !visible
      // if (needed) {
        const mutable = definition.duration ? this.mutable() : true
        if (mutable && !this.muted) {
          const audioGraphFile: GraphFile = {
            input: true, type: LoadType.Audio, definition,
            file: this.definition.urlAudible(editing), 
          }  
          files.push(audioGraphFile)
        } 
      // }
    }
    return files
  }

  private _foreignElement?: SVGForeignObjectElement
  get foreignElement() { 
    return this._foreignElement ||= this.foreignElementInitialize 
  }
  private get foreignElementInitialize(): SVGForeignObjectElement {
    // console.log(this.constructor.name, "foreignElementInitialize")

    return globalThis.document.createElementNS(NamespaceSvg, 'foreignObject')
  }

  iconUrl(size: Size, time: Time, clipTime: TimeRange): string {
    const inSize = sizeCopy(this.intrinsicRect(true))
    const coverSize = sizeCover(inSize, size)
    const { width, height } = coverSize
    const start = this.definitionTime(time, clipTime)
    const { frame } = start
    const { fps } = clipTime
    const { definition } = this
    const { url } = definition
    const videoUrl = urlPrependProtocol('video', url, { frame, fps}) 
    return urlPrependProtocol('image', videoUrl, { width, height })
  }

  itemPreviewPromise(rect: Rect, time: Time, range: TimeRange): Promise<SvgItem> {
    const { clientCanMaskVideo } = VideoClass
    const { _foreignElement, _loadedVideo } = this
    const predefined = !!_foreignElement
    if (predefined || _loadedVideo) {
      // console.log(this.constructor.name, "itemPreviewPromise LOADED")
      this.updateForeignElement(rect, time, range, predefined)

      return Promise.resolve(clientCanMaskVideo ? this.foreignElement : this.loadedVideo)
    }
    
    return this.loadVideoPromise.then(() => {
      this.updateForeignElement(rect, time, range)
      return clientCanMaskVideo ? this.foreignElement : this.loadedVideo
    })
  }

  private _loadedVideo?: LoadedVideo
  private get loadedVideo(): LoadedVideo { return this._loadedVideo! }

  private get loadVideoPromise(): Promise<LoadedVideo> {
    // console.log(this.constructor.name, "loadVideoPromise")

    const { _loadedVideo } = this
    if (_loadedVideo) return Promise.resolve(_loadedVideo)

    const { definition } = this
    const { loadedVideo } = definition
    if (loadedVideo) {
      this._loadedVideo = loadedVideo.cloneNode() as LoadedVideo
      return Promise.resolve(this._loadedVideo)
    }
    const { preloader } = this.clip.track.mash
    const file = this.intrinsicGraphFile({ editing: true, size: true })
    const { file: url } = file
    const videoUrl = urlPrependProtocol('video', url)
    return preloader.loadPromise(videoUrl).then((video: LoadedVideo) => {
      definition.loadedVideo = video
      return this._loadedVideo = video.cloneNode() as LoadedVideo
    })
  }

  private updateVideo(rect: Rect, time: Time, range: TimeRange) {
    const { loadedVideo } = this
    const { currentTime } = loadedVideo
    const definitionTime = this.definitionTime(time, range)
    const maxDistance = time.isRange ? 1 : 1.0 / time.fps
    const { seconds } = definitionTime
    if (Math.abs(seconds - currentTime) > maxDistance) {
      loadedVideo.currentTime = seconds
    }  
    
    const { width, height } = rect
    loadedVideo.width = width 
    loadedVideo.height = height
    return loadedVideo
  }

  private updateForeignElement(rect: Rect, time: Time, range: TimeRange, foreignElementDefined?: boolean) {
    const { clientCanMaskVideo } = VideoClass
    if (clientCanMaskVideo) {
      const { foreignElement } = this
      if (!foreignElementDefined) foreignElement.appendChild(this.loadedVideo)
      svgSetDimensions(foreignElement, rect)
    }
    this.updateVideo(rect, time, range)
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
