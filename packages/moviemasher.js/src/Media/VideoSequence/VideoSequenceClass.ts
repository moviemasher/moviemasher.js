import { UnknownObject } from "../../declarations"
import { CommandFiles, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs } from "../../MoveMe"
import { Time, TimeRange } from "../../Helpers/Time/Time"
import { VideoSequence, VideoSequenceDefinition } from "./VideoSequence"
import { PreloadableMixin } from "../../Mixin/Preloadable/PreloadableMixin"
import { ContentMixin } from "../Content/ContentMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../Container/ContainerMixin"
import { LoadType } from "../../Setup/Enums"
import { Size } from "../../Utility/Size"
import { MediaInstanceBase } from "../MediaInstance/MediaInstanceBase"

const VideoSequenceWithTweenable = TweenableMixin(MediaInstanceBase)
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

  graphFiles(args: PreloadArgs): GraphFiles {
    const { time, clipTime, editing, visible } = args
    const definitionTime = this.definitionTime(time, clipTime)

    const definitionArgs: PreloadArgs = { ...args, time: definitionTime }
    const files = super.graphFiles(definitionArgs) 
    
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

  // preloadUrls(args: PreloadArgs): string[] {
  //   const { time, clipTime, editing, visible } = args
  //   const definitionTime = this.definitionTime(time, clipTime)

  //   const definitionArgs: PreloadArgs = { ...args, time: definitionTime }
  //   const files = super.preloadUrls(definitionArgs) 
    
  //   if (visible) {
  //     const { definition } = this
  //     if (editing) {
  //       const frames = definition.framesArray(definitionTime)
  //       const files = frames.map(frame => {
  //         const graphFile: GraphFile = {
  //           type: LoadType.Image, file: definition.urlForFrame(frame), 
  //           input: true, definition
  //         }
  //         return graphFile
  //       })
  //       files.push(...files)
  //     } else files.push(definition.source)
  //   }
  //   return files
  // }

  speed = 1.0

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== 1.0) object.speed = this.speed
    return object
  }
}
