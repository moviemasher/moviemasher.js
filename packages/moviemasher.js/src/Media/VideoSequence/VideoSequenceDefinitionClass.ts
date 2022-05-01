import { DefinitionType, TrackType, LoadType, GraphType, AVType } from "../../Setup/Enums"
import { Any, VisibleSource, UnknownObject, GraphFile, FilesArgs, GraphFiles } from "../../declarations"
import { Time } from "../../Helpers/Time/Time"
import { VideoSequenceClass } from "./VideoSequenceClass"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { Default } from "../../Setup/Default"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"

const WithClip = ClipDefinitionMixin(PreloadableDefinition)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithAudibleFile = AudibleFileDefinitionMixin(WithAudible)
const WithVisible = VisibleDefinitionMixin(WithAudibleFile)
const WithTransformable = TransformableDefinitionMixin(WithVisible)
export class VideoSequenceDefinitionClass extends WithTransformable implements VideoSequenceDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const {
      padding, begin, fps, increment, pattern
    } = <VideoSequenceDefinitionObject>object

    if (typeof begin !== "undefined") this.begin = begin
    if (fps) this.fps = fps
    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern
    if (padding) this.padding = padding
    else {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.padding = String(lastFrame).length
    }
    // TODO: support speed
    // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  begin = Default.definition.videosequence.begin

  definitionFiles(args: FilesArgs): GraphFiles {
    const files = super.definitionFiles(args) // maybe get the audio file
    const { time, graphType, avType, preloading } = args
    // console.log(this.constructor.name, "files", time, graphType, avType, preloading)
    if (avType !== AVType.Audio) {
      if (graphType === GraphType.Canvas) {
        const frames = this.framesArray(time)
        const graphFiles = frames.map(frame => {
          const graphFile: GraphFile = {
            type: LoadType.Image, file: this.urlForFrame(frame), input: true,
            definition: this
          }
          return graphFile
        })
        files.push(...graphFiles)
      } else {
        const graphFile: GraphFile = {
          type: LoadType.Video, file: this.source, definition: this, input: true
        }
        if (!preloading) {
          if (graphType === GraphType.Cast) {
            graphFile.options = { loop: 1 }
            graphFile.options.re = ''
          }
        }
        files.push(graphFile)
      }
    }
    return files
  }

  fps = Default.definition.videosequence.fps

  private framesArray(start: Time): number[] {
    const frames : number[] = []
    const startFrame = Math.min(this.framesMax, start.scale(this.fps, "floor").frame)
    if (start.isRange) {
      const endFrame = Math.min(this.framesMax + 1, start.timeRange.endTime.scale(this.fps, "ceil").frame)
      for (let frame = startFrame; frame < endFrame; frame += 1) {
        frames.push(frame)
      }
    } else frames.push(startFrame)
    // console.log(this.constructor.name, "framesArray", frames.length, frames[0])
    return frames
  }

  private get framesMax() : number { return Math.floor(this.fps * this.duration) - 2 }

  increment = Default.definition.videosequence.increment

  get instance() : VideoSequence { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoSequenceObject) : VideoSequence {
    return new VideoSequenceClass({ ...this.instanceObject, ...object })
  }

  loadType = LoadType.Image

  loadedVisible(preloader: Preloader, _quantize: number, time: Time): VisibleSource | undefined {
    const frames = this.framesArray(time)
    const [frame] = frames
    const url = this.urlForFrame(frame)
    const file: GraphFile = {
      type: LoadType.Image, file: url, definition: this, input: true
    }
    if (!preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  pattern = '%.jpg'

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.pattern !== Default.definition.videosequence.pattern) object.pattern = this.pattern
    if (this.increment !== Default.definition.videosequence.increment) object.increment = this.increment
    if (this.begin !== Default.definition.videosequence.begin) object.begin = this.begin
    if (this.fps !== Default.definition.videosequence.fps) object.fps = this.fps
    if (this.padding !== Default.definition.videosequence.padding) object.padding = this.padding
    return object
  }

  trackType = TrackType.Video

  type = DefinitionType.VideoSequence

  private urlForFrame(frame : number) : string {
    let s = String((frame * this.increment) + this.begin)
    if (this.padding) s = s.padStart(this.padding, '0')
    return (this.url + this.pattern).replaceAll('%', s)
  }


  padding : number
}
