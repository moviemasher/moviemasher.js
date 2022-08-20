import { SvgItem, UnknownObject } from "../../declarations"
import { GraphFile, GraphFileArgs, GraphFiles } from "../../MoveMe"
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
import { LoadType } from "../../Setup/Enums"
import { Rect } from "../../Utility/Rect"
import { assertTrue } from "../../Utility"

const VideoSequenceWithTweenable = TweenableMixin(InstanceBase)
const VideoSequenceWithContainer = ContainerMixin(VideoSequenceWithTweenable)
const VideoSequenceWithContent = ContentMixin(VideoSequenceWithContainer)
const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent)
const VideoSequenceWithUpdatableSize = UpdatableSizeMixin(VideoSequenceWithPreloadable)
const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableSize)

export class VideoSequenceClass extends VideoSequenceWithUpdatableDuration implements VideoSequence {
  declare definition : VideoSequenceDefinition

  graphFiles(args: GraphFileArgs): GraphFiles {
    const { time, clipTime, editing, streaming, visible } = args
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
        if (streaming) {
          graphFile.options = { loop: 1 }
          graphFile.options.re = ''
        }
        files.push(graphFile)
      }
    }
    return files
  }

  speed = 1.0

  svgItem(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): SvgItem {
    const args: GraphFileArgs = {
      time, clipTime: range, visible: true, quantize: range.fps, editing: true
    }
    const [graphFile] = this.graphFiles(args)
    const { preloader } = this.clip.track.mash
    const element = preloader.getFile(graphFile)?.cloneNode()
    assertTrue(!!element, "image element")

    return this.foreignSvgItem(element, rect, stretch)
  }

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== 1.0) object.speed = this.speed
    return object
  }
}
