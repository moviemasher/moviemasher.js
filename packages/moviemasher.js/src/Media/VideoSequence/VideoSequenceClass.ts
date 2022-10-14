import { SvgItem, UnknownObject } from "../../declarations"
import { CommandFiles, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFileArgs } from "../../MoveMe"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { LoadType } from "../../Setup/Enums"
import { Rect } from "../../Utility/Rect"
import { Size } from "../../Utility/Size"
import { svgSet } from "../../Utility/Svg"

const VideoSequenceWithTweenable = TweenableMixin(InstanceBase)
const VideoSequenceWithContainer = ContainerMixin(VideoSequenceWithTweenable)
const VideoSequenceWithContent = ContentMixin(VideoSequenceWithContainer)
const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent)
const VideoSequenceWithUpdatableSize = UpdatableSizeMixin(VideoSequenceWithPreloadable)
const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableSize)

export class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {
  declare definition : VideoSequenceDefinition

  visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.visibleCommandFiles(args)
    const { streaming, visible } = args
    if (!(visible && streaming)) return files

    files.forEach(file => {
      const { options = {} } = file
      options.loop = 1 
      options.re = ''
      file.options = options
    })
    return files
  }

  fileUrls(args: GraphFileArgs): GraphFiles {
    const { time, clipTime, editing, visible } = args
    const definitionTime = this.definitionTime(time, clipTime)

    const definitionArgs: GraphFileArgs = { ...args, time: definitionTime }
    const files = super.fileUrls(definitionArgs) 
    
    if (visible) {
      const { definition } = this
      if (editing) {
        const frames = definition.framesArray(definitionTime)
        const files = frames.map(frame => {
          const graphFile: GraphFile = {
            type: LoadType.Image, file: definition.urlForFrame(frame), 
            input: true, definition
          }
          return graphFile
        })
        files.push(...files)
      } else {
        const graphFile: GraphFile = {
          type: LoadType.Video, file: definition.source, definition, input: true
        }
        files.push(graphFile)
      }
    }
    return files
  }

  iconUrl(size: Size, time: Time, range: TimeRange): string {
    const definitionTime = this.definitionTime(time, range)
    const { definition } = this
    const frames = definition.framesArray(definitionTime)
    const [frame] = frames
    return definition.urlForFrame(frame)
  }

  // itemPreviewPromise(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): Promise<SvgItem> {
  //   return this.itemIconPromise(rect, time, range, stretch).then(svgItem => {
      
  //     return svgItem
  //   })
  // }

  // private itemPromise(time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
  //   const definitionTime = this.definitionTime(time, range)
  //   const { definition } = this
  //   const frames = definition.framesArray(definitionTime)
  //   const [frame] = frames
  //   const url = definition.urlForFrame(frame)
  //   const svgUrl = `svg:/${url}`
  //   const { preloader } = this.clip.track.mash
  //   return preloader.loadPromise(svgUrl, definition)
  // }

  // itemPromise(containerRect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem> {
  //   const { container } = this
  //   const rect = container ? containerRect : this.contentRect(containerRect, time, range)
  //   const lock = stretch ? undefined : Orientation.V
  //   return this.itemPromise(time, range, icon).then(item => {
  //     svgSetDimensionsLock(item, rect, lock)
  //     return item
  //   })
  // }

  speed = 1.0

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== 1.0) object.speed = this.speed
    return object
  }
}
