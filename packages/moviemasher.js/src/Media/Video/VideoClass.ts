import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType, Orientation } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertObject, assertPopulatedString, assertTrue, isAboveZero } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { LoadedImage, LoadedVideo, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { NamespaceSvg } from "../../Setup/Constants"
import { Size, sizeCopy, sizeCover, sizeLockNegative } from "../../Utility/Size"
import { svgImageElement, svgPolygonElement, svgSetDimensions } from "../../Utility/Svg"
import { urlPrependProtocol } from "../../Utility/Url"

const VideoWithTweenable = TweenableMixin(InstanceBase)
const VideoWithContent = ContentMixin(VideoWithTweenable)
const VideoWithPreloadable = PreloadableMixin(VideoWithContent)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  declare definition : VideoDefinition

  private _foreignElement?: SVGForeignObjectElement
  get foreignElement() { 
    return this._foreignElement ||= this.foreignElementInitialize 
  }
  private get foreignElementInitialize(): SVGForeignObjectElement {
    return globalThis.document.createElementNS(NamespaceSvg, 'foreignObject')
  }

   private foreignSvgItem(item: any, rect: Rect, stretch?: boolean): SVGForeignObjectElement {
    const { x, y, width, height } = rect
    const {foreignElement} = this // icon ? this.foreignElementInitialize : this.foreignElement

    foreignElement.setAttribute('x', String(x))
    foreignElement.setAttribute('y', String(y))
    foreignElement.setAttribute('width', String(width))
    // element.setAttribute('width', String(width))
    if (stretch) {
      foreignElement.setAttribute('height', String(height))
      // element.setAttribute('height', String(height))
      // element.setAttribute('preserveAspectRatio', 'none')
    }
    if (!foreignElement.hasChildNodes()) foreignElement.appendChild(item)
    // element.replaceChildren(item)
    // else 

    return foreignElement
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const files: GraphFiles = []

    const { editing, time, audible, visible, icon } = args
    // console.trace(this.constructor.name, "graphFiles", size)
    

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

  itemPreviewPromise(rect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem> {
    // if (icon) {
    //   const size = sizeCopy(rect)
    //   return this.loadedImagePromise(size, time, range).then(image => {
    //     if (!image) return svgPolygonElement(containerRect, '', 'red')
        
    //     const lock = stretch ? undefined : Orientation.V
    //     return svgImageElement(image.src, rect, lock)
    //   })
    // }
  
    return this.loadVideoPromise.then(loadedVideo => {
      const { currentTime } = loadedVideo
      const definitionTime = this.definitionTime(time, range)
      const maxDistance = time.isRange ? 1 : 1.0 / time.fps
      const { seconds } = definitionTime
      if (Math.abs(seconds - currentTime) > maxDistance) {
        loadedVideo.currentTime = seconds
      }  
      // const lock = stretch ? undefined : Orientation.V
      const { width, height } = rect
      loadedVideo.width = width 
      loadedVideo.height = height
      return this.foreignSvgItem(loadedVideo, rect, stretch)
    })
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

  private _loadedVideo?: LoadedVideo

  private get loadVideoPromise(): Promise<LoadedVideo> {
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

}
