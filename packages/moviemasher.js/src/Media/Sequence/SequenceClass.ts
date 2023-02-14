import { UnknownRecord } from "../../declarations"
import { CommandFiles, GraphFile, PreloadArgs, GraphFiles, VisibleCommandFileArgs } from "../../Base/Code"
import { Sequence, SequenceDefinition } from "./Sequence"
import { ContentMixin } from "../Content/ContentMixin"
import { UpdatableSizeMixin } from "../../Mixin/UpdatableSize/UpdatableSizeMixin"
import { UpdatableDurationMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationMixin"
import { TweenableMixin } from "../../Mixin/Tweenable/TweenableMixin"
import { ContainerMixin } from "../Container/ContainerMixin"

import { MediaInstanceBase } from "../MediaInstanceBase"
import { ImageType, VideoType } from "../../Setup/Enums"

const SequenceWithTweenable = TweenableMixin(MediaInstanceBase)
const SequenceWithContainer = ContainerMixin(SequenceWithTweenable)
const SequenceWithContent = ContentMixin(SequenceWithContainer)
const SequenceWithUpdatableSize = UpdatableSizeMixin(SequenceWithContent)
const SequenceWithUpdatableDuration = UpdatableDurationMixin(SequenceWithUpdatableSize)

export class SequenceClass extends SequenceWithUpdatableDuration implements Sequence {
  declare definition : SequenceDefinition

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
            type: ImageType, file: '',//definition.urlForFrame(frame), 
            input: true, definition
          }
          return graphFile
        })
        files.push(...files)
      } else {
        const graphFile: GraphFile = {
          type: VideoType, file: '', definition, input: true
        }
        files.push(graphFile)
      }
    }
    return files
  }

  // iconUrl(size: Size, time: Time, range: TimeRange): string {
  //   const definitionTime = this.definitionTime(time, range)
  //   const { definition } = this
  //   const frames = definition.framesArray(definitionTime)
  //   const [frame] = frames
  //   return definition.urlForFrame(frame)
  // }

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
  //           type: ImageType, file: definition.urlForFrame(frame), 
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

  toJSON() : UnknownRecord {
    const object = super.toJSON()
    if (this.speed !== 1.0) object.speed = this.speed
    return object
  }
}
