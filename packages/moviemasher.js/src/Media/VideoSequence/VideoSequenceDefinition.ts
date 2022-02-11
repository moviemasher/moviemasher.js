import { DefinitionType, TrackType, DataType, LoadType, GraphType, AVType } from "../../Setup/Enums"
import { Any, VisibleSource, UnknownObject, GraphFile, FilesArgs } from "../../declarations"
import { Time, Times } from "../../Helpers/Time"
import { urlAbsolute} from "../../Utility/Url"
import { DefinitionBase } from "../../Base/Definition"
import { VideoSequenceClass } from "./VideoSequenceInstance"
import { VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject, VideoSequenceObject } from "./VideoSequence"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Errors } from "../../Setup/Errors"
import { Definitions } from "../../Definitions/Definitions"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { Default } from "../../Setup/Default"
import { Property } from "../../Setup/Property"
import { AudibleFileDefinitionMixin } from "../../Mixin/AudibleFile/AudibleFileDefinitionMixin"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithAudibleFile = AudibleFileDefinitionMixin(WithAudible)
const WithVisible = VisibleDefinitionMixin(WithAudibleFile)
const WithTransformable = TransformableDefinitionMixin(WithVisible)
class VideoSequenceDefinitionClass extends WithTransformable implements VideoSequenceDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const {
      padding, url, begin, fps, increment, pattern, source
    } = <VideoSequenceDefinitionObject>object
    if (!url) throw Errors.invalid.definition.url
    this.url = url

    if (source) this.source = source
    if (typeof begin !== "undefined") this.begin = begin
    if (fps) this.fps = fps
    if (increment) this.increment = increment
    if (pattern) this.pattern = pattern
    if (padding) this.padding = padding
    else {
      const lastFrame = this.begin + (this.increment * this.framesMax - this.begin)
      this.padding = String(lastFrame).length
    }
    this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
    Definitions.install(this)
  }

  begin = Default.definition.videosequence.begin

  definitionUrls(start: Time, end?: Time): string[] {
    return this.framesArray(start, end).map(frame => urlAbsolute(this.urlForFrame(frame)))
  }

  files(args: FilesArgs): GraphFile[] {
    const files = super.files(args) // maybe get the audio file
    const { start, end, graphType, avType } = args
    if (avType !== AVType.Audio) {
      if (graphType === GraphType.Canvas) files.push(
          ...this.framesArray(start, end).map(frame => (
            { type: LoadType.Image, file: this.urlForFrame(frame) }
          )
        )
      )
      else files.push({ type: LoadType.Video, file: this.source })
    }
    return files
  }

  fps = Default.definition.videosequence.fps

  private framesArray(start : Time, end? : Time) : number[] {
    const frames : number[] = []
    const startFrame = Math.min(this.framesMax, start.scale(this.fps, "floor").frame)
    if (end) {
      const endFrame = Math.min(this.framesMax, end.scale(this.fps, "ceil").frame)
      for (let frame = startFrame; frame <= endFrame; frame += 1) {
        frames.push(frame)
      }
    } else frames.push(startFrame)
    return frames
  }

  private get framesMax() : number { return Math.floor(this.fps * this.duration) - 2 }

  increment = Default.definition.videosequence.increment

  get inputSource(): string { return this.source }

  get instance() : VideoSequence { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoSequenceObject) : VideoSequence {
    return new VideoSequenceClass({ ...this.instanceObject, ...object })
  }

  loadedVisible(preloader: Preloader, _quantize: number, time: Time): VisibleSource | undefined {
    const frames = this.framesArray(time)
    const [frame] = frames
    const url = this.urlForFrame(frame)
    const file: GraphFile = { type: LoadType.Image, file: url }
    if (!preloader.loadedFile(file)) return

    return preloader.getFile(file)
  }

  pattern = '%.jpg'

  source = ''

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    if (this.pattern !== Default.definition.videosequence.pattern) object.pattern = this.pattern
    if (this.increment !== Default.definition.videosequence.increment) object.increment = this.increment
    if (this.begin !== Default.definition.videosequence.begin) object.begin = this.begin
    if (this.fps !== Default.definition.videosequence.fps) object.fps = this.fps
    if (this.padding !== Default.definition.videosequence.padding) object.padding = this.padding
    return object
  }

  trackType = TrackType.Video

  type = DefinitionType.VideoSequence

  url : string

  private urlForFrame(frame : number) : string {
    let s = String((frame * this.increment) + this.begin)
    if (this.padding) s = s.padStart(this.padding, '0')
    return (this.url + this.pattern).replaceAll('%', s)
  }

  private urls(start : Time, end? : Time) : string[] {
    return this.framesArray(start, end).map(frame => urlAbsolute(this.urlForFrame(frame)))
  }

  padding : number
}

export { VideoSequenceDefinitionClass }
