import {
  UnknownObject, CanvasVisibleSource, SvgContent} from "../../declarations"
import { GraphFile, GraphFiles, GraphFileArgs } from "../../MoveMe"
import { DefinitionType, TrackType, LoadType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time/Time"
import { VideoSequenceClass } from "./VideoSequenceClass"
import {
  VideoSequence, VideoSequenceDefinition, VideoSequenceDefinitionObject,
  VideoSequenceObject
} from "./VideoSequence"
import { Default } from "../../Setup/Default"
import { Loader } from "../../Loader/Loader"
import {
  PreloadableDefinitionMixin
} from "../../Mixin/Preloadable/PreloadableDefinitionMixin"
import { DefinitionBase } from "../../Definition/DefinitionBase"
import { NamespaceSvg } from "../../Setup/Constants"
import { ContentDefinitionMixin } from "../../Content/ContentDefinitionMixin"
import { UpdatableSizeDefinitionMixin } from "../../Mixin/UpdatableSize/UpdatableSizeDefinitionMixin"
import { UpdatableDurationDefinitionMixin } from "../../Mixin/UpdatableDuration/UpdatableDurationDefinitionMixin"
import { TrackPreview } from "../../Editor/Preview/TrackPreview/TrackPreview"
import { TweenableDefinitionMixin } from "../../Mixin/Tweenable/TweenableDefinitionMixin"

const VideoSequenceDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase)
const VideoSequenceDefinitionWithContent = ContentDefinitionMixin(VideoSequenceDefinitionWithTweenable)
const VideoSequenceDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoSequenceDefinitionWithContent)
const VideoSequenceDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoSequenceDefinitionWithPreloadable)
const VideoSequenceDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoSequenceDefinitionWithUpdatableSize)
export class VideoSequenceDefinitionClass extends VideoSequenceDefinitionWithUpdatableDuration implements VideoSequenceDefinition {
  constructor(...args : any[]) {
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

  fps = Default.definition.videosequence.fps

  framesArray(start: Time): number[] {
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

  instanceFromObject(object: VideoSequenceObject = {}): VideoSequence {
    return new VideoSequenceClass(this.instanceArgs(object))
  }

  loadType = LoadType.Image

  // loadedVisible(preloader: Loader, _quantize: number, time: Time): CanvasVisibleSource | undefined {
  //   const frames = this.framesArray(time)
  //   const [frame] = frames
  //   const url = this.urlForFrame(frame)
  //   const file: GraphFile = {
  //     type: LoadType.Image, file: url, definition: this, input: true
  //   }
  //   if (!preloader.loadedFile(file)) return

  //   return preloader.getFile(file)
  // }

  padding : number

  pattern = '%.jpg'

  // preloadableSvg(trackPreview: TrackPreview): SvgContent {
  //   const { preview: filterGraph } = trackPreview
  //   const { size } = filterGraph
  //   const { preloader, editing, visible, quantize, time } = filterGraph
  //   const graphFileArgs: GraphFileArgs = { editing, visible, quantize, time }

  //   const { width, height } = size
  //   const graphFiles = this.graphFiles(graphFileArgs)
  //   const [graphFile] = graphFiles
  //   const href = preloader.key(graphFile)
  //   const imageElement = globalThis.document.createElementNS(NamespaceSvg, 'image')
  //   imageElement.setAttribute('id', `image-${this.id}`)
  //   imageElement.setAttribute('width', String(width))
  //   imageElement.setAttribute('height', String(height))
  //   imageElement.setAttribute('href', href)
  //   return imageElement
  // }

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

  urlForFrame(frame : number): string {
    let s = String((frame * this.increment) + this.begin)
    if (this.padding) s = s.padStart(this.padding, '0')
    return (this.url + this.pattern).replaceAll('%', s)
  }
}
