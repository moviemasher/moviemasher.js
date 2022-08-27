import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, assertTrue } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { LoadedVideo, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"
import { NamespaceSvg } from "../../Setup/Constants"

const VideoWithTweenable = TweenableMixin(InstanceBase)
const VideoWithContent = ContentMixin(VideoWithTweenable)
const VideoWithPreloadable = PreloadableMixin(VideoWithContent)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): SvgItem {
    const { loadedVideo } = this
    if (!icon) {
      const { currentTime } = loadedVideo
      const definitionTime = this.definitionTime(time, range)
      const maxDistance = time.isRange ? 1 : 1.0 / time.fps
      const { seconds } = definitionTime
      if (Math.abs(seconds - currentTime) > maxDistance) {
        loadedVideo.currentTime = seconds
      }  
    }
    return this.foreignSvgItem(loadedVideo, rect, stretch, icon)
  }
 
  declare definition : VideoDefinition

  private _foreignElement?: SVGForeignObjectElement
  get foreignElement() { 
    return this._foreignElement ||= this.foreignElementInitialize 
  }
  private get foreignElementInitialize(): SVGForeignObjectElement {
    if (!globalThis.document) throw 'wrong environment'
  
    const foreignElement = globalThis.document.createElementNS(NamespaceSvg, 'foreignObject')
    // foreignElement.setAttribute('id', `foreign-element-${this.id}`)
    return foreignElement
  }

  foreignSvgItem(item: any, rect: Rect, stretch?: boolean, icon?: boolean): SVGForeignObjectElement {
    const { x, y, width, height } = rect
    const element = icon ? this.foreignElementInitialize : this.foreignElement

    element.setAttribute('x', String(x))
    element.setAttribute('y', String(y))
    element.setAttribute('width', String(width))
    // element.setAttribute('width', String(width))
    if (stretch) {
      element.setAttribute('height', String(height))
      // element.setAttribute('height', String(height))
      // element.setAttribute('preserveAspectRatio', 'none')
    }
    if (element.hasChildNodes()) element.replaceChildren(item)
    else element.appendChild(item)

    return element
  }

  graphFiles(args: GraphFileArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const { editing, time, audible, visible, icon } = args
    const { definition } = this
    const { url, source } = definition
    const file = editing ? url : source
    assertPopulatedString(file, editing ? 'url' : 'source')
    if (visible) {
      const visibleGraphFile: GraphFile = {
        input: true, type: LoadType.Video, file, definition
      }
      // if (icons) visibleGraphFile.
      graphFiles.push(visibleGraphFile)
    }
    if (audible) {
      const needed = editing ? time.isRange : !visible
      if (needed) {
        const mutable = definition.duration ? this.mutable() : true
        if (mutable && !this.muted) {
          const audioGraphFile: GraphFile = {
            input: true, type: LoadType.Audio, file, definition
          }  
          graphFiles.push(audioGraphFile)
        } 
      }
    }
    return graphFiles
  }

  _loadedVideo?: LoadedVideo 

  private get loadedVideo(): LoadedVideo {
    return this._loadedVideo ||= this.loadedVideoInitialize
  }

  private get loadedVideoInitialize(): LoadedVideo {
    const { clip, definition } = this
    const { loadedVideo } = definition
    if (loadedVideo) return loadedVideo.cloneNode() as LoadedVideo

    const clipTime = timeRangeFromArgs()
    const args: GraphFileArgs = {
      time: clipTime, clipTime, 
      visible: true, quantize: 0, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const video = clip.track.mash.preloader.getFile(graphFile)
    assertTrue(!!video, "video")

    definition.loadedVideo = video

    return video.cloneNode() as LoadedVideo
  }
}
