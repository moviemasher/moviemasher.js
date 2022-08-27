import { LoadedImage, SvgItem, UnknownObject } from "../../declarations"
import { CommandFiles, GraphFile, GraphFileArgs, GraphFiles, VisibleCommandFileArgs } from "../../MoveMe"
import { Default } from "../../Setup/Default"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { InstanceBase } from "../../Instance/InstanceBase"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { ContentMixin } from "../../Content/ContentMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../../Container/ContainerMixin"
import { LoadType, Orientation } from "../../Setup/Enums"
import { Rect } from "../../Utility/Rect"
import { assertTrue } from "../../Utility"
import { svgImageElement } from "../../Utility/Svg"

const VideoSequenceWithTweenable = TweenableMixin(InstanceBase)
const VideoSequenceWithContainer = ContainerMixin(VideoSequenceWithTweenable)
const VideoSequenceWithContent = ContentMixin(VideoSequenceWithContainer)
const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent)
const VideoSequenceWithUpdatableSize = UpdatableSizeMixin(VideoSequenceWithPreloadable)
const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableSize)

export class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {
  declare definition : VideoSequenceDefinition

  commandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const files = super.commandFiles(args)
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
  graphFiles(args: GraphFileArgs): GraphFiles {
    const { time, clipTime, editing, visible } = args
    const definitionTime = this.definitionTime(time, clipTime)

    if (!editing) console.trace(this.constructor.name, "graphFiles", editing, time, clipTime, definitionTime)
    const definitionArgs: GraphFileArgs = { ...args, time: definitionTime }
    const files = super.graphFiles(definitionArgs) 
    
    if (visible) {
      const { definition } = this
      if (editing) {
        const frames = definition.framesArray(definitionTime)
        const graphFiles = frames.map(frame => {
          const graphFile: GraphFile = {
            type: LoadType.Image, file: definition.urlForFrame(frame), 
            input: true, definition
          }
          return graphFile
        })
        files.push(...graphFiles)
      } else {
        const graphFile: GraphFile = {
          type: LoadType.Video, file: definition.source, definition, input: true
        }
        files.push(graphFile)
      }
    }
    return files
  }

  speed = 1.0

  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): SvgItem {
    const args: GraphFileArgs = {
      time, clipTime: range, visible: true, quantize: range.fps, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const { preloader } = this.clip.track.mash
    const loadedImage = preloader.getFile(graphFile) as LoadedImage 
    assertTrue(loadedImage, "image element")
    const { src } = loadedImage
    const lock = stretch ? undefined : Orientation.V
    return svgImageElement(src, rect, lock)
  }

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== 1.0) object.speed = this.speed
    return object
  }
}
