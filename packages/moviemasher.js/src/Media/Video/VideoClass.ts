import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { LoadType } from "../../Setup/Enums"
import { InstanceBase } from "../../Instance/InstanceBase"
import { Video, VideoDefinition } from "./Video"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { assertPopulatedString, assertTrue, isDefined } from "../../Utility/Is"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"

import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { LoadedVideo, SvgItem } from "../../declarations"
import { Rect } from "../../Utility/Rect"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { timeRangeFromArgs } from "../../Helpers/Time/TimeUtilities"

const VideoWithTweenable = TweenableMixin(InstanceBase)
const VideoWithContent = ContentMixin(VideoWithTweenable)
const VideoWithContainer = ContainerMixin(VideoWithContent)
const VideoWithPreloadable = PreloadableMixin(VideoWithContainer)
const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable)
const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize)

export class VideoClass extends VideoWithUpdatableDuration implements Video {
  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
    const video = this.loadedVideo
    const { currentTime } = video
    const definitionTime = this.definitionTime(time, range)
    const maxDistance = time.isRange ? 1 : 1.0 / time.fps
    const { seconds } = definitionTime
    if (Math.abs(seconds - currentTime) > maxDistance) {
      video.currentTime = seconds
    }
    return this.foreignSvgItem(video as any, rect, stretch)
  }
 
  declare definition : VideoDefinition

  graphFiles(args: GraphFileArgs): GraphFiles {
    const graphFiles: GraphFiles = []
    const { editing, time, audible, visible } = args
    const { definition } = this
    const { url, source } = definition
    const file = editing ? url : source
    assertPopulatedString(file, editing ? 'url' : 'source')
    if (visible) {
      const visibleGraphFile: GraphFile = {
        input: true, options: {}, type: LoadType.Video, file, definition
      }
      graphFiles.push(visibleGraphFile)
    }
    if (editing && audible && time.isRange && this.mutable() && !this.muted) {
      const audioGraphFile: GraphFile = {
        input: true, options: {}, type: LoadType.Audio, file, definition
      }  
      graphFiles.push(audioGraphFile)
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
